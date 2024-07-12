# Pin npm packages by running ./bin/importmap

pin "application"
pin "@hotwired/turbo-rails", to: "turbo.min.js"
pin "@hotwired/stimulus", to: "stimulus.min.js"
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"
pin_all_from "app/javascript/controllers", under: "controllers"

pin "popper", to: 'popper.js', preload: true
pin "bootstrap", to: 'bootstrap.min.js', preload: true

pin "@editorjs/editorjs", to: "@editorjs--editorjs.js" # @2.30.1
pin "@editorjs/header", to: "@editorjs--header.js" # @2.8.6
pin "@editorjs/list", to: "@editorjs--list.js" # @1.9.0
pin "@editorjs/paragraph", to: "@editorjs--paragraph.js" # @2.11.6
pin "@editorjs/image", to: "@editorjs--image.js" # @2.9.1
pin "@editorjs/code", to: "@editorjs--code.js" # @2.9.0
