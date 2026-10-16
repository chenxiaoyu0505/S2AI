#!/usr/bin/env python3
# export-dashboard.py —— 把学习树导出为自包含的单文件 HTML 看板
# 任何 Agent / 任何机器都能用：python scripts/export-dashboard.py
# 产物 dashboard/tree.html 内嵌全部树数据 + 原生 JS 渲染，无需 node、无需服务器，浏览器直接打开。
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


# ---------- 项目清单 ----------
def parse_checklist():
    text = (DATA / 'content.ts').read_text(encoding='utf-8')
    body = slice_export(text, 'CHECKLIST')
    cats, cur = [], None
    for line in body.splitlines():
        m = re.search(r"\{ name: '((?:[^'\\]|\\.)*)'(, opt: true)?, items: \[", line)
        if m:
            cur = {'name': unquote(m.group(1)), 'opt': bool(m.group(2)), 'items': []}
            cats.append(cur)
            continue
        m = re.search(r"\{ id: '([^']+)', t: '((?:[^'\\]|\\.)*)'(, e: '((?:[^'\\]|\\.)*)')?(, ref: '((?:[^'\\]|\\.)*)')? \}", line)
        if m and cur is not None:
            item = {'id': m.group(1), 't': unquote(m.group(2))}
            if m.group(4):
                item['e'] = unquote(m.group(4))
            if m.group(6):
                item['ref'] = unquote(m.group(6))
            cur['items'].append(item)
    return cats


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
            'name': field('name'), 'url': url, 'added': field('added'), 'cat': field('cat'),
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


tree = {'chapters': parse_theory(), 'checklist': parse_checklist(),
        'inbox': parse_inbox(), 'cards': parse_cards(), 'generated': str(date.today())}

HTML = r"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>S2AI 学习树 · 看板</title>
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
         background: #fafafa; color: #1a1a1a; line-height: 1.6; font-size: 14px; }
  #app { max-width: 1080px; margin: 0 auto; padding: 24px 20px 64px; }
  header { display: flex; flex-wrap: wrap; align-items: baseline; gap: 8px 16px; margin-bottom: 4px; }
  header h1 { font-size: 20px; font-weight: 600; }
  header .meta { color: #888; font-size: 12px; }
  .stats { display: flex; flex-wrap: wrap; gap: 8px; margin: 12px 0 16px; }
  .stat { background: #fff; border: 1px solid #e5e5e5; border-radius: 8px; padding: 6px 12px; font-size: 12px; color: #666; }
  .stat b { color: #1a1a1a; font-size: 15px; margin-right: 4px; font-variant-numeric: tabular-nums; }
  .toolbar { display: flex; gap: 8px; align-items: center; margin-bottom: 16px; flex-wrap: wrap; }
  .toolbar input { flex: 1; min-width: 200px; padding: 8px 12px; border: 1px solid #ddd; border-radius: 8px; font: inherit; background: #fff; }
  .toolbar input:focus { outline: 2px solid #1a1a1a; outline-offset: -1px; }
  nav.tabs { display: flex; gap: 4px; border-bottom: 1px solid #e5e5e5; margin-bottom: 20px; flex-wrap: wrap; }
  nav.tabs button { border: none; background: none; padding: 8px 14px; font: inherit; color: #666; cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -1px; }
  nav.tabs button[aria-selected="true"] { color: #1a1a1a; font-weight: 600; border-bottom-color: #1a1a1a; }
  nav.tabs button .cnt { color: #999; font-size: 12px; margin-left: 4px; }
  .panel { display: none; }
  .panel.active { display: block; }
  .card { background: #fff; border: 1px solid #e5e5e5; border-radius: 10px; padding: 14px 16px; margin-bottom: 12px; }
  .card h3 { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
  .card .sub { color: #888; font-size: 12px; margin-bottom: 8px; }
  .mod { margin-top: 10px; }
  .mod h4 { font-size: 13px; color: #444; margin-bottom: 6px; font-weight: 600; }
  .pt { display: flex; align-items: center; gap: 8px; padding: 4px 6px; border-radius: 6px; }
  .pt:hover { background: #f3f3f3; }
  .pt .id { font-family: ui-monospace, Consolas, monospace; font-size: 11px; color: #999; min-width: 62px; }
  .pt .name { flex: 1; }
  .stars { color: #d97706; font-size: 12px; letter-spacing: 1px; white-space: nowrap; }
  .done { color: #16a34a; font-size: 12px; }
  .item { display: flex; gap: 8px; align-items: baseline; padding: 5px 6px; border-radius: 6px; }
  .item:hover { background: #f3f3f3; }
  .item .id { font-family: ui-monospace, Consolas, monospace; font-size: 11px; color: #999; min-width: 84px; }
  .item .e { color: #888; font-size: 12px; }
  .badge { display: inline-block; font-size: 11px; padding: 1px 7px; border-radius: 999px; background: #f0f0f0; color: #555; border: 1px solid #e0e0e0; white-space: nowrap; }
  .badge.ref, .badge.node { cursor: pointer; background: #eef2ff; color: #4338ca; border-color: #e0e7ff; }
  .badge.node:hover { background: #e0e7ff; }
  .badge.broken { background: #fef2f2; color: #dc2626; border-color: #fecaca; text-decoration: line-through; }
  .badge.level-深入 { background: #ecfdf5; color: #047857; border-color: #d1fae5; }
  .badge.level-跟练 { background: #fffbeb; color: #b45309; border-color: #fef3c7; }
  .badge.grad { background: #f5f3ff; color: #6d28d9; border-color: #ede9fe; }
  .tags { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 6px; }
  .tag { font-size: 11px; padding: 1px 8px; border-radius: 999px; background: #f5f5f5; color: #555; border: 1px solid #e8e8e8; }
  .kv { margin-top: 6px; font-size: 13px; color: #444; }
  .kv b { color: #888; font-weight: 500; font-size: 12px; margin-right: 6px; }
  a { color: #2563eb; text-decoration: none; }
  a:hover { text-decoration: underline; }
  .hl { outline: 2px solid #f59e0b; outline-offset: 1px; }
  .empty { color: #999; padding: 24px; text-align: center; }
  footer { margin-top: 32px; color: #aaa; font-size: 12px; text-align: center; }
  /* 嵌进 Kimi Work widget 时：背景交给宿主，颜色跟随宿主主题令牌 */
  html.in-kimi body { background: transparent; color: var(--kimi-color-text-primary); }
  html.in-kimi .card, html.in-kimi .stat, html.in-kimi .toolbar input { background: var(--kimi-color-surface-raised); border-color: var(--kimi-color-border); color: var(--kimi-color-text-primary); }
  html.in-kimi .sub, html.in-kimi .meta, html.in-kimi .id, html.in-kimi .kv b, html.in-kimi footer { color: var(--kimi-color-text-tertiary); }
  html.in-kimi .pt:hover, html.in-kimi .item:hover { background: var(--kimi-color-surface-muted); }
  html.in-kimi .e { color: var(--kimi-color-text-secondary); }
  html.in-kimi a { color: var(--kimi-color-accent); }
  html.in-kimi nav.tabs { border-bottom-color: var(--kimi-color-border); }
  html.in-kimi nav.tabs button { color: var(--kimi-color-text-secondary); }
  html.in-kimi nav.tabs button[aria-selected="true"] { color: var(--kimi-color-text-primary); border-bottom-color: var(--kimi-color-text-primary); }
</style>
</head>
<body>
<div id="app">
  <header>
    <h1>S2AI 学习树</h1>
    <span class="meta" id="meta"></span>
  </header>
  <div class="stats" id="stats"></div>
  <div class="toolbar">
    <input id="q" type="search" placeholder="搜索当前板块：名称 / 编号 / 关键词…" aria-label="搜索">
  </div>
  <nav class="tabs" id="tabs" role="tablist"></nav>
  <main id="main"></main>
  <footer>S2AI（science to AI）· 本看板由 scripts/export-dashboard.py 生成 · 改数据后重新导出即可刷新</footer>
</div>
<script id="tree-data" type="application/json">__DATA__</script>
<script>
if (window.DaimonWidget) document.documentElement.classList.add('in-kimi');
const T = JSON.parse(document.getElementById('tree-data').textContent);
const $ = s => document.querySelector(s);

// ---------- 节点索引：id/url -> 位置 ----------
const idx = {};
function reg(key, type, c, m, p) { if (key) idx[key] = { type, c, m, p }; }
T.chapters.forEach((ch, c) => ch.modules.forEach((mo, m) => mo.points.forEach((pt, p) => {
  reg(ch.id + '-' + pt.id, 'theory', c, m, p);
  reg(pt.id, 'theory', c, m, p); // 章内简写
})));
T.checklist.forEach((cat, c) => cat.items.forEach((it, i) => reg(it.id, 'list', c, null, i)));
T.inbox.forEach((it, i) => reg(it.url, 'inbox', i));
T.cards.forEach((cd, i) => reg(cd.id, 'card', i));

const esc = s => (s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const stars = n => '★'.repeat(n) + '<span style="color:#ddd">' + '★'.repeat(Math.max(0, 3 - n)) + '</span>';

let cur = 0, query = '';
const TABS = [
  { key: 'theory', name: '理论地图' },
  { key: 'list', name: '项目清单' },
  { key: 'inbox', name: '收集箱' },
  { key: 'cards', name: '学习卡片' },
];
const count = { theory: T.chapters.reduce((n, c) => n + c.modules.reduce((k, m) => k + m.points.length, 0), 0),
  list: T.checklist.reduce((n, c) => n + c.items.length, 0), inbox: T.inbox.length, cards: T.cards.length };

function nodeBadge(key) {
  if (!key) return '';
  if (idx[key]) return `<span class="badge node" data-go="${esc(key)}" title="跳转到 ${esc(key)}">${esc(key)}</span>`;
  return `<span class="badge broken" title="树上没有此节点——断链">${esc(key)}</span>`;
}
function match(...fields) { const q = query.toLowerCase(); return !q || fields.some(f => (f || '').toLowerCase().includes(q)); }

function renderTabs() {
  $('#tabs').innerHTML = TABS.map((t, i) =>
    `<button role="tab" aria-selected="${i === cur}" data-tab="${i}">${t.name}<span class="cnt">${count[t.key]}</span></button>`).join('');
  $('#stats').innerHTML = [
    ['篇章', T.chapters.length], ['学习点', count.theory], ['清单项', count.list],
    ['收集箱', count.inbox], ['卡片', count.cards],
  ].map(([k, v]) => `<span class="stat"><b>${v}</b>${k}</span>`).join('');
  $('#meta').textContent = '生成于 ' + T.generated + ' · 只读投影（生长动作在 Agent 端）';
}

function panelTheory() {
  return T.chapters.map((ch, c) => {
    if (!match(ch.name, ch.summary, ch.p0) && !ch.modules.some(mo => mo.points.some(pt => match(pt.name, ch.id + '-' + pt.id, pt.id))))
      return '';
    const mods = ch.modules.map((mo, m) => {
      const pts = mo.points.map((pt, p) => match(pt.name, pt.id, ch.id + '-' + pt.id) ? `
        <div class="pt" id="th-${c}-${m}-${p}">
          <span class="id">${ch.id}-${pt.id}</span><span class="name">${esc(pt.name)}</span>
          <span class="stars">${stars(pt.freq)}</span>${pt.done ? '<span class="done">✓ 已学</span>' : ''}
        </div>` : '').join('');
      return pts ? `<div class="mod"><h4>${esc(mo.name)}</h4>${pts}</div>` : '';
    }).join('');
    if (!mods) return '';
    return `<div class="card">
      <h3>${ch.id} · ${esc(ch.name)}</h3>
      <div class="sub">${esc(ch.summary)}${ch.p0 ? ' ｜ 优先学习配方：' + esc(ch.p0) : ''}</div>
      ${mods}</div>`;
  }).join('') || '<div class="empty">没有匹配的学习点</div>';
}

function panelList() {
  return T.checklist.map(cat => {
    const items = cat.items.filter(it => match(it.t, it.e, it.id, it.ref)).map((it, i) => `
      <div class="item" id="li-${T.checklist.indexOf(cat)}-${i}">
        <span class="id">${esc(it.id)}</span>
        <span><span style="font-weight:500">${esc(it.t)}</span>
        ${it.e ? `<span class="e"> — ${esc(it.e)}</span>` : ''}</span>
        ${it.ref ? it.ref.split('+').map(r => r.trim()).map(r => {
          const m = r.match(/^(\d+-M\d+\.\d+)(?:[–—-](\d+))?/);
          if (m && m[2]) { let out = '', a = +m[1].split('.')[1], b = +m[2];
            for (let k = a; k <= b; k++) out += nodeBadge(m[1].split('.')[0] + '.' + k) + ' ';
            return out; }
          return nodeBadge(r);
        }).join('') : ''}
      </div>`).join('');
    return items ? `<div class="card"><h3>${esc(cat.name)}${cat.opt ? ' <span class="badge">选学</span>' : ''}</h3>${items}</div>` : '';
  }).join('') || '<div class="empty">没有匹配的清单项</div>';
}

function panelInbox() {
  return T.inbox.filter(it => match(it.name, it.intro, it.cat, it.concept)).map((it, i) => `
    <div class="card" id="ib-${i}">
      <h3><a href="${esc(it.url)}" target="_blank" rel="noopener">${esc(it.name)}</a>
        <span class="badge level-${esc(it.level)}">${esc(it.level)}</span>
        ${it.graduated ? `<span class="badge grad">已毕业 ${esc(it.graduated)}</span>` : ''}</h3>
      <div class="sub">${esc(it.cat)} · 收录于 ${esc(it.added)}</div>
      <div class="kv"><b>是什么</b>${esc(it.intro)}</div>
      <div class="kv"><b>为什么收</b>${esc(it.why)}</div>
      <div class="kv"><b>怎么下潜</b>${esc(it.dive)}</div>
      ${it.concept ? `<div class="kv"><b>新概念</b>${esc(it.concept)}（待入理论线）</div>` : ''}
    </div>`).join('') || '<div class="empty">没有匹配的收集箱条目</div>';
}

function panelCards() {
  return T.cards.filter(cd => match(cd.name, cd.tags.join(' '), cd.target)).map((cd, i) => `
    <div class="card" id="cd-${i}">
      <h3><a href="${esc(cd.url)}" target="_blank" rel="noopener">${esc(cd.name)}</a>
        ${cd.date ? `<span class="badge">${esc(cd.date)}</span>` : ''}
        ${cd.madeBy ? `<span class="badge">${esc(cd.madeBy)}</span>` : ''}</h3>
      <div class="sub">挂载点 ${nodeBadge(cd.target)}</div>
      <div class="tags">${cd.tags.map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>
      <div class="kv"><b>接下来</b>${cd.next.map(n => nodeBadge(n)).join(' ') || '—'}</div>
    </div>`).join('') || '<div class="empty">没有匹配的卡片</div>';
}

const panels = { theory: panelTheory, list: panelList, inbox: panelInbox, cards: panelCards };
const panelEl = { theory: 'th', list: 'li', inbox: 'ib', cards: 'cd' };

function render() {
  renderTabs();
  $('#main').innerHTML = `<div class="panel active">${panels[TABS[cur].key]()}</div>`;
  document.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => { cur = +b.dataset.tab; render(); });
  document.querySelectorAll('[data-go]').forEach(b => b.onclick = () => go(b.dataset.go));
  if (location.hash.length > 1) go(decodeURIComponent(location.hash.slice(1)), true);
}

function go(key, fromHash) {
  const t = idx[key];
  if (!t) return;
  cur = { theory: 0, list: 1, inbox: 2, card: 3 }[t.type];
  render();
  const el = document.getElementById(`${panelEl[TABS[cur].key]}-${t.c}${t.m == null ? '-' + t.p : '-' + t.m + '-' + t.p}`);
  if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.classList.add('hl'); setTimeout(() => el.classList.remove('hl'), 1600); }
  if (!fromHash) history.replaceState(null, '', '#' + encodeURIComponent(key));
}

$('#q').addEventListener('input', e => { query = e.target.value.trim(); render(); });
render();
</script>
</body>
</html>
"""

html = HTML.replace('__DATA__', json.dumps(tree, ensure_ascii=False))
out = Path(sys.argv[sys.argv.index('--out') + 1]) if '--out' in sys.argv else ROOT / 'dashboard' / 'tree.html'
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(html, encoding='utf-8')
pts = sum(len(m['points']) for c in tree['chapters'] for m in c['modules'])
print(f'看板已导出：{out}')
print(f'数据：{len(tree["chapters"])} 篇章 / {pts} 学习点 / '
      f'{sum(len(c["items"]) for c in tree["checklist"])} 清单项 / '
      f'{len(tree["inbox"])} 收集箱 / {len(tree["cards"])} 卡片')
