/* Mobile navigation */
let menuReturnFocus = null;

function openMenu() {
  const menu = document.querySelector('.menu');
  if (!menu) return;
  menuReturnFocus = document.activeElement;
  menu.inert = false;
  menu.setAttribute('aria-hidden', 'false');
  document.body.classList.add('menu--open');
  document.querySelector('.btn__menu')?.setAttribute('aria-expanded', 'true');
  menu.querySelector('button, a[href]')?.focus();
}

function closeMenu() {
  const menu = document.querySelector('.menu');
  if (!menu) return;
  if (menu.contains(document.activeElement)) menuReturnFocus?.focus();
  document.body.classList.remove('menu--open');
  menu.inert = true;
  menu.setAttribute('aria-hidden', 'true');
  document.querySelector('.btn__menu')?.setAttribute('aria-expanded', 'false');
}

function initializeWebsite() {
  const menu = document.querySelector('.menu');
  document.addEventListener('keydown', (event) => {
    if (!menu || !document.body.classList.contains('menu--open')) return;
    if (event.key === 'Escape') {
      closeMenu();
      return;
    }
    if (event.key !== 'Tab') return;
    const items = [...menu.querySelectorAll('a[href], button:not(:disabled)')]
      .filter(item => item.getClientRects().length);
    const first = items[0];
    const last = items[items.length - 1];
    if (!first) { event.preventDefault(); return; }
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  window.matchMedia('(min-width: 1025px)').addEventListener('change', event => {
    if (event.matches) closeMenu();
  });

  /* Testimonial controls enable when there is more than one slide. */
  const slides = [...document.querySelectorAll('.testimonials__slides .testimonial')];
  const previous = document.querySelector('[data-testimonial-prev]');
  const next = document.querySelector('[data-testimonial-next]');
  let current = 0;
  function showSlide(index) {
    if (!slides.length) return;
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => { slide.hidden = i !== current; });
  }
  if (previous) {
    previous.disabled = slides.length < 2;
    previous.addEventListener('click', () => showSlide(current - 1));
  }
  if (next) {
    next.disabled = slides.length < 2;
    next.addEventListener('click', () => showSlide(current + 1));
  }
  showSlide(0);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeWebsite);
} else {
  initializeWebsite();
}
