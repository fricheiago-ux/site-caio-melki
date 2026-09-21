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

  // ---------- Menu do celular (painel de tela cheia) ----------
  // Abaixo de 940px os links do navbar viram um painel cheio, aberto por
  // este botão. Sem isso não havia nenhum jeito de navegar entre seções
  // no celular — os links só existiam a partir de 940px de largura.
  const menuToggle = document.querySelector('.navbar__toggle');
  const menuPainel = document.getElementById('navbar-links');
  if (navbar && menuToggle && menuPainel) {
    function fecharMenu() {
      navbar.classList.remove('is-aberto');
      document.body.classList.remove('menu-aberto');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
    function alternarMenu() {
      const abrir = !navbar.classList.contains('is-aberto');
      navbar.classList.toggle('is-aberto', abrir);
      document.body.classList.toggle('menu-aberto', abrir);
      menuToggle.setAttribute('aria-expanded', String(abrir));
    }
    menuToggle.addEventListener('click', alternarMenu);
    // Clicar num link fecha o painel — sem isso a pessoa toca um link,
    // a página rola por baixo do painel ainda aberto, e parece travado.
    menuPainel.querySelectorAll('a').forEach((a) => a.addEventListener('click', fecharMenu));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') fecharMenu(); });
    // Se a tela crescer para o layout de mesa com o painel aberto (giro de
    // tablet, por exemplo), o estado de "aberto" não faz mais sentido.
    window.matchMedia('(min-width: 940px)').addEventListener('change', (e) => { if (e.matches) fecharMenu(); });
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
