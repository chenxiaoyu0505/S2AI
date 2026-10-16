// 站内节点跳转：清单 ref / 卡片 target / 卡片 next 点击后切到目标 tab 并定位节点
// Home 订阅事件并受控切换 Tabs；目标 section 拿到 focus 后展开所在手风琴并滚动定位。

export interface JumpTarget {
  /** 理论点 key，如 02-M1.3 */
  ref: string
}

type Listener = (t: JumpTarget) => void
const listeners = new Set<Listener>()

export function onJump(l: Listener): () => void {
  listeners.add(l)
  return () => { listeners.delete(l) }
}

export function jumpTo(ref: string) {
  listeners.forEach(l => l({ ref }))
}

/** 从挂靠引用中提取理论点编号；支持 "02-M5.2 + 08-M2.1"、"04-M4.3–4.5" 等复合写法，返回第一个 */
export function parseTheoryRefs(ref?: string): string[] {
  if (!ref) return []
  return ref.match(/\d{2}-M\d+\.\d+/g) ?? []
}
