/*
  Abertura do site, em três tempos:

  1. o loader, com os ícones de saúde se revezando e a linha de progresso;
  2. as portas, com "dr. Caio Melki mfc". Loader e portas dividem o mesmo
     fundo, então a troca entre 1 e 2 é só um desfoque — não parece que o
     site carregou duas páginas;
  3. um segundo e meio depois elas se afastam sozinhas e, ao terminarem, o
     site avisa quem estava esperando (a digitação da hero, por exemplo).

  Nada de clicar nem de rolar para abrir. A primeira versão puxava a
  abertura pelo scroll, o que exigia um trilho de uma tela e meia com a
  hero presa no topo e produzia uma rolagem longa e em falso logo na
  primeira seção. A segunda pedia um clique, o que resolvia o scroll mas
  punha uma porteira entre a pessoa e o site. Agora é só tempo: a página
  fica travada enquanto as portas cobrem a tela e volta ao normal quando
  elas somem.

  Quem precisa esperar a abertura ouve o evento 'portas:abertas' no window,
  ou consulta window.portasAbertas. Quem pode começar com as portas ainda
  se mexendo (a digitação da hero) ouve 'portas:meio' / window.portasMeio,
  disparado na metade do movimento — sempre antes de 'portas:abertas'.

  Para desligar as portas: <div class="abertura" data-portas="off">
*/
(function () {
  const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- 1. Loader ---------------- */
  const loader = document.querySelector('.loader:not(.loader--mini)');
  const portas = document.querySelector('.hero-portas');
  let giroPrincipal = null;

  function girarIcones(escopo) {
    const icones = escopo.querySelectorAll('.loader__icones > *');
    if (icones.length < 2) return null;
    let i = 0;
    icones[0].classList.add('is-active');
    return setInterval(() => {
      icones[i].classList.remove('is-active');
      i = (i + 1) % icones.length;
      icones[i].classList.add('is-active');
    }, 420);
  }

  document.querySelectorAll('.loader--mini').forEach(girarIcones);

  function encerrarLoader() {
    if (!loader || loader.classList.contains('is-closing')) return;
    if (giroPrincipal) { clearInterval(giroPrincipal); giroPrincipal = null; }

    // Os nomes surgem enquanto o loader ainda está desfocando: as duas
    // telas se sobrepõem no mesmo fundo e viram uma só.
    if (portas) portas.classList.add('is-revelado');
    loader.classList.add('is-closing');

    setTimeout(() => {
      loader.classList.add('is-done');
      document.body.classList.remove('is-loading');
      document.body.classList.add('is-ready');
    }, 260);
  }

  if (loader) {
    document.body.classList.add('is-loading');
    giroPrincipal = girarIcones(loader);
    requestAnimationFrame(() => loader.classList.add('is-loading'));

    if (reduzido) {
      encerrarLoader();
    } else {
      const minimo = new Promise((r) => setTimeout(r, 1500));
      const carregou = document.readyState === 'complete'
        ? Promise.resolve()
        : new Promise((r) => window.addEventListener('load', r, { once: true }));
      Promise.all([minimo, carregou]).then(encerrarLoader);
      setTimeout(encerrarLoader, 6000);   // rede de segurança
    }
  } else if (portas) {
    portas.classList.add('is-revelado');
  }

  /* ---------------- 2 e 3. Portas ---------------- */
  const abertura = document.querySelector('.abertura');

  function anunciar() {
    window.portasAbertas = true;
    window.dispatchEvent(new Event('portas:abertas'));
  }

  if (!abertura || !portas) { anunciar(); return; }

  const DURACAO = 1050;   // igual à transição das portas no CSS
  const ESPERA = 1500;    // quanto tempo "dr. Caio Melki mfc" fica na tela
  let estado = 'fechada'; // fechada -> abrindo -> aberta

  // Enquanto as portas cobrem a tela, o fundo animado da hero, o canvas de
  // partículas e a navbar ficam suspensos: nada disso está visível, e o
  // quadro inteiro fica para o movimento das portas.
  document.body.classList.add('portas-fechadas');
  window.fundoSuspenso = true;

  let agendada = null;

  // Metade do caminho: a curva das portas é simétrica, então na metade do
  // tempo cada folha já descobriu metade da sua metade da tela. A digitação
  // da hero larga daqui, com as portas ainda saindo, em vez de esperar o fim.
  function anunciarMeio() {
    if (window.portasMeio) return;
    window.portasMeio = true;
    window.dispatchEvent(new Event('portas:meio'));
  }

  function concluir() {
    if (estado === 'aberta') return;
    estado = 'aberta';
    anunciarMeio();
    portas.setAttribute('data-aberto', '1');
    portas.removeAttribute('tabindex');
    portas.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('portas-fechadas');
    window.fundoSuspenso = false;
    anunciar();
  }

  function abrir() {
    if (estado !== 'fechada') return;
    estado = 'abrindo';
    if (agendada) { clearTimeout(agendada); agendada = null; }
    portas.classList.add('is-abrindo');
    // O transitionend não é confiável quando a aba está em segundo plano,
    // então quem manda é o relógio; a transição só precisa caber nele.
    setTimeout(anunciarMeio, DURACAO / 2);
    setTimeout(concluir, DURACAO);
  }

  window.abrirPortas = abrir;

  if (reduzido || abertura.dataset.portas === 'off') {
    document.body.classList.remove('portas-fechadas');
    window.fundoSuspenso = false;
    estado = 'abrindo';
    concluir();
    return;
  }

  // A contagem começa quando os nomes aparecem, e não no carregamento da
  // página: senão, num carregamento lento, as portas abririam antes de
  // alguém ter chance de ler "dr. Caio Melki mfc".
  function agendarAbertura() {
    if (agendada || estado !== 'fechada') return;
    agendada = setTimeout(abrir, ESPERA);
  }

  if (portas.classList.contains('is-revelado')) {
    agendarAbertura();
  } else {
    const olho = new MutationObserver(() => {
      if (portas.classList.contains('is-revelado')) { olho.disconnect(); agendarAbertura(); }
    });
    olho.observe(portas, { attributes: true, attributeFilter: ['class'] });
    // Rede de segurança: se o loader travar, o site não fica trancado
    setTimeout(() => { olho.disconnect(); agendarAbertura(); }, 8000);
  }
})();
