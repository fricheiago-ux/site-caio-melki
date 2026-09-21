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

```
index.html                     ← a página inteira; site de uma página só
assets/
  design-system-2/css, js/     ← tokens, animações, efeitos, componentes
  site/css, js/                ← CSS/JS específico de cada seção do site
  imagens/                     ← TODA imagem do site
    fotos-caio/                ← fotos do próprio Caio, dentro de imagens/
  logos/                       ← marca (creme sobre escuro) e ícone da Unimed
  templates/                   ← ⚠️ material de referência (sites clonados para
                                  extrair design system). NUNCA faz parte do
                                  site publicado. 182 MB — não deployar, e
                                  provavelmente não deve nem entrar no git
                                  (ver "Ao publicar" e o registro em
                                  aprendizados.md sobre isso).
```

Também existem na raiz e em `assets/` alguns arquivos soltos que são rascunho ou
material de trabalho, não parte do site ao vivo (nada em `index.html` referencia
eles): `Conduct.dc.html`, `Main.dc.html`, `canvas.json`,
`certificados-caio-melki.html`, `section-nuvem-aura.html`,
`sincronizar-certificados.py`, `assets/_teste-sintomas.html`,
`assets/design_system2.html`, `assets/Estrutura e Conteúdo - Site Caio Melki.md`.
Manter fora do que for publicado.

A convenção de pastas de imagem está registrada também na memória global do
usuário (`site-caio-melki-imagens.md`): tudo em `assets/imagens/`, fotos do Caio
em `assets/imagens/fotos-caio/`. As únicas exceções são `assets/logos/` (marca e
ícones de parceiro) e ícones/brasões institucionais que ficam em `assets/site/img/`.

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

Definidas em `assets/design-system-2/css/tokens.css` — essa é a fonte da verdade,
esta tabela é só um resumo de consulta rápida.

## Estrutura de uma página tipo

Não se aplica — é site de página única. As seções de `index.html`, na ordem:
hero → especialidade (01) → sintomas/nuvem de busca (02) → pilares (5 cards,
GSAP Flip) → formação/instituições (03) → trajetória (carrossel) → currículo (04)
→ agendar (05) → rodapé.

## Cuidados de CSS

- O cursor customizado (`assets/design-system-2/js/cursor.js`) mede a luminância
  do que está *de fato* sob o ponteiro (elemento real, gradiente incluído) para
  decidir se fica claro ou escuro — não é uma lista fixa de seções. Seção nova
  escura já funciona sozinha; não precisa (e não deve) adicionar caso especial.
- A abertura da hero (portas + digitação do título) depende de um aviso
  (`portas:abertas`) disparado por `intro.js`. Qualquer efeito que precise
  esperar a abertura terminar deve ouvir esse evento, e não inventar seu próprio
  cronômetro.

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

Em até um minuto o workflow `.github/workflows/deploy.yml` publica sozinho a
versão nova em https://fricheiago-ux.github.io/site-caio-melki/ — não existe
passo manual depois do push, e ninguém precisa entrar no GitHub para nada.

Como funciona por baixo:
1. O workflow roda a cada `git push` na branch `main` (também dá para forçar
   manualmente pela aba **Actions** do repositório no GitHub, botão
   "Run workflow", sem precisar de commit novo).
2. Ele monta uma cópia limpa só com `index.html` + `assets/design-system-2/` +
   `assets/site/` + `assets/imagens/` + `assets/logos/`, e publica só essa
   cópia — **nunca** `assets/templates/` (182 MB, sites de terceiros clonados,
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
