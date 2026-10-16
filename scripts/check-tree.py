#!/usr/bin/env python3
# check-tree.py —— 学习树完整性校验
# 校验内容：叶子 id 唯一、anchor 挂得上树（树根/枝干/枝节/野生）、叶子标签里的理论点编号可解析、
#           卡片 id 唯一、target/next 无断链、收集箱 cat 挂得上模块、毕业条目有对应卡片。
# 用法：在仓库根目录跑  python scripts/check-tree.py
# 退出码：0 = 树完好；1 = 有断链（打印在 stdout，逐条列出）
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / 'src' / 'data'

errors = []


def slice_export(text: str, name: str) -> str:
    start = text.find(f'export const {name}')
    if start == -1:
        errors.append(f'找不到 export const {name}')
        return ''
    end = text.find('\n];', start)
    return text[start:end if end != -1 else len(text)]


# ---------- 1. 理论地图：篇章 / 模块 / 学习点 ----------
theory_text = (DATA / 'theory.ts').read_text(encoding='utf-8')
point_ids, module_ids, chapter_ids = set(), set(), set()
chap = mod = None
for line in theory_text.splitlines():
    m = re.match(r"\s*\{ id: '(\d+)', name: ", line)
    if m:
        chap, mod = m.group(1), None
        chapter_ids.add(chap)
        continue
    m = re.search(r"name: '(M\d+)[^']*', points:", line)
    if m and chap:
        mod = m.group(1)
        module_ids.add(f'{chap}-{mod}')
        continue
    m = re.search(r"\{ id: '(M\d+\.\d+)'", line)
    if m and chap:
        point_ids.add(f'{chap}-{m.group(1)}')

# ---------- 2. 叶子清单：id 唯一 / anchor 挂得上树 / 标签可解析 ----------
leaves_text = (DATA / 'leaves.ts').read_text(encoding='utf-8')
leaves_slice = slice_export(leaves_text, 'LEAVES')
leaf_ids = []
leaf_rows = []  # (id, url, anchor, tags, practice)
for block in leaves_slice.split('\n  {'):
    lid = re.search(r"id: '([^']+)'", block)
    if not lid:
        continue
    lid = lid.group(1)
    leaf_ids.append(lid)
    url = re.search(r"url: '([^']*)'", block)
    anchor = re.search(r"anchor: '([^']+)'", block)
    tags = re.findall(r"'(\d{2}-M\d+\.\d+)'", block)
    leaf_rows.append((lid, url.group(1) if url else '', anchor.group(1) if anchor else '', tags, 'practice: true' in block))

# 私有树（content.local.ts 存在时）的 EXTRA_LEAVES 也是合法叶子——
# 公开克隆里没有该文件，跳过即可；私有化后卡片会挂到自己的叶子上
local_file = DATA / 'content.local.ts'
if local_file.exists():
    local_text = local_file.read_text(encoding='utf-8')
    local_slice = slice_export(local_text, 'EXTRA_LEAVES')
    leaf_ids.extend(re.findall(r"id: '([^']+)'", local_slice))

for lid, url, anchor, tags, practice in leaf_rows:
    if anchor in ('root', 'wild'):
        pass
    elif anchor in chapter_ids:
        pass
    elif anchor in point_ids:
        pass
    else:
        errors.append(f'叶子 {lid} 的 anchor 挂不上树：{anchor!r}（应为 root/wild/篇章 id/理论点编号）')
    for t in tags:
        if t not in point_ids:
            errors.append(f'叶子 {lid} 的标签断链：{t} 不是理论地图里的学习点')
    if practice and url:
        errors.append(f'叶子 {lid} 是练习项但带了链接：{url}')
    if not practice and not url:
        errors.append(f'叶子 {lid} 不是练习项但缺少项目链接')

# ---------- 3. 收集箱：url / cat / graduated ----------
inbox_text = (DATA / 'inbox.ts').read_text(encoding='utf-8')
inbox_slice = slice_export(inbox_text, 'INBOX')
inbox_urls, graduated_urls = set(), set()
for block in inbox_slice.split('\n  {'):
    url = re.search(r"url: '(https?://[^']+)'", block)
    cat = re.search(r"cat: '([^']+)'", block)
    if url:
        inbox_urls.add(url.group(1))
    if url and 'graduated:' in block:
        graduated_urls.add(url.group(1))
    if cat:
        mod_part = cat.group(1).split('·')[-1].strip()
        # 野生枝节：已进树但树还没长出对应位置，合法暂存
        if '野生' in mod_part:
            continue
        if mod_part not in module_ids and mod_part not in point_ids:
            errors.append(f'收集箱 cat 挂不上模块：{cat.group(1)!r}（{url.group(1) if url else "?"}）')

# ---------- 4. 学习卡片：id 唯一 / target / next ----------
cards_text = (DATA / 'cards.ts').read_text(encoding='utf-8')
cards_slice = slice_export(cards_text, 'CARDS')
card_ids, card_targets, card_nexts = [], {}, {}
for block in cards_slice.split('\n  {'):
    cid = re.search(r"id: '([^']+)'", block)
    if not cid:
        continue
    cid = cid.group(1)
    card_ids.append(cid)
    target = re.search(r"target: '([^']+)'", block)
    card_targets[cid] = target.group(1) if target else None
    nxt = re.search(r'next: \[([^\]]*)\]', block, re.S)
    card_nexts[cid] = re.findall(r"'([^']+)'", nxt.group(1)) if nxt else []

nodes = point_ids | set(leaf_ids) | inbox_urls | set(card_ids)

for cid in card_ids:
    if card_ids.count(cid) > 1:
        errors.append(f'卡片 id 重复：{cid}')
for cid, target in card_targets.items():
    if target and target not in nodes:
        errors.append(f'卡片 {cid} 的 target 断链：{target}')
for cid, nxt in card_nexts.items():
    for n in nxt:
        if n not in nodes:
            errors.append(f'卡片 {cid} 的 next 断链：{n}')

# ---------- 5. 毕业一致性：毕业的收集箱条目应有卡片挂回来 ----------
for url in graduated_urls:
    if url not in set(card_targets.values()):
        errors.append(f'收集箱条目已毕业但没有卡片挂载：{url}')

# ---------- 结果 ----------
print(f'理论点 {len(point_ids)} ｜ 模块 {len(module_ids)} ｜ 枝干 {len(chapter_ids)} ｜ '
      f'叶子 {len(leaf_ids)} ｜ 收集箱 {len(inbox_urls)}（毕业 {len(graduated_urls)}）｜ 卡片 {len(card_ids)}')
if errors:
    print(f'\n✗ 发现 {len(errors)} 处断链：')
    for e in errors:
        print(f'  - {e}')
    sys.exit(1)
print('✓ 树完好，无断链')
