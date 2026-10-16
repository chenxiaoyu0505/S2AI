// 「退回」：学习卡片 → 项目收集箱（毕业的逆操作，Agent 执行，见 AGENTS.md 任务手册 9）
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
  try {
    localStorage.setItem(DEMOTE_KEY, JSON.stringify(ids))
  } catch {
    // 本机存储不可用时静默降级：退回标记只是提示，不影响公共数据
  }
}

export function demoteFeedText(card: { id: string; name: string; target: string; url: string }): string {
  return `请把学习卡片「${card.name}」（${card.id}）退回项目收集箱（AGENTS.md 任务手册 9）：\n` +
    `1. 从 src/data/cards.ts 的 CARDS 中移除该卡；\n` +
    `2. 若 src/data/inbox.ts 没有对应条目，补一条（name=${card.name}，url=${card.url}，cat=${card.target}，level='观望'，intro 一句话说明）；若已有条目，移除其 graduated 标记；\n` +
    `3. 全局检查并清理其他卡片 next 中指向 ${card.id} 的引用（枯叶不留断链）；\n` +
    `4. 跑 npm run build 验证，commit（信息如 cards: 退回 ${card.name} 到收集箱），push。`
}
