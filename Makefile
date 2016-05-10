.DEFAULT_GOAL := help
.PHONY: help preview

preview: ## Deploy to preview
	s3cmd sync --delete-removed ./{*.html,assets,css,img,landingpage,script} s3://rh-preview/

help: ## (default), display the list of make commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
