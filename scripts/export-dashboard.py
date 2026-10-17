#!/usr/bin/env python3
# export-dashboard.py —— 把学习树导出为自包含的单文件 HTML 看板
# 任何 Agent / 任何机器都能用：python scripts/export-dashboard.py
# 产物 dashboard/tree.html 内嵌全部树数据 + 原生 JS 渲染，无需 node、无需服务器，浏览器直接打开。
# 页面模板在 scripts/dashboard-template.html（Kimi 设计令牌 + 独立打开回退样式），改模板后重新导出即可。
# 用法:
#   python scripts/export-dashboard.py              # 输出到 <仓库>/dashboard/tree.html
#   python scripts/export-dashboard.py --out PATH   # 指定输出路径（如 Kimi Work widget 的 index.html）
import json
import re
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / 'src' / 'data'


def slice_export(text: str, name: str) -> str:
    start = text.find(f'export const {name}')
    if start == -1:
        sys.exit(f'找不到 export const {name}，请在仓库根目录运行')
    end = text.find('\n];', start)
    return text[start:end if end != -1 else len(text)]


def unquote(s: str) -> str:
    return s.replace("\\'", "'").replace('\\\\', '\\')


# ---------- 理论地图 ----------
def parse_theory():
    text = (DATA / 'theory.ts').read_text(encoding='utf-8')
    chapters, chap, mod = [], None, None
    for line in text.splitlines():
        m = re.match(r"\s*\{ id: '(\d+)', name: '((?:[^'\\]|\\.)*)', weight: (\d+),", line)
        if m:
            chap = {'id': m.group(1), 'name': unquote(m.group(2)), 'weight': int(m.group(3)),
                    'summary': '', 'p0': '', 'modules': []}
            chapters.append(chap)
            mod = None
            continue
        if chap is None:
            continue
        m = re.search(r"summary: '((?:[^'\\]|\\.)*)', p0: '((?:[^'\\]|\\.)*)', modules:", line)
        if m:
            chap['summary'] = unquote(m.group(1))
            chap['p0'] = unquote(m.group(2))
            continue
        m = re.search(r"name: '((?:M\d+)[^']*)', points: \[", line)
        if m:
            mod = {'name': m.group(1), 'points': []}
            chap['modules'].append(mod)
            continue
        m = re.search(r"\{ id: '(M\d+\.\d+)', name: '((?:[^'\\]|\\.)*)', freq: (\d+), done: (true|false) \}", line)
        if m and mod is not None:
            mod['points'].append({'id': m.group(1), 'name': unquote(m.group(2)),
                                  'freq': int(m.group(3)), 'done': m.group(4) == 'true'})
    return chapters


# ---------- 叶子清单 ----------
def parse_leaves():
    text = (DATA / 'leaves.ts').read_text(encoding='utf-8')
    body = slice_export(text, 'LEAVES')
    leaves = []
    for block in body.split('\n  {'):
        m = re.search(r"id: '([^']+)'", block)
        if not m:
            continue
        def field(key):
            fm = re.search(key + r": '((?:[^'\\]|\\.)*)'", block)
            return unquote(fm.group(1)) if fm else None
        def arr(key):
            am = re.search(key + r': \[([^\]]*)\]', block, re.S)
            return [unquote(x) for x in re.findall(r"'([^']*)'", am.group(1))] if am else []
        leaves.append({'id': m.group(1), 'name': field('name'), 'url': field('url') or '',
                       'anchor': field('anchor'), 'tags': arr('tags'), 'intro': field('intro') or '',
                       'opt': 'opt: true' in block, 'practice': 'practice: true' in block})
    return leaves


# ---------- 收集箱 ----------
def parse_inbox():
    text = (DATA / 'inbox.ts').read_text(encoding='utf-8')
    body = slice_export(text, 'INBOX')
    items = []
    for block in body.split('\n  {'):
        def field(key, pattern=r"((?:[^'\\]|\\.)*)"):
            m = re.search(key + r": '" + pattern + r"'", block)
            return unquote(m.group(1)) if m else None
        url = field('url')
        if not url:
            continue
        items.append({
            'name': field('name'), 'url': url, 'kind': field('kind') or 'leaf',
            'added': field('added'), 'cat': field('cat'),
            'intro': field('intro'), 'why': field('why'), 'dive': field('dive'),
            'level': field('level'), 'concept': field('concept'), 'graduated': field('graduated'),
        })
    return items


# ---------- 学习卡片 ----------
def parse_cards():
    text = (DATA / 'cards.ts').read_text(encoding='utf-8')
    body = slice_export(text, 'CARDS')
    cards = []
    for block in body.split('\n  {'):
        m = re.search(r"id: '([^']+)'", block)
        if not m:
            continue
        def field(key):
            fm = re.search(key + r": '((?:[^'\\]|\\.)*)'", block)
            return unquote(fm.group(1)) if fm else None
        def arr(key):
            am = re.search(key + r': \[([^\]]*)\]', block, re.S)
            return [unquote(x) for x in re.findall(r"'([^']*)'", am.group(1))] if am else []
        cards.append({'id': m.group(1), 'name': field('name'), 'target': field('target'),
                      'url': field('url'), 'tags': arr('tags'), 'next': arr('next'),
                      'madeBy': field('madeBy'), 'date': field('date')})
    return cards


tree = {'chapters': parse_theory(), 'leaves': parse_leaves(),
        'inbox': parse_inbox(), 'cards': parse_cards(), 'generated': str(date.today())}

HTML = (ROOT / 'scripts' / 'dashboard-template.html').read_text(encoding='utf-8')

html = HTML.replace('__DATA__', json.dumps(tree, ensure_ascii=False))
out = Path(sys.argv[sys.argv.index('--out') + 1]) if '--out' in sys.argv else ROOT / 'dashboard' / 'tree.html'
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(html, encoding='utf-8')
pts = sum(len(m['points']) for c in tree['chapters'] for m in c['modules'])
print(f'看板已导出：{out}')
print(f'数据：{len(tree["chapters"])} 篇章 / {pts} 学习点 / '
      f'{len(tree["leaves"])} 叶子 / '
      f'{len(tree["inbox"])} 收集箱 / {len(tree["cards"])} 卡片')
