# Site Caio Melki — regras deste projeto

Complementa o `CLAUDE.md` global. Onde houver conflito, **este arquivo vence**.

Site institucional do Dr. Caio Ribeiro Melki, médico de família e comunidade em
Belo Horizonte. Estático, sem etapa de build — é `index.html` puro com CSS e JS
próprios. No ar em **https://fricheiago-ux.github.io/site-caio-melki/**, via
GitHub Pages, publicado automaticamente a partir do repositório
[fricheiago-ux/site-caio-melki](https://github.com/fricheiago-ux/site-caio-melki)
(público). O domínio **caiomelkimfc.com.br** está registrado na Hostinger mas
ainda não aponta para cá — apontar é um passo futuro opcional, não feito ainda.

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
    especialidade/              ← esp-apoio.jpeg
    fotos-caio/                ← todas as fotos do Caio — a que está em uso
                                  hoje (foto-principal-caio) e as demais, de
                                  reserva para trocar depois
    certificados/               ← logos usados na seção de certificados, e
                                  os originais em certificados/originais/
    atuacao/                   ← logos da seção "Minha trajetória" (Alice,
                                  Unimed, Mais Médicos, Nescon, Unifap, Faseh)
    formacao/                  ← logos da seção de instituições acadêmicas
                                  (UFMG, Hertfordshire, McGill, HC-UFMG,
                                  Cruzeiro)
    marca/                     ← a logo do site em uso (logo-sem-fundo.png,
                                  usada como máscara) e o ícone da Unimed, +
                                  variantes de reserva não usadas hoje
                                  (logo-fundo-preto, os três recortes antigos
                                  caio/dr/melki-hero, logo-unimed duplicado)
```

`_nao-publicar/` (raiz do projeto, fora de `assets/`) guarda o que não é o site:
material de referência (`templates/`, 182 MB de sites de terceiros clonados —
gitignored, nunca teve histórico), rascunhos e versões antigas
(`design_system2.html`, `teste-sintomas.html`, `section-nuvem-aura.html`,
`certificados-caio-melki.html`, `conduct.dc.html`, `main.dc.html`,
`canvas.json`, `sincronizar-certificados.py`) e o brief original
(`estrutura-e-conteudo-site-caio-melki.md`). `CLAUDE.md`, `aprendizados.md` e
`memoria.md` ficam soltos na raiz — não são o site, mas também não são
descartável.

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
GSAP Flip) → formação/instituições (03) → trajetória (carrossel) → currículo (04)
→ agendar (05) → rodapé.

## Cuidados de CSS

- O cursor customizado (`assets/js/design-system/cursor.js`) mede a luminância
  do que está *de fato* sob o ponteiro (elemento real, gradiente incluído) para
  decidir se fica claro ou escuro — não é uma lista fixa de seções. Seção nova
  escura já funciona sozinha; não precisa (e não deve) adicionar caso especial.
- A abertura da hero (portas + digitação do título) depende de um aviso
  (`portas:abertas`) disparado por `intro.js`. Qualquer efeito que precise
  esperar a abertura terminar deve ouvir esse evento, e não inventar seu próprio
  cronômetro.
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
2. Ele monta uma cópia limpa só com `index.html` + `assets/css/` +
   `assets/js/` + `assets/img/`, e publica só essa cópia — **nunca** `assets/templates/` (182 MB, sites de terceiros clonados,
   está no `.gitignore` e nem chega a entrar no repositório) nem os arquivos
   soltos de rascunho listados em "Estrutura" acima.
3. Autenticação com o GitHub é feita pelo GitHub CLI (`gh`), já autorizado
   nesta máquina — nenhuma senha ou token é digitado em lugar nenhum a cada
   publicação.
4. Conferir sempre, depois de qualquer mudança de nome de arquivo, que nenhuma
   referência no HTML/CSS/JS aponta para um caminho inexistente e que o nome
   bate letra por letra com o do disco (Linux diferencia maiúscula/minúscula;
   macOS não) — GitHub Pages roda em servidor Linux.
5. Domínio próprio (`caiomelkimfc.com.br`) ainda não está conectado a este
   Pages. Se isso for feito no futuro, documentar aqui o procedimento (arquivo
   `CNAME` no repositório + registro DNS na Hostinger apontando para o
   GitHub).
