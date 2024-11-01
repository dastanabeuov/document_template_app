import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["message"]

  connect() {
    this.timeoutId = setTimeout(() => this.hideFlash(), 3000)

    // Добавляем слушатель события closed.bs.alert
    this.element.addEventListener('closed.bs.alert', this.handleManualClose.bind(this))
  }

  disconnect() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
    }

    if (this.boundTransitionendHandler) {
      this.element.removeEventListener("transitionend", this.boundTransitionendHandler)
    }

    // Удаляем слушатель события Bootstrap
    this.element.removeEventListener('closed.bs.alert', this.handleManualClose.bind(this))
  }

  // Обработчик для ручного закрытия через Bootstrap
  handleManualClose() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
    }
  }

  hideFlash() {
    const alert = this.element
    alert.classList.remove("show")
    alert.classList.add("hide")

    this.boundTransitionendHandler = () => alert.remove()
    alert.addEventListener("transitionend", this.boundTransitionendHandler)
  }
}
