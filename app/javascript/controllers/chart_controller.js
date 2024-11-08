import { Controller } from "@hotwired/stimulus"
import { Chart, registerables } from "chart.js"

// Регистрируем компоненты Chart.js
Chart.register(...registerables)

export default class extends Controller {
  static targets = ["canvas"]

  // Приватное свойство для хранения экземпляра графика
  #chart = null

  connect() {
    this.initializeChart()
  }

  disconnect() {
    this.destroyChart()
  }

  // Инициализация графика
  initializeChart() {
    try {
      const translateUsers = this.element.dataset.translateUsers || "[]"
      const translateActiveUsers = this.element.dataset.translateActiveUsers || "[]"
      const labels = JSON.parse(this.element.dataset.chartLabels || "[]")
      const data = JSON.parse(this.element.dataset.chartData || "[]")
      const ctx = this.canvasTarget.getContext('2d')

      // Создаем градиенты
      const gradient = this.createBackgroundGradient(ctx)
      const pointHoverGradient = this.createHoverGradient(ctx)

      // Создание и сохранение экземпляра графика
      this.#chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: translateActiveUsers,
            data: data,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: gradient,
            fill: true,
            tension: 0.4,
            borderWidth: 3,
            pointBorderColor: 'rgba(0, 123, 255, 1)',
            pointBackgroundColor: 'rgba(255, 255, 255, 1)',
            pointBorderWidth: 3,
            pointRadius: 6,
            pointHoverRadius: 8,
            pointHoverBackgroundColor: pointHoverGradient,
            pointHoverBorderColor: 'rgba(0, 123, 255, 1)',
            pointHoverBorderWidth: 3,
          }]
        },
        options: this.chartOptions(translateUsers)
      })
    } catch (error) {
      console.error("Ошибка при создании графика:", error)
    }
  }

  // Уничтожение графика и очистка памяти
  destroyChart() {
    if (this.#chart) {
      this.#chart.destroy()
      this.#chart = null
    }
  }

  // Создание градиента для фона
  createBackgroundGradient(ctx) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400)
    gradient.addColorStop(0, 'rgba(75, 192, 192, 0.5)')
    gradient.addColorStop(1, 'rgba(75, 192, 192, 0)')
    return gradient
  }

  // Создание градиента для hover эффекта
  createHoverGradient(ctx) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400)
    gradient.addColorStop(0, 'rgba(0, 123, 255, 1)')
    gradient.addColorStop(1, 'rgba(0, 123, 255, 0.5)')
    return gradient
  }

  // Настройки графика
  chartOptions(translateUsers) {
    return {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          labels: {
            color: 'rgba(0, 0, 0, 0.7)',
            font: {
              size: 16,
              family: 'Helvetica, Arial, sans-serif',
              weight: 'bold'
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 123, 255, 0.9)',
          titleColor: '#fff',
          bodyColor: '#fff',
          bodyFont: {
            size: 14,
          },
          cornerRadius: 6,
          padding: 12,
          displayColors: false,
          callbacks: {
            label: function(context) {
              return `${translateUsers}: ${context.raw}`
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(200, 200, 200, 0.2)',
            borderDash: [5, 5],
          },
          ticks: {
            color: 'rgba(0, 0, 0, 0.8)',
            font: {
              size: 14,
              family: 'Arial',
            }
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: 'rgba(0, 0, 0, 0.8)',
            font: {
              size: 14,
              family: 'Arial',
            }
          }
        }
      },
      elements: {
        line: {
          shadowColor: 'rgba(0, 0, 0, 0.2)',
          shadowBlur: 8,
          shadowOffsetX: 3,
          shadowOffsetY: 3,
        }
      }
    }
  }
}
