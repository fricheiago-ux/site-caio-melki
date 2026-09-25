# Memória de resgate — Site Caio Melki

Fatos combinados no meio de uma conversa que **não podem se perder** quando o
contexto do chat compactar. Quando a janela de contexto estiver ficando cheia,
pedir para o Claude revisar se há algo importante da conversa que ainda não está
registrado aqui (ou no `CLAUDE.md` do projeto) antes de compactar.

Formato: uma linha por fato, com data.

- 2026-09-21 — Domínio e hospedagem já contratados na Hostinger. Objetivo: link
  fixo e sempre atualizado para o Caio revisar, sem reenviar arquivo nem ele abrir
  nada manualmente — publicação automática direto no host de verdade.
- 2026-09-21 — Regra do usuário: nunca pedir/colar senha de FTP ou da Hostinger
  no chat. A credencial fica guardada só na máquina do Iago (fora do git) ou é
  digitada por ele na hora, direto no terminal.
- 2026-09-21 — Git já estava inicializado neste projeto (branch `master`, ainda
  sem nenhum commit). Decisão pendente antes do primeiro commit: o que entra no
  repositório — em especial `assets/templates/` (182 MB, sites de terceiros
  clonados, nunca deve ir ao ar) e os arquivos soltos de rascunho na raiz.
- 2026-09-21 — Mecanismo de deploy ainda não decidido: depende de o plano da
  Hostinger ter a função "Git" no hPanel (deploy automático a cada `git push`) ou
  não (nesse caso, script de upload por SFTP, um comando só). Pendente perguntar
  ao Iago os detalhes do plano dele.
- 2026-09-22 — Domínio confirmado: caiomelkimfc.com.br (.com.br, ativo, renovação
  automática já configurada na Hostinger).
- 2026-09-22 — CORREÇÃO: não existe hospedagem contratada na Hostinger ainda,
  só o domínio (caiomelkimfc.com.br). Ao clicar em "Sites" no hPanel aparece a
  vitrine de venda de planos, o que só acontece quando a conta não tem
  nenhuma hospedagem ativa. Antes de configurar qualquer deploy, é preciso
  primeiro contratar um plano de hospedagem.
- 2026-09-22 — DECISÃO: abandonada a ideia de hospedar na Hostinger (não havia
  hospedagem contratada, só o domínio). Publicação será via GitHub Pages, com
  um workflow do GitHub Actions (`.github/workflows/deploy.yml`) que publica
  automaticamente a cada `git push` na branch `main`. O domínio
  caiomelkimfc.com.br pode ser apontado para o GitHub Pages depois, como
  passo separado.
- 2026-09-22 — Branch local renomeada de `master` para `main`. GitHub CLI
  (`gh`) instalado via Homebrew nesta máquina para criar o repositório e
  autenticar sem precisar colar senha/token em lugar nenhum.
- 2026-09-22 — CONFIGURADO E NO AR: repositório
  github.com/fricheiago-ux/site-caio-melki (público). Link fixo de revisão:
  https://fricheiago-ux.github.io/site-caio-melki/ — atualiza sozinho a cada
  `git push` na branch main, sem passo manual. Verificado ao vivo: página
  carrega, título certo, assets das 4 pastas resolvem, e rascunhos/pasta
  templates confirmadamente fora do ar (404).
- 2026-09-22 — Segundo deploy (via push normal, não manual) testado de ponta a
  ponta: funcionou sozinho, sem nenhum passo manual, mas levou uns 6 minutos
  até o link público mostrar a versão nova (confirmado pelo cabeçalho
  Last-Modified da página, não só pelo status do GitHub Actions). Vale
  esperar alguns minutos depois de um push antes de checar se "não
  funcionou".
- 2026-09-22 — PLANO DE AÇÃO DO MOBILE (auditoria feita, execução em
  andamento, ordem por severidade e não pela ordem da página):
  1. [FEITO] Menu de navegação mobile — não existia nenhum. Corrigido com
     painel de tela cheia (ver aprendizados.md).
  2. [A FAZER, alta prioridade — provável causa comum] Investigar os
     "buracos" de espaço em branco grandes antes de pelo menos duas seções
     (sintomas e pilares) — suspeita: `.section { padding-block: var(--sp-32) }`
     não reduz em telas estreitas. Corrigir isso pode resolver as duas de
     uma vez.
  3. [A FAZER] sintomas: campo de busca com o placeholder cortado
     ("Pesquise o que você está sentin...") em 375px de largura.
  4. [NÃO VERIFICADO] especialidade — tem 3 regras @media, não confirmadas
     visualmente ainda.
  5. [NÃO VERIFICADO] formacao/instituicoes — tem regras @media (1080/720px),
     não confirmadas visualmente.
  6. [NÃO VERIFICADO] trajetoria (carrossel `atuacao.css/js`) — funciona por
     arraste/toque, tem regras @media, comportamento touch não testado.
  7. [NÃO VERIFICADO] agendar + rodapé (`fechamento.css`) — só 1 regra
     @media no arquivo inteiro; seção com vários cartões/colunas, risco alto
     de não caber bem em tela de celular.
  8. [A LOCALIZAR] certificados — existe `certificados.css`/`.js` mas a
     seção não tem id próprio visível na varredura; achar onde ela mora na
     página antes de avaliar o mobile dela.
  9. [INVESTIGAR, não é bug de mobile] `assets/site/css/busca.css` tem 0
     regras @media e o seletor `.busca` não foi encontrado na página ao
     vivo — pode ser código morto de uma versão anterior da busca de
     sintomas. Confirmar antes de decidir se apaga.
  Larguras de corte hoje em uso, sem padrão único (ver CLAUDE.md, seção
  Cuidados de CSS): 640, 660, 720, 767, 860, 900, 1000, 1080, 1100, 1140,
  1279px.

- 2026-09-23 — Seção "Experiência profissional" (`#trajetoria`): reescrito o
  selo de status de cada card (antes era texto fixo "Em atividade" preso ao
  estado do carrossel — todo card dizia isso quando ficava em foco, mesmo
  vínculo já encerrado). Agora cada card tem classe própria
  `.atuacao__vivo--ativo` (bolinha verde pulsando, mesma animação de
  `.esp-painel__ponto` em especialidade.css) ou `.atuacao__vivo--encerrado`
  (bolinha cinza parada + o período). Fonte dos dados: Lattes do Caio,
  colado pelo Iago nesta conversa. Confirmado com o Iago (AskUserQuestion):
  os cards "Mais Médicos" e "NESCON UFMG" continuam sendo 2 cards
  separados — não veio um 7º card — só trocaram de logo para a arte que já
  vem com as duas marcas (NESCON+Mais Médicos e NESCON+Preceptoria),
  refletindo que são as duas experiências do Caio na NESCON.
  Mapeamento aplicado:
  - Alice Saúde → ativo, desde 2023.
  - Unimed-BH → ativo, desde 2026. Texto do corpo trocado para "Médico
    cooperado & Coordenador de operações em saúde digital" (pedido
    explícito do Iago).
  - Mais Médicos → encerrado, 2024–2026. Logo trocada para
    `logo-nesocon-mais-medicos.png`.
  - NESCON UFMG → ativo, desde 2026 (Coordenador Adjunto de Atividades
    Síncronas + Supervisor de Tutoria/Facilitação, Preceptoria em MFC).
    Logo trocada para `logo-nesocon-preceptoria-mfc.png`.
  - **UNIFAP → GAP, não preenchido.** Esse card não aparece em nenhum lugar
    do texto do Lattes que o Iago colou (nem a instituição, nem o período).
    O selo hoje mostra `[PERÍODO]` em vermelho (cor --danger), de propósito,
    em vez de eu inventar uma data. Precisa perguntar ao Caio.
  - **PUC-MG · Faseh · Uni-BH → GAP parcial, não preenchido.** O Lattes só
    tem entradas de PUC Minas (2020 e 2022, ambas isoladas, sem "Atual" —
    logo já encerradas) — nada de Faseh nem de Uni-BH. Como o card combina
    as 3 instituições num período só, não dá pra afirmar um intervalo sem
    saber quando começou/terminou em cada uma. Selo também em `[PERÍODO]`
    vermelho. Precisa perguntar ao Caio.
  `logo-nescon.jpg` (a logo antiga, genérica, do card NESCON UFMG) ficou sem
  uso — mantida em `assets/img/atuacao/` como reserva, não apagada (mesma
  convenção do resto do projeto).
  Verificado: servidor local, 6 imagens carregando (HTTP 200, complete=true,
  1080×1350 cada), dot com animation-name `atuacaoPulsoVivo` presente de
  fato no card ativo, texto/classe de cada badge lido via JS (não só
  olhando print), 0px de estouro horizontal em 375px de largura, sem erro
  no console.

- 2026-09-24 — Card "PUC-MG · Faseh · Uni-BH" (carrossel de atuação): a
  legenda (degradê + texto no rodapé do card) tapava a palavra "unibh" da
  imagem — único card cujas 3 logos empilhadas ocupam até o rodapé da arte
  (os outros 5 são um símbolo só, centralizado, com espaço vazio embaixo).
  Tentativa inicial (23/09): encolher a imagem pro topo do card
  (`object-fit: contain`) — o Iago pediu pra reverter, a imagem devia
  continuar de sangria (`cover`) como os outros cards. Revertido. Solução
  final: só a LEGENDA desse card ficou mais compacta — nova classe
  `.atuacao__legenda--compacta` (`atuacao.css`) tira o respiro de 7rem do
  degradê antes do texto, e o selo do card teve o texto encurtado ("03 •
  PUC · Faseh · UniBH" em vez de "03 • PUC-MG · Faseh · Uni-BH" — sem isso,
  o selo quebrava em 2 linhas no celular e a legenda voltava a invadir o
  "unibh"). Os outros 5 cards não têm a classe, continuam com o degradê
  padrão.
  Duas armadilhas encontradas no caminho, candidatas a virar regra global
  (perguntar ao Iago se registra em `~/.claude/CLAUDE.md`):
  1. **Medir imediatamente após um clique que dispara transição CSS dá
     número errado.** A legenda tem `transition: opacity/transform`; medir
     a altura logo após o clique (mesmo com `setTimeout` de ~900ms) pegou
     o card ainda em transição mais de uma vez, com valores que não se
     repetiam entre execuções idênticas. Só estabilizou esperando a
     transição terminar de verdade e conferindo `opacity:1`/
     `transform:none` computados antes de confiar na medida.
  2. **Duas regras de mesma especificidade (uma classe só) — a que vem
     depois no arquivo ganha, independente de qual "parece" mais
     específica.** `.atuacao__legenda--compacta` e a
     `@media(max-width:640px) .atuacao__legenda` (a media query vem depois
     no arquivo, por causa da regra de media queries no fim do bloco) têm a
     mesma especificidade (0,1,0) — a media query ganhava no celular,
     silenciosamente. Corrigido reforçando a especificidade do modifier
     para `.atuacao__legenda.atuacao__legenda--compacta` (0,2,0), que
     ganha em qualquer ordem.
  Verificado: servidor local, card em estado assentado (não em transição):
  desktop 1100px de folga +5,4pp entre o fim do "unibh" e o topo da
  legenda; mobile 375px +0,8pp; 0px de estouro horizontal; sem erro no
  console; os outros 5 cards confirmados sem a classe `--compacta`,
  continuam com os 112px de respiro padrão.

- 2026-09-24 — Os dois GAPs de período do carrossel de atuação (ver entrada
  de 2026-09-23) foram fechados pelo Iago, direto no chat (não veio do
  Lattes — o Lattes continua sem UNIFAP e sem Faseh/Uni-BH, só cobre PUC
  Minas isolada): **UNIFAP → ativo** ("Em atividade"); **PUC-MG · Faseh ·
  Uni-BH → encerrado, 2023 – 2024**. Os dois `[PERÍODO]` em vermelho
  sumiram do site. Verificado nos 6 cards via servidor local (texto, classe
  --ativo/--encerrado e cor de cada selo lidos do DOM), sem erro no
  console.

- 2026-09-24 — Três ajustes visuais na seção "Experiência profissional",
  pedidos pelo Iago: (1) fundo da seção agora é `var(--paper-200)`, igual à
  seção "Formação" logo acima — as duas ficam com o mesmo tom bege, uma
  emenda visual mais suave entre elas; (2) os cards do baralho (`.atuacao__
  baralho`) encolheram 15%, de 420px pra 357px de largura máxima; (3) os
  cards de trás no baralho perderam o filtro `grayscale+blur+brightness`
  que tinham — ficam só com a opacidade 0.4 que já existia (herdada de
  `.atuacao__card[data-estado='antes'/'depois']`), sem desfoque.
  Verificado no servidor local, desktop e mobile: fundo das duas seções
  idêntico (`rgb(244,242,236)`), `max-width` do baralho em 357px nos dois
  tamanhos de tela, `filter: none` nos cards de trás com a opacidade 0.4
  mantida, 0px de estouro horizontal no mobile, sem erro no console.
  **Soluço de cache à parte, sem explicação clara:** ao subir o `?v=` de 79
  pra 80 (mudança normal, uma vez só), o navegador serviu a versão VELHA do
  CSS mesmo com a query string nova — confirmado comparando a resposta real
  do servidor (`curl`/`fetch` direto bateu certo) contra o que o
  `document.styleSheets` do navegador tinha carregado (errado). Bumpar de
  novo pra `?v=81` resolveu. Não investiguei a causa raiz a fundo (não valia
  o tempo desta vez) — se acontecer de novo, vale investigar se é algo
  específico do navegador de teste desta sessão ou do próprio
  `python3 -m http.server`.

- 2026-09-24 — Período do card "PUC-MG · Faseh · Uni-BH" corrigido de novo
  pelo Iago: era 2023–2024, agora **2020–2025**. Mesmo dia da rodada
  anterior — ele reconsiderou a data depois de já ter enviado a primeira.
  Verificado direto no card via servidor local.

- 2026-09-24 — Espaçamento entre "Minha formação acadêmica" e "Experiência
  profissional" reduzido pela metade, a pedido do Iago (achou grande
  demais). Cada seção tem 8rem (128px) de respiro padrão em cima e embaixo
  (`.section { padding-block: var(--sp-32) }` em `components.css` — existe
  até um `.section--tight` pronto pra 6rem, mas não usei porque afetaria os
  DOIS lados de cada seção, e eu só queria apertar o lado que elas dividem).
  Em vez disso, só as bordas que se tocam encolheram, via style inline:
  `padding-bottom:var(--sp-16)` (4rem) no `#formacao` e
  `padding-top:var(--sp-16)` no `#trajetoria` — o respiro contra os
  vizinhos de cada uma (pilares acima, FAQ abaixo) ficou intocado.
  Verificado: a distância real entre o fim da grade de instituições e o
  título "Experiência profissional" caiu de 256px pra 128px (medida com
  `getBoundingClientRect`, não só no olho), confirmada igual em mobile
  (375px) e desktop (1200px), 0px de estouro horizontal, sem erro no
  console.

- 2026-09-25 — REVERTIDO o tamanho dos cards do carrossel de atuação: a
  redução de 15% (420px → 357px) de 24/09 voltou pro valor original (420px).
  Causa: a legenda de cada card tem altura fixa em px/rem — encolher o CARD
  sem encolher a legenda junto faz o texto ocupar uma fatia bem maior da
  imagem. No card do NESCON, a legenda passou a cobrir 63% do card (era
  ~48%) e tapou a palavra "Preceptoria"; no card PUC-MG·Faseh·UniBH voltou a
  cobrir o "unibh" que já tinha sido resolvido no dia anterior. O Iago
  reportou visualmente e pediu pra voltar. Verificado nos 6 cards, desktop e
  mobile: card de volta a 420×525 (proporção mantida), legenda de volta a
  ~51,6% nos 5 cards padrão, folga de +2,0pp (desktop) / +5,9pp (mobile)
  acima do "unibh" no card compacto — mesma faixa seguro medida em 24/09.
  **Descoberta nova sobre o ambiente de teste desta sessão:** o navegador
  usado para verificar mudou a se recusar a rebuscar `index.html`
  (o documento em si, não só os CSS/JS com `?v=`) mesmo depois de trocar a
  versão e navegar de novo pra mesma URL — o servidor sempre respondia
  certo (confirmado com `fetch`/`curl` direto), mas o DOM carregado ficava
  preso numa versão anterior do HTML. Só resolveu navegando pra uma URL
  com uma query string nunca usada antes (`?forcar=N`). Se isso voltar a
  acontecer, tentar isso antes de desconfiar do código.
