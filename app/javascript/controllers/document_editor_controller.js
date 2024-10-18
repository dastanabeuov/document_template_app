import { Controller } from "@hotwired/stimulus";
import SunEditor from "suneditor";
import * as plugins from "suneditor/src/plugins";

import "katex";

// import CodeMirror from "codemirror";
// import "codemirror-htmlmixed";
// import "codemirror-xml";
// import "codemirror-css";

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
    const lang = {
        code: 'ru',
        toolbar: {
            default: 'По умолчанию',
            save: 'Сохранить',
            font: 'Шрифт',
            formats: 'Стиль абзаца',
            fontSize: 'Размер шрифта',
            bold: 'Полужирный',
            underline: 'Подчёркнутый',
            italic: 'Курсив',
            strike: 'Зачеркнутый',
            subscript: 'Нижний индекс',
            superscript: 'Верхний индекс',
            removeFormat: 'Очистить форматирование',
            fontColor: 'Цвет текста',
            hiliteColor: 'Цвет фона',
            indent: 'Увеличить отступ',
            outdent: 'Уменьшить отступ',
            align: 'Выравнивание',
            alignLeft: 'Слева',
            alignRight: 'Справа',
            alignCenter: 'По центру',
            alignJustify: 'По ширине',
            list: 'Списки',
            orderList: 'Нумерованный',
            unorderList: 'Маркированный',
            horizontalRule: 'Горизонтальная линия',
            hr_solid: 'Сплошная',
            hr_dotted: 'Пунктир',
            hr_dashed: 'Штриховая',
            table: 'Таблица',
            link: 'Ссылка',
            math: 'математический',
            image: 'Изображение',
            video: 'Видео',
            audio: 'Аудио',
            fullScreen: 'Полный экран',
            showBlocks: 'Блочный вид',
            codeView: 'Редактировать HTML',
            undo: 'Отменить',
            redo: 'Вернуть',
            preview: 'Предварительный просмотр',
            print: 'Печать',
            tag_p: 'Текст',
            tag_div: 'Базовый',
            tag_h: 'Заголовок',
            tag_blockquote: 'Цитата',
            tag_pre: 'Код',
            template: 'Шаблон',
            lineHeight: 'Высота линии',
            paragraphStyle: 'Стиль абзаца',
            textStyle: 'Стиль текста',
            imageGallery: 'Галерея',
            dir_ltr: 'Слева направо',
            dir_rtl: 'Справа налево',
            mention: 'Упоминание'
        },
        dialogBox: {
            linkBox: {
                title: 'Вставить ссылку',
                url: 'Ссылка',
                text: 'Текст',
                newWindowCheck: 'Открывать в новом окне',
                downloadLinkCheck: 'Ссылка для скачивания',
                bookmark: 'Закладка'
            },
            mathBox: {
                title: 'математический',
                inputLabel: 'Математическая запись',
                fontSizeLabel: 'Кегль',
                previewLabel: 'Предварительный просмотр'
            },
            imageBox: {
                title: 'Вставить изображение',
                file: 'Выберите файл',
                url: 'Адрес изображения',
                altText: 'Текстовое описание изображения'
            },
            videoBox: {
                title: 'Вставить видео',
                file: 'Выберите файл',
                url: 'Ссылка на видео, Youtube,Vimeo'
            },
            audioBox: {
                title: 'Вставить аудио',
                file: 'Выберите файл',
                url: 'Адрес аудио'
            },
            browser: {
                tags: 'Теги',
                search: 'Поиск',
            },
            caption: 'Добавить подпись',
            close: 'Закрыть',
            submitButton: 'Подтвердить',
            revertButton: 'Сбросить',
            proportion: 'Сохранить пропорции',
            basic: 'Без обтекания',
            left: 'Слева',
            right: 'Справа',
            center: 'По центру',
            width: 'Ширина',
            height: 'Высота',
            size: 'Размер',
            ratio: 'Соотношение'
        },
        controller: {
            edit: 'Изменить',
            unlink: 'Убрать ссылку',
            remove: 'Удалить',
            insertRowAbove: 'Вставить строку выше',
            insertRowBelow: 'Вставить строку ниже',
            deleteRow: 'Удалить строку',
            insertColumnBefore: 'Вставить столбец слева',
            insertColumnAfter: 'Вставить столбец справа',
            deleteColumn: 'Удалить столбец',
            fixedColumnWidth: 'Фиксированная ширина столбца',
            resize100: 'Размер 100%',
            resize75: 'Размер 75%',
            resize50: 'Размер 50%',
            resize25: 'Размер 25%',
            autoSize: 'Авто размер',
            mirrorHorizontal: 'Отразить по горизонтали',
            mirrorVertical: 'Отразить по вертикали',
            rotateLeft: 'Повернуть против часовой стрелки',
            rotateRight: 'Повернуть по часовой стрелке',
            maxSize: 'Ширина по размеру страницы',
            minSize: 'Ширина по содержимому',
            tableHeader: 'Строка заголовков',
            mergeCells: 'Объединить ячейки',
            splitCells: 'Разделить ячейку',
            HorizontalSplit: 'Разделить горизонтально',
            VerticalSplit: 'Разделить вертикально'
        },
        menu: {
            spaced: 'интервал',
            bordered: 'Граничная Линия',
            neon: 'неон',
            translucent: 'полупрозрачный',
            shadow: 'Тень',
            code: 'Код'
        }
    };

    if (!this.contentTarget) {
      console.error("contentTarget не найден!");
      return;
    }

    const uploadUrl = this.data.get("uploadUrl");
    //const urlImagesGallery = uploadUrl.replace("/upload_image", "") + "/document-images";


    this.editor = SunEditor.create(this.contentTarget, {
      templates: [
        { name: "Template 1", html: "<p>Template 1 content</p>" },
        { name: "Template 2", html: "<p>Template 2 content</p>" }
      ],
      width: "100%",
      height: "300px",
      plugins: plugins,
      lang: lang,
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
