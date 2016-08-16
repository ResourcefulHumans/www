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

debug: ## Print variables
	@echo "jssrcfiles=$(jssrcfiles)"
	@echo "jssrcbasenames=$(jssrcbasenames)"
	@echo "jsbrowserified=$(jsbrowserified)"
	@echo "jsminified=$(jsminified)"
	@echo "cssrcfiles=$(cssrcfiles)"
	@echo "cssbasenames=$(cssbasenames)"
	@echo "csssassed=$(csssassed)"
	@echo "cssminified=$(cssminified)"

development: ## Build for development environment
	ENVIRONMENT=development make build

build: $(cssminified) $(cssrcfiles) $(jsminified) $(jssrcfiles) build/*.html build/favicon.ico build/robots.txt ## Build for production environment

ACCESS_KEY := $(shell node console config aws:access_key_id)
SECRET_KEY := $(shell node console config aws:secret_access_key)
BUCKET := $(shell node console config aws:website_bucket)
REGION := $(shell node console config aws:region)
VERSION := $(shell node console config version)
DEPLOY_VERSION := $(shell node console config deployVersion)
deploy: ## Deploy to production
	#rm -rf build
	#ENVIRONMENT=production make -B build
	#rm $(jsbrowserified) $(csssassed)
	@echo $(REGION)
	s3cmd \
		--access_key="$(ACCESS_KEY)" \
		--secret_key="$(SECRET_KEY)" \
		--region=$(REGION) \
		sync -M --no-mime-magic --delete-removed ./build/ s3://$(BUCKET)/
	# Expires 10 minutes for html files
	s3cmd \
		--access_key="$(ACCESS_KEY)" \
		--secret_key="$(SECRET_KEY)" \
		--region=$(REGION) \
		modify --recursive \
		--add-header=Cache-Control:public,max-age=600 \
		--add-header=X-Version:$(VERSION)-$(DEPLOY_VERSION) \
		s3://$(BUCKET)/ --exclude "*" --include "*.html"
	# Expires 1 year for everything else
	s3cmd \
		--access_key="$(ACCESS_KEY)" \
		--secret_key="$(SECRET_KEY)" \
		--region=$(REGION) \
		modify --recursive \
		--add-header=Cache-Control:public,max-age=31536000 \
		--add-header=X-Version:$(VERSION)-$(DEPLOY_VERSION) \
		--exclude "*.html" s3://$(BUCKET)/

help: ## (default), display the list of make commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

# JavaScript

build/js:
	mkdir -p build/js

build/js/%.js: src/js/%.js src/js/*.js src/js/**/*.js build/js
	./node_modules/.bin/browserify $< -o $@

build/js/%.min.js: build/js/%.js
ifeq "${ENVIRONMENT}" "development"
	cp -u $< $@
else
	./node_modules/.bin/uglifyjs $< -o $@
endif

# CSS

build/css:
	mkdir -p build/css

build/fonts: node_modules/font-awesome/fonts/*.* node_modules/ionicons/dist/fonts/*.*
	mkdir -p build/fonts
	cp -u node_modules/font-awesome/fonts/*.* build/fonts/
	cp -u node_modules/ionicons/dist/fonts/*.* build/fonts/

build/css/%.css: src/scss/%.scss src/scss/*.scss src/scss/**/*.scss build/fonts build/css
	./node_modules/.bin/node-sass $< $@

build/css/%.min.css: build/css/%.css
ifeq ($(ENVIRONMENT),development)
	cp -u $< $@
else
	./node_modules/.bin/uglifycss $< > $@
endif

# HTML

build/*.html: src/*.html src/includes/*.html build/img
	./node_modules/.bin/rheactor-build-views build -m ./config ./src ./build

# Assets

build/img: src/img/*.*
	mkdir -p build/img
	cp -u -r src/img/* build/img/

build/favicon.ico: src/favicon/*.*
	cp -u src/favicon/* build/

build/robots.txt: src/robots.txt
	cp -u src/robots.txt build/
