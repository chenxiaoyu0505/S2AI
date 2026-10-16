// 「毕业」本机暂存：收集箱条目点「毕业」后生成的学习卡片草稿（localStorage）
// 静态站不写公共数据——草稿只存本机（学习卡片 tab 虚线展示），
// 入库指令喂给 Agent 后由 Agent 写入 src/data/cards.ts（见 AGENTS.md 任务手册 5/6）。
const GRAD_KEY = 's2ai-graduated-cards'

export interface GradDraft {
  id: string
  name: string
  target: string
  url: string
  tags: string[]
  next: string[]
  madeBy: string
  date: string
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
  }
}

// 喂给 Agent 的入库指令文本
export function gradFeedText(draft: GradDraft): string {
  return `请按 AGENTS.md 任务手册 6（制作学习卡片）把下面这张学习卡片写入 src/data/cards.ts，并把收集箱条目「${draft.name}」标记为已毕业：\n\n${JSON.stringify(draft, null, 2)}`
}
