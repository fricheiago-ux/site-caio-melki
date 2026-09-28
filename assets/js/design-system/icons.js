/*
  Ícones do site — substitui a biblioteca lucide inteira (444 KB, ~1.500
  ícones, vinda do unpkg com um redirecionamento a mais) por só os 29
  ícones que a página usa. Mesma interface: lucide.createIcons() troca cada
  <i data-lucide="nome"> por um <svg> igual ao que a biblioteca gerava
  (mesmas classes "lucide lucide-nome", mesmos atributos, estilo inline
  preservado), então o CSS e o JS que já existiam continuam valendo.

  Geometria copiada de lucide 1.48.0 (a versão que "@latest" resolvia em
  28/09/2026). Ícone novo: adicionar o nome e as formas em ICONES abaixo
  (as formas estão em https://lucide.dev/icons/<nome>, aba "Copy as JS"
  ou no arquivo dist/esm/icons/<nome>.js do pacote lucide).
*/
(function () {
  var ICONES = {"activity":[["path",{"d":"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"}]],"arrow-down":[["path",{"d":"M12 5v14"}],["path",{"d":"m19 12-7 7-7-7"}]],"arrow-right":[["path",{"d":"M5 12h14"}],["path",{"d":"m12 5 7 7-7 7"}]],"arrow-up-right":[["path",{"d":"M7 7h10v10"}],["path",{"d":"M7 17 17 7"}]],"baby":[["path",{"d":"M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"}],["path",{"d":"M15 12h.01"}],["path",{"d":"M19.38 6.813A9 9 0 0 1 20.8 10.2a2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"}],["path",{"d":"M9 12h.01"}]],"book-open":[["path",{"d":"M12 5v16"}],["path",{"d":"M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z"}]],"brain":[["path",{"d":"M12 18V5"}],["path",{"d":"M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4"}],["path",{"d":"M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5"}],["path",{"d":"M17.997 5.125a4 4 0 0 1 2.526 5.77"}],["path",{"d":"M18 18a4 4 0 0 0 2-7.464"}],["path",{"d":"M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517"}],["path",{"d":"M6 18a4 4 0 0 1-2-7.464"}],["path",{"d":"M6.003 5.125a4 4 0 0 0-2.526 5.77"}]],"calendar-check":[["path",{"d":"M8 2v3"}],["path",{"d":"M16 2v3"}],["rect",{"x":"3","y":"3","width":"18","height":"18","rx":"2"}],["path",{"d":"M3 9h18"}],["path",{"d":"m9 15 2 2 4-4"}]],"chevron-down":[["path",{"d":"m6 9 6 6 6-6"}]],"chevron-up":[["path",{"d":"m18 15-6-6-6 6"}]],"clipboard-list":[["rect",{"width":"8","height":"4","x":"8","y":"2","rx":"1","ry":"1"}],["path",{"d":"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"}],["path",{"d":"M12 11h4"}],["path",{"d":"M12 16h4"}],["path",{"d":"M8 11h.01"}],["path",{"d":"M8 16h.01"}]],"corner-right-down":[["path",{"d":"m10 15 5 5 5-5"}],["path",{"d":"M4 4h7a4 4 0 0 1 4 4v12"}]],"file-text":[["path",{"d":"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"}],["path",{"d":"M14 2v5a1 1 0 0 0 1 1h5"}],["path",{"d":"M10 9H8"}],["path",{"d":"M16 13H8"}],["path",{"d":"M16 17H8"}]],"git-merge":[["circle",{"cx":"18","cy":"18","r":"3"}],["circle",{"cx":"6","cy":"6","r":"3"}],["path",{"d":"M6 21V9a9 9 0 0 0 9 9"}]],"heart-handshake":[["path",{"d":"M19.414 14.414C21 12.828 22 11.5 22 9.5a5.5 5.5 0 0 0-9.591-3.676.6.6 0 0 1-.818.001A5.5 5.5 0 0 0 2 9.5c0 2.3 1.5 4 3 5.5l5.535 5.362a2 2 0 0 0 2.879.052 2.12 2.12 0 0 0-.004-3 2.124 2.124 0 1 0 3-3 2.124 2.124 0 0 0 3.004 0 2 2 0 0 0 0-2.828l-1.881-1.882a2.41 2.41 0 0 0-3.409 0l-1.71 1.71a2 2 0 0 1-2.828 0 2 2 0 0 1 0-2.828l2.823-2.762"}]],"heart-pulse":[["path",{"d":"M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"}],["path",{"d":"M3.22 13H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"}]],"house":[["path",{"d":"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"}],["path",{"d":"M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"}]],"info":[["circle",{"cx":"12","cy":"12","r":"10"}],["path",{"d":"M12 16v-4"}],["path",{"d":"M12 8h.01"}]],"mail":[["path",{"d":"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"}],["rect",{"x":"2","y":"4","width":"20","height":"16","rx":"2"}]],"menu":[["path",{"d":"M4 5h16"}],["path",{"d":"M4 12h16"}],["path",{"d":"M4 19h16"}]],"message-circle":[["path",{"d":"M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"}]],"monitor-play":[["path",{"d":"M15.033 9.44a.647.647 0 0 1 0 1.12l-4.065 2.352a.645.645 0 0 1-.968-.56V7.648a.645.645 0 0 1 .967-.56z"}],["path",{"d":"M12 17v4"}],["path",{"d":"M8 21h8"}],["rect",{"x":"2","y":"3","width":"20","height":"14","rx":"2"}]],"pill":[["path",{"d":"m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"}],["path",{"d":"m8.5 8.5 7 7"}]],"pointer":[["path",{"d":"M22 14a8 8 0 0 1-8 8"}],["path",{"d":"M18 11v-1a2 2 0 0 0-2-2a2 2 0 0 0-2 2"}],["path",{"d":"M14 10V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1"}],["path",{"d":"M10 9.5V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v10"}],["path",{"d":"M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"}]],"quote":[["path",{"d":"M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"}],["path",{"d":"M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"}]],"search":[["path",{"d":"m21 21-4.34-4.34"}],["circle",{"cx":"11","cy":"11","r":"8"}]],"search-check":[["path",{"d":"m8 11 2 2 4-4"}],["circle",{"cx":"11","cy":"11","r":"8"}],["path",{"d":"m21 21-4.3-4.3"}]],"shield-check":[["path",{"d":"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"}],["path",{"d":"m9 12 2 2 4-4"}]],"stethoscope":[["path",{"d":"M11 2v2"}],["path",{"d":"M5 2v2"}],["path",{"d":"M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"}],["path",{"d":"M8 15a6 6 0 0 0 12 0v-3"}],["circle",{"cx":"20","cy":"10","r":"2"}]],"triangle-alert":[["path",{"d":"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"}],["path",{"d":"M12 9v4"}],["path",{"d":"M12 17h.01"}]],"users":[["path",{"d":"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"}],["path",{"d":"M16 3.128a4 4 0 0 1 0 7.744"}],["path",{"d":"M22 21v-2a4 4 0 0 0-3-3.87"}],["circle",{"cx":"9","cy":"7","r":"4"}]],"x":[["path",{"d":"M18 6 6 18"}],["path",{"d":"m6 6 12 12"}]]};

  var NS = "http://www.w3.org/2000/svg";

  function criar(el, nome) {
    var formas = ICONES[nome];
    if (!formas) {
      console.warn("[icones] ícone \"" + nome + "\" não está em icons.js — ver comentário no topo do arquivo");
      return null;
    }
    var svg = document.createElementNS(NS, "svg");
    var fixos = {
      xmlns: NS, width: "24", height: "24", viewBox: "0 0 24 24", fill: "none",
      stroke: "currentColor", "stroke-width": "2",
      "stroke-linecap": "round", "stroke-linejoin": "round"
    };
    Object.keys(fixos).forEach(function (k) { svg.setAttribute(k, fixos[k]); });

    // atributos que o autor escreveu no <i> (style, width, aria-label...) vencem
    Array.prototype.forEach.call(el.attributes, function (a) {
      if (a.name !== "class") svg.setAttribute(a.name, a.value);
    });
    if (!svg.hasAttribute("aria-label") && !svg.hasAttribute("aria-hidden")) svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("class", ["lucide", "lucide-" + nome, el.getAttribute("class") || ""].join(" ").trim());

    formas.forEach(function (f) {
      var p = document.createElementNS(NS, f[0]);
      Object.keys(f[1]).forEach(function (k) { p.setAttribute(k, f[1][k]); });
      svg.appendChild(p);
    });
    return svg;
  }

  function createIcons() {
    Array.prototype.slice.call(document.querySelectorAll("[data-lucide]")).forEach(function (el) {
      var svg = criar(el, el.getAttribute("data-lucide"));
      if (svg && el.parentNode) el.parentNode.replaceChild(svg, el);
    });
  }

  window.lucide = { createIcons: createIcons };
  createIcons();
})();
