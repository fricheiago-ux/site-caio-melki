/*
  FAQ — acordeão exclusivo (abrir uma pergunta fecha a anterior).

  Mesmo padrão de altura medida + transitionend + temporizador de segurança
  já usado em sintomas.js: sem o temporizador, se o evento de transição não
  disparar por qualquer motivo, a resposta fica travada na altura medida
  naquele instante e não acompanha o conteúdo real depois.
*/
(function () {
  const itens = Array.from(document.querySelectorAll('.faq-item'));
  if (!itens.length) return;

  const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function medir(painel) {
    const alturaAnterior = painel.style.height;
    painel.style.height = 'auto';
    const altura = painel.scrollHeight;
    painel.style.height = alturaAnterior;
    return altura;
  }

  function fechar(item) {
    const botao = item.querySelector('.faq-item__pergunta');
    const painel = item.querySelector('.faq-item__resposta');
    item.classList.remove('is-aberto');
    botao.setAttribute('aria-expanded', 'false');
    painel.style.height = medir(painel) + 'px';
    void painel.offsetHeight;
    painel.style.height = '0px';
  }

  function abrir(item) {
    const botao = item.querySelector('.faq-item__pergunta');
    const painel = item.querySelector('.faq-item__resposta');
    item.classList.add('is-aberto');
    botao.setAttribute('aria-expanded', 'true');

    if (semMovimento) { painel.style.height = 'auto'; return; }

    painel.style.height = medir(painel) + 'px';
    let soltou = false;
    const soltar = () => {
      if (soltou) return;
      soltou = true;
      painel.removeEventListener('transitionend', aoTransicionar);
      if (item.classList.contains('is-aberto')) painel.style.height = 'auto';
    };
    const aoTransicionar = (e) => {
      if (e.propertyName !== 'height' || e.target !== painel) return;
      soltar();
    };
    painel.addEventListener('transitionend', aoTransicionar);
    window.setTimeout(soltar, 450);
  }

  itens.forEach((item) => {
    const botao = item.querySelector('.faq-item__pergunta');
    const painel = item.querySelector('.faq-item__resposta');
    if (!botao || !painel) return;

    painel.style.height = '0px';

    botao.addEventListener('click', () => {
      const abrindo = !item.classList.contains('is-aberto');
      itens.forEach((outro) => { if (outro !== item && outro.classList.contains('is-aberto')) fechar(outro); });
      if (abrindo) abrir(item); else fechar(item);
    });
  });
})();
