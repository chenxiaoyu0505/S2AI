# S2AI · AI 学习树

> science to AI —— 一棵预制的 AI 学习树：**理论地图 + 项目清单**双轨互相挂靠，只做索引、顺序和取舍，不提供详细内容。设计对齐见 [DESIGN.md](./DESIGN.md)。

**在线访问**：<https://chenxiaoyu0505.github.io/S2AI/>

## 三种用法

1. **直接看**：静态网站，零成本，只读
2. **私有化**：clone 到本地、装进你的 Agent 作为插件——树开始生长（项目收集箱收录分支、学习卡片制作叶子）
3. **共建**：站长持续维护公共树干，私有树可随时同步 upstream

## 站点内容

| 板块 | 说明 |
| --- | --- |
| 项目清单 | 项目线主干：基础工具 / Agent 开发 / RAG / 后训练 / 模型量化 / 强化学习 / 具身 / 智驾 / 量化交易等 13 组实操项，逐项勾选、进度本机保存，右侧徽标标注关联的理论点编号 |
| 理论地图 | 理论线：11 篇章 · 71 模块 · 285 个学习点，星级 = 推荐学习 / 深入的程度，每篇章附「优先学习配方」 |
| 资源导航 | 路线中提到的项目官网直达链接，每个附简介和「学什么」 |
| 速查 | 模型速查（选型对比 + 量化速记）+ 多模态速查（学习路径 + 模型表），工具书定位，随时来查 |
| 项目收集箱 | 项目线分支：Agent 收录的项目（链接 + 解析 + 下潜路径 + 观望/跟练/深入分级），收录时做概念提炼、反哺理论线 |

首页 hero 内含「从哪开始」：零基础转行 / 有基础进阶两条入口路径。

> 个人化板块（项目拆解等）仅在学习树被私有化后出现（数据来自 `src/data/content.local.ts`，不进 git），公开站没有。

## 把这个仓库喂给你的 Agent

本树的内容都是数据文件（`src/data/*.ts`），没有写死的内容。**clone 下来丢给你的 Agent，让它读 `AGENTS.md`**，它就能帮你：

- 给项目清单加你自己的学习项（带理论点挂靠编号）
- 收录项目到收集箱（含概念提炼）
- 新增模型卡片、新增板块 tab
- 改造数据后自动构建验证、push 上线（Actions 自动部署）

你的个人内容（复盘、自己的拆解笔记）写在 `src/data/content.local.ts` 即可——它已被 git 排除，只存在你自己的机器上，公开版本看不到。

```bash
git clone https://github.com/chenxiaoyu0505/S2AI.git my-tree
# 然后对你的 Agent 说：读 AGENTS.md，帮我把这棵学习树变成我自己的
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

「理论地图」的数据不是手写的，由 `scripts/generate-theory.py` 从本地笔记的目录总览自动生成：

```bash
python scripts/generate-theory.py   # 更新笔记目录后重跑，再 commit 即可
```

## 自动部署

push 到 `main` 后，GitHub Actions 自动执行构建并发布到 GitHub Pages（workflow 见 `.github/workflows/deploy.yml`），无需手动部署。

## 边界说明

- 本仓库为公开版：个人复盘、面试拆解等个人化内容**不在**其中（最多进 local 文件）
- 模型速查信息带「更新于」日期戳，模型迭代快，引用前留意时效

## License

MIT（代码）；站点内容欢迎注明出处的非商业转载。
