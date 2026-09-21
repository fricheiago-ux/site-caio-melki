/*
  PARTÍCULAS DE FUNDO — só dentro de #pilares
  Porte fiel do efeito de fundo da hero de mirelle-fashion.aura.build:
  não é a rede de pontos+linhas de design-system-2/js/particles.js (isso
  foi tentativa 1, rejeitada — lia como "polígonos voando"). É uma nuvem
  de pontos em Three.js/WebGL, sem linha nenhuma entre eles, girando bem
  devagar. Mesma biblioteca (three.js r134, cdnjs), mesma contagem, mesmo
  tamanho de ponto, mesma velocidade de giro, mesmo balanço vertical —
  isso tudo foi copiado 1:1 do código-fonte deles (lido do atributo
  srcdoc do iframe de preview, já que o site nunca renderiza puro).

  Duas cores foram adaptadas, e só elas:
  - partícula: 0x173f22 (verde-escuro) → --sand-300. O deles é claro por
    trás de partícula escura; #pilares é o oposto (fundo escuro), então
    manter a cor original apagaria o efeito por completo.
  - fog: 0xf4f8e9 (creme claro, a cor de fundo do hero deles) → um tom do
    nosso próprio gradiente (#2A302A), pro ponto que se afasta desbotar
    no NOSSO fundo, e não crie um halo claro estranho no meio do verde.
  Contagem, tamanho, opacidade, blending, câmera, fog (densidade) e a
  animação inteira são os valores exatos do original.
*/
(function () {
  const secao = document.querySelector('.pilares');
  const canvas = secao && secao.querySelector('.pilares__particulas');
  if (!secao || !canvas || typeof THREE === 'undefined') return;

  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x2a302a, 0.08);

  const rect = canvas.parentElement.getBoundingClientRect();
  const camera = new THREE.PerspectiveCamera(75, (rect.width || 1) / (rect.height || 1), 0.1, 100);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(rect.width || 1, rect.height || 1);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const geometry = new THREE.BufferGeometry();
  const count = 400;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 15;
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    size: 0.04,
    color: 0xe8dfcd, // --sand-300
    transparent: true,
    opacity: 0.3,
    blending: THREE.NormalBlending
  });

  const particlesMesh = new THREE.Points(geometry, material);
  scene.add(particlesMesh);

  // Um frame parado (reduced-motion) ainda mostra a nuvem, só sem girar.
  renderer.render(scene, camera);
  if (reduced) return;

  const clock = new THREE.Clock();
  let rodando = false;

  function animateWebGL() {
    if (!rodando) return;
    requestAnimationFrame(animateWebGL);
    const elapsedTime = clock.getElapsedTime();
    particlesMesh.rotation.y = elapsedTime * 0.03;
    particlesMesh.rotation.x = elapsedTime * 0.015;
    particlesMesh.position.y = Math.sin(elapsedTime * 0.2) * 0.5;
    renderer.render(scene, camera);
  }

  // O original roda sempre (é a hero, já nasce visível). Aqui, seção no
  // meio da página: só anima com ela na tela.
  const io = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (e.isIntersecting && !rodando) {
        rodando = true;
        requestAnimationFrame(animateWebGL);
      } else if (!e.isIntersecting) {
        rodando = false;
      }
    });
  }, { threshold: 0 });
  io.observe(secao);

  window.addEventListener('resize', () => {
    const newRect = canvas.parentElement.getBoundingClientRect();
    if (!newRect.width || !newRect.height) return;
    camera.aspect = newRect.width / newRect.height;
    camera.updateProjectionMatrix();
    renderer.setSize(newRect.width, newRect.height);
  });
})();
