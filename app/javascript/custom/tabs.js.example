document.addEventListener('turbo:load', function() {
  const tabLinks = document.querySelectorAll('.nav-tabs .nav-item .nav-link');

  tabLinks.forEach(link => {
    link.addEventListener('click', function() {
      // Удалите класс shadow у всех ссылок
      tabLinks.forEach(link => {
        link.classList.remove('shadow-lg');
      });

      // Добавьте класс shadow к текущей активной вкладке
      this.classList.add('shadow-lg');
    });
  });
});
