pin "application"
pin "@hotwired/turbo-rails", to: "turbo.min.js"
pin "@hotwired/stimulus", to: "stimulus.min.js"
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"
pin_all_from "app/javascript/controllers", under: "controllers"
pin_all_from "app/javascript/resources", under: "resources"

pin "@editorjs/editorjs", to: "@editorjs--editorjs.js" # @2.30.1
pin "@editorjs/header", to: "@editorjs--header.js" # @2.8.6
pin "@editorjs/list", to: "@editorjs--list.js" # @1.9.0
pin "@editorjs/paragraph", to: "@editorjs--paragraph.js" # @2.11.6
pin "@editorjs/image", to: "@editorjs--image.js" # @2.9.1
pin "@editorjs/code", to: "@editorjs--code.js" # @2.9.0

pin "bootstrap", to: "bootstrap.min.js", preload: true
pin "@popperjs/core", to: "popper.js", preload: true

pin "color-modes", to: "color-modes.js", preload: true

pin "chart.js", to: "https://ga.jspm.io/npm:chart.js@4.4.4/dist/chart.js"
pin "@kurkle/color", to: "https://ga.jspm.io/npm:@kurkle/color@0.3.2/dist/color.esm.js"
