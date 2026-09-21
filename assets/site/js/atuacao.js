/*
  TRAJETÓRIA PROFISSIONAL — porte em JS puro do "Feature Carousel"
  (21st.dev), originalmente React + motion/react + Tailwind.

  O que mudou em relação ao original:
  - sem React: o passo vive numa variável e cada pílula/card recebe
    transform e opacidade por estilo inline, animados por CSS;
  - sem motion: as molas viraram transições com --ease-out-expo, e a
    emenda da roda (a pílula que salta de uma ponta à outra) é feita
    sem transição, para não atravessar a lista inteira à vista;
  - o passo é mais lento que o do original (3s → 4.2s), no ritmo do site;
  - o giro pausa no hover, com a aba em segundo plano e quando a seção
    sai da tela; setas ↑ ↓ e Home/End navegam pelo teclado.
*/
(function () {
  const raiz = document.querySelector('[data-atuacao]');
  if (!raiz) return;

  const itens = Array.from(raiz.querySelectorAll('.atuacao__item'));
  const cards = Array.from(raiz.querySelectorAll('.atuacao__card'));
  if (!itens.length || itens.length !== cards.length) return;

  const TOTAL = itens.length;
  const ALTURA = 64;          // altura de cada pílula na roda
  const INTERVALO = 4200;     // ms entre trocas automáticas
  const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let passo = 0;
  let relogio = null;
  let pausadoPorHover = false;
  let pausadoPorFoco = false;
  let naTela = true;
  let distancias = new Array(TOTAL).fill(null);

  // Mesma função do original: joga v para dentro da faixa [min, max).
  const dobrar = (min, max, v) => {
    const faixa = max - min;
    return ((((v - min) % faixa) + faixa) % faixa) + min;
  };

  const atual = () => ((passo % TOTAL) + TOTAL) % TOTAL;

  function posicionarPilula(el, indice, d, animar) {
    if (!animar) el.style.transition = 'none';
    el.style.transform = 'translateY(' + d * ALTURA + 'px)';
    el.style.opacity = String(Math.max(0, 1 - Math.abs(d) * 0.28));
    if (!animar) {
      void el.offsetHeight; // força o reflow antes de devolver a transição
      el.style.transition = '';
    }
  }

  function pintar(animar) {
    const i = atual();

    itens.forEach((item, indice) => {
      const d = dobrar(-TOTAL / 2, TOTAL / 2, indice - i);
      const anterior = distancias[indice];
      // Salto de ponta a ponta: reposiciona sem transição, longe da vista.
      const emenda = anterior !== null && Math.abs(d - anterior) > TOTAL / 2;
      posicionarPilula(item, indice, d, animar && !semMovimento && !emenda);
      distancias[indice] = d;

      const ativo = indice === i;
      item.classList.toggle('is-ativo', ativo);
      const chip = item.querySelector('.atuacao__chip');
      if (chip) {
        chip.setAttribute('aria-current', ativo ? 'true' : 'false');
        chip.tabIndex = ativo ? 0 : -1;
      }
    });

    cards.forEach((card, indice) => {
      let d = indice - i;
      if (d > TOTAL / 2) d -= TOTAL;
      if (d < -TOTAL / 2) d += TOTAL;

      const estado = d === 0 ? 'ativo' : d === -1 ? 'antes' : d === 1 ? 'depois' : 'oculto';
      card.dataset.estado = estado;
      card.setAttribute('aria-hidden', estado === 'ativo' ? 'false' : 'true');
    });
  }

  function irPara(indice) {
    const avanco = (indice - atual() + TOTAL) % TOTAL;
    if (avanco > 0) passo += avanco;
    pintar(true);
  }

  function seguinte() {
    passo += 1;
    pintar(true);
  }

  function tocar() {
    parar();
    if (semMovimento || pausadoPorHover || pausadoPorFoco || !naTela || document.hidden) return;
    relogio = setInterval(seguinte, INTERVALO);
  }
  function parar() {
    if (relogio) clearInterval(relogio);
    relogio = null;
  }

  itens.forEach((item, indice) => {
    const chip = item.querySelector('.atuacao__chip');
    if (!chip) return;
    chip.addEventListener('click', () => { irPara(indice); tocar(); });
  });

  raiz.addEventListener('mouseenter', () => { pausadoPorHover = true; parar(); });
  raiz.addEventListener('mouseleave', () => { pausadoPorHover = false; tocar(); });
  raiz.addEventListener('focusin', () => { pausadoPorFoco = true; parar(); });
  raiz.addEventListener('focusout', () => { pausadoPorFoco = false; tocar(); });

  raiz.addEventListener('keydown', (e) => {
    const teclas = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End'];
    if (!teclas.includes(e.key)) return;
    e.preventDefault();
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') passo += 1;
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') passo -= 1;
    else if (e.key === 'Home') passo -= atual();
    else passo += TOTAL - 1 - atual();
    pintar(true);
    const foco = itens[atual()].querySelector('.atuacao__chip');
    if (foco) foco.focus();
  });

  document.addEventListener('visibilitychange', () => { document.hidden ? parar() : tocar(); });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => { naTela = entrada.isIntersecting; naTela ? tocar() : parar(); });
    }, { threshold: 0 }).observe(raiz);
  }

  pintar(false);
  tocar();
})();
