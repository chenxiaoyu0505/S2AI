// 站内跳转总线：板块内引用徽标点击 → 切 tab + 展开分组 + 滚动定位
// Home 订阅：切 tab（同步 ?tab= URL）+ 展开清单组 + 滚动锚点 + 理论点聚焦；
// TheoryMap 另订阅 theory 目标：展开所在篇章（派生值，不写回持久化）并滚动。

export interface JumpTarget {
  tab: 'checklist' | 'theory' | 'cards' | 'resources' | 'inbox'
  /** 目标标识：theory = 理论点 key（如 02-M1.3）；checklist/cards = 完整元素 id（item-p-sft / card-gqa） */
  anchor?: string
  /** 需要展开的清单组名（切到项目清单 tab 时自动展开该分组） */
  expand?: string
}

type Listener = (t: JumpTarget) => void
const listeners = new Set<Listener>()

export function onJump(l: Listener): () => void {
  listeners.add(l)
  return () => { listeners.delete(l) }
}

export function jumpTo(t: JumpTarget) {
  listeners.forEach(l => l(t))
}

/** 从挂靠引用中提取理论点编号；支持 "02-M5.2 + 08-M2.1"、"04-M4.3–4.5" 等复合写法 */
export function parseTheoryRefs(ref?: string): string[] {
  if (!ref) return []
  return ref.match(/\d{2}-M\d+\.\d+/g) ?? []
}
