import { useMemo, useState, type ReactElement } from 'react'
import {
  CheckCircle2, ExternalLink, PenLine, Search, Sprout, TreePine, X,
} from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { LEAVES, LEAF_TOTAL, leafGroupKey, type Leaf } from '@/data/leaves'
import { LOCAL } from '@/data/content'
import { THEORY_CHAPTERS } from '@/data/theory'
import { CARDS } from '@/data/cards'
import { jumpTo } from '@/lib/jump'
import IndexNote from '@/components/IndexNote'

// 叶子清单（第二板块）：这棵树上长出的全部叶子（项目 + 练习项），按枝干分组。
// 分组顺序：树根组 → 各篇章（理论地图顺序）→ 野生组；
// 组内先按枝节锚点（'04-M4.3'）后按枝干锚点（'04'），同一层级保持 LEAVES 数据顺序。

interface LeafGroup {
  key: string
  name: string
  note?: string
  opt?: boolean
  leaves: Leaf[]
}

const ALL_LEAVES: Leaf[] = [...LEAVES, ...(LOCAL?.EXTRA_LEAVES ?? [])]
const ITEM_IDS = new Set(ALL_LEAVES.map(l => l.id))

// 组内排序：枝节锚点（含 '-'）排前，枝干锚点排后，各保序
function sortGroup(leaves: Leaf[]): Leaf[] {
  const twig = leaves.filter(l => l.anchor.includes('-'))
  const branch = leaves.filter(l => !l.anchor.includes('-'))
  return [...twig, ...branch]
}

function buildGroups(): LeafGroup[] {
  const byKey = new Map<string, Leaf[]>()
  for (const leaf of ALL_LEAVES) {
    const key = leafGroupKey(leaf.anchor)
    byKey.set(key, [...(byKey.get(key) ?? []), leaf])
  }
  const groups: LeafGroup[] = []
  const root = byKey.get('root')
  if (root?.length) {
    groups.push({ key: 'root', name: '树根 · 基础工具', note: '长在树根：全树通用的基础工具，跨枝干都要用', leaves: sortGroup(root) })
  }
  for (const ch of THEORY_CHAPTERS) {
    const leaves = byKey.get(ch.id)
    if (leaves?.length) groups.push({ key: ch.id, name: `${ch.id} · ${ch.name}`, leaves: sortGroup(leaves) })
  }
  const wild = byKey.get('wild')
  if (wild?.length) {
    groups.push({ key: 'wild', name: '野生叶子', note: '已进树但未落户：树还没长出对应枝干，长出后移入正式分组', opt: true, leaves: sortGroup(wild) })
  }
  return groups
}

// 搜索命中高亮：标出全部匹配片段（不止第一个）
function HL({ text, q }: { text: string; q: string }) {
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

export default function Leaves({
  checked, open, onToggleOpen, onToggle,
}: {
  checked: Record<string, boolean>
  open: string[]
  onToggleOpen: (v: string[]) => void
  onToggle: (id: string) => void
}) {
  const groups = useMemo(() => buildGroups(), [])
  const [query, setQuery] = useState('')

  // 清单项 ← 卡片（反向）：target 指向叶子 id 的卡片
  const cardsByLeaf = useMemo(() => {
    const m = new Map<string, number>()
    for (const c of CARDS) {
      if (ITEM_IDS.has(c.target)) m.set(c.target, (m.get(c.target) ?? 0) + 1)
    }
    return m
  }, [])

  const q = query.trim().toLowerCase()
  const filtered = useMemo(() => {
    if (!q) return null
    return groups.map(g => ({
      ...g,
      leaves: g.leaves.filter(l =>
        `${g.name} ${l.name} ${l.intro} ${l.anchor} ${l.tags.join(' ')}`.toLowerCase().includes(q)),
    })).filter(g => g.leaves.length > 0)
  }, [q, groups])
  const matchCount = filtered?.reduce((n, g) => n + g.leaves.length, 0) ?? 0
  const view = filtered ?? groups

  return (
    <div className="space-y-4">
      <IndexNote />
      <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
        叶子清单：这棵树上长出的全部叶子——真实项目（带官网直达）和练习项（动手任务），
        按枝干分组；枝节索引（如 04-M4.3）标在每片叶子上，点击可跳回理论地图对应学习点。
        <span className="block text-xs mt-1">
          共 {LEAF_TOTAL} 片叶子 ｜ 学完一项勾一项，进度自动保存在本机浏览器；收集箱毕业的项目也会长成新叶子挂上来。
        </span>
      </p>
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="搜索叶子：如「LoRA」「GRPO」「向量库」"
            className="h-8 pl-8 pr-7 text-sm"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              title="清空搜索"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        {q && (
          <span className="text-xs text-muted-foreground">
            命中 {matchCount} 片叶子（{filtered?.length ?? 0} 个分组）
          </span>
        )}
      </div>
      {/* 搜索时命中分组强制展开，收起/展开不持久化——否则搜索中收起一个组会污染 open，
          清空搜索后用户原本的展开选择就丢了 */}
      <Accordion type="multiple" value={q ? (filtered?.map(g => g.key) ?? []) : open} onValueChange={v => { if (!q) onToggleOpen(v) }} className="space-y-3">
        {view.map(g => {
          const cn = g.leaves.filter(l => checked[l.id]).length
          const allDone = cn === g.leaves.length
          return (
            <AccordionItem key={g.key} value={g.key}
              className={`rounded-lg border bg-card px-4 transition-shadow hover:shadow-md ${allDone ? 'border-emerald-500/40' : ''}`}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex flex-1 items-center gap-3 pr-2">
                  {allDone
                    ? <CheckCircle2 className="h-4 w-4 flex-none text-emerald-500 dark:text-emerald-400" />
                    : g.key === 'wild'
                      ? <Sprout className="h-4 w-4 flex-none text-muted-foreground/60" />
                      : <TreePine className="h-4 w-4 flex-none text-muted-foreground/50" />}
                  <span className={`text-sm font-medium ${g.opt ? 'text-muted-foreground' : ''}`}>
                    {g.name}
                  </span>
                  {g.opt && <Badge variant="secondary" className="text-xs">支线</Badge>}
                  <span className="ml-auto text-xs tabular-nums text-muted-foreground">
                    {cn} / {g.leaves.length}
                  </span>
                  <div className="w-24">
                    <Progress value={(cn / g.leaves.length) * 100} className="h-1.5" />
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {g.note && (
                  <p className="text-xs text-muted-foreground bg-muted rounded-md px-3 py-2 mb-2 leading-relaxed">{g.note}</p>
                )}
                <div className="grid gap-1 pb-2 md:grid-cols-2">
                  {g.leaves.map(leaf => {
                    const on = !!checked[leaf.id]
                    const nCards = cardsByLeaf.get(leaf.id)
                    const isTwig = leaf.anchor.includes('-')
                    return (
                      <div
                        key={leaf.id}
                        id={leaf.id}
                        role="checkbox"
                        aria-checked={on}
                        tabIndex={0}
                        onClick={() => onToggle(leaf.id)}
                        onKeyDown={e => {
                          if (e.key === ' ' || e.key === 'Enter') {
                            e.preventDefault()
                            onToggle(leaf.id)
                          }
                        }}
                        className="flex cursor-pointer select-none items-start gap-2.5 rounded-md px-2 py-1.5 hover:bg-accent transition-colors scroll-mt-20"
                      >
                        <Checkbox
                          className="mt-0.5 pointer-events-none"
                          checked={on}
                          aria-hidden
                          onCheckedChange={() => {}}
                        />
                        <span className={`min-w-0 flex-1 ${on ? 'text-muted-foreground' : ''}`}>
                          <span className="flex items-center gap-1.5 flex-wrap">
                            {leaf.url ? (
                              <a
                                href={leaf.url}
                                target="_blank"
                                rel="noreferrer"
                                onClick={e => e.stopPropagation()}
                                className="text-sm font-medium underline-offset-4 hover:underline inline-flex items-center gap-1"
                              >
                                <HL text={leaf.name} q={q} />
                                <ExternalLink className="h-3 w-3 text-muted-foreground" />
                              </a>
                            ) : (
                              <span className={`text-sm font-medium inline-flex items-center gap-1 ${on ? 'line-through' : ''}`}>
                                <HL text={leaf.name} q={q} />
                                <span className="inline-flex items-center gap-0.5 rounded bg-violet-500/10 text-violet-600 dark:text-violet-400 px-1.5 py-0 text-[10px] font-normal">
                                  <PenLine className="h-2.5 w-2.5" />练习
                                </span>
                              </span>
                            )}
                            {leaf.opt && <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">支线</Badge>}
                          </span>
                          <span className={`block text-xs text-muted-foreground leading-relaxed mt-0.5 ${on ? 'line-through' : ''}`}>
                            <HL text={leaf.intro} q={q} />
                          </span>
                        </span>
                        <span className="ml-auto flex flex-none items-start gap-1.5 pt-0.5">
                          {nCards ? (
                            <button
                              onClick={e => {
                                e.stopPropagation()
                                jumpTo({ tab: 'cards', anchor: `card-${CARDS.find(c => c.target === leaf.id)?.id}` })
                              }}
                              className="text-[10px] px-1.5 py-0 h-4 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:underline underline-offset-2"
                              title={`${nCards} 张学习卡片挂在这片叶子上，点击跳去学习卡片`}
                            >
                              卡 {nCards}
                            </button>
                          ) : null}
                          {isTwig ? (
                            <button
                              onClick={e => {
                                e.stopPropagation()
                                jumpTo({ tab: 'theory', anchor: leaf.anchor })
                              }}
                              className="rounded border px-1.5 py-0 h-4 text-[10px] font-mono text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
                              title={`枝节索引 ${leaf.anchor}，点击跳去理论地图`}
                            >
                              {leaf.anchor}
                            </button>
                          ) : null}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
      {q && filtered && filtered.length === 0 && (
        <p className="text-sm text-muted-foreground py-10 text-center">
          没有找到匹配「{query.trim()}」的叶子——换个关键词试试
        </p>
      )}
    </div>
  )
}
