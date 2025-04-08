pin "application"
pin "@hotwired/turbo-rails", to: "turbo.min.js"
pin "@hotwired/stimulus", to: "stimulus.min.js"
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"
pin_all_from "app/javascript/controllers", under: "controllers"
pin_all_from "app/javascript/resources", under: "resources"

pin "bootstrap", to: "bootstrap.min.js", preload: true
pin "@popperjs/core", to: "popper.js", preload: true

pin "datatables", to: "datatables/datatables.js", preload: true
pin "jquery", to: "jquery/jquery-3.7.1.js", preload: true
# pin "jquery", to: "https://code.jquery.com/jquery-3.7.1.js"
# pin "datatables", to: "https://cdn.datatables.net/2.1.8/js/dataTables.js"

pin "color-modes", to: "color-modes/color-modes.js", preload: true

pin "chart.js", to: "https://ga.jspm.io/npm:chart.js@4.4.4/dist/chart.js"
pin "@kurkle/color", to: "https://ga.jspm.io/npm:@kurkle/color@0.3.2/dist/color.esm.js"

pin "suneditor", to: "suneditor/src/suneditor.js"
pin "suneditor/src/plugins", to: "suneditor/src/plugins/index.js"
pin "suneditor/src/lang/ru", to: "suneditor/src/lang/ru.js"
pin "katex", to: "https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.js"

pin "codemirror", to: "https://cdn.jsdelivr.net/npm/codemirror@5.49.0/lib/codemirror.min.js"
pin "codemirror/mode/htmlmixed/htmlmixed", to: "https://cdn.jsdelivr.net/npm/codemirror@5.49.0/mode/htmlmixed/htmlmixed.js"
pin "codemirror/mode/xml/xml", to: "https://cdn.jsdelivr.net/npm/codemirror@5.49.0/mode/xml/xml.js"
pin "codemirror/mode/css/css", to: "https://cdn.jsdelivr.net/npm/codemirror@5.49.0/mode/css/css.js"
