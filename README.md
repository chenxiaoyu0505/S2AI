# S2AI · AI 学习站

> science to AI —— 面向大模型 / Agent 算法岗的公开学习站：**理论考点地图 + 实操学习清单 + 主流模型卡片**，两条线互相挂靠，逐项勾选、进度本机保存。

**在线访问**：<https://chenxiaoyu0505.github.io/S2AI/>

## 站点内容

| 板块 | 说明 |
| --- | --- |
| 学习清单 | 实操主线：基础工具 / Agent 开发 / RAG / 后训练 / 模型量化 / 强化学习等 12 组可勾选项，右侧徽标标注关联的理论考点编号 |
| 考点地图 | 理论主线：11 篇章 · 71 模块 · 285 个面试考点（大模型 / Agent 算法岗），含频率星级、P0 必学清单、验收勾选与笔记状态 |
| 模型卡片 | 主流开放权重模型速查（Qwen3 / DeepSeek / Kimi K2 / Llama 4 / GLM / Mixtral），含 Dense vs MoE 选型速查与量化速记 |
| 方向总览 / 资源导航 | 学习方向与技术栈、项目官网直达链接 |
| JEPA · REA / 多模态 | 科研支线与世界模型、多模态动手路径 |
| 作品目标 | 求职作品 checklist |

> 「面试拆解」等个人化板块仅在站长的本地构建中出现（数据来自 `src/data/content.local.ts`，不进 git），公开版没有。

## 自学习：把这个仓库喂给你的 Agent

本站全部内容都是数据文件（`src/data/*.ts`），没有写死的内容。**把仓库克隆下来丢给你的 Agent，让它读 `AGENTS.md`**，它就能帮你：

- 给学习清单加你自己的学习项（带理论考点挂靠编号）
- 新增模型卡片、新增板块 tab
- 改造数据后自动构建验证、push 上线（Actions 自动部署）

你的个人内容（面经、复盘、自己的拆解笔记）写在 `src/data/content.local.ts` 即可——它已被 git 排除，只存在你自己的机器上，公开版本看不到。

三种更新方式，按顺手程度任选：

- **直接发链接**：在对话里把项目网址丢给 Agent 说「收录」，自动解析、归类、上线（进「项目收集箱」）
- **让 Agent 改造**：克隆后让它读 `AGENTS.md`，按任务手册扩展任意板块
- **自己动手**：数据都在 `src/data/*.ts`，改完 `npm run build` + push 即上线

```bash
git clone https://github.com/chenxiaoyu0505/S2AI.git my-station
# 然后对你的 Agent 说：读 AGENTS.md，帮我把它改造成我的 AI 学习站
```

## 技术栈

React 19 · TypeScript · Vite · Tailwind CSS · shadcn/ui

## 本地运行

```bash
npm install
npm run dev        # 开发预览
npm run build      # 类型检查 + 生产构建
```

## 数据同步（维护者向）

「考点地图」的数据不是手写的，由 `scripts/generate-theory.py` 从本地八股笔记的目录总览自动生成：

```bash
python scripts/generate-theory.py   # 更新笔记目录后重跑，再 commit 即可
```

## 自动部署

push 到 `main` 后，GitHub Actions 自动执行构建并发布到 GitHub Pages（workflow 见 `.github/workflows/deploy.yml`），无需手动部署。

## 边界说明

- 本站为公开版：面试真题、个人面经、审计文档等个人化内容**不在**本仓库中
- 模型卡片信息带「更新于」日期戳，模型迭代快，引用前留意时效

## License

MIT（代码）；站点内容（笔记与卡片）欢迎注明出处的非商业转载。
