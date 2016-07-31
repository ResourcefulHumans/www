.DEFAULT_GOAL := help
.PHONY: help build development

development: ## Build for development environment
	ENVIRONMENT=development make build

build: build/css/index.min.css build/js/index.min.js build/*.html build/favicon.ico build/robots.txt ## Build for production environment

build/js:
	mkdir -p build/js

build/js/index.js: package.json build/js src/js/*.js
	./node_modules/.bin/browserify src/js/index.js -o $@

build/js/index.min.js: build/js/index.js
ifeq "${ENVIRONMENT}" "development"
	cp -u build/js/index.js $@
else
	./node_modules/.bin/uglifyjs build/js/index.js -o $@
endif

build/css:
	mkdir -p build/css

build/css/index.css: src/scss/*.scss build/fonts
	./node_modules/.bin/node-sass src/scss/index.scss $@

build/fonts: node_modules/material-design-icons/iconfont/MaterialIcons-Regular.* node_modules/font-awesome/fonts/*.*
	mkdir -p build/fonts
	cp -u node_modules/material-design-icons/iconfont/MaterialIcons-Regular.* build/fonts/
	cp -u node_modules/font-awesome/fonts/*.* build/fonts/

build/css/index.min.css: build/css build/css/index.css
ifeq ($(ENVIRONMENT),development)
	cp -u build/css/index.css $@
else
	./node_modules/.bin/uglifycss build/css/index.css > $@
endif

build/*.html: src/*.html src/includes/*.html build/img
	./node_modules/.bin/rheactor-build-views build ./config ./src ./build

build/img: src/img/*.*
	mkdir -p build/img
	cp -u -r src/img/* build/img/

build/favicon.ico: src/favicon/*.*
	cp -u src/favicon/* build/

build/robots.txt: src/robots.txt
	cp -u src/robots.txt build/

deploy: ## Deploy to production
	#rm -rf build
	#ENVIRONMENT=production make -B build
	#rm build/js/index.js
	#rm build/css/index.css
	s3cmd \
		--access_key="$(shell node console config aws:access_key_id)" \
		--secret_key="$(shell node console config aws:secret_access_key)" \
		--region=$(shell node console config aws:region) \
		sync --delete-removed ./build/ s3://$(shell node console config aws:website_bucket)/

help: ## (default), display the list of make commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
