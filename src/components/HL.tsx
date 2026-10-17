import type { ReactElement } from 'react'

// 搜索命中高亮：标出全部匹配片段（不止第一个）。
// 此前在 TheoryMap / Leaves 里各写了一份完全相同的实现，抽出来共用。
export default function HL({ text, q }: { text: string; q: string }) {
  if (!q) return <>{text}</>
  const lower = text.toLowerCase()
  let from = 0
  let hit = lower.indexOf(q)
  if (hit < 0) return <>{text}</>
  const parts: (string | ReactElement)[] = []
  while (hit >= 0) {
    if (hit > from) parts.push(text.slice(from, hit))
    parts.push(<mark key={hit} className="bg-transparent text-primary font-medium">{text.slice(hit, hit + q.length)}</mark>)
    from = hit + q.length
    hit = lower.indexOf(q, from)
  }
  parts.push(text.slice(from))
  return <>{parts}</>
}
