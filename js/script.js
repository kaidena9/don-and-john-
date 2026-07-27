document.documentElement.classList.add('js');

(function () {
  'use strict';

  var nav = document.getElementById('nav');
  var navToggle = document.getElementById('navToggle');

  /* ---- year ---- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- nav: scrolled state ---- */
  var onScroll = function () {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 24);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- mobile menu ---- */
  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    nav.querySelectorAll('.nav__links a, .nav__cta').forEach(function (a) {
      a.addEventListener('click', function () {
        if (nav.classList.contains('is-open')) {
          nav.classList.remove('is-open');
          navToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });
    });
  }

  /* ---- FAQ accordion ---- */
  var faqList = document.getElementById('faqList');
  if (faqList) {
    faqList.addEventListener('click', function (e) {
      var q = e.target.closest('.faq__q');
      if (!q) return;
      var item = q.parentElement;
      var isOpen = item.classList.contains('is-open');
      faqList.querySelectorAll('.faq__item').forEach(function (it) { it.classList.remove('is-open'); });
      if (!isOpen) item.classList.add('is-open');
    });
  }

  /* ---- reveal on scroll ---- */
  var revealEls = document.querySelectorAll('[data-reveal], [data-reveal-stagger]');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---- review slider ---- */
  var track = document.getElementById('revTrack');
  var prevBtn = document.getElementById('revPrev');
  var nextBtn = document.getElementById('revNext');
  var countEl = document.getElementById('revCount');
  if (track && prevBtn && nextBtn) {
    var slides = track.querySelectorAll('.trust__slide').length;
    var idx = 0;
    var go = function (i) {
      idx = (i + slides) % slides;
      track.style.transform = 'translateX(-' + (idx * 100) + '%)';
      if (countEl) countEl.textContent = (idx + 1) + ' / ' + slides;
    };
    prevBtn.addEventListener('click', function () { go(idx - 1); });
    nextBtn.addEventListener('click', function () { go(idx + 1); });

    var startX = null;
    track.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) go(dx < 0 ? idx + 1 : idx - 1);
      startX = null;
    }, { passive: true });
  }

  /* ---- estimate form ---- */
  var form = document.getElementById('estimate-form');
  var formNote = document.getElementById('form-note');
  if (form && formNote) {
    form.addEventListener('submit', function () {
      formNote.textContent = 'Sending your request…';
    });
  }
})();
