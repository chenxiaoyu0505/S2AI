// 「毕业」本机暂存：收集箱条目点「毕业」后生成的学习卡片草稿（localStorage）
// 静态站不写公共数据——草稿只存本机（学习卡片 tab 虚线展示），
// 入库指令喂给 Agent 后由 Agent 写入 src/data/cards.ts（见 AGENTS.md 任务手册 5/6）。
const GRAD_KEY = 's2ai-graduated-cards'

/** 草稿超过 7 天未入库（未喂给 Agent）则温和提醒 */
export const GRAD_STALE_MS = 7 * 24 * 3600 * 1000

export interface GradDraft {
  id: string
  name: string
  target: string
  url: string
  tags: string[]
  next: string[]
  madeBy: string
  date: string
  /** 毕业时刻（ms 时间戳），用于 7 天未入库提醒 */
  graduatedAt: number
}

export function loadGrads(): GradDraft[] {
  try {
    return JSON.parse(localStorage.getItem(GRAD_KEY) || '[]')
  } catch {
    return []
  }
}

export function saveGrads(grads: GradDraft[]) {
  localStorage.setItem(GRAD_KEY, JSON.stringify(grads))
}

// url 的确定性散列，保证同一条目毕业的 id 稳定
function urlHash(s: string): string {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h.toString(36)
}

export function makeGradDraft(item: { name: string; url: string; cat: string; concept?: string }): GradDraft {
  return {
    id: `card-grad-${urlHash(item.url)}`,
    name: item.name,
    target: item.cat,
    url: item.url,
    tags: item.concept ? [item.concept] : [],
    next: [],
    madeBy: '毕业自收集箱',
    date: new Date().toISOString().slice(0, 7),
    graduatedAt: Date.now(),
  }
}

// 喂给 Agent 的入库指令文本
export function gradFeedText(draft: GradDraft): string {
  return `请按 AGENTS.md 任务手册 6（制作学习卡片）把下面这张学习卡片写入 src/data/cards.ts，并把收集箱条目「${draft.name}」标记为已毕业：\n\n${JSON.stringify(draft, null, 2)}`
}

/** 草稿是否超 7 天未入库（已入公共数据的条目不算） */
export function isGradStale(draft: GradDraft, graduated?: string): boolean {
  if (graduated || !draft.graduatedAt) return false
  return Date.now() - draft.graduatedAt > GRAD_STALE_MS
}

// ---- 「退回」：学习卡片 → 项目收集箱（毕业的逆操作，Agent 执行，见 AGENTS.md 任务手册 9） ----
// 本机只记录"已申请退回"的卡片 id（用于网页上的标记与撤销），公共数据的变更由 Agent 完成。

const DEMOTE_KEY = 's2ai-demoted-cards'

export function loadDemoted(): string[] {
  try {
    return JSON.parse(localStorage.getItem(DEMOTE_KEY) || '[]')
  } catch {
    return []
  }
}

export function saveDemoted(ids: string[]) {
  localStorage.setItem(DEMOTE_KEY, JSON.stringify(ids))
}

export function demoteFeedText(card: { id: string; name: string; target: string; url: string }): string {
  return `请把学习卡片「${card.name}」（${card.id}）退回项目收集箱（AGENTS.md 任务手册 9）：\n` +
    `1. 从 src/data/cards.ts 的 CARDS 中移除该卡；\n` +
    `2. 若 src/data/inbox.ts 没有对应条目，补一条（name=${card.name}，url=${card.url}，cat=${card.target}，level='观望'，intro 一句话说明）；若已有条目，移除其 graduated 标记；\n` +
    `3. 全局检查并清理其他卡片 next 中指向 ${card.id} 的引用（枯叶不留断链）；\n` +
    `4. 跑 npm run build 验证，commit（信息如 cards: 退回 ${card.name} 到收集箱），push。`
}
