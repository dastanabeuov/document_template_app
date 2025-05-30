# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = "1.0"

# Add additional assets to the asset load path.
# config.assets.paths << Rails.root.join("vendor/javascript")

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in the app/assets
# folder are already added.
Rails.application.config.assets.precompile += %w[
  bootstrap.min.js
  popper.js
  datatables.css
]

# color-modes.css
# chartist.min.css
# suneditor.css
# suneditor-contents.css
# katex.min.css
# codemirror.min.css
