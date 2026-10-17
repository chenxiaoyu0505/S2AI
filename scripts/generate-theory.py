# -*- coding: utf-8 -*-
"""从八股笔记的 00-目录总览.md 生成 src/data/theory.ts。

用法：python scripts/generate-theory.py            # 公共树：不写入个人笔记进度（done 全 false）
      python scripts/generate-theory.py --personal # 私有树：从笔记 ✅ 解析 done

theory.ts 是进 git 的公共数据，「哪篇已有成文笔记」属于个人进度（见 DESIGN.md 硬边界），
默认一律输出 done: false；维护者在本地同步自己的私有树时才加 --personal。
源文件更新后重跑本脚本即可同步网站数据。
"""
import re
import sys
from pathlib import Path

PERSONAL = '--personal' in sys.argv[1:]

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT.parent / '八股笔记' / '八股' / '00-目录总览.md'
OUT = ROOT / 'src' / 'data' / 'theory.ts'

if not SRC.exists():
    raise SystemExit(f'找不到笔记源文件：{SRC}\n'
                     '该脚本只供维护者在本地同步八股笔记使用，源文件不进本仓库。')

text = SRC.read_text(encoding='utf-8')

# 只解析「三、各篇章目录」内的章节
body = text.split('## 三、各篇章目录', 1)[1]
body = body.split('## 四、', 1)[0]

def clean_cell(s: str) -> str:
    s = s.strip()
    s = re.sub(r'\[([^\]]+)\]\([^)]*\)', r'\1', s)   # 去链接
    s = re.sub(r'\s*→\s*详见.*$', '', s)              # 去 "→ 详见 ..."
    s = s.replace('🆕', '').replace('🔗', '').strip()
    s = s.replace('**', '').strip()                   # 去加粗标记（页面按纯文本渲染）
    return s

chapters = []
# 章节标题：### 01-DL 基础
chapter_iter = list(re.finditer(r'^###\s+(\d{2})-(.+?)\s*$', body, re.M))
for i, m in enumerate(chapter_iter):
    cid, cname = m.group(1), clean_cell(m.group(2))
    seg = body[m.end(): chapter_iter[i + 1].start() if i + 1 < len(chapter_iter) else len(body)]

    weight, p0, summary = 0, '', ''
    for line in seg.splitlines():
        if line.startswith('> ') and '权重' in line and not summary:
            wm = re.search(r'权重\s*(★+)', line)
            weight = len(wm.group(1)) if wm else 0
            sm = re.search(r'定位：(.+?)(?:\s*｜|$)', line)
            summary = sm.group(1).strip() if sm else ''
        if '**P0 必学**' in line:
            p0 = clean_cell(line.split('**P0 必学**：', 1)[-1])

    modules, cur = [], None
    for line in seg.splitlines():
        if not line.startswith('|') or '---' in line or '模块' in line:
            continue
        cells = [clean_cell(c) for c in line.strip().strip('|').split('|')]
        if len(cells) < 4:
            continue
        mcell, pcell, fcell, scell = cells[0], cells[1], cells[2], cells[3]
        if mcell.startswith('**M') or re.match(r'^M\d', mcell):
            cur = {'name': mcell.strip('*').strip(), 'points': []}
            modules.append(cur)
        if cur is None or not re.match(r'^\d+\.\d+\s', pcell):
            continue
        pm = re.match(r'^(\d+\.\d+)\s+(.*)$', pcell)
        num, pname = pm.group(1), pm.group(2).strip()
        freq = fcell.count('★')
        # done = 是否已有成文笔记：只在 --personal（私有树）时才从笔记 ✅ 解析，公共树恒为 false
        done = ('✅' in scell) if PERSONAL else False
        cur['points'].append({'id': f'M{num}', 'name': pname, 'freq': freq, 'done': done})

    chapters.append({
        'id': cid, 'name': cname, 'weight': weight,
        'summary': summary, 'p0': p0, 'modules': modules,
    })

def esc(s: str) -> str:
    # 输出用单引号字符串：只需转义反斜杠和单引号
    return s.replace('\\', '\\\\').replace("'", "\\'")

lines = []
lines.append('// 自动生成自 八股笔记/八股/00-目录总览.md —— 请勿手改，跑 scripts/generate-theory.py 重新生成')
lines.append('export interface TheoryPoint { id: string; name: string; freq: number; done: boolean }')
lines.append('export interface TheoryModule { name: string; points: TheoryPoint[] }')
lines.append('export interface TheoryChapter {')
lines.append('  id: string; name: string; weight: number; summary: string; p0: string')
lines.append('  modules: TheoryModule[]')
lines.append('}')
lines.append('')
lines.append('export const THEORY_CHAPTERS: TheoryChapter[] = [')
for ch in chapters:
    n_points = sum(len(m['points']) for m in ch['modules'])
    lines.append(f"  {{ id: '{ch['id']}', name: '{esc(ch['name'])}', weight: {ch['weight']},")
    lines.append(f"    summary: '{esc(ch['summary'])}', p0: '{esc(ch['p0'])}',")
    lines.append('    modules: [')
    for mo in ch['modules']:
        lines.append(f"      {{ name: '{esc(mo['name'])}', points: [")
        for p in mo['points']:
            lines.append(f"        {{ id: '{p['id']}', name: '{esc(p['name'])}', freq: {p['freq']}, done: {'true' if p['done'] else 'false'} }},")
        lines.append('      ]},')
    lines.append('    ]},')
lines.append(']')
lines.append('')
lines.append('export const THEORY_TOTAL = THEORY_CHAPTERS.reduce(')
lines.append('  (n, c) => n + c.modules.reduce((m, mo) => m + mo.points.length, 0), 0)')
lines.append('export const THEORY_DONE = THEORY_CHAPTERS.reduce(')
lines.append('  (n, c) => n + c.modules.reduce((m, mo) => m + mo.points.filter(p => p.done).length, 0), 0)')
lines.append('')

OUT.write_text('\n'.join(lines), encoding='utf-8')

n_pts = sum(len(m['points']) for c in chapters for m in c['modules'])
n_done = sum(1 for c in chapters for m in c['modules'] for p in m['points'] if p['done'])
print(f'生成 {OUT}（{"含个人笔记进度" if PERSONAL else "公共模式：done 全为 false"}）')
print(f'章节 {len(chapters)} ｜ 模块 {sum(len(c["modules"]) for c in chapters)} ｜ 学习点 {n_pts}（已有笔记 {n_done}）')
for c in chapters:
    pts = sum(len(m['points']) for m in c['modules'])
    print(f"  {c['id']} {c['name']}: {len(c['modules'])} 模块 / {pts} 学习点")
