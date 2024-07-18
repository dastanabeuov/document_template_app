import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="flash"
export default class extends Controller {
  static targets = ["message"];

  connect() {
    this.hideAfterDelay();
  }

  hideAfterDelay() {
    setTimeout(() => {
      const alert = this.element;
      alert.classList.remove("show");
      alert.classList.add("hide");
      alert.addEventListener("transitionend", () => alert.remove());
    }, 10000); // 10000 миллисекунд = 10 секунды
  }
}
