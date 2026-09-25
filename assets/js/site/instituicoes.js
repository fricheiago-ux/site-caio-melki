/*
  Cards de formação — a virada em 3D (logo -> descrição).

  No mouse, quem já cuida disso é o :hover puro em instituicoes.css. Este
  arquivo resolve duas coisas que o :hover sozinho não cobre:

  1. Toque. :hover não se desfaz sozinho depois de um toque na tela (ver
     CLAUDE.md) — por isso cada card abre e fecha explicitamente no
     clique/toque, alternando a classe .inst-card.is-open, que o CSS já
     sabe animar do mesmo jeito que anima o :hover. Tocar fora de todos
     os cards fecha o que estiver aberto.

  2. Demonstração automática. No desktop e no celular, o primeiro card
     vira sozinho e volta, uma única vez, assim que a seção entra na
     tela — só para avisar que os cards são interativos antes de a
     pessoa precisar descobrir sozinha. Cancela se alguém já mexeu no
     card antes disso (toque, clique, foco ou o mouse passando por
     cima), e não roda se o navegador pede menos movimento.
*/
(function () {
  const grade = document.querySelector('.inst-grid');
  if (!grade) return;
  const cards = Array.from(grade.querySelectorAll('.inst-card'));
  if (!cards.length) return;

  // ---------- 1. Toque: cada card abre e fecha por conta própria ----------
  cards.forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return; // o link de fonte só navega
      card.classList.toggle('is-open');
    });
  });

  document.addEventListener('click', (e) => {
    if (e.target.closest('.inst-card')) return;
    cards.forEach((c) => c.classList.remove('is-open'));
  });

  // ---------- 2. Demonstração automática do primeiro card ----------
  const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduzido) return;

  const primeiro = cards[0];
  let cancelada = false;
  const cancelar = () => { cancelada = true; };
  ['click', 'touchstart', 'mouseenter', 'focus'].forEach((ev) =>
    primeiro.addEventListener(ev, cancelar, { once: true })
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();

      setTimeout(() => {
        if (cancelada) return;
        primeiro.classList.add('is-open');
        setTimeout(() => {
          if (!cancelada) primeiro.classList.remove('is-open');
        }, 1500);
      }, 500);
    });
  }, { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.4 });

  observer.observe(grade);
})();
