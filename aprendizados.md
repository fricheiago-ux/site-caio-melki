# Aprendizados — Site Caio Melki

Registro vivo de erros, decisões e coisas que eu faria diferente da próxima vez.
No fim do projeto, revisar esta lista com o Claude e decidir juntos o que vale virar
regra no `CLAUDE.md` global (`~/.claude/CLAUDE.md`) em vez de ficar só aqui.

Formato de cada entrada:

## [data] — [título curto do que aconteceu]

**O que aconteceu:** [o problema/decisão em 1-3 frases]

**O que eu entendi:** [a lição, em termos que eu (não-programador) entendo]

**Vale generalizar para o CLAUDE.md global?** [sim/não — por quê]

---

## 2026-09-21 — Cache do navegador mascarando mudanças já feitas

**O que aconteceu:** várias vezes uma correção foi aplicada no código, mas o
navegador continuou mostrando o comportamento antigo porque CSS/JS local é
carregado com `?v=N` na URL, e o número não tinha sido atualizado em todos os
lugares — inclusive um caso em que uma sessão paralela subiu o número enquanto
outra ainda estava testando com o número anterior.

**O que eu entendi:** se eu disser "não mudou nada" depois de uma correção, a
primeira suspeita não é o código estar errado — é o navegador estar servindo a
versão antiga do cache. Vale sempre recarregar ignorando o cache antes de discutir
se a correção funcionou.

**Vale generalizar para o CLAUDE.md global?** Parcialmente — a regra "testar em
servidor local, não com duplo clique" já existe globalmente (regra 3). O que é
específico daqui é o padrão `?v=N`; talvez valha uma nota global sobre
cache-busting em qualquer projeto que use esse padrão.

---

## 2026-09-21 — Pasta de referências (`assets/templates/`) quase foi parar no ar

**O que aconteceu:** ao planejar a publicação automática no Hostinger, percebemos
que `assets/templates/` (182 MB de sites de terceiros clonados, usados só para
extrair ideias de design no início do projeto) nunca foi excluída de nada — ela
não é usada pelo `index.html`, mas também nunca foi formalmente separada do
"projeto de verdade".

**O que eu entendi:** material de referência (sites de outras marcas/agências
copiados para estudo) precisa ficar claramente separado do que é publicável desde
cedo, e o momento de configurar deploy automático é exatamente quando isso vaza —
porque some o passo manual de "escolher o que enviar por FTP".

**Vale generalizar para o CLAUDE.md global?** Sim — a regra global 16 já fala de
nunca deixar nome de agência/marca de terceiro no *código* entregue; vale
reforçar que pastas inteiras de referência também não podem estar no caminho de
um deploy automático, e devem ser marcadas cedo no `CLAUDE.md` do projeto (seção
Estrutura) como "nunca publicar".

---

## 2026-09-22 — A "hospedagem contratada" era só o domínio

**O que aconteceu:** o pedido inicial partiu de "domínio e hospedagem já
contratados na Hostinger". Ao investigar juntos onde ficava a função Git, veio à
tona que só o domínio existe — a conta nunca teve uma hospedagem ativa (a prova
foi a própria Hostinger mostrar a vitrine de venda de planos ao clicar em
"Sites", tela que só aparece quando não há nenhuma hospedagem contratada).

**O que eu entendi:** premissa dada como fato no início de uma tarefa também
merece ser conferida, mesmo vindo de mim — nesse caso a checagem levou uns
poucos prints de tela e evitou configurar deploy para um destino que não existia.

**Vale generalizar para o CLAUDE.md global?** Sim, é o mesmo espírito da regra
global 6 ("não afirmar de memória o que dá para checar"), só que aplicado ao
contrário: quando o *usuário* afirma um fato de infraestrutura (domínio,
hospedagem, conta já configurada), vale confirmar com uma evidência concreta
antes de construir algo em cima dele, em vez de seguir direto para a
configuração.

---

## 2026-09-22 — O mobile ficou para trás, e isso custou caro de achar

**O que aconteceu:** o site foi construído pensando em desktop primeiro, sem
checar mobile seção por seção conforme cada uma nascia. Ao finalmente auditar,
o problema mais grave não era visual — era estrutural: abaixo de 940px, os
links do menu simplesmente desapareciam (`display:none`), sem nenhum botão de
menu no lugar. Um visitante no celular não tinha como navegar entre seções,
só rolar a página inteira na mão. Isso passou despercebido porque ninguém
tinha aberto o site num celular de verdade até agora.

**O que eu entendi:** "fazer o mobile depois" não é só ajustar espaçamento no
fim — pode esconder um buraco funcional (não só estético) que só aparece
quando alguém tenta *usar* o site na tela pequena, não só olhar para ela.
Auditar com `grep -c "@media"` em cada arquivo de CSS do site foi rápido e
revelou o problema antes mesmo de abrir o navegador: `busca.css` e
`effects.css` não tinham nenhuma regra de mobile, e as que existiam usavam
onze larguras de corte diferentes (640, 660, 720, 767, 860, 900, 1000, 1080,
1100, 1140, 1279px) sem nenhum padrão comum entre os arquivos.

**Vale generalizar para o CLAUDE.md global?** Sim, duas coisas: (1) a regra 8
já existia, mas faltava o *método* de auditoria rápida antes de sair
corrigindo — contar `@media` por arquivo e listar as larguras usadas revela
o estado real do projeto em segundos, antes de abrir um navegador; (2) o
próprio processo de "plano de ação de mobile" (auditar → ordenar por
severidade, não por ordem da página → corrigir o navegar-pela-página antes
de qualquer ajuste visual → verificar cada item por medição de verdade, nunca
só por print) vale virar um roteiro repetível para qualquer projeto que
chegue nessa situação.

## 2026-09-22 — `transform: translateY(0)` não é "sem transformação" para o CSS

**O que aconteceu:** ao construir o painel do menu mobile como
`position: fixed; inset: 0`, ele só ocupava a altura do próprio cabeçalho
(~150px) em vez da tela inteira. A causa: `.navbar` tem uma animação de
entrada que termina em `transform: translateY(0)` — visualmente parece "sem
efeito nenhum", mas para o CSS *qualquer* valor de `transform` diferente de
`none` faz aquele elemento virar o "containing block" dos filhos com
`position: fixed`. Ou seja, o painel parou de se posicionar em relação à
tela e passou a se posicionar em relação ao próprio `.navbar`, que é bem
menor.

**O que eu entendi:** um elemento pai com qualquer `transform` (mesmo uma
transformação identidade, "parada", vinda de uma animação que já terminou)
quebra `position: fixed` de filhos em relação à tela. A correção robusta é
não confiar em `inset: 0` dentro de uma árvore que pode ter transform em
algum ancestral — usar `width: 100vw; height: 100dvh` resolve, porque essas
unidades sempre olham para a janela de verdade, nunca para o elemento pai.

**Vale generalizar para o CLAUDE.md global?** Sim — é uma pegadinha de CSS
genérica, não específica deste site, e already há uma seção "Cuidados de CSS"
no `CLAUDE.md` global para exatamente esse tipo de regra.

<!-- próximas entradas vão aqui -->
