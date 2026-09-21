// Custom Cursor Logic — estrutura da ref-5 (.cursor-dot / .cursor-outline / .hovered)
(function () {
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorOutline = document.querySelector('.cursor-outline');
  if (!cursorDot || !cursorOutline) return;

  // Em telas de toque o cursor nativo volta a valer
  if (window.matchMedia('(hover: none)').matches) {
    cursorDot.style.display = 'none';
    cursorOutline.style.display = 'none';
    document.body.style.cursor = 'auto';
    return;
  }

  // O atraso do anel é uma interpolação num único requestAnimationFrame.
  // Antes cada mousemove criava uma Web Animation com fill: forwards —
  // centenas delas se acumulavam e roubavam quadros da rolagem.
  let alvoX = -100, alvoY = -100;
  let anelX = -100, anelY = -100;
  let rodando = false;

  function seguir() {
    anelX += (alvoX - anelX) * 0.16;
    anelY += (alvoY - anelY) * 0.16;
    cursorOutline.style.transform = `translate3d(${anelX}px, ${anelY}px, 0) translate(-50%, -50%)`;

    if (Math.abs(alvoX - anelX) < 0.4 && Math.abs(alvoY - anelY) < 0.4) {
      rodando = false;
      return;
    }
    requestAnimationFrame(seguir);
  }

  window.addEventListener('mousemove', (e) => {
    // O ponto acompanha instantaneamente
    cursorDot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;

    alvoX = e.clientX;
    alvoY = e.clientY;
    conferirFundo(e.clientX, e.clientY);
    if (!rodando) { rodando = true; requestAnimationFrame(seguir); }
  }, { passive: true });


  /* ---------- Cursor claro sobre fundo escuro ----------
     O cursor é sálvia. Em cima das portas, da seção dos pilares, do painel
     escuro ou do rodapé ele desaparecia dentro do próprio fundo.

     Em vez de manter uma lista de seções escuras, que envelheceria a cada
     seção nova, aqui se mede o que está de fato sob o ponteiro: sobe pela
     árvore até achar quem pinta o fundo e calcula a luminância. Gradiente
     também conta, porque getComputedStyle devolve as cores já resolvidas
     dentro da string, e basta ler a primeira. */

  function luminancia(r, g, b) {
    const f = (c) => {
      c /= 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  }

  function corDeFundo(estilo) {
    // Cor sólida, se for opaca o bastante para valer como fundo
    const m = estilo.backgroundColor.match(/[\d.]+/g);
    if (m && m.length >= 3 && (m.length < 4 || parseFloat(m[3]) > 0.5)) {
      return [+m[0], +m[1], +m[2]];
    }
    // Gradiente: varre TODAS as cores e fica com a primeira opaca. Pegar
    // só a primeira da string erra em fundo de camadas — a seção dos
    // pilares, por exemplo, começa com um halo de sálvia a 20% por cima
    // do musgo, e o halo sozinho não diz nada sobre o fundo real.
    const g = estilo.backgroundImage;
    if (g && g !== 'none' && g.indexOf('gradient') !== -1) {
      const cores = g.match(/rgba?\([^)]+\)/g) || [];
      for (let i = 0; i < cores.length; i++) {
        const v = cores[i].replace(/^rgba?\(|\)$/g, '').split(',').map(parseFloat);
        if (v.length >= 3 && (v.length < 4 || v[3] > 0.5)) return [v[0], v[1], v[2]];
      }
    }
    return null;
  }

  function fundoEscuro(el) {
    let passos = 0;
    while (el && passos++ < 12) {
      const cor = corDeFundo(getComputedStyle(el));
      if (cor) return luminancia(cor[0], cor[1], cor[2]) < 0.45;
      el = el.parentElement;
    }
    return false;
  }

  let sobEscuro = null;
  let ultimoAlvo = null;

  function conferirFundo(x, y) {
    // Só recalcula quando o elemento sob o ponteiro muda: a conta envolve
    // getComputedStyle, e a cada mousemove seria desperdício puro.
    const alvo = document.elementFromPoint(x, y);
    if (alvo === ultimoAlvo) return;
    ultimoAlvo = alvo;

    const escuro = fundoEscuro(alvo);
    if (escuro === sobEscuro) return;
    sobEscuro = escuro;
    cursorDot.classList.toggle('em-fundo-escuro', escuro);
    cursorOutline.classList.toggle('em-fundo-escuro', escuro);
  }

  const clickables = document.querySelectorAll(
    'a, button, input, textarea, select, .class-item, .toggle-faq, .swatch, .icon-tile, .tag, [data-cursor="hover"]'
  );
  clickables.forEach((el) => {
    el.addEventListener('mouseenter', () => cursorOutline.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hovered'));
  });

  document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity = '0';
    cursorOutline.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursorDot.style.opacity = '1';
    cursorOutline.style.opacity = '1';
  });
})();
