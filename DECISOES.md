# Decisões do projeto — Site Caio Melki

Por que o projeto é do jeito que é, incluindo o que foi descartado no caminho.
Para "faça assim", ver `CLAUDE.md`. Isto aqui é o "é assim porque…".

**Aviso sobre a fonte.** O `git log` deste projeto tem só 9 commits, todos de
21 e 22/09/2026 — cobrem a reta final (publicação, o menu mobile, um bug de
altura, a reorganização de pastas). O site em si foi construído ao longo de
semanas de conversa, antes de existir um repositório git aqui: o design
inteiro (hero, portas de abertura, os cinco pilares, a nuvem de sintomas,
o cursor, a digitação) não tem histórico de commit nenhum — o primeiro commit
já entrou com tudo isso pronto, como uma foto única. Para essas decisões mais
antigas, a fonte não é o git, é o comentário que já existe em cada arquivo de
código (este projeto documenta bem o "por quê" direto no CSS/JS) e o que ficou
registrado em `aprendizados.md`/`memoria.md`. Cada entrada abaixo diz de onde
veio.

---

## 1. O que é o projeto

Site institucional de página única do Dr. Caio Ribeiro Melki, médico de
família e comunidade em Belo Horizonte — estático, sem etapa de build.
Publicado em **https://fricheiago-ux.github.io/site-caio-melki/**, via GitHub
Pages, atualizado automaticamente a cada `git push` (confirmado ao vivo nesta
sessão: repositório conectado, workflow rodando, página respondendo).

---

## 2. Decisões estruturais

### 2.1 — Hospedagem: Hostinger descartada, GitHub Pages no lugar

**Decidido:** publicar via GitHub Pages + GitHub Actions, de graça, sem
depender de nenhum servidor contratado.

**Descartado, e por quê:** a ideia original era usar a hospedagem da
Hostinger, que o Iago informou já estar contratada junto com o domínio. Ao
investigar (commits `96d3afa`, `21cab34`; `aprendizados.md`,
2026-09-22), veio à tona que só o domínio existia — a conta nunca teve
hospedagem ativa. A prova foi a própria Hostinger mostrar a vitrine de venda
de planos ao clicar em "Sites" no painel, tela que só aparece quando não há
nenhuma hospedagem contratada.

**Se fosse revertido hoje:** voltaria a depender de contratar um plano pago
na Hostinger e configurar deploy por Git nativo do hPanel ou por SFTP —
nenhum dos dois foi implementado, então reverter significa recomeçar essa
parte do zero.

**Status:** vigente. Verificado nesta sessão: `git remote -v` aponta para
`github.com/fricheiago-ux/site-caio-melki`, e a URL pública responde 200.

### 2.2 — O que é publicado: um subconjunto do repositório, não ele inteiro

**Decidido:** o workflow `.github/workflows/deploy.yml` monta uma cópia
limpa antes de publicar — só `index.html` + `assets/css/` + `assets/js/` +
`assets/img/`. Nada mais do repositório vai ao ar.

**Descartado, e por quê:** publicar o repositório inteiro tal como está
colocaria no ar `_nao-publicar/` inteira, incluindo `templates/` (182 MB de
sites de outras marcas clonados como referência de design) e os documentos
internos do projeto (`CLAUDE.md`, `aprendizados.md`, `memoria.md`). Isso foi
identificado como risco antes de acontecer (`aprendizados.md`, entrada
"Pasta de referências quase foi parar no ar").

**Se fosse revertido hoje:** a próxima publicação exporia publicamente
material de terceiros e as anotações internas do projeto no mesmo domínio do
Caio.

**Status:** vigente. Verificado nesta sessão: `curl` na URL pública para
`_nao-publicar/templates/` devolve 404.

### 2.3 — Estrutura de pastas: por seção do site, não por origem histórica

**Decidido (commit `77f88e2`, 22/09):** `assets/` organizado em `css/`,
`js/` e `img/`, cada um com subpastas — `img/` especificamente por seção do
site (`hero/`, `pilares/`, `especialidade/`, `fotos-caio/`, `certificados/`,
`atuacao/`, `formacao/`, `marca/`), preservando a divisão entre "design
system" (`design-system/`, reutilizável) e "site" (`site/`, específico deste
projeto) como subpasta dentro de `css/` e `js/`, em vez de dois troncos
separados.

**Descartado, e por quê:** manter `design-system-2/`, `site/`, `imagens/`,
`logos/` e `site/img/` como pastas de topo separadas — era o estado antes da
reorganização. Funcionava, mas misturava a origem histórica de cada pasta
(quando ela foi criada) com o que ela guarda hoje, e imagens do mesmo assunto
ficavam espalhadas em três lugares diferentes (`imagens/`, `logos/`,
`site/img/`).

**Se fosse revertido hoje:** bastaria desfazer o commit `77f88e2` — ele é só
estrutura, sem mudança de comportamento, então reverter é seguro e não
quebra nada além dos caminhos.

**Status:** vigente. Verificado nesta sessão em três camadas (script estático
da skill, servidor local com checagem de rede, e a publicação ao vivo) — sem
nenhuma referência quebrada.

### 2.4 — Mídia sem uso: guardada, não descartada

**Decidido:** dez das doze fotos do Caio, as imagens originais antes do
recorte dos slots da hero, algumas variantes antigas de logo, e cinco
arquivos de CSS/JS que não são carregados por nenhuma página hoje (`busca.css`,
`condicoes.css`, `condition-search.js`, `conditions-data.js`, `carousel.js`)
continuam no projeto, dentro de `assets/`, junto com o que está em uso.

**Descartado, e por quê:** a alternativa óbvia seria mover tudo isso para
`_nao-publicar/` junto com o material de referência. Não foi feito porque o
Iago pediu explicitamente para não descartar nada ainda — são candidatos a
reuso (trocar uma foto, retomar a busca por texto), não lixo.

**Se fosse revertido hoje:** mover esses arquivos para `_nao-publicar/` é
seguro (nada os referencia), mas dificultaria achá-los se algum dia forem
reaproveitados.

**Status:** vigente, por decisão explícita do Iago (22/09).

### 2.5 — Seção de certificados: gerada por script, não escrita à mão

**Decidido:** o bloco de certificados dentro da seção "Experiência
profissional" (dentro de `#trajetoria`, sem id próprio) é gerado por
`sincronizar-certificados.py` a partir de `certificados-caio-melki.html` — o
HTML final fica entre os marcadores `<!-- certificados:inicio -->` e
`<!-- certificados:fim -->` dentro do próprio `index.html`.

**Descoberto, não decidido nesta sessão** — verificado agora ao investigar
onde a seção morava (não tinha sido localizada quando o plano de mobile foi
escrito). Os arquivos de origem (`certificados-caio-melki.html`,
`sincronizar-certificados.py`, e os artboards de design `main.dc.html`/
`conduct.dc.html`/`canvas.json` que geraram as imagens dos certificados) estão
em `_nao-publicar/certificados/`, por não serem HTML/CSS/JS que o navegador
carrega — mas continuam sendo a fonte de verdade daquele trecho.

**Se for editado sem saber disso:** alguém pode editar o bloco de
certificados direto no `index.html` manualmente, e essa edição some na
próxima vez que o script rodar de novo a partir do arquivo de origem.

**Status:** vigente, mas **pendência de documentação** — isso ainda não está
descrito na seção "Estrutura" do `CLAUDE.md`. Registrar lá é o próximo passo
óbvio, fora do escopo desta skill.

---

## 3. Erros cometidos e o que os corrigiu

### 3.1 — Menu de navegação inexistente no celular

Abaixo de 940px de largura, os links do menu simplesmente desapareciam
(`display: none`), sem nenhum botão no lugar — não era um ajuste visual
faltando, era impossível navegar entre seções no celular. Corrigido no
commit `d6f4490` com um painel de menu de tela cheia, aberto por um botão de
hambúrguer, reaproveitando o mesmo `<nav>` sem duplicar links.

**Levou duas tentativas dentro do mesmo commit:** a primeira versão do painel
usava `position: fixed; inset: 0` e só ocupava a altura do próprio cabeçalho
(~150px), não a tela inteira. Causa: `.navbar` tem uma animação de entrada
que termina em `transform: translateY(0)` — para o CSS, qualquer valor de
`transform` diferente de `none` faz aquele elemento virar a referência de
posição ("containing block") de filhos com `position: fixed`, mesmo que a
transformação pareça "parada". Corrigido trocando para `width: 100vw;
height: 100dvh`, que sempre olham para a janela real. Ver `aprendizados.md`,
2026-09-22.

### 3.2 — Altura de painel travada para sempre

Na seção de sintomas, abrir a resposta de uma palavra media a altura uma vez
e esperava o evento `transitionend` do CSS para soltar essa altura e deixá-la
livre. Se esse evento não disparasse por qualquer motivo, a altura ficava
presa para sempre naquele valor — e qualquer mudança real de conteúdo depois
(fonte do Google terminando de trocar, ícone chegando um instante depois)
deixava uma sobra de espaço sem se corrigir sozinha. Reportado pelo Caio como
"espaço em branco no fim da seção" depois de clicar numa palavra. Corrigido
no commit `749d799` com um temporizador de segurança que solta a altura de
qualquer jeito, pouco depois da duração da transição — reproduzido e
confirmado: sem a correção a altura travava para sempre num ambiente onde o
evento não dispara; com ela, solta em ~550ms sozinha.

### 3.3 — Expectativa de tempo de publicação errada

O `CLAUDE.md` chegou a afirmar que a publicação levava "até um minuto".
Testado de ponta a ponta duas vezes (commit `291e776`): a primeira
publicação levou uns quatro minutos, a segunda uns seis — medido pelo
cabeçalho `Last-Modified` da página ao vivo, não só pelo status do GitHub
Actions. A afirmação foi corrigida para "alguns minutos, varia" antes de
virar uma fonte de confusão futura.

---

## 4. Limites descobertos na prática

- **Onze larguras de corte diferentes** (`@media`) coexistem no CSS do site
  hoje: 640, 660, 720, 767, 860, 900, 1000, 1080, 1100, 1140, 1279px — cada
  seção herdou a largura que fazia sentido no momento em que foi construída,
  sem padrão comum entre elas. Não chegou a causar bug até agora, mas
  qualquer ajuste futuro de mobile precisa checar o que as seções vizinhas já
  usam antes de inventar mais uma largura (documentado em `CLAUDE.md`,
  "Cuidados de CSS").
- **`.section { padding-block: var(--sp-32) }`** (128px) não tem nenhuma
  redução para telas estreitas em todo o design system — confirmado nesta
  sessão (`assets/css/design-system/components.css`, linha 13, sem
  `@media` associado). Isso por si só **não é** a causa do bug do item 3.2
  (medido: a sobra de espaço no fim da seção de sintomas era 96px tanto com
  o painel aberto quanto fechado, ou seja, constante) — mas continua sendo
  um padding grande para celular, e vale revisar quando o plano de mobile
  chegar nas seções ainda não verificadas.

---

## 5. Pendências em aberto

Herdadas de `memoria.md` (plano de ação do mobile, 22/09) e revisadas agora —
o que já mudou de status está marcado:

1. ~~Menu de navegação mobile~~ — feito (3.1).
2. Espaço em branco antes de seções no celular (sintomas, pilares) —
   **parcialmente investigado nesta sessão**: não é um bug de interação (ver
   item 4 acima); pode ainda ser, simplesmente, um padding grande demais
   para tela pequena. Falta decidir se isso incomoda visualmente e, se sim,
   reduzir `--sp-32` num `@media` para telas estreitas.
3. Campo de busca da seção de sintomas com o texto de exemplo cortado em
   375px de largura — não verificado de novo nesta sessão.
4. Seções "especialidade", "formação/instituições" e "trajetória" (carrossel
   por toque) — mobile ainda não confirmado visualmente.
5. Seção "agendar + rodapé" (`fechamento.css`) — só uma regra `@media` no
   arquivo inteiro; risco alto de não caber bem em tela de celular, ainda
   não testado.
6. Domínio próprio (`caiomelkimfc.com.br`) registrado mas não apontado para
   o GitHub Pages — passo futuro opcional, não feito.
7. Padrão de mídia para fotos novas (dimensão, compressão) nunca foi
   fechado com o Iago — `CLAUDE.md`, seção "Mídia", ainda em aberto.
8. Documentar a seção de certificados (2.5 acima) no `CLAUDE.md`.

**Custo de continuar sem decidir os itens 2 a 5:** o site pode ter problemas
reais de uso no celular em seções ainda não visitadas por ninguém no
processo de revisão — o mesmo tipo de buraco que o menu de navegação
escondia até ser auditado.

---

## 6. O que faríamos diferente

- Testar mobile seção por seção **enquanto** cada uma era construída, não
  todas de uma vez no fim — o buraco do menu de navegação (3.1) é
  exatamente o tipo de problema que passa despercebido quando ninguém abre
  o site num celular de verdade até o projeto já estar quase inteiro pronto.
- Inicializar o git no primeiro dia do projeto, não perto do fim — é a
  razão direta deste `DECISOES.md` não conseguir reconstruir nenhuma decisão
  de design anterior a 21/09 a partir do histórico.
- Confirmar premissas de infraestrutura ("já tenho hospedagem contratada")
  com uma evidência concreta assim que aparecem na conversa, e não só quando
  se torna necessário configurar algo em cima delas.
