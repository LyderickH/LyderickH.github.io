/* Diaporama partagé par les pages projet.
   Chaque page se contente de déclarer ses légendes :
     window.SLIDER_CAPTIONS = [{ title: '…', text: '…' }, …];
   La logique, elle, ne vit qu'ici. */
(function () {
  function initSlider() {
    var container = document.querySelector('.slider-container');
    if (!container) return;

    var slides = container.querySelectorAll('.slide');
    if (!slides.length) return;

    var indicators = container.querySelectorAll('.indicator');
    var counter = container.querySelector('.counter');
    var captionTitle = container.querySelector('#caption-title');
    var captionText = container.querySelector('#caption-text');
    var prev = container.querySelector('.prev');
    var next = container.querySelector('.next');
    var captions = window.SLIDER_CAPTIONS || [];
    var current = 0;

    function show(index) {
      current = (index + slides.length) % slides.length;

      for (var i = 0; i < slides.length; i++) {
        slides[i].classList.toggle('active', i === current);
      }
      for (var j = 0; j < indicators.length; j++) {
        indicators[j].classList.toggle('active', j === current);
        indicators[j].setAttribute('aria-current', j === current ? 'true' : 'false');
      }

      var caption = captions[current];
      if (caption) {
        if (captionTitle) captionTitle.textContent = caption.title;
        if (captionText) captionText.textContent = caption.text;
      }
      if (counter) counter.textContent = (current + 1) + ' / ' + slides.length;
    }

    if (prev) prev.addEventListener('click', function () { show(current - 1); });
    if (next) next.addEventListener('click', function () { show(current + 1); });

    for (var k = 0; k < indicators.length; k++) {
      (function (index) {
        indicators[index].addEventListener('click', function () { show(index); });
      })(k);
    }

    /* Les flèches ne pilotent le diaporama que s'il est à l'écran : sinon
       elles volent la navigation au clavier du reste de la page. */
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      var tag = (document.activeElement || {}).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      var box = container.getBoundingClientRect();
      if (box.bottom < 0 || box.top > window.innerHeight) return;

      show(e.key === 'ArrowLeft' ? current - 1 : current + 1);
    });

    show(0);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSlider);
  } else {
    initSlider();
  }
})();
