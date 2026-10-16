import { useEffect, useMemo, useState } from 'react'
import { BookOpenCheck, Circle, CheckCircle2, RotateCcw, Search, Star, X } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { THEORY_CHAPTERS, THEORY_TOTAL, THEORY_DONE, type TheoryChapter } from '@/data/theory'
import { CHECKLIST } from '@/data/content'
import { MM_CAT } from '@/data/resources'
import { CARDS } from '@/data/cards'
import { jumpTo } from '@/lib/jump'
import IndexNote from '@/components/IndexNote'

const STORE_KEY = 'ai-study-theory-v1'
// 展开的篇章也持久化：不再写死默认展开，切 tab / 刷新后保持用户自己的选择
const OPEN_KEY = 'ai-study-theory-open-v1'
const THEORY_MODULES = THEORY_CHAPTERS.reduce((n, c) => n + c.modules.length, 0)

// 全部有效学习点 key（过滤 localStorage 里数据更新后遗留的失效 key）
const POINT_KEYS = new Set(
  THEORY_CHAPTERS.flatMap(c => c.modules.flatMap(mo => mo.points.map(p => `${c.id}-${p.id}`)))
)

// 解析清单项 ref → 理论点编号列表：支持 "03-M3.1"、"02-M5.2 + 08-M2.1"、"05-M1.3–1.4"（含跨模块与区间）
function expandRef(ref: string): string[] {
  const out: string[] = []
  for (const part of ref.split('+')) {
    const p = part.trim()
    const range = p.match(/^(\d{2})-M(\d+)\.(\d+)[–—-](?:M(\d+)\.)?(\d+)$/)
    if (range) {
      const [, ch, mod, a, mod2, b] = range
      if ((mod2 ?? mod) === mod) {
        for (let i = Number(a); i <= Number(b) && i <= Number(a) + 10; i++) out.push(`${ch}-M${mod}.${i}`)
      } else {
        out.push(`${ch}-M${mod}.${a}`) // 跨模块范围只记起点，不展开
      }
      continue
    }
    const single = p.match(/^(\d{2}-M\d+\.\d+)$/)
    if (single) out.push(single[1])
  }
  return out
}

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
    <span className={`text-xs whitespace-nowrap ${freq >= 3 ? 'text-amber-500 dark:text-amber-400' : 'text-muted-foreground/60'}`}>
      {'★'.repeat(freq)}{'☆'.repeat(3 - freq)}
    </span>
  )
}

// 搜索命中高亮：把匹配片段标为主题色
function HL({ text, q }: { text: string; q: string }) {
  if (!q) return <>{text}</>
  const i = text.toLowerCase().indexOf(q)
  if (i < 0) return <>{text}</>
  return (
    <>
      {text.slice(0, i)}
      <mark className="bg-transparent text-primary font-medium">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  )
}

export default function TheoryMap({ focus }: { focus?: { ref: string; nonce: number } | null }) {
  const [checked, setChecked] = useState<Record<string, boolean>>(loadProgress)
  const [open, setOpen] = useState<string[]>(loadOpen)
  const [query, setQuery] = useState('')

  useEffect(() => {
    localStorage.setItem(STORE_KEY, JSON.stringify(checked))
  }, [checked])

  useEffect(() => {
    localStorage.setItem(OPEN_KEY, JSON.stringify(open))
  }, [open])

  // 外部跳转（清单 ref / 卡片引用点击）：展开所在篇章并滚动定位到学习点。
  // 展开采用「派生值」而非 setState：focus 所在篇章临时并入受控 open，不写回 localStorage。
  const focusChapter = focus && POINT_KEYS.has(focus.ref) ? focus.ref.split('-')[0] : null
  const openWithFocus = focusChapter
    ? (open.includes(focusChapter) ? open : [...open, focusChapter])
    : open

  useEffect(() => {
    if (!focusChapter) return
    const timer = setTimeout(() => {
      document.getElementById(`tp-${focus?.ref}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 350) // 等手风琴展开动画结束
    return () => clearTimeout(timer)
  }, [focus, focusChapter])

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

  // 反向引用：哪些项目清单项（ref）与哪些学习卡片（target/next）指向每个理论点
  const backRefs = useMemo(() => {
    const items = new Map<string, number>()
    for (const cat of [...CHECKLIST, MM_CAT]) {
      for (const it of cat.items) {
        if (!it.ref) continue
        for (const pid of expandRef(it.ref)) items.set(pid, (items.get(pid) ?? 0) + 1)
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
    return { items, cardIds }
  }, [])

  return (
    <div className="space-y-4">
      <IndexNote />
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
          理论地图：大模型 / Agent 的知识骨架。{THEORY_CHAPTERS.length} 篇章 · {THEORY_MODULES} 模块 · {THEORY_TOTAL} 学习点，数据源自笔记目录总览。
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
            <Progress value={(done / THEORY_TOTAL) * 100} className="h-1.5" />
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

      <Accordion type="multiple" value={q ? (filtered?.map(c => c.ch.id) ?? []) : openWithFocus} onValueChange={setOpen} className="space-y-3">
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
                <div className="flex flex-1 items-center gap-3 pr-2 text-left">
                  {allDone
                    ? <CheckCircle2 className="h-4 w-4 flex-none text-emerald-500 dark:text-emerald-400" />
                    : <Circle className="h-4 w-4 flex-none text-muted-foreground/50" />}
                  <span className="text-sm font-medium whitespace-nowrap">{ch.id} · {ch.name}</span>
                  <span className={`text-xs ${ch.weight >= 3 ? 'text-amber-500 dark:text-amber-400' : 'text-muted-foreground/60'}`}>{'★'.repeat(ch.weight)}</span>
                  <span className="hidden md:inline text-xs text-muted-foreground truncate">{ch.summary}</span>
                  <span className="ml-auto flex items-center gap-3 flex-none">
                    {noted > 0 && (
                      <Badge variant="secondary" className="text-xs gap-1"><BookOpenCheck className="h-3 w-3" />{noted} 篇笔记</Badge>
                    )}
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
                        <span className="ml-2 font-normal text-muted-foreground/60">{points.length} 学习点</span>
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
                                <span className="font-mono text-xs text-muted-foreground/70 mr-1.5">{p.id}</span>
                                <HL text={p.name} q={q} />
                              </span>
                              <span className="ml-auto flex items-center gap-1.5 flex-none pt-0.5">
                                {backRefs.items.get(key) ? (
                                  <button
                                    onClick={e => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      jumpTo({ tab: 'checklist' })
                                    }}
                                    className="text-[10px] px-1.5 py-0 h-4 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 hover:underline underline-offset-2"
                                    title={`${backRefs.items.get(key)} 个项目清单项挂靠本点，点击跳去项目清单`}
                                  >
                                    单 {backRefs.items.get(key)}
                                  </button>
                                ) : null}
                                {backRefs.cardIds.get(key) ? (
                                  <button
                                    onClick={e => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      const ids = backRefs.cardIds.get(key)
                                      if (ids) jumpTo({ tab: 'cards', anchor: `card-${ids[0]}` })
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
