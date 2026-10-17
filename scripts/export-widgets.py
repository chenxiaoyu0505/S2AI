#!/usr/bin/env python3
# export-widgets.py —— 把学习树四个板块分别导出为独立的小组件 HTML
# 产物 dashboard/widgets/{theory,leaves,inbox,cards}.html，每个文件只内嵌自己需要的数据切片，
# 用于 Kimi Work Widget（每个板块一个可拖移小组件）；数据层与 export-dashboard.py 共用 tree_data.py。
# 用法: python scripts/export-widgets.py
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from tree_data import tree  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'dashboard' / 'widgets'

# 四个组件共用的设计令牌 + 基础样式（源自 scripts/dashboard-template.html，去掉跨板块互跳）
CSS = r"""
  :root {
    font-family: var(--kimi-font-sans, -apple-system, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif);
    --kt: var(--kimi-color-text-primary, #1a1a1a);
    --k2: var(--kimi-color-text-secondary, #555);
    --k3: var(--kimi-color-text-tertiary, #888);
    --k4: var(--kimi-color-text-quaternary, #aaa);
    --bd: var(--kimi-color-border, #e5e5e5);
    --sm: var(--kimi-color-surface-muted, #f5f5f5);
    --pos: var(--kimi-color-positive, #16a34a);
    --warn: var(--kimi-color-warning, #d97706);
    --dan: var(--kimi-color-danger, #dc2626);
    --c4: var(--kimi-chart-4, #9333ea);
    --em: var(--kimi-chart-2, #059669);
    --sans: var(--kimi-font-sans, -apple-system, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif);
    --mono: var(--kimi-font-mono, ui-monospace, Consolas, monospace);
    --sp1: var(--kimi-space-1, 4px); --sp2: var(--kimi-space-2, 8px); --sp3: var(--kimi-space-3, 12px);
    --sp4: var(--kimi-space-4, 16px); --sp5: var(--kimi-space-5, 20px); --sp6: var(--kimi-space-6, 24px);
    --rc: var(--kimi-radius-chip, 6px); --rp: var(--kimi-radius-panel, 12px); --ri: var(--kimi-radius-input, 10px);
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .root { padding: var(--sp3) var(--sp4); font-family: var(--sans); color: var(--kt); font-size: 14px; line-height: 1.55; }
  .head { margin-block-end: var(--sp2); }
  .head h1 { font-size: 17px; font-weight: 500; }
  .head .meta { font-size: 12px; color: var(--k3); margin-block-start: 2px; }
  .stats { display: flex; flex-wrap: wrap; gap: var(--sp1); margin-block-end: var(--sp2); }
  .stat { font-size: 12px; color: var(--k3); border: 1px solid var(--bd); border-radius: var(--rc); padding: 1px var(--sp2); font-variant-numeric: tabular-nums; }
  .stat b { color: var(--kt); font-weight: 500; margin-inline-end: 3px; }
  .toolbar { margin-block-end: var(--sp2); }
  .toolbar input { width: 100%; padding: 6px var(--sp3); border: 1px solid var(--bd); border-radius: var(--ri); background: transparent; font-size: 13px; color: var(--kt); font-family: var(--sans); }
  .toolbar input::placeholder { color: var(--k4); }
  .toolbar input:focus { outline: 2px solid var(--kt); outline-offset: -1px; }

  details.ch { border-block-start: 1px solid var(--bd); }
  details.ch:first-of-type { border-block-start: none; }
  details.ch summary { display: flex; align-items: center; gap: var(--sp2); padding-block: var(--sp2); cursor: pointer; list-style: none; font-size: 14px; font-weight: 500; }
  details.ch summary::-webkit-details-marker { display: none; }
  details.ch summary .chev { flex: none; width: 16px; height: 16px; color: var(--k3); transition: transform .15s ease-out; }
  details.ch[open] summary .chev { transform: rotate(90deg); }
  details.ch summary .stars { color: var(--warn); font-size: 12px; letter-spacing: 1px; }
  details.ch summary .sum { font-weight: 400; font-size: 12px; color: var(--k3); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; }
  details.ch summary .n { margin-inline-start: auto; font-size: 12px; color: var(--k4); font-variant-numeric: tabular-nums; flex: none; }
  .ch-body { padding-block-end: var(--sp3); }
  .p0 { font-size: 12px; color: var(--k2); background: var(--sm); border-radius: var(--rc); padding: var(--sp2) var(--sp3); margin-block-end: var(--sp2); }
  .mod { margin-block-end: var(--sp2); }
  .mod h4 { font-size: 12px; color: var(--k3); font-weight: 500; margin-block-end: 2px; }
  .pt { display: flex; align-items: baseline; gap: var(--sp2); padding-block: 3px; padding-inline: var(--sp1); border-radius: var(--rc); }
  .pt:hover { background: var(--sm); }
  .pt .id { font-family: var(--mono); font-size: 11px; color: var(--k4); flex: none; }
  .pt .nm { flex: 1; min-width: 0; }
  .pt .nm .chips { display: flex; flex-wrap: wrap; gap: var(--sp1); margin-block-start: 2px; }
  .pt .done { color: var(--pos); font-size: 12px; flex: none; }
  .badge.dash { border-style: dashed; color: var(--k3); }
  .cnt { display: inline-block; font-size: 10px; padding: 0 5px; border-radius: var(--rc); flex: none; font-variant-numeric: tabular-nums; white-space: nowrap; }
  .cnt.leafy { color: var(--pos); background: color-mix(in srgb, var(--pos) 10%, transparent); }
  .cnt.cardy { color: var(--em); background: color-mix(in srgb, var(--em) 10%, transparent); }

  .leaf { display: flex; gap: var(--sp2); align-items: baseline; padding-block: 4px; padding-inline: var(--sp1); border-radius: var(--rc); }
  .leaf:hover { background: var(--sm); }
  .leaf .nm { font-weight: 500; }
  .leaf .intro { color: var(--k3); font-size: 12px; }
  .gnote { font-size: 12px; color: var(--k3); margin-block: var(--sp1) var(--sp2); }
  .orphan { margin-block-start: var(--sp2); padding-block-start: var(--sp2); border-block-start: 1px dashed var(--bd); font-size: 12px; color: var(--k3); display: flex; flex-wrap: wrap; gap: var(--sp1); align-items: baseline; }

  .cardx { border: 1px solid var(--bd); border-radius: var(--ri); padding: var(--sp3); margin-block-end: var(--sp2); }
  .cardx h3 { font-size: 14px; font-weight: 500; display: flex; align-items: center; gap: var(--sp2); flex-wrap: wrap; }
  .cardx .sub { font-size: 12px; color: var(--k3); margin-block-start: 2px; }
  .kv { display: flex; gap: var(--sp2); margin-block-start: var(--sp1); font-size: 13px; }
  .kv b { flex: none; width: 60px; font-weight: 500; font-size: 12px; color: var(--k3); padding-block-start: 1px; }
  .tags { display: flex; flex-wrap: wrap; gap: var(--sp1); }

  a { color: var(--kt); text-decoration: none; border-block-end: 1px solid transparent; }
  a:hover { border-block-end-color: var(--kt); }
  .badge { display: inline-block; font-size: 11px; padding: 0 var(--sp2); border-radius: var(--rc); border: 1px solid var(--bd); color: var(--k3); font-variant-numeric: tabular-nums; white-space: nowrap; }
  .badge.leafy { color: var(--pos); border-color: color-mix(in srgb, var(--pos) 35%, transparent); background: color-mix(in srgb, var(--pos) 8%, transparent); }
  .badge.lv-深入 { color: var(--warn); border-color: color-mix(in srgb, var(--warn) 35%, transparent); background: color-mix(in srgb, var(--warn) 8%, transparent); }
  .badge.lv-跟练 { color: var(--pos); border-color: color-mix(in srgb, var(--pos) 35%, transparent); background: color-mix(in srgb, var(--pos) 8%, transparent); }
  .badge.grad { color: var(--c4); border-color: color-mix(in srgb, var(--c4) 35%, transparent); background: color-mix(in srgb, var(--c4) 8%, transparent); }
  .badge.kind-twig { color: var(--c4); border-color: color-mix(in srgb, var(--c4) 35%, transparent); background: color-mix(in srgb, var(--c4) 8%, transparent); }
  .mono { font-family: var(--mono); font-size: 11px; }
  .empty { color: var(--k4); text-align: center; padding-block: var(--sp6); font-size: 13px; }
  footer { margin-block-start: var(--sp3); font-size: 11px; color: var(--k4); }
"""

# 各组件共用的渲染辅助 JS（小组件独立 iframe，无跨板块跳转，只保留搜索 + 手风琴）
JS_HELPERS = r"""
const $ = s => document.querySelector(s);
const esc = s => (s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const stars = n => '★'.repeat(n) + '<span style="opacity:.25">' + '★'.repeat(Math.max(0, 3 - n)) + '</span>';
const chev = '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>';
let query = '';
function match(...fields) { const q = query.toLowerCase(); return !q || fields.some(f => (f || '').toLowerCase().includes(q)); }
function bindAccordion(store) {
  document.querySelectorAll('details.ch').forEach(d => d.ontoggle = () => {
    if (!query) { d.open ? store.add(d.dataset.key) : store.delete(d.dataset.key); }
  });
}
"""

COMMON_HEAD = """<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<style>{css}</style>
</head>
<body>
<div class="root">
  <div class="head"><h1>{title}</h1><p class="meta" id="meta"></p></div>
  <div class="stats" id="stats"></div>
  <div class="toolbar"><input id="q" type="search" placeholder="搜索：名称 / 编号 / 关键词…" aria-label="搜索"></div>
  <main id="main"></main>
  <footer>S2AI 学习树 · 由 scripts/export-widgets.py 生成 · 数据更新后重跑脚本并覆盖组件即可刷新</footer>
</div>
<script id="tree-data" type="application/json">{data}</script>
<script>
const T = JSON.parse(document.getElementById('tree-data').textContent);
"""


def page(title: str, data: dict, body_js: str) -> str:
    return (COMMON_HEAD.replace('{title}', title).replace('{css}', CSS)
            .replace('{data}', json.dumps(data, ensure_ascii=False))
            + JS_HELPERS + body_js + '\n</script>\n</body>\n</html>\n')


def theory_page(t: dict) -> str:
    chapters, leaves, cards = t['chapters'], t['leaves'], t['cards']
    # 反向引用与网页版 / 单文件看板同口径：叶子的 anchor 或 tags 指向点编号即挂在本枝节；
    # 卡片的 target/next 指向点编号即计入。挂载关系在 Python 侧算好内嵌进每个学习点。
    pt_re = re.compile(r'^\d{2}-M\d+\.\d+$')
    leaves_by_pt, card_ids_by_pt = {}, {}
    for l in leaves:
        pts = {l['anchor'], *l['tags']}
        for pid in pts:
            if pt_re.match(pid):
                leaves_by_pt.setdefault(pid, []).append(
                    {'id': l['id'], 'name': l['name'], 'url': l['url'], 'intro': l['intro']})
    for c in cards:
        for r in dict.fromkeys([c['target'], *c['next']]):
            if r and pt_re.match(r):
                card_ids_by_pt.setdefault(r, []).append({'id': c['id'], 'name': c['name']})
    for ch in chapters:
        for mo in ch['modules']:
            for pt in mo['points']:
                # 叶子/卡片的引用带篇章前缀（'02-M5.2'），学习点 id 是相对篇章的（'M5.2'）——按全编号对齐
                full_id = f"{ch['id']}-{pt['id']}"
                pt['leaves'] = leaves_by_pt.get(full_id, [])
                pt['cards'] = card_ids_by_pt.get(full_id, [])
    data = {'chapters': chapters, 'generated': t['generated']}
    pts = sum(len(m['points']) for c in chapters for m in c['modules'])
    body = r"""
const openCh = new Set(T.chapters.length ? [T.chapters[0].id] : []);
function renderStats() {
  $('#meta').textContent = '生成于 ' + T.generated + ' · 只读投影（生长动作在 Agent 端）';
  const nLeaves = T.chapters.reduce((n, c) => n + c.modules.reduce((k, m) => k + m.points.reduce((x, p) => x + p.leaves.length, 0), 0), 0);
  $('#stats').innerHTML = [
    ['篇章', T.chapters.length], ['学习点', """ + str(pts) + r"""],
    ['挂枝叶子', nLeaves],
    ['已点亮', T.chapters.reduce((n, c) => n + c.modules.reduce((k, m) => k + m.points.filter(p => p.done).length, 0), 0)],
  ].map(([k, v]) => `<span class="stat"><b>${v}</b>${k}</span>`).join('');
}
function render() {
  $('#main').innerHTML = T.chapters.map(ch => {
    const chHit = match(ch.name, ch.summary, ch.p0);
    const modsHtml = ch.modules.map(mo => {
      const rows = mo.points.filter(pt => chHit || match(pt.name, pt.id, ch.id + '-' + pt.id)).map(pt => {
        const chips = pt.leaves.length ? `<span class="chips">${pt.leaves.map(l => l.url
          ? `<a class="badge leafy" href="${esc(l.url)}" target="_blank" rel="noopener" title="叶子：${esc(l.intro)}">${esc(l.name)} ↗</a>`
          : `<span class="badge dash" title="练习项：${esc(l.intro)}">✎ ${esc(l.name)}</span>`).join('')}</span>` : '';
        const leafCnt = pt.leaves.length ? `<span class="cnt leafy" title="${pt.leaves.length} 片叶子长在本枝节">叶 ${pt.leaves.length}</span>` : '';
        const cardCnt = pt.cards.length ? `<span class="cnt cardy" title="${pt.cards.length} 张学习卡片指向本点：${pt.cards.map(c => esc(c.name)).join(' / ')}">卡 ${pt.cards.length}</span>` : '';
        return `
        <div class="pt"><span class="id">${ch.id}-${pt.id}</span><span class="nm">${esc(pt.name)}${chips}</span>
          <span>${stars(pt.freq)}</span>${leafCnt}${cardCnt}${pt.done ? '<span class="done">✓</span>' : ''}</div>`;
      }).join('');
      return rows ? `<div class="mod"><h4>${esc(mo.name)}</h4>${rows}</div>` : '';
    }).join('');
    if (query && !modsHtml) return '';
    const total = ch.modules.reduce((n, mo) => n + mo.points.length, 0);
    const open = query ? true : openCh.has(ch.id);
    return `<details class="ch" data-key="${ch.id}" ${open ? 'open' : ''}>
      <summary>${chev}<span>${ch.id} · ${esc(ch.name)}</span><span class="stars">${'★'.repeat(ch.weight)}</span>
        <span class="sum">${esc(ch.summary)}</span><span class="n">${total} 点</span></summary>
      <div class="ch-body">
        ${ch.p0 ? `<p class="p0">优先学习配方：${esc(ch.p0)}</p>` : ''}
        ${modsHtml}
      </div></details>`;
  }).join('') || '<div class="empty">没有匹配的学习点</div>';
  bindAccordion(openCh);
}
$('#q').addEventListener('input', e => { query = e.target.value.trim(); render(); });
renderStats(); render();
"""
    return page('S2AI 理论地图', data, body)


def leaves_page(t: dict) -> str:
    chapters, leaves, cards = t['chapters'], t['leaves'], t['cards']
    chapters_by_id = {c['id']: c['name'] for c in chapters}
    groups = {}
    for l in leaves:
        k = l['anchor'] if l['anchor'] in ('root', 'wild') else l['anchor'].split('-')[0]
        groups.setdefault(k, []).append(l)
    order = ['root'] + [c['id'] for c in chapters] + ['wild']
    group_list = [{'key': k, 'name': ('树根 · 基础工具' if k == 'root' else '野生叶子' if k == 'wild' else k + ' · ' + chapters_by_id.get(k, '')),
                   'opt': k == 'wild', 'items': groups[k]} for k in order if k in groups]

    def card_hits(c, l):
        keys = {c['target'], *c['next']}
        return l['id'] in keys or l['anchor'] in keys or any(tg in keys for tg in l['tags'])

    cards_by_leaf = {l['id']: [c for c in cards if card_hits(c, l)] for l in leaves}
    orphan = {}
    for c in cards:
        if not any(card_hits(c, l) for l in leaves):
            m = re.match(r'^(\d{2})-M', c['target']) if c['target'] else None
            orphan.setdefault(m.group(1) if m else 'root', []).append(c)

    data = {'groups': group_list, 'cardsByLeaf': cards_by_leaf, 'orphan': orphan,
            'generated': t['generated']}
    body = r"""
const openGrp = new Set(['root']);
function renderStats() {
  $('#meta').textContent = '生成于 ' + T.generated + ' · 只读投影（生长动作在 Agent 端）';
  const n = T.groups.reduce((k, g) => k + g.items.length, 0);
  const wild = (T.groups.find(g => g.key === 'wild') || { items: [] }).items.length;
  $('#stats').innerHTML = [['分组', T.groups.length], ['叶子', n], ['野生', wild]]
    .map(([k, v]) => `<span class="stat"><b>${v}</b>${k}</span>`).join('');
}
function render() {
  $('#main').innerHTML = T.groups.map(g => {
    const items = g.items.filter(it => match(it.name, it.intro, it.id, it.anchor, it.tags.join(' '))).map(it => `
      <div class="leaf">
        <span style="flex:1;min-width:0">
          <span class="nm">${it.url ? `<a href="${esc(it.url)}" target="_blank" rel="noopener">${esc(it.name)} ↗</a>` : esc(it.name)}</span>
          ${it.practice ? '<span class="badge">练习</span>' : ''}
          ${it.opt ? '<span class="badge">支线</span>' : ''}
          <span class="intro"> — ${esc(it.intro)}</span>
          ${(T.cardsByLeaf[it.id] || []).map(c => `<span class="badge leafy" title="学习卡片「${esc(c.name)}」">${esc(c.name)}</span>`).join(' ')}
        </span>
        ${it.anchor && it.anchor.includes('-') ? `<span class="badge mono">${esc(it.anchor)}</span>` : ''}
      </div>`).join('');
    if (query && !items) return '';
    const orphans = T.orphan[g.key] || [];
    const orphanLine = orphans.length && !query ? `
      <p class="orphan">本枝干知识卡片（暂未挂到具体叶子）：
        ${orphans.map(c => `<span class="badge leafy">${esc(c.name)}</span>`).join(' ')}</p>` : '';
    const open = query ? true : openGrp.has(g.key);
    return `<details class="ch" data-key="${g.key}" ${open ? 'open' : ''}>
      <summary>${chev}<span>${esc(g.name)}</span>${g.opt ? '<span class="badge">支线</span>' : ''}
        <span class="n">${g.items.length} 片</span></summary>
      <div class="ch-body">
        ${g.key === 'wild' ? '<p class="gnote">已进树但未落户：树还没长出对应枝干，长出后移入正式分组。</p>' : ''}
        ${items}${orphanLine}
      </div></details>`;
  }).join('') || '<div class="empty">没有匹配的叶子</div>';
  bindAccordion(openGrp);
}
$('#q').addEventListener('input', e => { query = e.target.value.trim(); render(); });
renderStats(); render();
"""
    return page('S2AI 叶子清单', data, body)


def inbox_page(t: dict) -> str:
    data = {'inbox': t['inbox'], 'generated': t['generated']}
    body = r"""
function renderStats() {
  $('#meta').textContent = '生成于 ' + T.generated + ' · 只读投影（收录/毕业动作在 Agent 端）';
  const twig = T.inbox.filter(i => i.kind === 'twig').length;
  const grad = T.inbox.filter(i => i.graduated).length;
  $('#stats').innerHTML = [['条目', T.inbox.length], ['新枝节', twig], ['已毕业', grad]]
    .map(([k, v]) => `<span class="stat"><b>${v}</b>${k}</span>`).join('');
}
function render() {
  $('#main').innerHTML = T.inbox.filter(it => match(it.name, it.intro, it.cat, it.concept)).map(it => `
    <div class="cardx">
      <h3><a href="${esc(it.url)}" target="_blank" rel="noopener">${esc(it.name)} ↗</a>
        <span class="badge ${it.kind === 'twig' ? 'kind-twig' : 'leafy'}">${it.kind === 'twig' ? '新枝节' : '新叶子'}</span>
        <span class="badge lv-${esc(it.level)}">${esc(it.level)}</span>
        ${it.graduated ? `<span class="badge grad">已毕业 ${esc(it.graduated)}</span>` : ''}</h3>
      <div class="sub">${esc(it.cat)} · 收录于 ${esc(it.added)}</div>
      <div class="kv"><b>是什么</b><span>${esc(it.intro)}</span></div>
      <div class="kv"><b>为什么收</b><span>${esc(it.why)}</span></div>
      <div class="kv"><b>怎么下潜</b><span>${esc(it.dive)}</span></div>
      ${it.concept ? `<div class="kv"><b>新概念</b><span>${esc(it.concept)}（待入理论线）</span></div>` : ''}
    </div>`).join('') || '<div class="empty">没有匹配的收集箱条目</div>';
}
$('#q').addEventListener('input', e => { query = e.target.value.trim(); render(); });
renderStats(); render();
"""
    return page('S2AI 收集箱', data, body)


def cards_page(t: dict) -> str:
    leaves = t['leaves']

    def card_hits(c, l):
        keys = {c['target'], *c['next']}
        return l['id'] in keys or l['anchor'] in keys or any(tg in keys for tg in l['tags'])

    # 相关叶子在 Python 侧算好内嵌（id/anchor/tags 口径同单文件看板），前端不再依赖叶子切片
    cards = []
    for c in t['cards']:
        c = dict(c, rel=[{'name': l['name'], 'url': l['url']} for l in leaves if card_hits(c, l)])
        cards.append(c)
    data = {'cards': cards, 'generated': t['generated']}
    body = r"""
function renderStats() {
  $('#meta').textContent = '生成于 ' + T.generated + ' · 只读投影（新建卡片动作在 Agent 端）';
  $('#stats').innerHTML = [['卡片', T.cards.length]]
    .map(([k, v]) => `<span class="stat"><b>${v}</b>${k}</span>`).join('');
}
function render() {
  $('#main').innerHTML = T.cards.filter(cd => match(cd.name, cd.tags.join(' '), cd.target)).map(cd => {
    const rel = cd.rel || [];
    return `
    <div class="cardx">
      <h3><a href="${esc(cd.url)}" target="_blank" rel="noopener">${esc(cd.name)} ↗</a>
        ${cd.date ? `<span class="badge">${esc(cd.date)}</span>` : ''}
        ${cd.madeBy ? `<span class="badge">${esc(cd.madeBy)}</span>` : ''}</h3>
      <div class="sub">挂载点 ${cd.target ? `<span class="badge mono">${esc(cd.target)}</span>` : '—'}</div>
      <div class="kv"><b>技术栈</b><span class="tags">${cd.tags.map(x => `<span class="badge">${esc(x)}</span>`).join('')}</span></div>
      ${rel.length ? `<div class="kv"><b>相关叶子</b><span>${rel.map(l => l.url
        ? `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.name)} ↗</a>`
        : `<span class="badge">${esc(l.name)}</span>`).join('　')}</span></div>` : ''}
      <div class="kv"><b>接下来</b><span>${cd.next.map(n => `<span class="badge mono">${esc(n)}</span>`).join(' ') || '—'}</span></div>
    </div>`;
  }).join('') || '<div class="empty">没有匹配的卡片</div>';
}
$('#q').addEventListener('input', e => { query = e.target.value.trim(); render(); });
renderStats(); render();
"""
    return page('S2AI 学习卡片', data, body)


def main():
    t = tree()
    OUT.mkdir(parents=True, exist_ok=True)
    pages = {'theory': theory_page(t), 'leaves': leaves_page(t),
             'inbox': inbox_page(t), 'cards': cards_page(t)}
    for name, html in pages.items():
        (OUT / f'{name}.html').write_text(html, encoding='utf-8')
        print(f'已导出 {OUT / (name + ".html")} ({len(html) // 1024} KB)')
    print(f'数据：{len(t["chapters"])} 篇章 / {len(t["leaves"])} 叶子 / '
          f'{len(t["inbox"])} 收集箱 / {len(t["cards"])} 卡片 / 生成于 {t["generated"]}')


if __name__ == '__main__':
    main()
