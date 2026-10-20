#!/usr/bin/env python3
# check-tree.py —— 学习树完整性校验
# 校验内容：叶子 id 唯一、anchor 挂得上树（树根/枝干/枝节/野生）、叶子标签里的理论点编号可解析、
#           自测题 pointId / id / 题型字段；
#           卡片 id 唯一、卡片有链接、target/next 无断链、收集箱 url 唯一、cat 挂得上模块、
#           毕业条目挂回树上（卡片或叶子）；
#           另加元校验：任务手册条数与 AGENTS.md 一致、源码不重复拼接 card- 前缀。
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

# 叶子 id 唯一：id 是勾选进度 / 跳转锚点 / 卡片引用的主键，重复会让两处互相覆盖
dup_leaf_ids = sorted({x for x in leaf_ids if leaf_ids.count(x) > 1})
if dup_leaf_ids:
    errors.append(f'叶子 id 重复：{"、".join(dup_leaf_ids)}（id 是进度与跳转主键，必须唯一）')

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
inbox_url_list = []
for block in inbox_slice.split('\n  {'):
    url = re.search(r"url: '(https?://[^']+)'", block)
    cat = re.search(r"cat: '([^']+)'", block)
    if url:
        inbox_urls.add(url.group(1))
        inbox_url_list.append(url.group(1))
    if url and 'graduated:' in block:
        graduated_urls.add(url.group(1))
    if cat:
        mod_part = cat.group(1).split('·')[-1].strip()
        # 野生枝节：已进树但树还没长出对应位置，合法暂存
        if '野生' in mod_part:
            continue
        if mod_part not in module_ids and mod_part not in point_ids:
            errors.append(f'收集箱 cat 挂不上模块：{cat.group(1)!r}（{url.group(1) if url else "?"}）')

# 收集箱 url 唯一：条目以 url 为 React key，重复会让两条目渲染冲突、毕业校验互相覆盖
dup_inbox_urls = sorted({u for u in inbox_url_list if inbox_url_list.count(u) > 1})
if dup_inbox_urls:
    errors.append(f'收集箱 url 重复：{"、".join(dup_inbox_urls)}')

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
    url = re.search(r"url: '(https?://[^']+)'", block)
    if not url:
        errors.append(f'卡片 {cid} 缺少链接：url 为空或不合法（应指向官方文档 / 论文 / 仓库）')
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

# ---------- 5. 毕业一致性：毕业的收集箱条目应挂回树上 ----------
# 协议允许两种毕业形态（AGENTS.md 任务手册 5）：需要卡片的写进 cards.ts；
# 纯项目不需要卡片，直接长成叶子进 leaves.ts。只认卡片会让「纯项目毕业」误报断链。
leaf_urls = {u for _, u, _, _, _ in leaf_rows if u}
card_target_set = set(card_targets.values())
for url in graduated_urls:
    if url not in card_target_set and url not in leaf_urls:
        errors.append(f'收集箱条目已毕业但没挂回树上：{url}'
                      '（应有卡片 target 指向它，或已在叶子清单里长成同 url 的叶子）')

# ---------- 5b. 闯关自测题库：pointId 挂得上树 / id 唯一 / 题型字段齐全 ----------
quiz_file = DATA / 'quiz.ts'
quiz_count = 0
if quiz_file.exists():
    quiz_slice = slice_export(quiz_file.read_text(encoding='utf-8'), 'QUIZ')
    quiz_ids = []
    for block in quiz_slice.split('\n  {')[1:]:
        qid = re.search(r"\bid: '([^']+)'", block)
        qid = qid.group(1) if qid else None
        if not qid:
            errors.append(f'题目缺少 id：{block.strip()[:40]!r}')
            continue
        quiz_ids.append(qid)
        quiz_count += 1
        pid = re.search(r"pointId: '([^']+)'", block)
        if not pid:
            errors.append(f'题目 {qid} 缺少 pointId')
        elif pid.group(1) not in point_ids:
            errors.append(f'题目 {qid} 的 pointId 断链：{pid.group(1)} 不是理论地图里的学习点')
        qtype = re.search(r"type: '([^']+)'", block)
        qtype = qtype.group(1) if qtype else None
        if qtype not in ('choice', 'short', 'code'):
            errors.append(f'题目 {qid} 的 type 不合法：{qtype!r}（应为 choice / short / code）')
        for field in ('question', 'explanation'):
            if not re.search(rf"{field}: ['`]", block):
                errors.append(f'题目 {qid} 缺少 {field}')
        if qtype == 'choice':
            opts = re.search(r"options: \[(.*?)\],\n", block, re.S)
            n_opts = len(re.findall(r"'[^']*'", opts.group(1))) if opts else 0
            ans = re.search(r"answer: (\d+)", block)
            if n_opts < 2:
                errors.append(f'题目 {qid} 是选择题但选项少于 2 个')
            if not ans:
                errors.append(f'题目 {qid} 是选择题但缺少 answer')
            elif int(ans.group(1)) >= n_opts:
                errors.append(f'题目 {qid} 的 answer 越界：{ans.group(1)}（共 {n_opts} 个选项）')
        elif qtype == 'short':
            kp = re.search(r"keyPoints: \[(.*?)\],\n", block, re.S)
            if not kp or not re.findall(r"'[^']+'", kp.group(1)):
                errors.append(f'题目 {qid} 是简答题但缺少 keyPoints')
        elif qtype == 'code':
            for field in ('reference', 'tests'):
                if not re.search(rf"{field}: [`']", block):
                    errors.append(f'题目 {qid} 是手撕题但缺少 {field}')
        src = re.search(r"source: \{[^}]*url: '([^']*)'", block)
        if src and not src.group(1).startswith('https://'):
            errors.append(f'题目 {qid} 的 source 链接不合法：{src.group(1)}')
    dup_quiz = sorted({x for x in quiz_ids if quiz_ids.count(x) > 1})
    if dup_quiz:
        errors.append(f'题目 id 重复：{"、".join(dup_quiz)}')

# ---------- 6. 元校验：协议与代码的一致性（断了不会白屏，但会让跳转 / 文案悄悄错） ----------
# 6a. 任务手册条数：AGENTS.md 的「### N. 」小节数必须与 content.ts 里的常量一致
agents_file = ROOT / 'AGENTS.md'
if agents_file.exists():
    manual_nums = [int(n) for n in re.findall(r'^### (\d+)\. ', agents_file.read_text(encoding='utf-8'), re.M)]
    content_text = (DATA / 'content.ts').read_text(encoding='utf-8')
    cm = re.search(r'export const TASK_MANUAL_COUNT = (\d+)', content_text)
    if not cm:
        errors.append('content.ts 里找不到 TASK_MANUAL_COUNT 常量')
    elif manual_nums:
        if manual_nums != list(range(1, len(manual_nums) + 1)):
            errors.append(f'AGENTS.md 任务手册编号不连续：{manual_nums}')
        if int(cm.group(1)) != len(manual_nums):
            errors.append(f'任务手册条数漂移：AGENTS.md 有 {len(manual_nums)} 条，'
                          f'content.ts 的 TASK_MANUAL_COUNT 是 {cm.group(1)}')

# 6b. 卡片 id 自带 card- 前缀：源码里再拼一次前缀会产生 card-card-xxx（元素 id 与 anchor 会一起错，
#     跳转侥幸可用但一改就全线断链，而本脚本管不到 DOM id——直接卡在源码层）
for path in sorted((ROOT / 'src').rglob('*.tsx')):
    if 'components/ui' in str(path):
        continue
    for i, line in enumerate(path.read_text(encoding='utf-8').splitlines(), 1):
        if 'card-${' in line:
            errors.append(f'{path.relative_to(ROOT)}:{i} 重复拼接 card- 前缀：{line.strip()}')

# ---------- 结果 ----------
print(f'理论点 {len(point_ids)} ｜ 模块 {len(module_ids)} ｜ 枝干 {len(chapter_ids)} ｜ '
      f'叶子 {len(leaf_ids)} ｜ 收集箱 {len(inbox_urls)}（毕业 {len(graduated_urls)}）｜ 卡片 {len(card_ids)} ｜ 自测题 {quiz_count}')
if errors:
    print(f'\n✗ 发现 {len(errors)} 处断链：')
    for e in errors:
        print(f'  - {e}')
    sys.exit(1)
print('✓ 树完好，无断链')
