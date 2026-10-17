// AI 学习站 · 全部内容数据（公开版）
// 个人化内容（如项目拆解、个人学习规划）只放在 src/data/content.local.ts，不进 git
//
// 树的模型：理论 = 树（理论地图），项目 = 叶子（leaves.ts）。
// 这里只放入口路径与本地个人化内容；清单主干在 leaves.ts。

import type { Leaf } from './leaves'
import type { JumpTarget } from '../lib/jump'

/** AGENTS.md 里的任务手册条数：新增 / 删除手册时同步改这里，check-tree.py 会校验二者一致 */
export const TASK_MANUAL_COUNT = 11

/** 本地个人化内容的形状（src/data/content.local.ts，不进 git） */
export interface LocalContent {
  INTERVIEW_FRAMEWORK?: { step: string; desc: string }[]
  WEKNORA?: TeardownProject
  ONYX?: TeardownProject
  COMPARE_ROWS?: { dim: string; weknora: string; onyx: string }[]
  TEARDOWN_METHOD?: string[]
  /** 本地个人叶子（追加进叶子清单，不进 git） */
  EXTRA_LEAVES?: Leaf[]
}

// 可选的本地私有数据文件：存在则合并进站点，不存在（如公开克隆）则全部为空
const localModule = Object.values(
  import.meta.glob<LocalContent>('./*.local.ts', { eager: true })
)[0]

export const LOCAL: LocalContent | undefined = localModule

export interface TeardownProject {
  name: string
  repo: string
  oneliner: string
  deploy: string[]
  teardown: { title: string; points: string[] }[]
  qa: { q: string; a: string }[]
}

// 首页「从哪开始」：两类读者的入口路径
// steps 的 to 字段可点：复用 jump.ts 总线，切 tab + 展开清单组 / 篇章（见 JumpTarget）
// expand 的取值 = 叶子清单分组键：'root'（树根组）/ 篇章 id（'01'–'12'）/ 'wild'（野生组）
export const STARTERS: {
  who: string
  desc: string
  steps: ({ t: string; to?: JumpTarget } | string)[]
}[] = [
  {
    who: '零基础转行',
    desc: '从树根的工具和基础理论开始，按顺序推进，不跳跃',
    steps: [
      { t: '叶子清单 · 树根组：PyTorch / Hugging Face / uv / Docker', to: { tab: 'checklist', expand: 'root' } },
      { t: '理论地图 · 01 篇章 DL 基础 + 02 篇章大模型基础', to: { tab: 'theory', chapters: ['01', '02'] } },
      { t: '回到叶子清单：04 枝干 Agent 组动手起步', to: { tab: 'checklist', expand: '04' } },
    ],
  },
  {
    who: '有基础进阶',
    desc: '直接进主线，边学边把真实项目收进收集箱',
    steps: [
      { t: '理论地图 · 04 篇章 Agent + 02 篇章大模型基础', to: { tab: 'theory', chapters: ['04', '02'] } },
      { t: '叶子清单 · 04 枝干 Agent 组', to: { tab: 'checklist', expand: '04' } },
      { t: '收集箱收一个真实项目开练（观望 → 跟练）', to: { tab: 'inbox' } },
    ],
  },
]
