import { Controller } from "@hotwired/stimulus";
import EditorJS from "@editorjs/editorjs";

// These are the plugins
import CodeTool from "@editorjs/code";
import Header from "@editorjs/header";
import ImageTool from "@editorjs/image";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";

// Connects to data-controller="document-editor"
export default class extends Controller {
  static targets = ["document_content"];

  csrfToken() {
    const metaTag = document.querySelector("meta[name='csrf-token']");
    return metaTag ? metaTag.content : "";
  }

  connect() {
    const initialContent = this.getInitialContent();

    this.contentEditor = new EditorJS({
      holder: this.document_contentTarget,
      data: initialContent,
      tools: {
        header: {
          class: Header,
        },
        list: {
          class: List,
        },
        paragraph: {
          class: Paragraph,
          config: {
            inlineToolbar: true,
          },
        },
        code: CodeTool,
        image: {
          class: ImageTool,
          config: {
            endpoints: {
              byFile: `/documents/upload_image`,
            },
            additionalRequestHeaders: {
              "X-CSRF-Token": this.csrfToken(),
            },
            field: 'image',
            types: 'image/*',
          },
        },
      },
      onReady: () => {
        console.log('Editor.js is ready to work!');
      },
      onChange: () => {
        console.log('Editor.js content changed!');
      }
    });

    this.element.addEventListener("submit", this.saveEditorData.bind(this));
  }

  getInitialContent() {
    const hiddenContentField = document.getElementById("document_content_hidden");

    if (hiddenContentField && hiddenContentField.value) {
      return JSON.parse(hiddenContentField.value);
    }
    return {};
  }

  async saveEditorData(event) {
    event.preventDefault();

    const outputData = await this.contentEditor.save();
    const documentForm = this.element;

    const hiddenInput = document.getElementById("document_content_hidden");

    hiddenInput.value = JSON.stringify(outputData);
    documentForm.submit();
  }
}
