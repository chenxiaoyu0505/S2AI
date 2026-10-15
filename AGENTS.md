# AGENTS.md —— 给 Agent 的仓库指南

> 你是被派来扩展这个学习站的 Agent。读完本文件，你就能安全地替主人增删内容、新增板块，并把改动提交发布。
> 这个仓库的设计目标：**人可以直接从网页学习；Agent 可以读这个仓库，帮主人把它改造成主人自己的学习站。**

## 这个项目是什么

S2AI（science to AI）—— 面向大模型 / Agent 算法岗的公开学习站。React + TypeScript + Vite + Tailwind + shadcn/ui。
所有内容都是**数据驱动的**（没有写死的内容），改数据文件即改网站。

## 黄金法则

1. **只改数据文件和页面组件，不动构建配置**（除非主人明确要求）。
2. **改完必须跑 `npm run build` 验证零报错**，再提交。
3. 个人化内容**只允许**写进 `src/data/content.local.ts`（已被 .gitignore 排除，永不进 git）。任何个人笔记、面经、复盘都放那里。
4. 提交信息用中文、一句话说清楚改了什么。

## 常用命令

```bash
npm install            # 首次
npm run dev            # 本地开发预览
npm run build          # 类型检查 + 生产构建（提交前必须跑通）
python scripts/generate-theory.py   # 从八股目录总览重新生成考点数据（见下）
git add -A && git commit -m "说明" && git push   # push 后 Actions 自动部署上线
```

## 仓库结构

```
src/
  data/            ★ 内容层（改这里）
    content.ts       学习清单、方向总览、JEPA、作品目标 + LOCAL 加载器
    content.local.ts 本地个人内容（不进 git，公开克隆中不存在）
    theory.ts        考点地图（自动生成，勿手改）
    models.ts        模型卡片
    resources.ts     资源导航 + 多模态数据
  sections/        ★ 页面板块（考点地图、模型卡片在这里）
  pages/Home.tsx   tab 容器与首页布局（注册新 tab 要改这里）
  components/ui/   shadcn 组件（直接用，不要新造轮子）
scripts/generate-theory.py   考点数据生成脚本
.github/workflows/deploy.yml 自动部署（push 到 main → 构建 → 发布 Pages）
AGENTS.md          本文件
```

## 任务手册（主人可能会让你做的事）

### 1. 给学习清单加条目

编辑 `src/data/content.ts` 的 `CHECKLIST`：在对应分类的 `items` 里加一项。

```ts
{ id: '唯一短横线id', t: '条目名', e?: '补充说明', ref?: '关联考点编号如 03-M3.1' }
```

`ref` 是理论↔实操的挂靠标记，格式 = 篇章号-M模块号.考点号，会在条目右侧显示为小徽标。

### 2. 给考点地图加 / 改考点

`theory.ts` 是 `scripts/generate-theory.py` 从「八股笔记目录总览」Markdown 解析生成的，**头部有勿手改声明**。
- 主人有笔记源：改源 Markdown → 重跑脚本。
- 主人没有笔记源：直接按现有结构编辑 `THEORY_CHAPTERS`，保持接口（id/name/freq/done/p0/modules）不变。

### 3. 加模型卡片

编辑 `src/data/models.ts` 的 `MODEL_CARDS`，每个模型一张卡：name / org / released / params / arch / context / license / quant / highlight / fit。
**必须带准确的发布时间**，模型时效性强；信息拿不准就标注「待核实」，不要编参数。

### 4. 加一个新 tab

1. 在 `src/sections/` 新建组件（参考 `TheoryMap.tsx` / `ModelCards.tsx` 的写法，用 shadcn 组件）。
2. 在 `src/pages/Home.tsx` 注册：`TabsTrigger` + `TabsContent` 各一处，import 图标用 lucide-react。
3. 数据放 `src/data/` 新文件，页面只负责渲染。

### 5. 个人化内容（面经、复盘、自己的拆解笔记）

全部写进 `src/data/content.local.ts`，可导出 `EXTRA_CATS`（追加学习清单分类）等字段，形状见 `content.ts` 里的 `LocalContent` 接口。
站点对缺失文件静默降级（公开克隆不会有这些 tab）。

## 不要做

- 不要 `git push --force` 到 main（主人明确要求时除外）。
- 不要把任何 `.local.ts`、密钥、个人笔记加进 git；提交前 `git status` 里不应出现它们。
- 不要升级框架大版本或更换 UI 库。
- 不要在组件里 fetch 外部接口——本站是纯静态站点。
