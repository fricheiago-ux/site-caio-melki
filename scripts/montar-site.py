#!/usr/bin/env python3
"""
Passo de publicação: junta os CSS locais do index.html em UM arquivo.

Por quê: o navegador só pinta a primeira tela depois de baixar todo CSS
declarado no <head>. Eram 16 arquivos + fonte; em rede móvel cada ida e
volta pesa (o PageSpeed acusou ~1,6 s de bloqueio). Um arquivo só, sem
comentários nem espaços, chega bem antes.

Só roda na publicação (.github/workflows/deploy.yml), sobre a cópia em
_site/. No repositório nada muda: continua-se editando cada CSS separado, o
index.html continua ligando cada um, e local (localhost) funciona como sempre.

Uso: python3 scripts/montar-site.py _site
"""
import hashlib
import os
import re
import sys
from pathlib import Path

raiz = Path(sys.argv[1] if len(sys.argv) > 1 else "_site")
index = raiz / "index.html"
html = index.read_text(encoding="utf-8")

# <link rel="stylesheet" href="assets/css/....css?v=N"/> — só os locais
padrao = re.compile(r'[ \t]*<link\s+rel="stylesheet"\s+href="(assets/css/[^"?]+\.css)(?:\?v=[^"]*)?"\s*/?>[ \t]*\n?')
achados = list(padrao.finditer(html))
if not achados:
    sys.exit("montar-site: nenhum <link> de CSS local encontrado — a estrutura do index.html mudou?")

TOKENS = re.compile(r'("(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\'|url\([^)]*\))')

def minificar(css: str) -> str:
    css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
    partes = TOKENS.split(css)          # ímpares = strings/url(), intocados
    for i in range(0, len(partes), 2):
        p = re.sub(r'\s+', ' ', partes[i])
        p = re.sub(r' ?([{};,>]) ?', r'\1', p)   # NÃO mexe em + - : (calc() e seletores)
        partes[i] = p
    css = ''.join(partes).replace(';}', '}')
    return css.strip()


def reancorar_urls(css: str, base: Path) -> str:
    """Troca url(relativo) por url(relativo-à-raiz), só nos url() de verdade.

    Anda pelo CSS caractere a caractere guardando se está dentro de aspas:
    assim um url() que aparece DENTRO de uma imagem embutida (ex.: o
    url(#n) do filtro de ruído, dentro de url("data:image/svg+xml,...")) não
    é tocado — foi exatamente o que um regex simples quebrou no primeiro
    teste (28/09/2026)."""
    saida, i, n, aspas = [], 0, len(css), None
    while i < n:
        c = css[i]
        if aspas:
            saida.append(c)
            if c == '\\' and i + 1 < n:
                saida.append(css[i + 1]); i += 2; continue
            if c == aspas: aspas = None
            i += 1; continue
        if c in '"\'':
            aspas = c; saida.append(c); i += 1; continue
        if css.startswith('url(', i):
            j, dentro = i + 4, None
            while j < n:
                if dentro:
                    if css[j] == '\\': j += 2; continue
                    if css[j] == dentro: dentro = None
                elif css[j] in '"\'': dentro = css[j]
                elif css[j] == ')': break
                j += 1
            bruto = css[i + 4:j]
            alvo = bruto.strip().strip('"\'')
            if alvo and not re.match(r'^(data:|https?:|/|#)', alvo):
                alvo = os.path.normpath(str(base / alvo)).replace(os.sep, '/')
                saida.append(f'url({alvo})')
            else:
                saida.append(f'url({bruto})')
            i = j + 1; continue
        saida.append(c); i += 1
    return ''.join(saida)

pedacos = []
for m in achados:
    arq = raiz / m.group(1)
    if not arq.is_file():
        sys.exit(f"montar-site: {m.group(1)} está no index.html mas não existe em {raiz}/")
    if 'media=' in m.group(0):
        sys.exit(f"montar-site: {m.group(1)} tem media= — o empacotador não trata isso")
    css = minificar(arq.read_text(encoding="utf-8"))
    # O CSS vai para DENTRO do index.html (raiz): url() relativo ao arquivo
    # CSS original precisa virar relativo à raiz, senão aponta para o lugar
    # errado. Hoje nenhum CSS usa url(), mas fica garantido.
    base = Path(m.group(1)).parent
    css = reancorar_urls(css, base)
    pedacos.append(css)

bundle = '\n'.join(pedacos) + '\n'
selo = hashlib.sha1(bundle.encode()).hexdigest()[:8]
if '</style' in bundle.lower():
    sys.exit("montar-site: algum CSS contém '</style' — não dá para embutir no HTML")

# Desde 28/09/2026 o CSS vai EMBUTIDO no index.html (<style>), e não num
# bundle.css à parte: o PageSpeed apontava o bundle.css como "solicitação
# que bloqueia a renderização" (~0,6s no 4G) — a página esperava uma segunda
# ida ao servidor antes de pintar qualquer coisa. Embutido, chega junto com
# o HTML (~20 KB comprimido a mais nele).
nova = f'<style data-css="{selo}">\n{bundle}</style>\n'

primeiro = achados[0]
saida, cursor = [], 0
for i, m in enumerate(achados):
    saida.append(html[cursor:m.start()])
    if i == 0:
        saida.append(nova)
    cursor = m.end()
saida.append(html[cursor:])
index.write_text(''.join(saida), encoding="utf-8")

for m in achados:
    (raiz / m.group(1)).unlink()

print(f"montar-site: {len(achados)} CSS embutidos no index.html ({len(bundle)/1024:.1f} KB, v={selo})")
