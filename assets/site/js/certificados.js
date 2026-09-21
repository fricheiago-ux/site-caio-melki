/*
  CERTIFICADOS — encolhe a folha para a largura do card.

  A peça é desenhada em tamanho real (1123x794, o mesmo do canvas de
  design) e reduzida por transform. O fator não dá para sair só de CSS:
  scale() exige um número puro, e calc(100cqw / 1123) devolve um
  comprimento — a regra era descartada sem aviso. Então o fator vem
  daqui, e o ResizeObserver reaplica a cada mudança de largura.
*/
(function () {
  const palcos = Array.from(document.querySelectorAll('.cert-palco'));
  if (!palcos.length) return;

  const LARGURA_REAL = 1123;

  function ajustar(palco) {
    const folha = palco.querySelector('.cert-folha');
    if (!folha || !palco.clientWidth) return;
    folha.style.transform = 'scale(' + palco.clientWidth / LARGURA_REAL + ')';
  }

  palcos.forEach(ajustar);

  if ('ResizeObserver' in window) {
    const observador = new ResizeObserver((entradas) => entradas.forEach((e) => ajustar(e.target)));
    palcos.forEach((p) => observador.observe(p));
  } else {
    window.addEventListener('resize', () => palcos.forEach(ajustar), { passive: true });
  }
})();
