/*
  Busca de condições da hero.
  Motivação (do brief): "a galera geralmente busca no google algo como
  'médico que trata x doença'" — então a busca é a ação principal da
  primeira dobra, e precisa entender o termo popular, não só o técnico.

  Lê window.CONDICOES e window.SINONIMOS de conditions-data.js
*/
(function () {
  const input = document.getElementById('busca-condicao');
  const painel = document.getElementById('busca-resultados');
  if (!input || !painel || !window.CONDICOES) return;

  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

  // Achata as categorias em uma lista de itens pesquisáveis
  const indice = [];
  window.CONDICOES.forEach((grupo) => {
    grupo.itens.forEach((nome) => {
      indice.push({ nome, categoria: grupo.categoria, chave: norm(nome + ' ' + grupo.categoria) });
    });
  });

  const sinonimos = (window.SINONIMOS || []).map((s) => ({
    termo: norm(s.termo),
    alvo: norm(s.alvo)
  }));

  let ativo = -1;
  let visiveis = [];

  function buscar(q) {
    const query = norm(q);
    if (query.length < 2) return [];

    // Termos populares que batem com a consulta apontam para o nome técnico
    const alvos = sinonimos
      .filter((s) => s.termo.includes(query) || query.includes(s.termo))
      .map((s) => s.alvo);

    const pontuar = (item) => {
      const i = item.chave.indexOf(query);
      if (i === 0) return 3;            // começa com o termo
      if (i > 0) return 2;              // contém o termo
      if (alvos.some((a) => item.chave.includes(a))) return 1; // veio por sinônimo
      return 0;
    };

    return indice
      .map((item) => ({ item, p: pontuar(item) }))
      .filter((r) => r.p > 0)
      .sort((a, b) => b.p - a.p || a.item.nome.localeCompare(b.item.nome))
      .slice(0, 8)
      .map((r) => r.item);
  }

  function destacar(texto, q) {
    const query = norm(q);
    const alvo = norm(texto);
    const i = alvo.indexOf(query);
    if (i < 0 || query.length < 2) return texto;
    return texto.slice(0, i) + '<mark>' + texto.slice(i, i + query.length) + '</mark>' + texto.slice(i + query.length);
  }

  function fechar() {
    painel.classList.remove('is-open');
    painel.innerHTML = '';
    ativo = -1;
    visiveis = [];
    input.setAttribute('aria-expanded', 'false');
  }

  function render(q) {
    visiveis = buscar(q);
    ativo = -1;

    if (norm(q).length < 2) return fechar();

    if (visiveis.length === 0) {
      painel.innerHTML =
        '<div class="busca-vazio">' +
        '<p class="body-sm"><strong>Não encontrei "' + q.replace(/</g, '&lt;') + '" na lista.</strong></p>' +
        '<p class="helper">A lista cobre os quadros mais comuns, mas não é exaustiva — o médico de família também coordena o cuidado de quem já tem diagnóstico. Vale conversar.</p>' +
        '<a class="btn btn--primary" href="#agendar"><span class="btn__shine"></span>Perguntar numa consulta</a>' +
        '</div>';
    } else {
      painel.innerHTML =
        '<p class="label busca-titulo">' + visiveis.length + (visiveis.length === 1 ? ' condição encontrada' : ' condições encontradas') + '</p>' +
        '<ul>' +
        visiveis.map((r, i) =>
          '<li><button class="busca-item" data-i="' + i + '" type="button">' +
          '<span class="busca-item__nome">' + destacar(r.nome, q) + '</span>' +
          '<span class="busca-item__cat">' + r.categoria + '</span>' +
          '</button></li>'
        ).join('') +
        '</ul>' +
        '<p class="helper busca-rodape">Sim, isso é acompanhado por um médico de família.</p>';
    }

    painel.classList.add('is-open');
    input.setAttribute('aria-expanded', 'true');
  }

  function mover(delta) {
    const botoes = painel.querySelectorAll('.busca-item');
    if (!botoes.length) return;
    ativo = (ativo + delta + botoes.length) % botoes.length;
    botoes.forEach((b, i) => b.classList.toggle('is-active', i === ativo));
    botoes[ativo].scrollIntoView({ block: 'nearest' });
  }

  input.addEventListener('input', () => render(input.value));
  input.addEventListener('focus', () => { if (input.value) render(input.value); });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); mover(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); mover(-1); }
    else if (e.key === 'Escape') { fechar(); input.blur(); }
    else if (e.key === 'Enter' && ativo >= 0 && visiveis[ativo]) {
      e.preventDefault();
      input.value = visiveis[ativo].nome;
      render(input.value);
    }
  });

  painel.addEventListener('click', (e) => {
    const btn = e.target.closest('.busca-item');
    if (!btn) return;
    const r = visiveis[Number(btn.dataset.i)];
    if (r) { input.value = r.nome; render(input.value); input.focus(); }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.busca')) fechar();
  });

  // Sugestões rápidas — atalhos para os termos mais buscados
  document.querySelectorAll('[data-sugestao]').forEach((chip) => {
    chip.addEventListener('click', () => {
      input.value = chip.dataset.sugestao;
      input.focus();
      render(input.value);
    });
  });

  // Contador exibido junto da busca
  const contador = document.getElementById('busca-total');
  if (contador) contador.textContent = indice.length;
})();
