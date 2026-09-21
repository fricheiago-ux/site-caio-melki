# Relatório PageSpeed Insights — Site Caio Melki

**URL testada:** https://fricheiago-ux.github.io/site-caio-melki/
**Data:** 21 de setembro de 2026, 17:13 BRT
**Gerado por:** `/revisar-performance`, Parte B — rodado manualmente em
pagespeed.web.dev (a API sem chave, usada pelo script deste projeto, estava
com a cota diária global esgotada — erro 429 — quando este relatório foi
gerado; ver `~/.claude/skills/revisar-performance/SKILL.md` para configurar
uma chave própria e evitar isso da próxima vez).

Este teste já reflete as correções da Parte A (lazy loading, imagens
recomprimidas, canonical/Open Graph/schema.org, robots.txt/sitemap.xml),
publicadas no commit `c4bc1a1` e confirmadas no ar antes deste teste.

---

## Notas

| Categoria | Celular | Computador |
|---|---|---|
| Desempenho | **62** | **94** |
| Acessibilidade | 96 | 93 |
| Práticas recomendadas | 100 | 100 |
| SEO | 100 | 100 |
| Navegação agêntica | 2/2 | 2/2 |

**Sem dados de campo (CrUX)** em nenhuma das duas — normal para um site com
tráfego real ainda baixo; as notas acima são só de laboratório (simulação do
Lighthouse), não de visitantes reais.

## Core Web Vitals (laboratório)

| Métrica | Celular | Computador |
|---|---|---|
| First Contentful Paint | 3,5 s | 0,8 s |
| Largest Contentful Paint | 6,8 s | 1,4 s |
| Total Blocking Time | 210 ms | 40 ms |
| Cumulative Layout Shift | 0 | 0,017 |
| Speed Index | 5,8 s | 1,3 s |

O celular é simulado com **Moto G Power + rede 4G limitada** — bem mais
pesado que a experiência real de um iPhone recente em wifi/5G, mas é o
cenário que o Google usa para pontuar. O LCP de 6,8s no celular é o maior
problema real deste relatório.

---

## Oportunidades de maior impacto (nesta ordem)

1. **Ciclo de vida de cache** — economia estimada de **590 KiB (celular) / 1.549 KiB (computador)**.
   As imagens e scripts do próprio site já são servidos pelo GitHub Pages, mas
   os três scripts de CDN (`unpkg.com/lucide`, `cdnjs` do three.js,
   `cdn.jsdelivr.net` do GSAP) têm política de cache curta e pesam bastante.
   **Fora do nosso controle direto** (não são arquivos nossos), mas dá para
   mitigar carregando essas bibliotecas localmente em `assets/js/vendor/`
   (com cache-busting `?v=N` como o resto do site) em vez de via CDN — troca
   "sempre a versão mais nova" por "controle total do cache".
2. **Solicitações que bloqueiam a renderização** — 1.550 ms (celular) / 510 ms
   (computador). Principalmente o CSS do Google Fonts e os 13 arquivos de CSS
   próprios carregados em série no `<head>`. Juntar os CSS do design system
   num único arquivo (ou pelo menos os 4 de `design-system/`) reduziria o
   número de conexões.
3. **Entrega de imagens** — 181 KiB (celular) / 302 KiB (computador) de
   economia ainda possível, mesmo depois da recompressão desta revisão.
   O Lighthouse está pedindo formatos mais modernos (WebP/AVIF) para as
   imagens que ainda são JPEG/PNG — não fizemos essa conversão porque exigiria
   `<picture>`/fallback e não temos ferramenta de WebP neste ambiente (só
   `sips`, que não gera WebP). Fica como pendência.
4. **JavaScript não usado** — 73 KiB. Candidato principal: `three.js`
   (r134, biblioteca grande) usado só para o efeito 3D do corpo em
   `corpo-3d.js` — vale checar se dá para importar só os módulos usados em
   vez do bundle inteiro.
5. **Animações não compostas** — 13 elementos no celular (10 no computador)
   que podem deixar a rolagem menos fluida e piorar o CLS. Não investigado
   nesta revisão (o CLS já está em 0/0,017, ótimo, mas o aviso continua
   valendo para fluidez percebida).

## Acessibilidade (96 celular / 93 computador)

Único ponto sinalizado automaticamente: **contraste de cor insuficiente**
entre texto e fundo em pelo menos um elemento (o Lighthouse não isola qual
neste resumo — abrir o relatório completo em pagespeed.web.dev para o
elemento exato). As outras 10 verificações da categoria pedem revisão manual
(não são bugs, são itens que a ferramenta não consegue testar sozinha).

## Práticas recomendadas e SEO: 100/100 nos dois

Confirma que os ajustes desta revisão (canonical, Open Graph, schema.org,
robots.txt, sitemap.xml) fecharam os itens que o Lighthouse consegue medir
automaticamente. SEO 100 não é garantia de posição no Google — só de que os
fundamentos técnicos estão corretos.

---

## O que já foi corrigido nesta revisão (antes deste teste)

- Lazy loading + `decoding="async"` nas imagens abaixo da dobra.
- `fetchpriority="high"` na foto da hero (real candidata a LCP).
- ~3 MB de imagem cortados (recompressão de PNG→JPEG e ajuste de qualidade).
- Canonical, Open Graph, `twitter:card`, `schema.org/Physician`, `robots.txt`,
  `sitemap.xml`.

## Pendências para uma próxima rodada

- Hospedar localmente os 3 scripts de CDN (maior economia de cache disponível).
- Consolidar os 13 arquivos CSS do site em menos arquivos.
- Converter as imagens mais pesadas para WebP com fallback (precisa de uma
  ferramenta que gere WebP — `sips` não gera).
- Investigar o uso de `three.js` em `corpo-3d.js` — 73 KiB de JS não usado.
- Identificar o elemento com contraste insuficiente e corrigir a cor.
