import { Controller } from "@hotwired/stimulus"
import "jquery"
import "datatables"

// Контроллер DataTables
export default class extends Controller {
  // Определяем цели, к которым будем обращаться
  static targets = ["table"]

  // Опции для DataTables
  static values = {
    options: { type: Object, default: {} }
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

    // Инициализируем DataTables на целевом элементе с опциями (если они есть)
    try {
      this.dataTable = $(this.tableTarget).DataTable(this.optionsValue)
      console.log("DataTable успешно инициализирована")
    } catch (error) {
      console.error("Ошибка при инициализации DataTable:", error)
    }

    // Слушаем событие turbo:before-cache для очистки таблицы
    document.addEventListener("turbo:before-cache", () => this.disconnect())
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
