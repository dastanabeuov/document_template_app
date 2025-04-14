import { Controller } from "@hotwired/stimulus"
import "jquery"
import "datatables"
// Импортируем языковые файлы
import ruLanguage from "datatables-i18n-ru"
import enLanguage from "datatables-i18n-en"
import kzLanguage from "datatables-i18n-kz"

// Контроллер DataTables
export default class extends Controller {
  // Определяем цели, к которым будем обращаться
  static targets = ["table"]

  // Опции для DataTables
  static values = {
    options: { type: Object, default: {} },
    language: { type: String, default: "ru" } // Параметр для языка
  }

  // Словарь доступных языков
  languages = {
    ru: ruLanguage,
    en: enLanguage,
    kz: kzLanguage
  }

  connect() {
    // Проверяем, что jQuery и DataTables доступны
    if (typeof $ === 'undefined') {
      console.error("jQuery не найден. DataTables не может быть инициализирована.")
      return
    }

    if (!$.fn.DataTable) {
      console.error("DataTables не найдена. Убедитесь, что библиотека загружена.")
      return
    }

    // Инициализируем таблицу
    this.initializeDataTable()
    
    // Слушаем событие turbo:before-cache для очистки таблицы
    document.addEventListener("turbo:before-cache", () => this.disconnect())
  }

  // Метод для инициализации таблицы с выбором языка
  initializeDataTable() {
    try {
      const language = this.languageValue.toLowerCase()
      const languageData = this.languages[language] || {}
      
      // Объединяем пользовательские опции с языковыми настройками
      const options = {
        ...this.optionsValue,
        language: languageData
      }

      // Инициализируем DataTables с опциями
      this.dataTable = $(this.tableTarget).DataTable(options)
      console.log(`DataTable успешно инициализирована с языком: ${language}`)
    } catch (error) {
      console.error("Ошибка при инициализации DataTable:", error)
      // Пробуем инициализировать без языковых настроек в случае ошибки
      this.dataTable = $(this.tableTarget).DataTable(this.optionsValue)
    }
  }

  disconnect() {
    // Уничтожаем DataTable при удалении контроллера из DOM
    if (this.dataTable) {
      this.dataTable.destroy()
      this.dataTable = null // Дополнительно очищаем ссылку на таблицу
      console.log("DataTable уничтожена")
    }
  }

  // Метод для обновления данных, если необходимо
  refresh() {
    if (this.dataTable) {
      this.dataTable.ajax.reload()
    }
  }
}