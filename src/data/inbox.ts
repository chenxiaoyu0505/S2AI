// 项目收集箱（inbox）—— 「看到好项目但暂时没空学，先收录、看解析、按需下潜」
// 更新方式：直接把项目网址发给学习站的 Agent（见 AGENTS.md 任务手册 5），
// 由 Agent 解析后追加条目；也可按下方格式手动添加。

export type InboxLevel = '观望' | '跟练' | '深入'

export interface InboxItem {
  name: string
  url: string
  /** 收录日期 YYYY-MM */
  added: string
  /** 归属：学习清单分类 · 考点模块，如 'Agent 开发 · 04-M2' */
  cat: string
  /** 一句话解析：它是什么 */
  intro: string
  /** 为什么收录：解决什么痛点 / 与现有内容什么关系 */
  why: string
  /** 小白下潜路径：从哪开始、到什么程度为止 */
  dive: string
  /** 建议投入：观望=只看解析 / 跟练=跑 demo / 深入=读源码 */
  level: InboxLevel
}

export const INBOX: InboxItem[] = [
  // 示例（收录第一个真实项目后可删除）：
  // {
  //   name: '示例项目', url: 'https://example.com', added: '2026-10',
  //   cat: 'Agent 开发 · 04-M2', intro: '一句话说清它是什么',
  //   why: '为什么值得收录', dive: '先看官方 quickstart → 跑通 demo → 只读核心模块',
  //   level: '观望',
  // },
]
