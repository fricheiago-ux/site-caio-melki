/*
  Surgimento no scroll — mesma mecânica da ref-4:
  .reveal  -> ganha .active
  .text-reveal-wrapper / h1 / h2 -> ganham .reveal-active
  .hero-badge / .hero-stat -> ganham .active no load
  header.nav-load -> ganha .loaded

  Também cobre o padrão .animate-on-scroll/.animate das ref-3 e ref-7.
  Rede de segurança: elementos já visíveis são liberados na hora e um
  timeout final garante que nada fique invisível se o observer falhar.
*/
document.addEventListener('DOMContentLoaded', () => {

  // 1. Animações iniciais do topo
  setTimeout(() => {
    const header = document.querySelector('header');
    if (header) header.classList.add('loaded');
  }, 100);

  setTimeout(() => {
    const heroTitle = document.getElementById('hero-title');
    if (heroTitle) heroTitle.classList.add('reveal-active');
  }, 400);

  setTimeout(() => {
    document.querySelectorAll('.hero-badge, .hero-stat').forEach((el) => el.classList.add('active'));
  }, 500);

  // 2. Observer de scroll
  const observerOptions = { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.15 };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('active');
      entry.target.classList.add('animate');

      const textWrappers = entry.target.querySelectorAll('.text-reveal-wrapper');
      if (textWrappers.length > 0 || entry.target.classList.contains('text-reveal-wrapper')) {
        entry.target.classList.add('reveal-active');
      }
      if (entry.target.tagName === 'H1' || entry.target.tagName === 'H2') {
        entry.target.classList.add('reveal-active');
      }
      observer.unobserve(entry.target);
    });
  }, observerOptions);

  function inViewport(el) {
    const r = el.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  }

  const watched = document.querySelectorAll('.reveal, .animate-on-scroll');

  watched.forEach((el) => {
    if (inViewport(el)) {
      el.classList.add('active', 'animate');
      if (el.querySelector('.text-reveal-content') || el.classList.contains('text-reveal-wrapper')) {
        el.classList.add('reveal-active');
      }
      return;
    }
    observer.observe(el);
  });

  // Títulos com revelado mascarado que não estão dentro de um .reveal
  document.querySelectorAll('h1, h2').forEach((el) => {
    if (!el.querySelector('.text-reveal-content')) return;
    if (inViewport(el)) { el.classList.add('reveal-active'); return; }
    observer.observe(el);
  });

  // 3. Rede de segurança — nada fica invisível
  setTimeout(() => {
    watched.forEach((el) => el.classList.add('active', 'animate'));
    document.querySelectorAll('.text-reveal-wrapper, h1, h2').forEach((el) => el.classList.add('reveal-active'));
  }, 8000);
});
