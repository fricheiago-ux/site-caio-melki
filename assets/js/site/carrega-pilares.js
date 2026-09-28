/*
  Carrega sob demanda o que só a seção "Os pilares" usa:
    - GSAP + Flip (o baralho, pilares.js)
    - three.js (a nuvem de partículas do fundo, pilares-particulas.js)
  Juntos são ~700 KB (~180 KB comprimidos) que antes bloqueavam a primeira
  tela de todo visitante, inclusive os que nunca chegariam nos pilares. Agora
  só saem da rede quando a seção está a ~2 telas de aparecer (ou, no pior
  caso, 12s depois do carregamento, para não depender da rolagem).

  Os dois scripts da seção já checam `typeof gsap` / `typeof THREE` e iniciam
  na hora que rodam, então basta entregá-los depois das bibliotecas.

  Versão do cache: herdada do "?v=" desta própria tag <script> no index.html,
  para o `sed` de "subir a versão" continuar valendo sem tocar aqui.
*/
(function () {
  var alvo = document.getElementById('pilares');
  if (!alvo) return;

  var atual = document.currentScript;
  var v = (atual && atual.src.match(/[?&]v=([^&]+)/) || [])[1];
  var sufixo = v ? '?v=' + v : '';
  var base = atual ? atual.src.replace(/[^/]*$/, '') : 'assets/js/site/';

  // Cópias servidas pelo próprio site (assets/js/vendor/), não por CDN: no
  // celular cada servidor externo custava uma conexão nova (~0,5s em 4G).
  var vendor = base.replace(/site\/$/, 'vendor/');
  var GSAP = vendor + 'gsap.min.js' + sufixo;     // GSAP 3.13.0
  var FLIP = vendor + 'Flip.min.js' + sufixo;
  var THREE = vendor + 'three.min.js' + sufixo;   // three.js r134

  function carregar(src) {
    return new Promise(function (ok) {
      var s = document.createElement('script');
      s.src = src;
      s.async = false;          // mantém a ordem entre os que se dependem
      s.onload = ok;
      // Falha de rede: segue sem a biblioteca. Os scripts da seção
      // conferem se ela existe e simplesmente não ligam o efeito.
      s.onerror = ok;
      document.body.appendChild(s);
    });
  }

  var iniciou = false;
  function iniciar() {
    if (iniciou) return;
    iniciou = true;
    if (io) io.disconnect();

    var gsapEFlip = carregar(GSAP).then(function () { return carregar(FLIP); });
    var three = carregar(THREE);

    Promise.all([gsapEFlip, three])
      .then(function () { return carregar(base + 'pilares.js' + sufixo); })
      .then(function () { return carregar(base + 'pilares-particulas.js' + sufixo); });
  }

  var io = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(function (entradas) {
      if (entradas.some(function (e) { return e.isIntersecting; })) iniciar();
    }, { rootMargin: '2200px 0px' });
    io.observe(alvo);
  } else {
    iniciar();
  }

  // Rede de segurança: mesmo sem rolar, tudo pronto pouco depois do carregamento
  function agendarReserva() { setTimeout(iniciar, 12000); }
  if (document.readyState === 'complete') agendarReserva();
  else window.addEventListener('load', agendarReserva, { once: true });
})();
