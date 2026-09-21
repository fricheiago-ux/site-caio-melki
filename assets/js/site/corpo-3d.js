/*
  O CORPO EM PONTOS — slot da esquerda da seção "A especialidade".

  Ideia emprestada da seção "A delivery is four files" do template GROUNDTRUTH
  (aura.build): uma nuvem de pontos que começa espalhada e vai se registrando
  na forma final conforme a pessoa rola a página. Lá o objeto é um escaneamento
  de loja; aqui é um corpo humano, que é exatamente o assunto da seção.

  Duas diferenças de fundo em relação ao original:

  1. sem GLB. O original carrega um modelo de um CDN e o decodifica. Aqui a
     figura é gerada por código — cápsulas e elipsoides amostrados na
     superfície — então não há arquivo para baixar, nada quebra offline e o
     custo é de alguns milissegundos no carregamento;

  2. a cor conta a história. O ponto nasce cinza-esverdeado, "não registrado",
     e vira sálvia claro quando encontra seu lugar. Rolando de volta ele se
     desfaz. É a mesma leitura do original, na paleta do Caio.

  Marcação: <canvas data-corpo></canvas> dentro do bloco que se quer observar.
*/
(function () {
  const tela = document.querySelector('[data-corpo]');
  if (!tela) return;

  const gl = tela.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: false });
  if (!gl) { tela.setAttribute('data-sem-gl', '1'); return; }

  /* ---------------- A figura ----------------
     Amostragem na SUPERFÍCIE, não no volume: um corpo preenchido de pontos
     vira uma mancha sólida, e o que faz a silhueta ler é a casca. */
  let semente = 20260916;
  const r = () => { semente = (semente * 9301 + 49297) % 233280; return semente / 233280; };

  const pontos = [];

  function capsula(a, b, ra, rb, n) {
    const eixo = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
    const comp = Math.hypot(eixo[0], eixo[1], eixo[2]) || 1;
    const u = eixo.map((v) => v / comp);
    // duas perpendiculares ao eixo, para girar em volta dele
    const ref = Math.abs(u[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
    const p1 = [u[1] * ref[2] - u[2] * ref[1], u[2] * ref[0] - u[0] * ref[2], u[0] * ref[1] - u[1] * ref[0]];
    const l1 = Math.hypot(p1[0], p1[1], p1[2]) || 1;
    for (let i = 0; i < 3; i++) p1[i] /= l1;
    const p2 = [u[1] * p1[2] - u[2] * p1[1], u[2] * p1[0] - u[0] * p1[2], u[0] * p1[1] - u[1] * p1[0]];

    for (let i = 0; i < n; i++) {
      const t = r();
      const raio = ra + (rb - ra) * t;
      const ang = r() * Math.PI * 2;
      const c = Math.cos(ang) * raio, s = Math.sin(ang) * raio;
      pontos.push(
        a[0] + eixo[0] * t + p1[0] * c + p2[0] * s,
        a[1] + eixo[1] * t + p1[1] * c + p2[1] * s,
        a[2] + eixo[2] * t + p1[2] * c + p2[2] * s
      );
    }
  }

  function elipsoide(c, rx, ry, rz, n) {
    for (let i = 0; i < n; i++) {
      const z = r() * 2 - 1;
      const th = r() * Math.PI * 2;
      const s = Math.sqrt(1 - z * z);
      pontos.push(c[0] + Math.cos(th) * s * rx, c[1] + z * ry, c[2] + Math.sin(th) * s * rz);
    }
  }

  /* Proporções de figura anatômica, e não de boneco: cabeça menor, ombros
     largos, cintura estreita e membros longos. O tronco é feito de três
     elipsoides empilhados (peito, cintura, quadril) em vez de um só — é o
     estrangulamento na cintura que dá a silhueta em V da referência. Um
     elipsoide único, por mais que se ajuste, sempre lê como barril. */
  elipsoide([0, 0.862, 0], 0.076, 0.098, 0.082, 470);            // cabeça
  capsula([0, 0.735, 0], [0, 0.784, 0], 0.044, 0.038, 90);       // pescoço
  capsula([-0.180, 0.712, 0], [0.180, 0.712, 0], 0.050, 0.050, 300); // linha dos ombros
  elipsoide([0, 0.600, 0], 0.145, 0.110, 0.082, 760);            // peito
  elipsoide([0, 0.462, 0], 0.098, 0.078, 0.062, 360);            // cintura
  elipsoide([0, 0.352, 0], 0.125, 0.075, 0.075, 400);            // quadril
  for (const lado of [-1, 1]) {
    /* Braço afastado do tronco de propósito. Colado, some dentro da silhueta
       e a figura vira um bloco — foi o que aconteceu na primeira versão. O
       vão entre braço e cintura é o que faz um corpo ler como corpo. */
    capsula([lado * 0.196, 0.688, 0], [lado * 0.238, 0.500, 0], 0.044, 0.034, 330); // braço
    capsula([lado * 0.238, 0.500, 0], [lado * 0.262, 0.330, 0], 0.034, 0.025, 280); // antebraço
    capsula([lado * 0.262, 0.330, 0], [lado * 0.268, 0.268, 0], 0.025, 0.018, 90);  // mão
    // pernas ligeiramente abertas, pelo mesmo motivo
    capsula([lado * 0.070, 0.320, 0], [lado * 0.092, 0.100, 0], 0.070, 0.048, 460); // coxa
    capsula([lado * 0.092, 0.100, 0], [lado * 0.100, -0.100, 0], 0.048, 0.033, 400);// canela
    capsula([lado * 0.100, -0.100, 0], [lado * 0.100, -0.126, 0.055], 0.033, 0.025, 90); // pé
  }

  const N = pontos.length / 3;

  // centraliza e normaliza a altura, para o enquadramento não depender das medidas acima
  let minY = Infinity, maxY = -Infinity;
  for (let i = 1; i < pontos.length; i += 3) { if (pontos[i] < minY) minY = pontos[i]; if (pontos[i] > maxY) maxY = pontos[i]; }
  const meio = (minY + maxY) / 2, escala = 1.62 / (maxY - minY);

  const destino = new Float32Array(N * 3);
  const origem = new Float32Array(N * 3);
  const atraso = new Float32Array(N);

  for (let i = 0; i < N; i++) {
    destino[i * 3] = pontos[i * 3] * escala;
    destino[i * 3 + 1] = (pontos[i * 3 + 1] - meio) * escala;
    destino[i * 3 + 2] = pontos[i * 3 + 2] * escala;
    /* Posição inicial: uma casca CILÍNDRICA alta em volta da figura, e não
       uma bolha esférica. O ponto nasce na altura que vai ocupar no corpo,
       só que longe do eixo — então ele desaba para dentro em vez de vir de
       um lugar qualquer, e o conjunto lê como um anel de varredura se
       fechando sobre a pessoa. O giro extra no ângulo faz a entrada ser em
       espiral, que é o que dá o suspense. */
    const alturaAlvo = (pontos[i * 3 + 1] - meio) * escala;
    const th = r() * 6.2832;
    const rad = 1.25 + r() * 0.55;
    origem[i * 3] = Math.cos(th) * rad;
    origem[i * 3 + 1] = alturaAlvo * 1.5 + (r() - 0.5) * 0.5;
    origem[i * 3 + 2] = Math.sin(th) * rad;
    atraso[i] = r();
  }

  /* ---------------- Shaders ---------------- */
  const VS = `attribute vec3 aOrigem; attribute vec3 aDestino; attribute float aAtraso;
uniform mat4 uMVP; uniform float uMix; uniform float uT;
varying float vFixo;
void main(){
  // cada ponto tem sua deixa: um lerp único lê como "morph", um escalonado lê
  // como pontos ENCAIXANDO um a um, que é o efeito que se quer
  float u = clamp((uMix - aAtraso * 0.55) / 0.45, 0.0, 1.0);
  u = u * u * (3.0 - 2.0 * u);
  // o caminho não é reto: o ponto gira em torno do eixo enquanto se aproxima,
  // então a nuvem se enrola para dentro em vez de encolher em linha reta
  float giro = (1.0 - u) * 2.4 + aAtraso * 1.6;
  float cg = cos(giro), sg = sin(giro);
  vec3 orig = vec3(aOrigem.x * cg - aOrigem.z * sg, aOrigem.y, aOrigem.x * sg + aOrigem.z * cg);
  vec3 p = mix(orig, aDestino, u);
  // enquanto não encaixou, o ponto ainda vibra
  p.x += sin(uT * 1.4 + aAtraso * 41.0) * (1.0 - u) * 0.045;
  p.y += cos(uT * 1.8 + aAtraso * 27.0) * (1.0 - u) * 0.045;
  p.z += sin(uT * 1.1 + aAtraso * 63.0) * (1.0 - u) * 0.045;
  vFixo = u;
  gl_Position = uMVP * vec4(p, 1.0);
  gl_PointSize = 1.6 + u * 1.5;
}`;

  const FS = `precision highp float;
varying float vFixo;
uniform vec3 uFrio, uQuente;
void main(){
  vec2 d = gl_PointCoord - 0.5;
  if (dot(d, d) > 0.25) discard;          // ponto redondo, não quadrado
  gl_FragColor = vec4(mix(uFrio, uQuente, vFixo), 0.45 + vFixo * 0.55);
}`;

  function compilar(tipo, src) {
    const s = gl.createShader(tipo);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s));
    return s;
  }
  const prog = gl.createProgram();
  gl.attachShader(prog, compilar(gl.VERTEX_SHADER, VS));
  gl.attachShader(prog, compilar(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const buf = (d) => { const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, d, gl.STATIC_DRAW); return b; };
  const bO = buf(origem), bD = buf(destino), bA = buf(atraso);
  const lO = gl.getAttribLocation(prog, 'aOrigem');
  const lD = gl.getAttribLocation(prog, 'aDestino');
  const lA = gl.getAttribLocation(prog, 'aAtraso');
  const uMVP = gl.getUniformLocation(prog, 'uMVP');
  const uMix = gl.getUniformLocation(prog, 'uMix');
  const uT = gl.getUniformLocation(prog, 'uT');
  // cinza-esverdeado "não registrado" -> sálvia claro do sistema
  gl.uniform3f(gl.getUniformLocation(prog, 'uFrio'), 0.42, 0.47, 0.44);
  gl.uniform3f(gl.getUniformLocation(prog, 'uQuente'), 0.64, 0.82, 0.64);

  /* ---------------- Matrizes ---------------- */
  function mul(a, b) {
    const o = new Float32Array(16);
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { let s = 0; for (let k = 0; k < 4; k++) s += a[k * 4 + j] * b[i * 4 + k]; o[i * 4 + j] = s; }
    return o;
  }
  function perspectiva(fov, asp, n, f) {
    const t = 1 / Math.tan(fov / 2), o = new Float32Array(16);
    o[0] = t / asp; o[5] = t; o[10] = (f + n) / (n - f); o[11] = -1; o[14] = 2 * f * n / (n - f);
    return o;
  }

  /* ---------------- Laço ---------------- */
  const bloco = tela.closest('.esp-retrato') || tela.parentElement;
  const secao = tela.closest('section') || bloco;
  const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let vivo = false, mistura = reduzido ? 1 : 0, rodando = false;

  function medir() {
    const cx = bloco.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    tela.width = Math.max(2, Math.round(cx.width * dpr));
    tela.height = Math.max(2, Math.round(cx.height * dpr));
    gl.viewport(0, 0, tela.width, tela.height);
  }
  medir();
  window.addEventListener('resize', medir, { passive: true });

  function quadro(agora) {
    if (!vivo) { rodando = false; return; }
    const t = agora / 1000;

    // a rolagem é o progresso: entra desmontado, sai montado
    const c = secao.getBoundingClientRect();
    const janela = window.innerHeight || 800;
    const alvo = reduzido ? 1 : Math.min(1, Math.max(0, (janela * 0.88 - c.top) / (janela * 0.9)));
    mistura += (alvo - mistura) * 0.10;

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(prog);

    const asp = tela.width / Math.max(tela.height, 1);
    const giro = t * 0.52;   // giro do boneco, mais vivo que os 0.20 iniciais
    const cs = Math.cos(giro), sn = Math.sin(giro);
    // gira em torno do eixo vertical e afasta a câmera
    const camera = new Float32Array([cs, 0, sn, 0, 0, 1, 0, 0, -sn, 0, cs, 0, 0, 0, -2.85, 1]);
    gl.uniformMatrix4fv(uMVP, false, mul(perspectiva(0.85, asp, 0.1, 30), camera));
    gl.uniform1f(uMix, mistura);
    gl.uniform1f(uT, t);

    gl.bindBuffer(gl.ARRAY_BUFFER, bO); gl.enableVertexAttribArray(lO); gl.vertexAttribPointer(lO, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, bD); gl.enableVertexAttribArray(lD); gl.vertexAttribPointer(lD, 3, gl.FLOAT, false, 0, 0);
    // tamanho 1: o atraso é um float solto. Ligá-lo como vec3 faz o desenho ler
    // além do buffer, o WebGL recusa e a nuvem inteira some sem aviso.
    gl.bindBuffer(gl.ARRAY_BUFFER, bA); gl.enableVertexAttribArray(lA); gl.vertexAttribPointer(lA, 1, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.POINTS, 0, N);

    requestAnimationFrame(quadro);
  }

  // só desenha quando está na tela: são milhares de pontos por quadro
  new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      vivo = e.isIntersecting;
      if (vivo && !rodando) { rodando = true; medir(); requestAnimationFrame(quadro); }
    });
  }, { threshold: 0.02 }).observe(bloco);
})();
