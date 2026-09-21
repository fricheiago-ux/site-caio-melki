/*
  Partículas de fundo — efeito da ref-5 reescrito em canvas e calibrado
  para tema claro: pontos de tinta/sálvia leves, com fios entre os
  vizinhos e uma atração discreta pelo ponteiro.
*/
(function () {
  const canvas = document.querySelector('.particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let particles = [];
  let w = 0, h = 0, dpr = 1;
  const pointer = { x: -9999, y: -9999 };

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  }

  function seed() {
    const density = Math.min(Math.round((w * h) / 17000), 120);
    particles = Array.from({ length: density }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.5,
      vx: (Math.random() - 0.5) * 0.14,
      vy: (Math.random() - 0.5) * 0.14 - 0.04,
      a: Math.random() * 0.28 + 0.10,
      tw: Math.random() * 0.018 + 0.004,
      sage: Math.random() > 0.55
    }));
  }

  function frame(t) {
    // Durante a abertura as portas cobrem o canvas. Desenhar ali custaria
    // o quadro inteiro (são milhares de pares de partículas por quadro)
    // e é justamente o que fazia a rolagem engasgar.
    if (window.fundoSuspenso || document.hidden) {
      requestAnimationFrame(frame);
      return;
    }

    ctx.clearRect(0, 0, w, h);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      const dx = pointer.x - p.x;
      const dy = pointer.y - p.y;
      if (dx * dx + dy * dy < 26000) {
        p.x += dx * 0.0015;
        p.y += dy * 0.0015;
      }

      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;

      const alpha = Math.max(p.a + Math.sin(t * p.tw) * 0.12, 0.04);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.sage
        ? `rgba(79, 115, 85, ${alpha})`
        : `rgba(31, 36, 32, ${alpha * 0.7})`;
      ctx.fill();
    }

    ctx.lineWidth = 0.5;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = dx * dx + dy * dy;
        if (dist < 11000) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(79, 115, 85, ${0.11 * (1 - dist / 11000)})`;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(frame);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => { pointer.x = e.clientX; pointer.y = e.clientY; });

  resize();
  if (!reduced) requestAnimationFrame(frame);
})();
