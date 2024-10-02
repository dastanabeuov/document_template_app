import { Controller } from "@hotwired/stimulus";
import EditorJS from "@editorjs/editorjs";

// Эти плагины подключены к Editor.js
import CodeTool from "@editorjs/code";
import Header from "@editorjs/header";
import ImageTool from "@editorjs/image";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";

// Контроллер Stimulus
export default class extends Controller {
  static targets = ["document_content"];  // Привязка цели для Editor.js

  csrfToken() {
    const metaTag = document.querySelector("meta[name='csrf-token']");
    return metaTag ? metaTag.content : "";
  }

  connect() {
    const initialContent = this.getInitialContent();

    // Получаем companyId и projectId из data-атрибутов формы
    const companyId = this.element.dataset.companyId;
    const projectId = this.element.dataset.projectId;

    // Инициализация Editor.js
    this.contentEditor = new EditorJS({
      holder: this.document_contentTarget,
      data: initialContent,
      tools: {
        header: { class: Header },
        list: { class: List },
        paragraph: {
          class: Paragraph,
          config: { inlineToolbar: true }
        },
        code: CodeTool,
        image: {
          class: ImageTool,
          config: {
            endpoints: {
              byFile: `/companies/${companyId}/projects/${projectId}/documents/upload_image`, // Правильный маршрут для загрузки изображений
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
        console.log('Editor.js готов к работе!');
      },
      onChange: () => {
        console.log('Изменения в Editor.js!');
      }
    });

    // Обработка отправки формы
    this.element.addEventListener("submit", this.saveEditorData.bind(this));
  }

  getInitialContent() {
    const hiddenContentField = document.getElementById("document_content_hidden");

    // Получение начального контента для Editor.js
    if (hiddenContentField && hiddenContentField.value) {
      return JSON.parse(hiddenContentField.value);
    }
    return {};
  }

  async saveEditorData(event) {
    event.preventDefault(); // блокируем стандартную отправку формы

    // Получение данных из Editor.js
    const outputData = await this.contentEditor.save();

    // Записываем данные в скрытое поле
    const hiddenInput = document.getElementById("document_content_hidden");
    hiddenInput.value = JSON.stringify(outputData);

    // Здесь нужно использовать Turbo для отправки формы
    if (window.Turbo) {
      Turbo.navigator.submitForm(this.element); // Отправляем форму с помощью Turbo
    } else {
      this.element.submit(); // Стандартная отправка, если Turbo не загружен
    }
  }
}
