/*
  Interações dos componentes:
  - lanterna que segue o mouse (.flashlight-card) .......... ref-7
  - acordeão do FAQ (.toggle-faq / .faq-content) ........... ref-6
  - lista que troca a mídia em destaque (.class-item) ...... ref-6
  - navbar que ganha fundo ao rolar, modal, switches e barras
*/
(function () {
  // ---------- Lanterna nos cards (ref-7) ----------
  document.querySelectorAll('.flashlight-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
  });

  // ---------- Acordeão do FAQ (ref-6) ----------
  document.querySelectorAll('.toggle-faq').forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const content = toggle.parentElement.querySelector('.faq-content');
      const isOpen = !!content.style.maxHeight;

      document.querySelectorAll('.faq-content').forEach((c) => {
        c.style.maxHeight = null;
        c.classList.remove('active');
      });
      document.querySelectorAll('.toggle-faq').forEach((t) => t.setAttribute('aria-expanded', 'false'));

      if (!isOpen) {
        content.style.maxHeight = content.scrollHeight + 'px';
        content.classList.add('active');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ---------- Lista interativa (ref-6) ----------
  const classItems = document.querySelectorAll('.class-item');
  const displayImage = document.getElementById('class-display-image');
  const displayTitle = document.getElementById('class-display-title');
  const displayTag = document.getElementById('class-display-tag');

  classItems.forEach((item) => {
    item.addEventListener('click', () => {
      classItems.forEach((i) => i.classList.remove('is-active'));
      item.classList.add('is-active');

      if (!displayImage) return;
      const newImage = item.getAttribute('data-image');
      const newTitle = item.getAttribute('data-title');
      const newTag = item.getAttribute('data-tag');

      displayImage.style.opacity = '0';
      setTimeout(() => {
        if (newImage) displayImage.src = newImage;
        if (displayTitle && newTitle) displayTitle.textContent = newTitle;
        if (displayTag && newTag) displayTag.textContent = newTag;
        displayImage.style.opacity = '1';
      }, 300);
    });
  });

  // ---------- Navbar ----------
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => navbar.classList.toggle('is-stuck', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---------- Modal ----------
  const overlay = document.querySelector('.modal-overlay');
  if (overlay) {
    document.querySelectorAll('[data-modal-open]').forEach((btn) => {
      btn.addEventListener('click', () => overlay.classList.add('is-open'));
    });
    overlay.querySelectorAll('[data-modal-close]').forEach((btn) => {
      btn.addEventListener('click', () => overlay.classList.remove('is-open'));
    });
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('is-open');
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') overlay.classList.remove('is-open');
    });
  }

  // ---------- Switches ----------
  document.querySelectorAll('.switch').forEach((sw) => {
    sw.addEventListener('click', () => {
      sw.setAttribute('aria-checked', sw.getAttribute('aria-checked') === 'true' ? 'false' : 'true');
    });
  });

  // ---------- Barras que preenchem ao entrar na tela ----------
  const meterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const fill = entry.target.querySelector('.meter__fill');
      if (fill) fill.style.width = fill.dataset.value || '0%';
      meterObserver.unobserve(entry.target);
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('.meter').forEach((m) => meterObserver.observe(m));
  setTimeout(() => {
    document.querySelectorAll('.meter__fill').forEach((f) => { f.style.width = f.dataset.value || '0%'; });
  }, 8000);

  // ---------- Âncoras suaves ----------
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
