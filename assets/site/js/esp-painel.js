/*
  Painel escuro da seção "A especialidade".

  Duas coisas acontecem quando ele entra na tela:

  1. o número sobe de zero até 90, e só então o símbolo de porcentagem
     entra. A contagem é o efeito; o fato é a faixa de 80 a 90%, que está
     escrita logo abaixo. Um contador que para num número redondo dá a
     impressão de precisão que o dado não tem, e por isso o texto manda;

  2. a linha de sintomas passa a girar. As palavras não são digitadas
     aqui: são lidas da nuvem da seção seguinte, pelos data-sintoma. Assim
     as duas seções nunca divergem quando alguém mexer na nuvem.

  O card inteiro é um link para a nuvem, então não há nada a ligar de
  clique — o navegador já faz, e a rolagem suave vem do interactions.js.
*/
(function () {
  const painel = document.querySelector('[data-painel-vivo]');
  if (!painel) return;

  const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const elNumero = painel.querySelector('[data-contador]');
  const elGiro = painel.querySelector('[data-giro]');

  /* ---------------- Contador ---------------- */
  function contar(el, ate, duracao) {
    if (!el) return;
    if (reduzido) { el.textContent = ate; painel.classList.add('is-contado'); return; }

    const inicio = performance.now();
    // desaceleração no fim: os últimos números pesam mais que os primeiros
    const suave = (t) => 1 - Math.pow(1 - t, 3);
    let fechou = false;

    function fechar() {
      if (fechou) return;
      fechou = true;
      el.textContent = ate;
      painel.classList.add('is-contado');
    }

    (function quadro(agora) {
      if (fechou) return;
      const t = Math.min((agora - inicio) / duracao, 1);
      el.textContent = Math.round(suave(t) * ate);
      if (t < 1) { requestAnimationFrame(quadro); return; }
      fechar();
    })(inicio);

    // requestAnimationFrame congela em aba de segundo plano. Sem isto, quem
    // abre o site e troca de aba no meio volta e encontra um número parado
    // pela metade — e o card passa a mentir sobre a estatística.
    setTimeout(fechar, duracao + 600);
  }

  /* ---------------- Sintomas da nuvem ---------------- */
  function palavrasDaNuvem() {
    const nos = document.querySelectorAll('[data-sintoma]');
    const lista = [];
    nos.forEach((n) => {
      const t = (n.textContent || '').trim();
      if (t) lista.push(t.toLowerCase());
    });
    return lista;
  }

  let giroRelogio = null;

  function girar() {
    if (!elGiro || reduzido) return;

    const todas = palavrasDaNuvem();
    if (todas.length < 2) return;

    // embaralha uma vez, para a ordem não ser a mesma da nuvem ao lado
    for (let i = todas.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = todas[i]; todas[i] = todas[j]; todas[j] = tmp;
    }

    let i = 0;
    elGiro.textContent = todas[0];

    giroRelogio = setInterval(() => {
      i = (i + 1) % todas.length;
      elGiro.classList.remove('is-trocando');
      void elGiro.offsetWidth;            // reinicia a animação de entrada
      elGiro.textContent = todas[i];
      elGiro.classList.add('is-trocando');
    }, 2200);
  }

  /* ---------------- Dispara quando aparece ---------------- */
  let comecou = false;
  function comecar() {
    if (comecou) return;
    comecou = true;
    contar(elNumero, parseInt(painel.querySelector('[data-contador]').dataset.ate || '90', 10), 1600);
    girar();
  }

  const io = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      comecar();
    });
  }, { threshold: 0.4 });
  io.observe(painel);

  // Rede de segurança: o número não pode ficar parado em zero se o
  // observer falhar, porque aí o card mente sobre a estatística.
  setTimeout(() => {
    const c = painel.getBoundingClientRect();
    const janela = window.innerHeight || document.documentElement.clientHeight;
    if (!comecou && c.top < janela && c.bottom > 0) comecar();
  }, 4000);

  window.addEventListener('pagehide', () => { if (giroRelogio) clearInterval(giroRelogio); });
})();
