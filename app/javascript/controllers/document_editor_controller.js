import { Controller } from "@hotwired/stimulus";
import SunEditor from "suneditor";
import * as plugins from "suneditor/src/plugins";

import "katex";

// import CodeMirror from "codemirror";
// import "codemirror-htmlmixed";
// import "codemirror-xml";
// import "codemirror-css";

// Import the i18n language files
import enLang from '../i18n/en';
import ruLang from '../i18n/ru';
import kzLang from '../i18n/kz';

export default class extends Controller {
  static targets = ["content", "hiddenContent"];

  connect() {
    console.log("SunEditor Stimulus Controller Connected!");
    const katex = window.katex;
    this.initializeEditor();
  }

  disconnect() {
    if (this.editor) {
      this.editor.destroy();
      console.log("SunEditor Stimulus Controller Disconnect!");
    }
  }

  csrfToken() {
    const metaTag = document.querySelector("meta[name='csrf-token']");
    return metaTag ? metaTag.content : "";
  }

  initializeEditor() {

    const i18n = {
      en: enLang,
      ru: ruLang,
      kz: kzLang
    };

    if (!this.contentTarget) {
      console.error("contentTarget не найден!");
      return;
    }

    const currentLanguage = this.element.dataset.currentLanguage || "[]";

    const uploadUrl = this.data.get("uploadUrl");
    //const urlImagesGallery = uploadUrl.replace("/upload_image", "") + "/document-images";

    this.editor = SunEditor.create(this.contentTarget, {
      templates: [
        { name: "Template 1", html: "<p>Template 1 content</p>" },
        { name: "Template 2", html: "<p>Template 2 content</p>" }
      ],
      width: "100%",
      height: "600px",
      plugins: plugins,
      lang: i18n[currentLanguage],
      katex: katex,
      //codeMirror: CodeMirror,
      //imageGalleryUrl: urlImagesGallery,
      mode: "htmlmixed",
      lineNumbers: true,
      theme: "default",
      buttonList: [
        [
          "undo", "redo",
          "font", "fontSize", "formatBlock",
          "paragraphStyle", "blockquote",
          "bold", "underline", "italic",
          "strike", "subscript", "superscript",
          "fontColor", "hiliteColor", "textStyle",
          "removeFormat", "outdent", "indent",
          "align", "horizontalRule", "list", "lineHeight",
          "table", "link", "image", "video", "audio",
          "math",
          //"codeView",
          //"imageGallery",
          "fullScreen", "showBlocks",
          "preview", "print", "save",
           "template", "dir", "dir_ltr", "dir_rtl"
        ]
      ],
      fileManager: {
        upload: {
          url: uploadUrl,
          type: 'POST',
          headers: {
            'X-CSRF-Token': this.csrfToken(),
            'Content-Type': 'application/json'
          }
        }
      },
      onImageUpload: (targetImgElement, index, state, imageInfo, remainingFilesCount) => {
        console.log("Starting image upload...");

        fetch(uploadUrl, {
          method: 'POST',
          headers: {
            "X-CSRF-Token": this.csrfToken(),
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ image: imageInfo })
        })
        .then(response => {
          console.log("Response status:", response.status);
          return response.json();
        })
        .then(jsonResponse => {
          console.log("Response from server:", jsonResponse);
          if (jsonResponse.url) {
            this.editor.insertImage(jsonResponse.url);
          } else {
            console.error("Image upload failed: No URL in the response");
          }
        })
        .catch(error => {
          console.error("Image upload failed: ", error);
        });
      },
      onChange: (contents) => {
        this.saveDocument(contents);
      },
      callBackSave: this.saveDocument.bind(this)
    });

    this.element.addEventListener("submit", this.handleSubmit.bind(this));
  }

  saveDocument(content) {
    // Сохраняем содержимое редактора в скрытом поле перед отправкой формы
    this.hiddenContentTarget.value = content;
  }

  handleSubmit(event) {
    event.preventDefault();

    const content = this.editor.getContents();
    this.hiddenContentTarget.value = content;

    // Проверка на пустое содержимое
    if (!content || content.trim() === '') {
      alert("Содержимое не может быть пустым!");
      return;
    }

    // Отправляем форму с использованием Turbo или стандартного метода
    if (window.Turbo) {
      Turbo.navigator.submitForm(this.element);
    } else {
      this.element.submit();
    }
  }
}
