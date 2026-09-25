/*
  PARTÍCULAS DE FUNDO — só dentro de #pilares
  Porte fiel do efeito de fundo da hero de mirelle-fashion.aura.build: uma
  nuvem de pontos em Three.js/WebGL girando bem devagar (não a rede de
  pontos+linhas de particles.js — isso foi tentativa 1, rejeitada, lia
  como "polígonos voando"). Mesma biblioteca (three.js r134, cdnjs), mesma
  contagem, mesma câmera, fog e velocidade de giro/balanço do original
  (lido do atributo srcdoc do iframe de preview deles).

  Cores adaptadas (só elas): partícula 0x173f22→--sand-300 e fog
  0xf4f8e9→#2A302A, porque o fundo deles é claro e o nosso é escuro —
  manter as cores originais apagaria o efeito por completo.

  Ajuste de 23/09 (a pedido do Iago — estava competindo com as imagens e
  o texto dos cards):
  1. Quadrado → círculo macio. THREE.PointsMaterial sem `map` desenha cada
     ponto como um quadrado sólido — é o padrão da biblioteca, não uma
     escolha nossa. Uma textura circular com degradê (criarTexturaPonto)
     corrige isso.
  2. Opacidade 0,3 → 0,18: mais discreto, sem sumir.
  3. Sem mais "partícula gigante passando na frente da tela": isso era
     `sizeAttenuation` (ligado por padrão) fazendo o tamanho do ponto
     crescer conforme ele girava para perto da câmera, em perspectiva —
     como os pontos vivem numa nuvem 3D que gira sozinha, de tempos em
     tempos um deles passava bem perto da lente e inflava. Desligado
     (`sizeAttenuation: false`): todo ponto nasce do mesmo tamanho na
     tela, não importa a distância.
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

  // Ponto branco com degradê radial (centro cheio, borda some): usado como
  // "carimbo" de cada partícula. Sem isso, THREE.PointsMaterial desenha um
  // quadrado sólido — é o formato padrão da biblioteca para pontos.
  function criarTexturaPonto() {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const ctx = c.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.5, 'rgba(255,255,255,0.55)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }

  const material = new THREE.PointsMaterial({
    size: 2.4, // pixels na tela — ver sizeAttenuation abaixo
    map: criarTexturaPonto(),
    color: 0xe8dfcd, // --sand-300
    transparent: true,
    opacity: 0.18,
    sizeAttenuation: false, // tamanho fixo: sem "bolha gigante" ao girar perto da câmera
    depthWrite: false, // evita risco de sobreposição esquisita entre pontos transparentes
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
