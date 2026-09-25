/*
  Revelação de texto da hero — dois efeitos diferentes, um por bloco.

  A manchete (h1.type-reveal) digita: quebra em palavras e revela uma por
  vez em corte seco, no ritmo irregular de alguém batendo teclado, com um
  cursor em bloco acompanhando a última palavra. Letra a letra não serve
  aqui porque há imagens no meio da frase — refluiria a linha a cada
  caractere e as fotos pulariam de lugar.

  A subhead (div.blur-reveal) não digita: as palavras entram em bloco,
  desfocadas, e vão para o foco com um leve deslocamento — o efeito
  "animationIn" da ref-7, por palavra. Ela é apoio da manchete, não fala
  por si, e digitá-la também competiria com o cursor da linha de cima.

  Duas etapas separadas, e a ordem importa:
  1) todos os blocos são quebrados e escondidos de uma vez, no primeiro
     quadro. Se a quebra esperasse a vez de cada bloco, o texto ainda não
     quebrado apareceria inteiro e piscaria ao ser escondido depois;
  2) só então a revelação corre, encadeada na ordem do documento — o
     bloco seguinte começa quando o anterior termina. Antes isso dependia
     de um data-type-start contado à mão, que desencaixava a cada mudança
     de texto.

  Os dois esperam a porta de abertura. Enquanto ela cobre a tela, a hero
  está escondida atrás dela: se o efeito rodasse ali, aconteceria todo
  fora do campo de visão e a pessoa chegaria com o texto já pronto. Sem
  porta na página, começa na hora.

  Uso:
  <h1 class="type-reveal"> … </h1>          — digitação, com cursor
  <p  class="blur-reveal"> … </p>           — desfoque → foco, por palavra
  data-type-start="6"    atraso extra, em passos, antes de começar
  data-type-ritmo="0.7"  acelera (menor que 1) ou desacelera a digitação
  data-blur-passo="42"   ms de intervalo entre palavras no desfoque
  data-cursor="off"      dispensa o cursor num bloco de digitação
*/
(function () {
  /* ---------- Ritmo da digitação ----------
     Cadência regular soa a máquina, não a gente. O que faz parecer
     alguém digitando não é só ser mais lento: é ser irregular e parar
     na pontuação. Então cada palavra ganha seu próprio intervalo:
     um piso, mais um tanto por caractere (palavra longa leva mais
     tempo para ser batida), mais um empurrão aleatório, mais uma pausa
     quando a palavra fecha em vírgula, ponto ou dois-pontos. */
  const RITMO = {
    piso: 62,        // ms mínimos entre duas palavras
    porLetra: 9,     // ms por caractere da palavra que acabou de entrar
    tremor: 0.3,     // variação aleatória, para cima e para baixo
    imagem: 130,     // uma imagem no meio da frase pede um respiro
    virgula: 140,    // pausa depois de vírgula, ponto-e-vírgula ou dois-pontos
    ponto: 300       // pausa depois de ponto, interrogação ou exclamação
  };
  const PASSO = RITMO.piso;   // usado só pelo atraso inicial de cada bloco
  const BLUR_PASSO = 42;      // ms entre palavras no efeito de desfoque

  function intervalo(ficha, fator) {
    if (ficha.tagName === 'IMG') return Math.round((RITMO.imagem + RITMO.piso) * fator);

    const txt = ficha.textContent || '';
    let ms = RITMO.piso + txt.length * RITMO.porLetra;

    const fim = txt.slice(-1);
    if (/[.!?…]/.test(fim)) ms += RITMO.ponto;
    else if (/[,;:]/.test(fim)) ms += RITMO.virgula;

    // tremor: nunca dois intervalos exatamente iguais
    ms *= 1 + (Math.random() * 2 - 1) * RITMO.tremor;
    return Math.round(ms * fator);
  }

  const alvos = Array.from(document.querySelectorAll('.type-reveal, .blur-reveal'));
  if (!alvos.length) return;

  const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Etapa 1: quebrar em palavras ----------
     Serve aos dois efeitos: cada um decide depois o que fazer com as
     fichas — revelar uma por vez, ou soltar todas com atraso escalonado. */
  function quebrar(el, fichas) {
    Array.from(el.childNodes).forEach((no) => {
      if (no.nodeType === Node.TEXT_NODE) {
        const partes = no.textContent.split(/(\s+)/);
        const frag = document.createDocumentFragment();

        partes.forEach((parte) => {
          if (!parte) return;
          // devolve o espaço como ele veio: trocar por ' ' apagaria um
          // espaço inquebrável e a quebra de linha voltaria a cair errado
          if (/^\s+$/.test(parte)) { frag.appendChild(document.createTextNode(parte)); return; }
          const span = document.createElement('span');
          span.className = 'tw';
          span.textContent = parte;
          frag.appendChild(span);
          fichas.push(span);
        });

        el.replaceChild(frag, no);
        return;
      }

      if (no.nodeType !== Node.ELEMENT_NODE) return;

      if (no.tagName === 'IMG') {
        no.classList.add('tw');
        fichas.push(no);
      } else if (no.tagName !== 'BR') {
        quebrar(no, fichas);
      }
    });
    return fichas;
  }

  const blocos = alvos.map((el) => ({
    el,
    fichas: quebrar(el, []),
    ehBlur: el.classList.contains('blur-reveal')
  })).filter((b) => b.fichas.length);

  // O desfoque escalona por CSS: o atraso de cada palavra é gravado agora,
  // no fio, e só passa a valer quando a classe is-on ligar a animação —
  // escrever isso cedo não antecipa nada, animation-delay parado não roda.
  blocos.filter((b) => b.ehBlur).forEach((b) => {
    const passo = parseInt(b.el.dataset.blurPasso || '0', 10) || BLUR_PASSO;
    b.fichas.forEach((f, i) => { f.style.animationDelay = (i * passo) + 'ms'; });
  });

  if (reduzido) {
    blocos.forEach((b) => b.fichas.forEach((f) => f.classList.add('is-on')));
    return;
  }

  /* ---------- Etapa 2a: digitação (type-reveal) ---------- */
  function prepararCursor(el) {
    if (el.dataset.cursor === 'off') return null;
    const cur = document.createElement('span');
    cur.className = 'tw-cursor';
    cur.setAttribute('aria-hidden', 'true');
    el.appendChild(cur);
    return cur;
  }

  // O cursor é absoluto dentro do bloco, então movê-lo não desloca nada
  function moverCursor(cur, ficha, altura, largura) {
    if (!cur) return;
    const topo = ficha.tagName === 'IMG'
      ? ficha.offsetTop + ficha.offsetHeight - altura
      : ficha.offsetTop + (ficha.offsetHeight - altura) / 2;
    cur.style.height = altura + 'px';
    cur.style.width = largura + 'px';
    cur.style.left = (ficha.offsetLeft + ficha.offsetWidth + 3) + 'px';
    cur.style.top = Math.max(0, topo) + 'px';
  }

  function rodarDigitacao(bloco, avancar) {
    const { el, fichas } = bloco;
    const cursor = prepararCursor(el);
    const corpo = parseFloat(getComputedStyle(el).fontSize) || 28;
    const alturaCursor = Math.round(corpo * 0.92);
    const larguraCursor = Math.round(corpo * 0.5);
    const inicio = parseInt(el.dataset.typeStart || '0', 10) * PASSO;
    // data-type-ritmo encurta ou alonga o bloco inteiro.
    const fator = parseFloat(el.dataset.typeRitmo || '1') || 1;

    let i = 0;
    let relogio = null;

    function encerrar() {
      if (relogio) { clearTimeout(relogio); relogio = null; }
      fichas.forEach((f) => f.classList.add('is-on'));
      if (cursor) cursor.classList.remove('is-on');
      avancar();
    }

    function passo() {
      const ficha = fichas[i];
      if (!ficha) { encerrar(); return; }

      ficha.classList.add('is-on');
      moverCursor(cursor, ficha, alturaCursor, larguraCursor);
      i += 1;

      if (i >= fichas.length) {
        relogio = null;
        // o cursor pisca um instante no fim, como quem parou de escrever
        setTimeout(() => { if (cursor) cursor.classList.remove('is-on'); }, 640);
        avancar();
        return;
      }

      // Cada palavra agenda a próxima com o tempo dela. Um setInterval
      // único não daria conta: o intervalo muda a cada passo.
      relogio = setTimeout(passo, intervalo(ficha, fator));
    }

    relogio = setTimeout(() => {
      if (cursor) cursor.classList.add('is-on');
      passo();
    }, inicio);

    // Rede de segurança: o texto nunca pode ficar invisível. Teto generoso:
    // com pontuação e tremor, o pior caso de uma palavra fica bem acima do
    // piso, então a rede não pode usar o piso na conta.
    return inicio + fichas.length * 380 + 6000;
  }

  /* ---------- Etapa 2b: desfoque → foco (blur-reveal) ---------- */
  function rodarDesfoque(bloco, avancar) {
    const { el, fichas } = bloco;
    const passo = parseInt(el.dataset.blurPasso || '0', 10) || BLUR_PASSO;
    // Uma única classe liga todas as palavras de uma vez; o atraso já
    // gravado em cada uma escalona a entrada sem depender de temporizador.
    el.classList.add('is-on');

    const duracaoAnimacao = 620; // combina com a animação bwIn do CSS
    const total = fichas.length * passo + duracaoAnimacao;
    setTimeout(avancar, total);
    return total + 6000; // teto da rede de segurança, se o navegador atrasar
  }

  function correr() {
    let n = 0;
    (function proximo() {
      const bloco = blocos[n++];
      if (!bloco) return;

      let seguiu = false;
      // A corrente avança uma única vez, venha o aviso do fim natural ou
      // da rede de segurança. Sem isso, um bloco travado paralisaria os
      // seguintes e metade do texto ficaria invisível para sempre.
      function avancar() {
        if (seguiu) return;
        seguiu = true;
        proximo();
      }

      const teto = bloco.ehBlur ? rodarDesfoque(bloco, avancar) : rodarDigitacao(bloco, avancar);
      setTimeout(() => {
        if (seguiu) return;
        bloco.fichas.forEach((f) => f.classList.add('is-on'));
        bloco.el.classList.add('is-on');
        avancar();
      }, teto);
    })();
  }

  /* ---------- Espera a abertura ----------
     Não espera as portas saírem de vez — só o meio do caminho
     ('portas:metade', disparado por intro.js na metade da transição). Cada
     porta cobre metade da tela e a frase fica do lado direito, então bem
     antes delas terminarem de sair aquele lado já está aberto o bastante
     para a digitação começar por cima. Esperar o fim inteiro (mais o
     respiro de antes) atrasava o começo em quase 1,2s sem necessidade. */
  const portas = document.querySelector('.hero-portas');
  const abertura = document.querySelector('.abertura');
  const temPortas = portas && abertura &&
    abertura.dataset.portas !== 'off' &&
    portas.getAttribute('data-aberto') !== '1' &&
    !window.portasMetade;

  if (!temPortas) { correr(); return; }

  let comecou = false;
  function largar() {
    if (comecou) return;
    comecou = true;
    window.removeEventListener('portas:metade', largar);
    // um respiro curto, só pra digitação não nascer no exato instante do clique
    setTimeout(correr, 90);
  }

  window.addEventListener('portas:metade', largar);
  // Rede de segurança: se o aviso não vier, o texto não fica preso
  setTimeout(largar, 40000);
})();
