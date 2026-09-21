#!/usr/bin/env python3
"""
Gera o bloco de certificados do index.html a partir dos arquivos do canvas
de design (Main.dc.html e Conduct.dc.html).

Por que existe: a mesma peça precisa viver em dois lugares — no canvas, onde
ela é editada, e no site, onde ela é exibida. Sem isto, mexer numa não mexe
na outra e as duas divergem em silêncio. Rode este script depois de qualquer
alteração nos .dc.html:

    python3 sincronizar-certificados.py
"""
import re, sys, pathlib

RAIZ = pathlib.Path(__file__).parent
INICIO, FIM = '<!-- certificados:inicio -->', '<!-- certificados:fim -->'

PECAS = [
    ('Main.dc.html',    'Instrutor de ACLS',      'American Heart Association · Suporte Avançado de Vida em Cardiologia'),
    ('Conduct.dc.html', 'Instrutor do CONDUCT®',  'Principais prescrições na urgência e emergência'),
]

def folha(arquivo):
    """Tira a folha do .dc.html: só o conteúdo, sem o <helmet> e sem o <x-dc>."""
    s = (RAIZ / arquivo).read_text(encoding='utf-8')
    corpo = s.split('<x-dc>')[1].split('</x-dc>')[0]
    corpo = re.sub(r'<helmet>.*?</helmet>', '', corpo, flags=re.S).strip()
    # as logos são referenciadas pelo nome no canvas; no site, pelo caminho
    corpo = corpo.replace('src="logo-', 'src="assets/imagens/certificados/logo-')
    # imagem abaixo da primeira tela carrega adiada
    corpo = corpo.replace('<img ', '<img loading="lazy" decoding="async" ')
    return corpo

def main():
    cartoes = []
    for arquivo, titulo, fonte in PECAS:
        cartoes.append(
            '<figure class="cert-peca">\n'
            '<div class="cert-palco">\n'
            '<div class="cert-folha">\n' + folha(arquivo) + '\n</div>\n'
            '</div>\n'
            '<figcaption class="cert-legenda">\n'
            f'<span class="cert-legenda__titulo">{titulo}</span>\n'
            f'<span class="cert-legenda__fonte">{fonte}</span>\n'
            '</figcaption>\n'
            '</figure>'
        )

    bloco = (
        INICIO + '\n'
        '<div class="cert-divisa reveal">\n'
        '<span class="label cert-divisa__rotulo"><i data-lucide="badge-check" style="width:13px;height:13px"></i>Certificações</span>\n'
        '<span class="cert-divisa__linha"></span>\n'
        '</div>\n\n'
        '<div class="cert-grade reveal delay-100">\n\n' + '\n\n'.join(cartoes) + '\n\n</div>\n'
        + FIM
    )

    alvo = RAIZ / 'index.html'
    html = alvo.read_text(encoding='utf-8')
    if html.count(INICIO) != 1 or html.count(FIM) != 1:
        sys.exit('erro: as marcas de início/fim precisam aparecer exatamente uma vez no index.html')
    i, j = html.index(INICIO), html.index(FIM) + len(FIM)
    alvo.write_text(html[:i] + bloco + html[j:], encoding='utf-8')
    print(f'ok: {len(PECAS)} certificados sincronizados no index.html')

if __name__ == '__main__':
    main()
