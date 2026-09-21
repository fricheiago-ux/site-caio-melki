# Site Caio Melki — regras deste projeto

Complementa o `CLAUDE.md` global. Onde houver conflito, **este arquivo vence**.

Site institucional do Dr. Caio Ribeiro Melki, médico de família e comunidade em
Belo Horizonte. Estático, sem etapa de build — é `index.html` puro com CSS e JS
próprios. Domínio **caiomelkimfc.com.br** já registrado na Hostinger; a
hospedagem em si **ainda não foi contratada** (checado em 22/09/2026 — ver
`memoria.md`). Forma de publicação **ainda em definição** (ver seção
"Ao publicar").

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

**Em definição — ver `aprendizados.md`.** Domínio e hospedagem já existem na
Hostinger; falta decidir e configurar o mecanismo de publicação (deploy nativo via
Git do hPanel, ou script de SFTP). Quando isso for fechado, os passos exatos vêm
aqui.

Já sabido, independente da rota escolhida:
1. **Nunca publicar `assets/templates/`** (material de referência, 182 MB, sites
   de terceiros clonados) nem os arquivos soltos de rascunho listados em
   "Estrutura" acima.
2. Publicar apenas: `index.html` + `assets/design-system-2/` + `assets/site/` +
   `assets/imagens/` + `assets/logos/`.
3. Conferir que nenhuma referência aponta para arquivo inexistente e que o nome
   bate com o do disco letra por letra (Linux diferencia maiúscula/minúscula;
   macOS não).
4. Nunca colar senha de FTP/Hostinger em conversa com o Claude. Ver
   `aprendizados.md` para como a credencial deve ficar guardada.
