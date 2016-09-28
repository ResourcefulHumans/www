.DEFAULT_GOAL := help
.PHONY: help build development

# Cancel implicit rules
.SUFFIXES:
%: %,v

# Build variables for JS artefacts
jssrcfiles := $(wildcard src/js/*.js)
jssrcbasenames := $(notdir $(basename $(jssrcfiles)))
jsbrowserified := $(foreach f,$(jssrcbasenames),build/js/$(f).js)
jsminified := $(foreach f,$(jssrcbasenames),build/js/$(f).min.js)

# Build variables for CSS artefacts
cssrcfiles := $(wildcard src/scss/*.scss)
cssbasenames := $(notdir $(basename $(cssrcfiles)))
csssassed := $(foreach f,$(cssbasenames),build/css/$(f).css)
cssminified := $(foreach f,$(cssbasenames),build/css/$(f).min.css)

.SECONDARY: $(jsbrowserified) $(csssassed)

# Build variables for assets
assetsrcfiles := $(shell find assets -type f)
assettargets := $(subst assets/,build/,$(assetsrcfiles))

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
	@echo "assettargets=$(assettargets)"

development: ## Build for development environment
	ENVIRONMENT=development make build

build: $(cssminified) $(cssrcfiles) $(jsminified) $(jssrcfiles) build/*.html $(assettargets) ## Build for production environment

ACCESS_KEY := $(shell node console config aws:access_key_id)
SECRET_KEY := $(shell node console config aws:secret_access_key)
BUCKET := $(shell node console config aws:website_bucket)
REGION := $(shell node console config aws:region)
VERSION := $(shell node console config version)
DEPLOY_VERSION := $(shell node console config deployVersion)
S3_CFG := /tmp/.s3cfg-$(BUCKET)
deploy: ## Deploy to production
	@echo "[default]" >> $(S3_CFG)
	@echo "access_key = $(ACCESS_KEY)" >> $(S3_CFG)
	@echo "secret_key = $(SECRET_KEY)" >> $(S3_CFG)
	@echo "region = $(REGION)" >> $(S3_CFG)
	rm -rf build
	ENVIRONMENT=production make -B build
	rm $(jsbrowserified) $(csssassed)
	s3cmd -c $(S3_CFG) \
		sync -M --no-mime-magic --delete-removed ./build/ s3://$(BUCKET)/
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

help: ## (default), display the list of make commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

# JavaScript
build/js/%.js: src/js/%.js src/js/*.js src/js/**/*.js
	@mkdir -p $(dir $@)
	./node_modules/.bin/browserify $< -o $@

build/js/%.min.js: build/js/%.js
ifeq "${ENVIRONMENT}" "development"
	cp -u $< $@
else
	./node_modules/.bin/uglifyjs $< -o $@
endif

# CSS

build/fonts: node_modules/font-awesome/fonts/*.* node_modules/ionicons/dist/fonts/*.*
	mkdir -p build/fonts
	cp -u node_modules/font-awesome/fonts/*.* build/fonts/
	cp -u node_modules/ionicons/dist/fonts/*.* build/fonts/

build/css/%.css: src/scss/%.scss src/scss/*.scss src/scss/**/*.scss build/fonts
	@mkdir -p $(dir $@)
	./node_modules/.bin/node-sass $< $@

build/css/%.min.css: build/css/%.css
ifeq ($(ENVIRONMENT),development)
	cp -u $< $@
else
	./node_modules/.bin/uglifycss $< > $@
endif

# HTML

build/*.html: src/*.html src/includes/*.html
	./node_modules/.bin/rheactor-build-views build -m ./config ./src ./build

# Assets
build/%: assets/%
	@mkdir -p $(dir $@)
	cp $< $@
