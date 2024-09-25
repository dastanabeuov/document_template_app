import { Controller } from "@hotwired/stimulus";
import { Chart, registerables } from "chart.js";

// Регистрируем компоненты
Chart.register(...registerables);

export default class extends Controller {
  static targets = ["canvas"];

  connect() {
    try {
      const labels = this.element.dataset.chartLabels || "[]";
      const data = this.element.dataset.chartData || "[]";

      const ctx = this.canvasTarget.getContext('2d');

      // Создаем градиент для фона линии
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, 'rgba(75, 192, 192, 0.5)');
      gradient.addColorStop(1, 'rgba(75, 192, 192, 0)');

      // Градиент для точки при наведении
      const pointHoverGradient = ctx.createLinearGradient(0, 0, 0, 400);
      pointHoverGradient.addColorStop(0, 'rgba(0, 123, 255, 1)');
      pointHoverGradient.addColorStop(1, 'rgba(0, 123, 255, 0.5)');

      // Создание графика
      new Chart(this.canvasTarget, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Активные пользователи',
            data: data,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: gradient, // Градиентный фон
            fill: true, // Заливка под графиком
            tension: 0.4, // Плавные линии
            borderWidth: 3, // Более толстые линии
            pointBorderColor: 'rgba(0, 123, 255, 1)',
            pointBackgroundColor: 'rgba(255, 255, 255, 1)',
            pointBorderWidth: 3,
            pointRadius: 6,
            pointHoverRadius: 8,
            pointHoverBackgroundColor: pointHoverGradient, // Градиент при наведении
            pointHoverBorderColor: 'rgba(0, 123, 255, 1)',
            pointHoverBorderWidth: 3,
          }]
        },
        options: {
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
                  return `Пользователи: ${context.raw}`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(200, 200, 200, 0.2)',
                borderDash: [5, 5], // Пунктирная линия
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
          // Тень для графика
          elements: {
            line: {
              shadowColor: 'rgba(0, 0, 0, 0.2)',
              shadowBlur: 8,
              shadowOffsetX: 3,
              shadowOffsetY: 3,
            }
          }
        }
      });
    } catch (error) {
      console.error("Ошибка при создании графика:", error);
    }
  }
}
