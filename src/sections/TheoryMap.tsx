import { useEffect, useMemo, useState } from 'react'
import { BookOpenCheck, Circle, CheckCircle2, Leaf, PenLine, RotateCcw, Search, Star, X } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { THEORY_CHAPTERS, THEORY_TOTAL, THEORY_DONE, type TheoryChapter } from '@/data/theory'
import { LEAVES, leafGroupKey, type Leaf as LeafItem } from '@/data/leaves'
import { CARDS } from '@/data/cards'
import { jumpTo } from '@/lib/jump'
import HL from '@/components/HL'
import IndexNote from '@/components/IndexNote'
import { QuizEntry } from '@/sections/Quiz'

const STORE_KEY = 'ai-study-theory-v1'
// 展开的篇章也持久化：不再写死默认展开，切 tab / 刷新后保持用户自己的选择
const OPEN_KEY = 'ai-study-theory-open-v1'
const THEORY_MODULES = THEORY_CHAPTERS.reduce((n, c) => n + c.modules.length, 0)

// 全部有效学习点 key（过滤 localStorage 里数据更新后遗留的失效 key）
const POINT_KEYS = new Set(
  THEORY_CHAPTERS.flatMap(c => c.modules.flatMap(mo => mo.points.map(p => `${c.id}-${p.id}`)))
)

function loadProgress(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || '{}')
  } catch {
    return {}
  }
}

function loadOpen(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(OPEN_KEY) || '[]')
    return Array.isArray(v) ? v.filter(id => THEORY_CHAPTERS.some(c => c.id === id)) : []
  } catch {
    return []
  }
}

function FreqStars({ freq }: { freq: number }) {
  if (!freq) return null
  return (
    <span className={`text-xs whitespace-nowrap ${freq >= 3 ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground/80'}`}>
      {'★'.repeat(freq)}{'☆'.repeat(3 - freq)}
    </span>
  )
}

export default function TheoryMap({ focus }: { focus?: { ref?: string; chapters?: string[]; nonce: number } | null }) {
  const [checked, setChecked] = useState<Record<string, boolean>>(loadProgress)
  const [open, setOpen] = useState<string[]>(loadOpen)
  const [query, setQuery] = useState('')

  useEffect(() => {
    localStorage.setItem(STORE_KEY, JSON.stringify(checked))
  }, [checked])

  useEffect(() => {
    localStorage.setItem(OPEN_KEY, JSON.stringify(open))
  }, [open])

  // 外部跳转（清单 ref / 卡片引用点击 / 从哪开始入口）：展开涉及篇章并滚动定位学习点。
  // 三个约束合在一起决定了写法：
  // 1. 必须是「一次性写回 open」而不是「每次渲染都并入的派生值」——后者让 focus 一直把篇章
  //    并回展开集合，用户点收起时 open 变了、渲染没变，手风琴像被锁死；
  // 2. 不能在 effect 里 setOpen（react-hooks/set-state-in-effect 会拦，npm run lint 必须过）；
  // 3. 同一次跳转只写回一次，写回后用户手动收起即刻生效，展开选择照常持久化。
  // → 用 React 推荐的「渲染期间派生状态」模式：focus 对象身份变化即新的一次跳转
  //   （Home 每次跳转都 new 新对象），在 render 里比较并调整 state，提交前即完成。
  const [consumedFocus, setConsumedFocus] = useState(focus)
  if (focus && focus !== consumedFocus) {
    setConsumedFocus(focus)
    const ids = new Set<string>()
    for (const c of focus.chapters ?? []) {
      if (THEORY_CHAPTERS.some(x => x.id === c)) ids.add(c)
    }
    if (focus.ref && POINT_KEYS.has(focus.ref)) ids.add(focus.ref.split('-')[0])
    if (ids.size > 0) setOpen(prev => [...new Set([...prev, ...ids])])
  }

  useEffect(() => {
    if (!focus?.ref) return
    const timer = setTimeout(() => {
      document.getElementById(`tp-${focus.ref}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 350) // 等手风琴展开动画结束
    return () => clearTimeout(timer)
  }, [focus])

  // 只统计仍然存在的学习点（数据更新后旧 key 不再计入）
  const done = useMemo(
    () => Object.entries(checked).filter(([k, v]) => v && POINT_KEYS.has(k)).length,
    [checked]
  )

  function togglePoint(key: string) {
    setChecked(prev => ({ ...prev, [key]: !prev[key] }))
  }

  // 搜索：按篇章 / 模块 / 学习点编号与名称过滤，命中结果强制展开所在篇章
  const q = query.trim().toLowerCase()
  const filtered = useMemo(() => {
    if (!q) return null
    return THEORY_CHAPTERS.map(ch => ({
      ch,
      modules: ch.modules
        .map(mo => ({
          mo,
          points: mo.points.filter(p =>
            `${ch.id} ${ch.name} ${mo.name} ${p.id} ${p.name}`.toLowerCase().includes(q)),
        }))
        .filter(m => m.points.length > 0),
    })).filter(c => c.modules.length > 0)
  }, [q])

  const matchCount = filtered
    ? filtered.reduce((n, c) => n + c.modules.reduce((m, x) => m + x.points.length, 0), 0)
    : 0

  // 统一渲染结构：搜索时只有命中项，平时全部（不改变手风琴形式）
  const view: { ch: TheoryChapter; modules: { mo: TheoryChapter['modules'][number]; points: TheoryChapter['modules'][number]['points'] }[] }[] =
    filtered ?? THEORY_CHAPTERS.map(ch => ({
      ch,
      modules: ch.modules.map(mo => ({ mo, points: mo.points })),
    }))

  // 反向引用：哪些叶子（anchor 或 tags 指向本点）与哪些学习卡片（target/next）指向每个理论点
  const backRefs = useMemo(() => {
    const leavesByPoint = new Map<string, LeafItem[]>()
    const leafCount = new Map<string, number>()
    for (const leaf of LEAVES) {
      const points = new Set<string>()
      if (/^\d{2}-M\d+\.\d+$/.test(leaf.anchor)) points.add(leaf.anchor)
      for (const t of leaf.tags) if (/^\d{2}-M\d+\.\d+$/.test(t)) points.add(t)
      for (const pid of points) {
        leafCount.set(pid, (leafCount.get(pid) ?? 0) + 1)
        const arr = leavesByPoint.get(pid) ?? []
        arr.push(leaf)
        leavesByPoint.set(pid, arr)
      }
    }
    const cardIds = new Map<string, string[]>()
    for (const c of CARDS) {
      const seen = new Set<string>()
      for (const r of [c.target, ...c.next]) {
        if (/^\d{2}-M\d+\.\d+$/.test(r) && !seen.has(r)) {
          seen.add(r)
          const arr = cardIds.get(r) ?? []
          arr.push(c.id)
          cardIds.set(r, arr)
        }
      }
    }
    return { leavesByPoint, leafCount, cardIds }
  }, [])

  return (
    <div className="space-y-4">
      <IndexNote />
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
          理论地图：这棵学习树的树干与枝节。{THEORY_CHAPTERS.length} 篇章（枝干）· {THEORY_MODULES} 模块 · {THEORY_TOTAL} 学习点（枝节），数据源自笔记目录总览。
          枝节下挂着长出来的叶子（项目 / 练习项），点击直达项目官网。
          <span className="block text-xs mt-1">
            ★★★ 推荐深入 · ★★ 推荐学习 · ★ 了解即可 ｜ 「笔记 ✓」= 已有成文笔记（{THEORY_DONE} 篇）｜ 勾选 = 已掌握，进度存本机
          </span>
        </p>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-lg font-medium tabular-nums leading-none">{done}<span className="text-xs font-normal text-muted-foreground"> / {THEORY_TOTAL}</span></div>
            <div className="text-xs text-muted-foreground mt-0.5">已掌握</div>
          </div>
          <div className="w-32">
            <Progress value={THEORY_TOTAL > 0 ? (done / THEORY_TOTAL) * 100 : 0} className="h-1.5" />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => { if (window.confirm('确定重置全部验收进度？')) setChecked({}) }}
          >
            <RotateCcw className="h-3.5 w-3.5" /> 重置
          </Button>
        </div>
      </div>

      {/* 搜索框：按名称 / 编号 / 模块过滤学习点 */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="搜索学习点：名称 / 编号 / 模块，如「RoPE」「02-M1.7」"
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
            命中 {matchCount} 个学习点（{filtered?.length ?? 0} 个篇章）
          </span>
        )}
      </div>

      {/* 搜索时命中篇章强制展开，收起/展开不持久化——否则搜索中收起一个篇章会污染 open，
          清空搜索后用户原本的展开选择就丢了 */}
      <Accordion type="multiple" value={q ? (filtered?.map(c => c.ch.id) ?? []) : open} onValueChange={v => { if (!q) setOpen(v) }} className="space-y-3">
        {view.map(({ ch, modules }) => {
          const total = ch.modules.reduce((n, m) => n + m.points.length, 0)
          const cn = ch.modules.reduce(
            (n, m) => n + m.points.filter(p => checked[`${ch.id}-${p.id}`]).length, 0)
          const noted = ch.modules.reduce(
            (n, m) => n + m.points.filter(p => p.done).length, 0)
          const allDone = cn === total
          return (
            <AccordionItem key={ch.id} value={ch.id}
              className={`rounded-lg border bg-card px-4 transition-shadow hover:shadow-md ${allDone ? 'border-emerald-500/40' : ''}`}>
              <AccordionTrigger className="hover:no-underline">
                {/* 窄屏允许换行：一行放不下时，右侧的笔记数 / 掌握进度整体落到第二行（ml-auto 仍右对齐）。
                    此前这行是 nowrap，篇章名不收缩、右侧组又 flex-none，手机上只能把内容顶出卡片。 */}
                <div className="flex flex-1 min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5 pr-2 text-left">
                  {allDone
                    ? <CheckCircle2 className="h-4 w-4 flex-none text-emerald-500 dark:text-emerald-400" />
                    : <Circle className="h-4 w-4 flex-none text-muted-foreground/50" />}
                  <span className="text-sm font-medium truncate min-w-0">{ch.id} · {ch.name}</span>
                  <span className={`flex-none text-xs ${ch.weight >= 3 ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground/80'}`}>{'★'.repeat(ch.weight)}</span>
                  <span className="hidden md:block flex-1 min-w-0 text-xs text-muted-foreground truncate">{ch.summary}</span>
                  <span className="ml-auto flex flex-none items-center gap-3">
                    {/* 没有笔记也标 0 篇：每个篇章的信息位置保持一致，扫读时不会串行 */}
                    <Badge variant="secondary" className={`text-xs gap-1 ${noted > 0 ? '' : 'text-muted-foreground/70'}`}>
                      <BookOpenCheck className="h-3 w-3" />{noted} 篇笔记
                    </Badge>
                    <span className="text-xs tabular-nums text-muted-foreground">{cn} / {total}</span>
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {ch.p0 && (
                  <p className="text-xs text-foreground/80 bg-muted rounded-md px-3 py-2 mb-3 leading-relaxed">
                    <span className="font-medium">优先学习配方：</span>{ch.p0}
                  </p>
                )}
                <div className="space-y-3 pb-2">
                  {modules.map(({ mo, points }) => (
                    <div key={mo.name}>
                      <p className="text-xs font-medium text-muted-foreground mb-1">{mo.name}
                        <span className="ml-2 font-normal text-muted-foreground/80">{points.length} 学习点</span>
                        <QuizEntry chapterId={ch.id} moduleName={mo.name} />
                      </p>
                      <div className="grid gap-1 md:grid-cols-2">
                        {points.map(p => {
                          const key = `${ch.id}-${p.id}`
                          const on = !!checked[key]
                          return (
                            // Radix Checkbox 渲染为 button，包在 label 里点文字不会触发勾选——
                            // 改用整行可点的 div，Checkbox 仅作视觉呈现
                            <div
                              key={key}
                              id={`tp-${key}`}
                              role="checkbox"
                              aria-checked={on}
                              tabIndex={0}
                              onClick={() => togglePoint(key)}
                              onKeyDown={e => {
                                if (e.key === ' ' || e.key === 'Enter') {
                                  e.preventDefault()
                                  togglePoint(key)
                                }
                              }}
                              className="flex cursor-pointer select-none items-start gap-2.5 rounded-md px-2 py-1.5 hover:bg-accent transition-colors"
                            >
                              <Checkbox className="mt-0.5 pointer-events-none" checked={on} aria-hidden />
                              <span className={`text-sm leading-relaxed min-w-0 ${on ? 'text-muted-foreground line-through' : ''}`}>
                                <span className="font-mono text-xs text-muted-foreground mr-1.5">{p.id}</span>
                                <HL text={p.name} q={q} />
                                {(() => {
                                  const here = backRefs.leavesByPoint.get(key) ?? []
                                  if (here.length === 0) return null
                                  return (
                                    // 枝节上挂的叶子：点击叶子名直达项目官网（练习项为虚线样式）
                                    <span className="mt-1 flex flex-wrap items-center gap-1" onClick={e => e.stopPropagation()}>
                                      {here.map(leaf => leaf.url ? (
                                        <a
                                          key={leaf.id}
                                          href={leaf.url}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="inline-flex items-center gap-1 rounded-full border bg-background px-2 py-0 text-[11px] text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
                                          title={`叶子：${leaf.intro}`}
                                        >
                                          <Leaf className="h-2.5 w-2.5" />{leaf.name}
                                        </a>
                                      ) : (
                                        <span
                                          key={leaf.id}
                                          className="inline-flex items-center gap-1 rounded-full border border-dashed px-2 py-0 text-[11px] text-muted-foreground/80"
                                          title={`练习项：${leaf.intro}（去叶子清单勾选）`}
                                        >
                                          <PenLine className="h-2.5 w-2.5" />{leaf.name}
                                        </span>
                                      ))}
                                    </span>
                                  )
                                })()}
                              </span>
                              <span className="ml-auto flex items-center gap-1.5 flex-none pt-0.5">
                                {backRefs.leafCount.get(key) ? (
                                  <button
                                    onClick={e => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      jumpTo({ tab: 'checklist', expand: leafGroupKey(key) })
                                    }}
                                    className="text-[10px] px-1.5 py-0 h-4 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 hover:underline underline-offset-2"
                                    title={`${backRefs.leafCount.get(key)} 片叶子长在本枝节，点击跳去叶子清单`}
                                  >
                                    叶 {backRefs.leafCount.get(key)}
                                  </button>
                                ) : null}
                                {backRefs.cardIds.get(key) ? (
                                  <button
                                    onClick={e => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      const ids = backRefs.cardIds.get(key)
                                      // 卡片 id 自带 card- 前缀，直接作为元素 id（不要再拼一次前缀）
                                      if (ids) jumpTo({ tab: 'cards', anchor: ids[0] })
                                    }}
                                    className="text-[10px] px-1.5 py-0 h-4 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:underline underline-offset-2"
                                    title={`${backRefs.cardIds.get(key)?.length} 张学习卡片指向本点，点击跳去学习卡片`}
                                  >
                                    卡 {backRefs.cardIds.get(key)?.length}
                                  </button>
                                ) : null}
                                {p.done && (
                                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 gap-0.5">
                                    <BookOpenCheck className="h-2.5 w-2.5" />笔记
                                  </Badge>
                                )}
                                <FreqStars freq={p.freq} />
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>

      {q && filtered && filtered.length === 0 && (
        <p className="text-sm text-muted-foreground py-10 text-center">
          没有找到匹配「{query.trim()}」的学习点——换个关键词试试
        </p>
      )}

      <Separator />
      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
        <Star className="h-3 w-3" />
        数据由 scripts/generate-theory.py 从笔记目录总览自动生成；笔记每完成一篇，重跑脚本即同步。
      </p>
    </div>
  )
}
