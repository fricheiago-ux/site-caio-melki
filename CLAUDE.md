# Site Caio Melki — regras deste projeto

Complementa o `CLAUDE.md` global. Onde houver conflito, **este arquivo vence**.

Site institucional do Dr. Caio Ribeiro Melki, médico de família e comunidade em
Belo Horizonte. Estático, sem etapa de build — é `index.html` puro com CSS e JS
próprios. No ar em **https://fricheiago-ux.github.io/site-caio-melki/**, via
GitHub Pages, publicado automaticamente a partir do repositório
[fricheiago-ux/site-caio-melki](https://github.com/fricheiago-ux/site-caio-melki)
(público). O domínio **caiomelkimfc.com.br** está registrado na Hostinger;
conectado ao Pages em 25/09/2026 — o site já abre em caiomelkimfc.com.br;
falta só o certificado HTTPS sair (automático) e marcar "Enforce HTTPS"
nas configurações do Pages (ver "Ao publicar", item 5).

---

## Como rodar e testar

```bash
python3 -m http.server 8880 --bind 0.0.0.0
```

Depois abrir `http://localhost:8880/index.html`. Para testar no celular na mesma
rede, trocar `localhost` pelo IP local da máquina.

**Cache-busting:** todo CSS/JS local e as imagens dos slots da hero são carregados
com `?v=N` na URL. Ao alterar um desses arquivos, subir o número em **todas** as
ocorrências no `index.html` (é um `sed` de uma linha) — sem isso o navegador serve
a versão antiga do cache e a mudança parece não ter feito efeito. Isso já mordeu
mais de uma vez neste projeto, inclusive entre sessões diferentes mexendo ao mesmo
tempo: se uma mudança parecer "não ter funcionado", suspeitar do cache antes de
tudo.

## Estrutura

Reorganizada em 22/09/2026 pela skill `/organizar-projeto` — se algo abaixo não
bater com o disco, o disco está certo e isto ficou desatualizado.

```
index.html                     ← a página inteira; site de uma página só
robots.txt, sitemap.xml        ← adicionados na revisão de SEO/performance
                                  (22/09/2026); apontam para a URL do GitHub
                                  Pages — atualizar se o domínio próprio for
                                  conectado (ver "Ao publicar")
assets/
  css/design-system/           ← tokens, animações, efeitos, componentes
  css/site/                    ← CSS específico de cada seção do site
  js/design-system/            ← idem, em JS
  js/site/                     ← idem, em JS
  img/
    hero/                      ← imagens da manchete + originais brutos antes
                                  do recorte (caio-cuidando.png,
                                  comunidade-header.png, pessoa-por-inteiro.png)
    pilares/                   ← card-1 a card-5, os 5 cards de "Os pilares"
    especialidade/              ← esp-apoio.jpeg (desktop, tira 4:1) e
                                  esp-apoio-mobile.jpeg (celular, 3:2, ver
                                  commit af2fb3f) + o original bruto antes do
                                  corte (esp-apoio-mobile-original.jpeg)
    fotos-caio/                ← todas as fotos do Caio — a que está em uso
                                  hoje (foto-principal-caio) e as demais, de
                                  reserva para trocar depois. A foto-8 tem
                                  versão sem fundo (recorte com IA, `rembg`,
                                  24/09/2026): foto-8-caio-sem-fundo.webp
                                  (em uso na divisória, 66 KB) e o .png
                                  original do recorte (reserva)
    certificados/               ← logos que eram usados na seção de
                                  certificados (removida do index.html em
                                  23/09/2026, ver "Estrutura de uma página tipo"); e os
                                  originais em certificados/originais/. Mantidas
                                  como reserva, não deletadas.
    atuacao/                   ← logos da seção "Experiência profissional"
                                  (carrossel `atuacao.css`/`.js`). Estado em
                                  23/09/2026, um arquivo por card, nessa ordem:
                                  logo-alice.jpg, logo-unifap.png,
                                  logo-faseh-puc-unibh.png,
                                  logo-nesocon-mais-medicos.png (Mais Médicos —
                                  a arte já traz a marca da NESCON, que
                                  coordena o programa),
                                  logo-unimed.png,
                                  logo-nesocon-preceptoria-mfc.png (NESCON
                                  UFMG). logo-nescon.jpg (a logo genérica
                                  antiga do card NESCON UFMG) ficou sem uso,
                                  mantida como reserva. Na revisão de
                                  performance de 22/09/2026, 5 das logos de
                                  então eram PNG opaco mal comprimido;
                                  convertidas para JPEG 85% cortou ~1,3 MB —
                                  sempre comparar JPEG x PNG, não assumir que
                                  um é sempre menor (foi por isso que
                                  logo-unimed.png ficou PNG).
    formacao/                  ← logos da seção de instituições acadêmicas
                                  (UFMG, Hertfordshire, McGill, HC-UFMG,
                                  Cruzeiro)
    marca/                     ← logo-creme-recortada.webp (a logo creme,
                                  sem margem, como <img> na divisória) e a
                                  logo do site em uso (logo-sem-fundo.png,
                                  usada como máscara), o ícone da Unimed e a
                                  logo do CNPq (cnpq-logo.png, 24/09/2026 —
                                  recortada e reduzida do PNG enviado pelo
                                  Iago; usada no card "Currículo Lattes
                                  completo" da seção de experiência) +
                                  variantes de reserva não usadas hoje
                                  (logo-fundo-preto, os três recortes antigos
                                  caio/dr/melki-hero, logo-unimed duplicado)
```

`_nao-publicar/` (raiz do projeto, fora de `assets/`) guarda o que não é o
site, organizada por assunto (reorganizada em 21/09/2026, revisitando a skill
`/organizar-projeto` — a raiz do projeto ainda tinha `robots.txt`/
`sitemap.xml`/`CLAUDE.md` soltos, mas esses ficam ali de propósito, ver abaixo):

```
_nao-publicar/
  templates/        ← 182 MB de sites de terceiros clonados como referência
                       de design — gitignored, nunca teve histórico
  certificados/      ← fonte do bloco de certificados que existiu no
                       index.html até 23/09/2026 (removido, ver "Estrutura de
                       uma página tipo"): os artboards de design (main.dc.html =
                       ACLS, conduct.dc.html = CONDUCT, canvas.json os
                       organiza), o certificados-caio-melki.html (canvas
                       publicado via Claude Code com o estado editável) e o
                       sincronizar-certificados.py que injetava o resultado
                       no index.html entre os marcadores
                       certificados:inicio/fim — esses marcadores não existem
                       mais no index.html; para trazer a seção de volta,
                       teriam que ser recriados antes de rodar o script
  rascunhos/         ← versões antigas/testes sem uso (design_system2.html,
                       teste-sintomas.html, section-nuvem-aura.html)
  brief/             ← o brief original do projeto
                       (estrutura-e-conteudo-site-caio-melki.md)
  relatorios/         ← saídas de comandos de revisão (ex.: os relatórios do
                       /revisar-performance, um por data)
```

`CLAUDE.md`, `DECISOES.md`, `aprendizados.md` e `memoria.md` ficam soltos na
raiz do projeto (fora de `_nao-publicar/` e de `assets/`), de propósito — é
onde a skill `/organizar-projeto` os deixa e onde o Claude Code carrega o
`CLAUDE.md` automaticamente. `robots.txt` e `sitemap.xml` também ficam soltos
na raiz porque só funcionam ali (é assim que o Google os encontra) — nenhum
desses seis arquivos é o site, mas nenhum é descartável, e nenhum pode virar
subpasta sem quebrar alguma coisa (ver `DECISOES.md` se quiser o raciocínio
completo).

Nada em `img/` marcado acima como "de reserva" é lixo — é material mantido de
propósito para o Caio trocar fotos/logos depois sem precisar gerar de novo.
Só não está linkado em `index.html` hoje.

## Identidade visual

Fontes: **Inter** (interface e títulos), **Instrument Serif** (só citações e
depoimentos — nunca em interface), **Courier Prime** (só valores técnicos/tokens).

```
--paper-100: #FBFAF7   --ink-900: #1F2420   --sage-700: #3E5C44
--paper-200: #F4F2EC   --ink-700: #3D453E   --sage-600: #4F7355
--paper-300: #E9E6DC   --ink-500: #6E766C   --sage-400: #7FA382
--paper-400: #D8D4C7   --ink-300: #9DA49A   --sage-200: #C3D8C2
                       --ink-200: #BFC4BB   --sage-100: #E2EDE0
--moss-900: #2A302A    --sand-300: #E8DFCD  --sky-400: #7FA3B8
--moss-700: #39423A    --sand-500: #CDBFA2  --sky-200: #C7DAE4
```

Definidas em `assets/css/design-system/tokens.css` — essa é a fonte da verdade,
esta tabela é só um resumo de consulta rápida.

## Estrutura de uma página tipo

Não se aplica — é site de página única. As seções de `index.html`, na ordem:
hero → especialidade (01) → sintomas/nuvem de busca (02) → pilares (5 cards,
GSAP Flip) → **divisória "sobre mim"** (`#divisoria`, faixa verde curta) →
formação/instituições (03) → experiência profissional (05,
carrossel de atuação + link do Lattes como fecho) → agendar (06) → rodapé.

**Divisória "sobre mim" (24/09/2026, `divisoria.css`).** Separa os temas
gerais de MFC do currículo do Caio. Layout da ref-1 (dralexandre): logo à
esquerda, foto do Caio no centro, nome + CRM/RQE + frase à direita; no
celular empilha (logo → texto → foto). A logo vira "Sobre mim" no hover e é
um link para `#formacao`. Fundo verde diagonal (135°, `--sage-600` →
`--sage-700`, o mesmo verde dos cards de formação). **Topo esfumaçado,
base reta, de propósito** (decisão do Iago): o topo nasce do creme da página
e vira verde aos poucos; a base encosta em "Formação" numa linha reta, com a
foto apoiada nela — a imagem é 14% maior que o espaço e desce para fora da
seção (zoom, corte exatamente na borda). A sombra da foto fica no contêiner
`.divisoria__foto`, não na `<img>` (com máscara na img, a sombra saía
recortada num retângulo). Frase (definida pelo Iago, 24/09/2026): "Antes do
eco da queixa, vem o silêncio da escuta."

**Seção de certificados removida em 23/09/2026** (a pedido do Iago) — ficava
dentro da seção de experiência, entre o carrossel e o link do Lattes, com o
título "Experiência profissional **e certificados**" e o contador
"[ 6 frentes · 2 certificações ]". Removido do `index.html`: o bloco gerado
por `sincronizar-certificados.py` (incluindo os marcadores
`certificados:inicio`/`:fim`) e o `<script>` de `certificados.js` (que só
existia para redimensionar essas peças — sem elas, virou código morto).
**Mantido, sem alteração:** `certificados.css` continua linkado (o link do
Lattes usa a classe `.cert-lattes` dele); as imagens em
`assets/img/certificados/` e a fonte de produção em
`_nao-publicar/certificados/` (artboards, script) seguem guardadas como
reserva — nada foi apagado, só desconectado da página. Verificado com o
script de referências (0 quebradas) e navegador local (sem sobra de espaço
entre o carrossel e o Lattes, sem erro no console, sem requisição do JS
removido).

**Selo de status dos cards do carrossel de atuação, corrigido em
23/09/2026.** Antes, o texto "Em atividade" no topo do card não dizia
respeito ao vínculo em si — vinha do estado do carrossel
(`data-estado='ativo'`, ou seja, "é a vez desse card aparecer em foco"), então
todo card mostrava essa mesma frase, inclusive vínculos já encerrados. Agora
cada `.atuacao__vivo` carrega uma classe própria por card —
`--ativo` (bolinha verde pulsando, `@keyframes atuacaoPulsoVivo` em
`atuacao.css`, mesma mecânica de `.esp-painel__ponto` em `especialidade.css`)
ou `--encerrado` (bolinha cinza parada + o período, ex. "2024 – 2026") —
fixada no HTML, independente da posição no carrossel. Dados tirados do Lattes
do Caio (colado pelo Iago na conversa). Os dois cards que ficaram sem data na
primeira rodada foram fechados em 24/09/2026, direto pelo Iago (não pelo
Lattes): UNIFAP → ativo; PUC-MG · Faseh · Uni-BH → encerrado, 2023–2024.

**Legenda compacta nos cards com arte "empilhada" (24 e 25/09/2026).** 3
dos 6 cards do carrossel usam artes que empilham 2–3 marcas até o rodapé da
imagem — "03 PUC-MG·Faseh·Uni-BH", "04 Mais Médicos" (NESCON+Mais Médicos)
e "06 NESCON UFMG" (NESCON+Preceptoria). Nesses, o degradê padrão da
legenda (7rem de respiro antes do texto) tampa texto importante da própria
imagem ("unibh", "MÉDICOS PARA O BRASIL", "PRECEPTORIA EM MFC" — cada um
descoberto num momento diferente, sempre por print, nunca só medindo). Os
outros 3 (Alice, UNIFAP, Unimed) são um símbolo só, centralizado, com
espaço vazio embaixo — sem esse problema, não levam a classe. A imagem
continua de sangria (`cover`, igual em todos os 6 — uma tentativa de
encolhê-la pro topo só no card 03 foi revertida a pedido do Iago); o ajuste
é só na legenda: classe `.atuacao__legenda--compacta` (`atuacao.css`) tira
o respiro de cima. No card 03 o selo também foi encurtado ("03 • PUC ·
Faseh · UniBH" em vez do nome completo — sem isso ele quebrava em 2 linhas
no celular e a legenda voltava a invadir a imagem); os outros dois não
precisaram disso (selo mais curto).
Também 25/09/2026: a roda de pílulas e o baralho de cards encolheram no
celular (`@media max-width:640px`) pra caber juntos numa tela só — antes
passavam de 820px de altura somados. Cuidado se for mexer de novo:
`.atuacao__roda` tem um piso de altura PRÓPRIO (320px, separado do piso do
`.atuacao__trilho` que o contém) — bloqueado no mobile por dentro desse
mesmo bloco, senão ele sozinho anula qualquer redução no trilho.
Armadilhas de CSS registradas em `memoria.md`, vale reler antes de mexer
de novo nesse componente: medir a altura de um elemento logo após um
clique que dispara transição dá número instável até a transição terminar
de verdade; duas regras de mesma especificidade — a que vem depois no
arquivo ganha, mesmo "parecendo" menos específica (por isso o seletor
`.atuacao__legenda.atuacao__legenda--compacta` é reforçado, pra não perder
pra regra de celular que fica no fim do arquivo); e o número de versão
(`?v=`) é compartilhado com outras sessões trabalhando no mesmo projeto ao
mesmo tempo — sempre conferir o valor real com `grep` antes de bumpar, não
assumir a partir da última leitura.

## Cuidados de CSS

- O cursor customizado (`assets/js/design-system/cursor.js`) mede a luminância
  do que está *de fato* sob o ponteiro (elemento real, gradiente incluído) para
  decidir se fica claro ou escuro — não é uma lista fixa de seções. Seção nova
  escura já funciona sozinha; não precisa (e não deve) adicionar caso especial.
- `.marca` (logo do header e do rodapé) é desenhada com `mask-image:
  url(...)` — isso só funciona com o site servido por HTTP (servidor local
  ou publicado). Abrindo o `index.html` com duplo clique (`file://`), o
  navegador bloqueia a máscara e **a logo some sem aviso**. Se a logo
  "sumiu", conferir primeiro como a página foi aberta. Logo nova em seção
  nova: preferir `<img>` (como na divisória), que funciona em qualquer caso.
- A abertura da hero (portas + digitação do título) depende de um aviso
  (`portas:abertas`) disparado por `intro.js`. Qualquer efeito que precise
  esperar a abertura terminar deve ouvir esse evento, e não inventar seu próprio
  cronômetro. Existe também `portas:meio` (25/09/2026), disparado na metade do
  movimento das portas — é dele que a digitação "Oi, sou o Caio" larga, a
  pedido do Iago (antes esperava o fim + 160ms, ~1,2s parada; agora ~0,5s).
- `.navbar` tem `transform: translateY(0)` depois do fade-in de entrada
  (`nav-load`/`.loaded` em `animations.css`) — parece "sem efeito", mas
  qualquer elemento com `.navbar` como ancestral que use
  `position: fixed; inset: 0` vai se posicionar em relação ao `.navbar` (bem
  menor que a tela), não à janela. É por isso que `.navbar__links` no modo
  celular usa `width: 100vw; height: 100dvh` em vez de `inset: 0`. Qualquer
  novo painel/overlay de tela cheia dentro do navbar precisa do mesmo cuidado.
- Larguras de corte (`@media`) usadas hoje no site, por arquivo — **não são
  um padrão, são o estado real**, herdado de quando cada seção foi construída
  em momentos diferentes: 640, 660, 720, 767, 860, 900, 1000, 1080, 1100,
  1140, 1279px. Ao mexer numa seção, não inventar uma largura nova — checar
  o que as seções vizinhas já usam com `grep -n "@media" assets/css/site/*.css`
  antes de decidir.

## Mobile

Em andamento (começado em 22/09/2026) — o site foi construído pensando em
desktop primeiro. Plano de trabalho e o que já foi feito/falta: ver
`memoria.md`. Primeira correção feita: existia um buraco funcional grave,
não só estético — abaixo de 940px o menu de navegação simplesmente
desaparecia, sem nenhum jeito de trocar de seção no celular (corrigido com
um menu de painel cheio, ver `assets/js/design-system/interactions.js`).

## Mídia

Sem padrão fechado ainda para fotos novas (JPEG, ~85% de qualidade, lado maior por
volta de 1600–1900px vem sendo usado nas imagens dos cards e da hero, mas não foi
formalizado). Perguntar/definir se entrar mais fotos no projeto.

Na revisão de performance de 22/09/2026 (`/revisar-performance`), os 5 cards de
`img/pilares/` estavam em ~85% de qualidade mas com dimensão maior que o
necessário para o tamanho exibido — recomprimidos para JPEG 82% (848×1264px
mantidos), cortando ~65% do peso (de ~3,2 MB para ~1,07 MB somados) sem perda
visível. Checado antes de aplicar: comparação lado a lado da imagem
recomprimida com a original.

## SEO e performance

Revisão feita em 22/09/2026 (`/revisar-performance`). O que já está no ar:
- `<link rel="canonical">`, tags Open Graph e `twitter:card` no `<head>`,
  apontando para a URL do GitHub Pages.
- Dado estruturado `schema.org/Physician` (JSON-LD) com nome, CRM/RQE,
  cidade/UF e especialidade — só com dado que já estava na própria página.
  **Sem endereço nem telefone**, porque a página não os divulga (rodapé marca
  "WhatsApp a definir"); completar o bloco `address` no `<head>` do
  `index.html` se isso mudar.
- `fetchpriority="high"` na foto da hero (candidata real a LCP — a mais
  importante da primeira tela) e `loading="lazy"` + `decoding="async"` nas
  imagens abaixo da dobra que ainda não tinham (cards do baralho de pilares
  no desktop, logos de formação e de trajetória).
- `robots.txt` e `sitemap.xml` na raiz, publicados pelo workflow (ver "Ao
  publicar").

**Pendência, adiada de propósito:** seção de perguntas frequentes — o Caio
quer adicionar, mas como conteúdo novo (perguntas + respostas certas), não
como parte desta revisão técnica.

**Teste real do PageSpeed Insights (21/09/2026), depois das correções acima
já publicadas:** Desempenho 62 (celular) / 94 (computador), Acessibilidade
96/93, Práticas recomendadas 100/100, SEO 100/100. Relatório completo em
`_nao-publicar/relatorios/pagespeed-report-2026-09-21.md`. Maior oportunidade que ainda
falta: os 3 scripts de CDN (lucide, three.js, GSAP) têm cache curto — hospedar
localmente em `assets/js/vendor/` é o próximo ganho de performance mais óbvio,
não feito ainda.

## Duplicação — saber antes de mexer

Sem duplicação relevante — página única, sem header/rodapé repetido em outro
arquivo.

## Ao publicar

**Publicação automática via GitHub Pages + GitHub Actions.** Basta enviar o
código:

```bash
git add -A
git commit -m "explicando o que mudou e por quê"
git push
```

Em alguns minutos (observado entre 1 e 6 minutos, o Pages costuma ser mais lento na primeira publicação e nas seguintes varia) o workflow `.github/workflows/deploy.yml` publica sozinho a
versão nova em https://fricheiago-ux.github.io/site-caio-melki/ — não existe
passo manual depois do push, e ninguém precisa entrar no GitHub para nada.

Como funciona por baixo:
1. O workflow roda a cada `git push` na branch `main` (também dá para forçar
   manualmente pela aba **Actions** do repositório no GitHub, botão
   "Run workflow", sem precisar de commit novo).
2. Ele monta uma cópia limpa só com `index.html` + `robots.txt` +
   `sitemap.xml` + `assets/css/` + `assets/js/` + `assets/img/`, e publica só
   essa cópia — **nunca** `assets/templates/` (182 MB, sites de terceiros clonados,
   está no `.gitignore` e nem chega a entrar no repositório) nem os arquivos
   soltos de rascunho listados em "Estrutura" acima.
3. Autenticação com o GitHub é feita pelo GitHub CLI (`gh`), já autorizado
   nesta máquina — nenhuma senha ou token é digitado em lugar nenhum a cada
   publicação.
4. Conferir sempre, depois de qualquer mudança de nome de arquivo, que nenhuma
   referência no HTML/CSS/JS aponta para um caminho inexistente e que o nome
   bate letra por letra com o do disco (Linux diferencia maiúscula/minúscula;
   macOS não) — GitHub Pages roda em servidor Linux.
5. Domínio próprio: conexão iniciada em 25/09/2026. Arquivo `CNAME` na raiz
   do repositório (conteúdo: `caiomelkimfc.com.br`) — o workflow copia ele
   para `_site/` igual ao `robots.txt`/`sitemap.xml`, senão cada publicação
   apagaria a configuração de domínio do Pages. `gh api -X PUT
   repos/fricheiago-ux/site-caio-melki/pages -f cname=caiomelkimfc.com.br`
   registrou o domínio nas configurações do Pages (o mesmo que preencher
   Settings → Pages → Custom domain na interface). **DNS na Hostinger:
   feito e conferido em 25/09/2026** — domínio raiz com só os 4 registros A
   do GitHub (185.199.108.153, .109.153, .110.153, .111.153, sem AAAA
   sobrando) e `www` também resolvendo para o GitHub. O site já abre em
   http://caiomelkimfc.com.br, ainda "Não seguro": o GitHub emite o
   certificado HTTPS sozinho (de minutos a ~24h). **Último passo, só o
   Iago:** quando o cadeado aparecer, marcar "Enforce HTTPS" em
   github.com/fricheiago-ux/site-caio-melki/settings/pages (a caixa fica
   cinza até o certificado sair). Depois disso, trocar a URL do GitHub
   Pages pela do domínio em `canonical`/Open Graph/JSON-LD do `index.html`,
   `robots.txt` e `sitemap.xml`.
