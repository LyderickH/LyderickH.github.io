/* Diaporama partagé par les pages projet.
   Chaque page se contente de déclarer ses légendes :
     window.SLIDER_CAPTIONS    = [{ title: '…', text: '…' }, …];
     window.SLIDER_CAPTIONS_EN = [{ title: '…', text: '…' }, …];  (facultatif)
   La logique, elle, ne vit qu'ici.

   Les légendes sont écrites en JS : le moteur i18n ne peut pas les atteindre.
   C'est donc le diaporama qui choisit la langue, et qui se redessine quand
   elle change. */
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
    var wrapper = container.querySelector('.slider-wrapper');
    var captionBox = container.querySelector('.caption');
    var current = 0;

    function isEn() {
      return (window.i18nLang ? window.i18nLang() : (localStorage.getItem('lang') || 'fr')) === 'en';
    }

    /* Hauteur stable : le cadre prend le format majoritaire des images
       (médiane des ratios, lus sur les attributs width/height). Une image
       plus haute s'y inscrit en réduction, une plus petite garde sa taille
       réelle ; le lien d'agrandissement donne toujours l'original. */
    if (wrapper) {
      var sizes = [];
      for (var s = 0; s < slides.length; s++) {
        var w = parseInt(slides[s].getAttribute('width'), 10);
        var h = parseInt(slides[s].getAttribute('height'), 10);
        if (w > 0 && h > 0) sizes.push({ w: w, h: h });
      }
      if (sizes.length === slides.length) {
        sizes.sort(function (a, b) { return a.h / a.w - b.h / b.w; });
        var ref = sizes[Math.floor((sizes.length - 1) / 2)];
        wrapper.style.setProperty('--slide-ratio', ref.w + ' / ' + ref.h);
        wrapper.classList.add('is-sized');
      }
    }

    /* Région nommée, légende annoncée aux lecteurs d'écran à chaque image */
    container.setAttribute('role', 'group');
    if (captionBox) captionBox.setAttribute('aria-live', 'polite');

    /* Lien d'agrandissement : une capture de tableau de bord à 360 px de
       large est illisible, on doit pouvoir l'ouvrir en taille réelle. */
    var zoom = null;
    if (captionBox) {
      zoom = document.createElement('a');
      zoom.className = 'section-link';
      zoom.target = '_blank';
      zoom.rel = 'noopener';
      captionBox.appendChild(zoom);
    }

    function captionSet() {
      var lang = window.i18nLang ? window.i18nLang() : (localStorage.getItem('lang') || 'fr');
      if (lang === 'en' && window.SLIDER_CAPTIONS_EN && window.SLIDER_CAPTIONS_EN.length) {
        return window.SLIDER_CAPTIONS_EN;
      }
      return window.SLIDER_CAPTIONS || [];
    }

    function show(index) {
      var captions = captionSet();
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

      var en = isEn();
      container.setAttribute('aria-label', en ? 'Slideshow' : 'Diaporama');

      /* Le texte alternatif reprend le titre de la légende, dans la langue
         courante, à la place d'un « Page 3 » qui ne décrit rien. */
      for (var a = 0; a < slides.length; a++) {
        if (captions[a] && captions[a].title) slides[a].alt = captions[a].title;
      }
      for (var b = 0; b < indicators.length; b++) {
        indicators[b].setAttribute('aria-label', 'Image ' + (b + 1) +
          (captions[b] && captions[b].title ? ' : ' + captions[b].title : ''));
      }

      if (zoom) {
        zoom.href = slides[current].currentSrc || slides[current].src;
        zoom.textContent = en ? 'Open the image full size ↗' : "Ouvrir l'image en taille réelle ↗";
      }
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

    // Le moteur i18n vient de repasser sur la page : réécrire la légende
    // courante dans la nouvelle langue.
    document.addEventListener('i18n-applied', function () { show(current); });

    show(0);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSlider);
  } else {
    initSlider();
  }
})();
