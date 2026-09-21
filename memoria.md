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
