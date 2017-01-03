.DEFAULT_GOAL := help
.PHONY: help build development merge_assets
APP ?= RH

# Cancel implicit rules
.SUFFIXES:
%: %,v

# Build variables for JS artefacts
jssrcfiles := src/js/content-page.js src/js/$(APP).js
jssrcbasenames := $(notdir $(basename $(jssrcfiles)))
jsbrowserified := $(foreach f,$(jssrcbasenames),build/js/$(f).js)
jsminified := $(foreach f,$(jssrcbasenames),build/js/$(f).min.js)

# Build variables for CSS artefacts
cssrcfiles := src/scss/content-page.scss src/scss/$(APP).scss
cssbasenames := $(notdir $(basename $(cssrcfiles)))
csssassed := $(foreach f,$(cssbasenames),build/css/$(f).css)
cssminified := $(foreach f,$(cssbasenames),build/css/$(f).min.css)

htmlsrc := $(shell find src/*.html -type f)
htmlbuild := $(subst src/,build/,$(htmlsrc))

.SECONDARY: $(jsbrowserified) $(csssassed)

# Build variables for assets
assetsrcfiles := $(shell find assets/shared/ -type f)
assetsrcfiles += $(shell find assets/$(APP)/ -type f)

debug: ## Print variables
	@echo "jssrcfiles=$(jssrcfiles)"
	@echo "jssrcbasenames=$(jssrcbasenames)"
	@echo "jsbrowserified=$(jsbrowserified)"
	@echo "jsminified=$(jsminified)"
	@echo "cssrcfiles=$(cssrcfiles)"
	@echo "cssbasenames=$(cssbasenames)"
	@echo "csssassed=$(csssassed)"
	@echo "cssminified=$(cssminified)"
	@echo "assetsrcfiles=$(assetsrcfiles)"
	@echo "htmlbuild=$(htmlbuild)"

development: ## Build for development environment
	ENVIRONMENT=development make build

build: $(cssminified) $(cssrcfiles) $(jsminified) $(jssrcfiles) $(htmlbuild) build/index.html merge_assets ## Build for production environment

ACCESS_KEY := $(shell node console config aws:access_key_id)
SECRET_KEY := $(shell node console config aws:secret_access_key)
BUCKET ?= $(shell node console config aws:website_bucket)
REGION := $(shell node console config aws:region)
VERSION := $(shell node console config version)
DEPLOY_VERSION := $(shell node console config deployVersion)
S3_CFG := /tmp/.s3cfg-$(BUCKET)

deploy: guard-WEB_HOST ## Deploy to AWS S3
	# Build
	rm -rf build
	ENVIRONMENT=production make -B build
	rm -f $(jsbrowserified) $(csssassed)

	# Create s3cmd config
	@echo $(S3_CFG)
	@echo "[default]" > $(S3_CFG)
	@echo "access_key = $(ACCESS_KEY)" >> $(S3_CFG)
	@echo "secret_key = $(SECRET_KEY)" >> $(S3_CFG)
	@echo "bucket_location = $(REGION)" >> $(S3_CFG)

	# Create bucket if not exists
	@if [[ `s3cmd -c $(S3_CFG) ls | grep s3://$(BUCKET) | wc -l` -eq 1 ]]; then \
		echo "Bucket exists"; \
	else \
		s3cmd -c $(S3_CFG) mb s3://$(BUCKET); \
		s3cmd -c $(S3_CFG) ws-create s3://$(BUCKET)/ --ws-index=index.html --ws-error=404.html; \
	fi

	# Upload
	s3cmd -c $(S3_CFG) \
		sync -P -M --no-mime-magic --delete-removed ./build/ s3://$(BUCKET)/
	# Expires 10 minutes for html files
	s3cmd -c $(S3_CFG) \
		modify --recursive \
		--add-header=Cache-Control:public,max-age=600 \
		--remove-header=Expires \
		--add-header=x-amz-meta-version:$(VERSION)-$(DEPLOY_VERSION) \
		--exclude "*" --include "*.html" --include "*.txt" \
		s3://$(BUCKET)/

	# Expires 1 year for everything else
	s3cmd -c $(S3_CFG) \
		modify --recursive \
		--add-header=Cache-Control:public,max-age=31536000 \
		--remove-header=Expires \
		--add-header=x-amz-meta-version:$(VERSION)-$(DEPLOY_VERSION) \
		--exclude "*.html" --exclude "*.txt" \
		s3://$(BUCKET)/

preview: ## Deploy to preview
	BUCKET=$(TRAVIS_PULL_REQUEST).pr.$(BUCKET) WEB_HOST=http://$(TRAVIS_PULL_REQUEST).pr.$(BUCKET).s3-website.eu-central-1.amazonaws.com make -B deploy
	@curl -s -H "Content-Type: application/json" \
		-H "Authorization: token $(GITHUB_TOKEN)" \
		--data '{"body":":arrows_counterclockwise: Preview published to http://$(TRAVIS_PULL_REQUEST).pr.$(BUCKET).s3-website.eu-central-1.amazonaws.com/"}' \
		https://api.github.com/repos/$(TRAVIS_REPO_SLUG)/issues/$(TRAVIS_PULL_REQUEST)/comments > /dev/null

help: ## (default), display the list of make commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

# JavaScript
build/js/%.js: src/js/%.js src/js/*.js src/js/**/*.js
	@mkdir -p $(dir $@)
	./node_modules/.bin/browserify $< -o $@

build/js/%.min.js: build/js/%.js
ifeq ($(ENVIRONMENT),development)
	cp $< $@
else
	./node_modules/.bin/uglifyjs $< -o $@
endif

# CSS

build/fonts: node_modules/font-awesome/fonts/*.* node_modules/ionicons/dist/fonts/*.*
	mkdir -p build/fonts
	cp node_modules/font-awesome/fonts/*.* build/fonts/
	cp node_modules/ionicons/dist/fonts/*.* build/fonts/

build/css/%.css: src/scss/%.scss src/scss/*.scss src/scss/**/*.scss src/scss/**/**/*.scss build/fonts
	@mkdir -p $(dir $@)
	./node_modules/.bin/node-sass $< $@

build/css/%.min.css: build/css/%.css
ifeq ($(ENVIRONMENT),development)
	cp $< $@
else
	./node_modules/.bin/uglifycss $< > $@
endif

# HTML

build/index.html: $(htmlbuild)
	cp build/index.$(APP).html build/index.html

build/%.html: src/%.html src/includes/*.html assets/**/img/*.svg config.*
ifeq ($(ENVIRONMENT),development)
	./node_modules/.bin/rheactor-build-views build -s assets/\?\(shared\|$(APP)\)/img/\*.svg ./config.web $< $@
else
	./node_modules/.bin/rheactor-build-views build -s assets/\?\(shared\|$(APP)\)/img/\*.svg -m ./config.web $< $@
endif

# Assets
merge_assets: $(assetsrcfiles)
	cp -r assets/shared/* build/
	cp -r assets/$(APP)/* build/

# Helpers

guard-%:
	@ if [ "${${*}}" = "" ]; then \
		echo "Environment variable $* not set"; \
		exit 1; \
	fi
