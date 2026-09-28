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

pedacos = []
for m in achados:
    arq = raiz / m.group(1)
    if not arq.is_file():
        sys.exit(f"montar-site: {m.group(1)} está no index.html mas não existe em {raiz}/")
    if 'media=' in m.group(0):
        sys.exit(f"montar-site: {m.group(1)} tem media= — o empacotador não trata isso")
    pedacos.append(minificar(arq.read_text(encoding="utf-8")))

bundle = '\n'.join(pedacos) + '\n'
selo = hashlib.sha1(bundle.encode()).hexdigest()[:8]
destino = raiz / "assets/css/site/bundle.css"   # mesma profundidade dos originais: url(../../img/...) continua valendo
destino.write_text(bundle, encoding="utf-8")

# troca o primeiro <link> pelo bundle e apaga os demais
nova = f'<link rel="stylesheet" href="assets/css/site/bundle.css?v={selo}"/>\n'
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

print(f"montar-site: {len(achados)} CSS -> bundle.css ({len(bundle)/1024:.1f} KB, v={selo})")
