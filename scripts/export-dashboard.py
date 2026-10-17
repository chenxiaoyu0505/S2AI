#!/usr/bin/env python3
# export-dashboard.py —— 把学习树导出为自包含的单文件 HTML 看板
# 任何 Agent / 任何机器都能用：python scripts/export-dashboard.py
# 产物 dashboard/tree.html 内嵌全部树数据 + 原生 JS 渲染，无需 node、无需服务器，浏览器直接打开。
# 页面模板在 scripts/dashboard-template.html（Kimi 设计令牌 + 独立打开回退样式），改模板后重新导出即可。
# 数据解析在 scripts/tree_data.py，与 export-widgets.py（四板块小组件）共用一份代码。
# 用法:
#   python scripts/export-dashboard.py              # 输出到 <仓库>/dashboard/tree.html
#   python scripts/export-dashboard.py --out PATH   # 指定输出路径（如 Kimi Work widget 的 index.html）
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from tree_data import tree  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent

tree = tree()

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
