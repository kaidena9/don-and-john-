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
  var revealAll = function () {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  };
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '200px 0px 0px 0px', threshold: 0 });
    revealEls.forEach(function (el) { io.observe(el); });
    // Safety net: content must never stay invisible, whatever the observer does.
    setTimeout(revealAll, 2500);
  } else {
    revealAll();
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

  /* ---- estimate form ----
     Paste the Apps Script web-app URL here (see FORM-SETUP.md) to send mail
     from our own account — no activation step. Empty = fall back to the
     form's own action. */
  var FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwuA43ED9MX_57EEmlU3lyKi_288O8c9HLTYYHARS7bGqrp6xNhTV9ewicKGErsWn2-Hw/exec';

  var form = document.getElementById('estimate-form');
  var formNote = document.getElementById('form-note');
  var overlay = document.getElementById('sentOverlay');
  var overlayClose = document.getElementById('sentClose');

  var showSent = function () {
    if (!overlay) { window.location.href = 'thanks.html'; return; }
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    if (overlayClose) overlayClose.focus();
  };
  var hideSent = function () {
    if (!overlay) return;
    overlay.hidden = true;
    document.body.style.overflow = '';
  };
  if (overlayClose) overlayClose.addEventListener('click', hideSent);
  if (overlay) {
    overlay.addEventListener('click', function (e) { if (e.target === overlay) hideSent(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !overlay.hidden) hideSent();
    });
  }

  if (form) {
    var addr = form.querySelector('#address');
    if (addr) {
      // A quote needs a real address — insist on a ZIP.
      var checkZip = function () {
        var ok = /\b\d{5}(-\d{4})?\b/.test(addr.value);
        addr.setCustomValidity(ok ? '' : 'Please include the ZIP code, e.g. 60634');
      };
      addr.addEventListener('input', checkZip);
      addr.addEventListener('blur', checkZip);
    }

    form.addEventListener('submit', function (e) {
      // Reply-to the customer, so Don & John can answer straight from the email.
      var email = form.querySelector('#email');
      var replyto = form.querySelector('input[name="_replyto"]');
      if (email && replyto) replyto.value = email.value;

      if (!FORM_ENDPOINT) return;
      e.preventDefault();

      var btn = form.querySelector('.estimate-form__submit');
      if (btn) { btn.disabled = true; btn.style.opacity = '.7'; }
      if (formNote) formNote.textContent = 'Sending your request…';

      fetch(FORM_ENDPOINT, { method: 'POST', mode: 'no-cors', body: new FormData(form) })
        .then(function () {
          if (formNote) formNote.textContent = '';
          form.reset();
          showSent();
        })
        .catch(function () {
          if (formNote) {
            formNote.textContent = "Couldn't send just now — please call (708) 855-2336.";
          }
        })
        .then(function () {
          if (btn) { btn.disabled = false; btn.style.opacity = ''; }
        });
    });
  }
})();
