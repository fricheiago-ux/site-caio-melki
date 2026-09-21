/*
  OS CINCO PILARES — porte em JS puro do componente GSAP Flip
  (21st.dev / Hyperiux Vault), originalmente React + Tailwind.

  O que mudou em relação ao original:
  - sem React: a ordem dos cards vive num array e o DOM é reposicionado
    por estilo inline, medido e animado pelo Flip (os nós nunca remontam);
  - o painel troca por completo a cada card (número, título e parágrafo),
    porque cada pilar tem texto próprio — no original era uma legenda só;
  - sem SplitText: a troca de texto usa o nosso desfoque→foco;
  - a pilha abre sozinha quando a seção entra na tela.
*/
(function () {
  const raiz = document.querySelector('.pilares');
  const palco = raiz && raiz.querySelector('.pilares__palco');
  if (!raiz || !palco || typeof gsap === 'undefined' || typeof Flip === 'undefined') return;

  gsap.registerPlugin(Flip);

  const cards = Array.from(palco.querySelectorAll('.pilar-card'));
  const painel = raiz.querySelector('.pilares__painel');
  const elN = raiz.querySelector('.pilares__n');
  const elT = raiz.querySelector('.pilares__h');
  const elD = raiz.querySelector('.pilares__p');
  const elD2 = raiz.querySelector('.pilares__p--2');
  const elContador = raiz.querySelector('.pilares__contador');
  const elSelo = raiz.querySelector('.pilares__selo');
  if (!cards.length) return;

  const dados = cards.map((c) => ({
    n: c.dataset.n || '',
    titulo: c.dataset.titulo || '',
    texto: c.dataset.texto || '',
    texto2: c.dataset.texto2 || ''
  }));

  // ---------- Medidas (mesmos números do componente original) ----------
  // O destaque saiu 20% menor que o do componente original (era 530x670),
  // mantendo a mesma proporção. O teto proporcional caiu junto, senão em
  // telas largas ele voltaria a crescer.
  const CFG = {
    thumbW: 108, thumbH: 120, gap: 12,
    heroW: 424, heroH: 536, heroMax: 0.37,
    rounded: 20,
    dur: 0.7, ease: 'power3.inOut',
    deslocX: 3, deslocY: 9, giro: 2,
    // Teto da coluna de texto. O vão entre a régua e o destaque chega a
    // 590px em tela cheia, e a 19px de corpo isso dá linhas de 60 e tantos
    // caracteres — texto que atravessa a tela e cansa. A ref trabalha em
    // torno de 22vw; 420px com corpo de 16px dá ~45 caracteres por linha.
    painelMax: 420
  };

  // A ordem é sempre 01→05: o card escolhido sai da fila para o destaque e
  // os outros fecham o buraco sem trocar de lugar entre si. Antes era uma
  // permuta (o escolhido trocava de posição com o antigo destaque), e a
  // régua embaralhava a numeração a cada clique.
  const cronologica = (heroIdx) =>
    [heroIdx].concat(cards.map((_, k) => k).filter((k) => k !== heroIdx));

  let ordem = cards.map((_, i) => i);
  let aberto = false;
  let animando = false;
  let larguraPalco = 0;

  const semMovimento = () =>
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ehMobile = () => larguraPalco > 0 && larguraPalco < 768;

  function medidas() {
    const estreito = larguraPalco < 900;
    const escala = estreito ? Math.min(1, larguraPalco / 900) : 1;
    const tW = CFG.thumbW * escala;
    const tH = CFG.thumbH * escala;
    const gap = CFG.gap * escala;
    const hW = Math.min(CFG.heroW * escala, larguraPalco * CFG.heroMax);
    const hH = CFG.heroH * (hW / CFG.heroW || 1);
    const railX = Math.max(24, larguraPalco * 0.045);
    const heroX = larguraPalco - hW - railX;
    const pilhaW = Math.min(215 * escala, larguraPalco * 0.42);
    return { escala, tW, tH, gap, hW, hH, railX, heroX, pilhaW, pilhaH: pilhaW * 1.5, estreito };
  }

  // Caixa de cada posição: 0 = destaque à direita, demais = régua à esquerda
  function caixa(slot, m) {
    if (slot === 0) {
      return { x: m.heroX, y: 0, w: m.hW, h: m.hH, r: CFG.rounded * m.escala, z: cards.length + 1 };
    }
    const naRegua = cards.length - 1;
    const alturaRegua = naRegua * m.tH + (naRegua - 1) * m.gap;
    const topo = -alturaRegua / 2 + (slot - 1) * (m.tH + m.gap);
    return {
      x: m.railX, y: topo + m.tH / 2, w: m.tW, h: m.tH,
      r: CFG.rounded * 0.6 * m.escala, z: cards.length - slot
    };
  }

  // O selo estava fixo no topo da seção (mesma altura do título), sem
  // nenhuma relação com o baralho — flutuava ali sozinho. Aqui ele passa
  // a colar no teto do palco (a área dos cards), subindo e descendo com
  // ele conforme o cabeçalho muda de altura, E centralizado na mesma
  // linha vertical da régua de miniaturas (m.railX — a mesma coordenada
  // que o contador e os próprios cards da régua já usam). Um `left` fixo
  // ficava sistematicamente mais à esquerda que a régua: railX cresce com
  // a largura da tela (é proporcional), o selo não. No mobile o palco
  // some (.pilares__mobile assume) e a régua de posição limpa o inline
  // style, devolvendo o controle para o CSS da media query.
  function posicionarSelo(m) {
    if (!elSelo) return;
    if (ehMobile()) { elSelo.style.top = ''; elSelo.style.left = ''; return; }
    const raizRect = raiz.getBoundingClientRect();
    const palcoRect = palco.getBoundingClientRect();
    if (!palcoRect.height) { elSelo.style.top = ''; elSelo.style.left = ''; return; }
    const topoDoPalco = palcoRect.top - raizRect.top;
    // 14px de folga: o selo termina um pouco antes do primeiro card, em
    // vez de encostar pixel a pixel nele.
    elSelo.style.top = Math.max(0, topoDoPalco - elSelo.offsetHeight - 14) + 'px';

    const esquerdaDoPalco = palcoRect.left - raizRect.left;
    const centroDaRegua = esquerdaDoPalco + m.railX + m.tW / 2;
    elSelo.style.left = Math.max(0, centroDaRegua - elSelo.offsetWidth / 2) + 'px';
  }

  function aplicar() {
    const m = medidas();
    posicionarSelo(m);
    if (ehMobile()) return;

    cards.forEach((card, i) => {
      const slot = ordem.indexOf(i);
      card.classList.toggle('is-hero', aberto && slot === 0);

      if (!aberto) {
        Object.assign(card.style, {
          left: (larguraPalco / 2 - m.pilhaW / 2) + 'px',
          top: '50%',
          width: m.pilhaW + 'px',
          height: m.pilhaH + 'px',
          borderRadius: (CFG.rounded * 0.75 * m.escala) + 'px',
          transform: `translateY(-50%) translate(${slot * CFG.deslocX}px, ${slot * CFG.deslocY}px) rotate(${slot * CFG.giro}deg)`,
          zIndex: String(cards.length - slot)
        });
        return;
      }

      const b = caixa(slot, m);
      Object.assign(card.style, {
        left: b.x + 'px',
        top: '50%',
        width: b.w + 'px',
        height: b.h + 'px',
        borderRadius: b.r + 'px',
        transform: `translateY(calc(-50% + ${b.y}px))`,
        zIndex: String(b.z)
      });
    });

    // O contador mora na cabeceira da régua, e não no canto do palco: ele
    // numera as cartas, então se alinha à coluna delas.
    if (elContador) {
      const naRegua = cards.length - 1;
      const alturaRegua = naRegua * m.tH + (naRegua - 1) * m.gap;
      const topoRegua = (palco.clientHeight - alturaRegua) / 2;
      elContador.style.left = m.railX + 'px';
      elContador.style.top = Math.max(0, topoRegua - 32) + 'px';
    }

    // O painel ocupa o vão entre a régua e o destaque, mas com teto de
    // largura: passado esse ponto a linha fica comprida demais para ler.
    // O que sobra do vão vira respiro dos dois lados, e o bloco recua da
    // régua em vez de encostar nela.
    if (painel) {
      const esquerda = m.railX + m.tW + Math.max(48, larguraPalco * 0.06);
      const folga = Math.max(40, larguraPalco * 0.04);
      const vao = Math.max(260, m.heroX - esquerda - folga);
      const largura = Math.min(vao, CFG.painelMax);
      painel.style.left = (esquerda + (vao - largura) / 2) + 'px';
      painel.style.width = largura + 'px';
      // Alinhado ao topo da carta em destaque, e não centralizado: assim o
      // título começa sempre na mesma altura, qualquer que seja o card.
      painel.style.top = Math.max(0, (palco.clientHeight - m.hH) / 2) + 'px';
      painel.style.transform = 'none';
      painel.style.display = m.estreito ? 'none' : '';
    }
  }

  function pintarPainel(i, animar) {
    const d = dados[i];
    if (!d) return;
    if (elN) elN.textContent = d.n;
    if (elT) elT.textContent = d.titulo;
    if (elD) elD.textContent = d.texto;
    if (elD2) { elD2.textContent = d.texto2; elD2.hidden = !d.texto2; }
    if (elContador) elContador.querySelector('b').textContent = d.n;

    if (animar && painel && !semMovimento()) {
      painel.classList.remove('pilares__troca');
      void painel.offsetWidth; // reinicia a animação
      painel.classList.add('pilares__troca');
    }
  }

  // ---------- Transições ----------
  function comFlip(mudar, opcoes, aoFim) {
    if (semMovimento() || ehMobile()) { mudar(); aplicar(); if (aoFim) aoFim(); return; }
    const estado = Flip.getState(cards, { props: 'borderRadius' });
    mudar();
    aplicar();
    animando = true;
    Flip.from(estado, Object.assign({
      duration: CFG.dur,
      ease: CFG.ease,
      absolute: true,
      props: 'borderRadius'
    }, opcoes || {}, {
      onComplete: () => { animando = false; if (aoFim) aoFim(); }
    }));
  }

  function abrir() {
    if (aberto || animando || larguraPalco === 0) return;
    // is-pronto só entra no fim do voo. Enquanto o baralho se abre, as
    // cartas cruzam justamente o vão onde o texto mora — com o painel já
    // aceso, o parágrafo aparecia escrito por cima das fotos.
    const acender = () => raiz.classList.add('is-pronto');
    comFlip(
      () => { aberto = true; raiz.classList.add('is-open'); },
      { stagger: 0.04 },
      acender
    );
    // Rede de segurança: se o onComplete não vier (aba em segundo plano,
    // tween interrompido), o texto não pode ficar invisível para sempre.
    setTimeout(() => { if (aberto) acender(); }, (CFG.dur + 0.04 * cards.length) * 1000 + 400);
    pintarPainel(ordem[0], false);
  }

  // Volta ao baralho fechado. Só é chamada quando a seção está inteira
  // fora da tela, então ninguém vê o rearme acontecer.
  function fechar() {
    if (!aberto || animando) return;
    aberto = false;
    // O painel e os números das miniaturas têm transição de opacidade de
    // 0,45s (CSS). Os cards, aqui, saem do destaque na hora — aplicar()
    // sem Flip, de propósito, porque ninguém deveria ver o rearme. Só que
    // isso descasa os dois: por 0,45s o texto do card em destaque ficava
    // desbotando por cima da pilha já fechada, visível para quem rolasse
    // de volta antes do fade terminar. A classe abaixo zera a transição
    // por um frame só para este corte, e a devolve logo em seguida — o
    // fade normal ao abrir não é afetado.
    raiz.classList.add('pilares--sem-transicao');
    raiz.classList.remove('is-open', 'is-pronto');
    ordem = cards.map((_, i) => i);
    aplicar();
    pintarPainel(ordem[0], false);
    requestAnimationFrame(() => raiz.classList.remove('pilares--sem-transicao'));
  }

  function escolher(i) {
    if (!aberto) { abrir(); return; }
    if (i === ordem[0] || animando) return;
    comFlip(() => { ordem = cronologica(i); });
    pintarPainel(i, true);
  }

  // ---------- Ligações ----------
  cards.forEach((card, i) => {
    card.addEventListener('click', () => escolher(i));
  });

  // Observa largura E altura: o topo do painel depende da altura do palco,
  // e enquanto só a largura era vigiada o painel do primeiro card ficava
  // preso na medida de antes da seção assentar.
  let alturaPalco = 0;
  const ro = new ResizeObserver(() => {
    const novaL = palco.clientWidth;
    const novaA = palco.clientHeight;
    if (novaL === larguraPalco && novaA === alturaPalco) return;
    larguraPalco = novaL;
    alturaPalco = novaA;
    aplicar();
  });
  ro.observe(palco);

  larguraPalco = palco.clientWidth;
  alturaPalco = palco.clientHeight;
  aplicar();
  pintarPainel(ordem[0], false);

  /* ---------- Gatilho da abertura ----------
     O baralho tem que estar fechado quando a pessoa chega, ficar assim
     por um instante e só então abrir. Antes havia uma rede de segurança
     cega de 9 segundos: como a hero e a seção anterior levam bem mais que
     isso para serem lidas, o baralho abria fora da tela e a pessoa
     chegava com tudo já desembaralhado.

     Agora o observer é a única porta de entrada, ele não se desliga, e a
     saída completa da tela rearma a pilha para a próxima passagem. */
  let agendado = null;

  const io = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (e.isIntersecting && e.intersectionRatio >= 0.35) {
        if (aberto || agendado) return;
        // a pilha fica visível um instante antes de se abrir
        agendado = setTimeout(() => { agendado = null; abrir(); }, 650);
      } else if (e.intersectionRatio === 0) {
        if (agendado) { clearTimeout(agendado); agendado = null; }
        fechar();
      }
    });
  }, { threshold: [0, 0.35] });
  io.observe(raiz);

  // Rede de segurança, agora com condição: se o observer falhar, abre —
  // mas só enquanto a seção estiver de fato na tela. É essa checagem que
  // faltava antes e que fazia o baralho abrir longe dos olhos de quem lê.
  setInterval(() => {
    if (aberto || agendado || ehMobile()) return;
    const c = raiz.getBoundingClientRect();
    const alturaJanela = window.innerHeight || document.documentElement.clientHeight;
    const visivel = Math.min(c.bottom, alturaJanela) - Math.max(c.top, 0);
    if (c.height > 0 && visivel / c.height >= 0.35) abrir();
  }, 1200);

  // Teclado
  raiz.addEventListener('keydown', (e) => {
    if (!aberto || cards.length < 2) return;
    const n = cards.length;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); escolher((ordem[0] + 1) % n); }
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); escolher((ordem[0] - 1 + n) % n); }
  });
})();
