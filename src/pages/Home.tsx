import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'
import {
  ListChecks, Briefcase, Leaf,
  CheckCircle2, RotateCcw, ExternalLink, Sparkles,
  Map as MapIcon, Inbox as InboxIcon,
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { LOCAL, STARTERS } from '@/data/content'
import { LEAVES, LEAF_TOTAL } from '@/data/leaves'
import { THEORY_TOTAL, THEORY_CHAPTERS } from '@/data/theory'
import { CARDS } from '@/data/cards'
import { jumpTo, onJump } from '@/lib/jump'
import ThemeToggle from '@/components/theme-toggle'
import TheoryMap from '@/sections/TheoryMap'
import Leaves from '@/sections/Leaves'
import Inbox from '@/sections/Inbox'
import Cards from '@/sections/Cards'

const STORE_KEY = 'ai-study-progress-v1'
// 展开的组也持久化：首次访问默认展开树根与前两个枝干，之后记住用户自己的选择
const OPEN_KEY = 'ai-study-checklist-open-v1'
// 首次访问的默认展开组（原 defaultValue 的意图），之后以 localStorage 为准
const DEFAULT_OPEN = ['root', '01', '02']
// 叶子清单合法分组键（过滤 localStorage 里数据更新后遗留的失效 key）
const GROUP_KEYS = new Set(['root', 'wild', ...THEORY_CHAPTERS.map(c => c.id)])
// 全部有效叶子 id（过滤 localStorage 里数据更新后遗留的失效 key）
const ITEM_IDS = new Set(LEAVES.map(l => l.id))

function loadProgress(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || '{}')
  } catch {
    return {}
  }
}

function loadOpen(): string[] {
  try {
    const raw = localStorage.getItem(OPEN_KEY)
    if (raw == null) return DEFAULT_OPEN
    const v = JSON.parse(raw)
    return Array.isArray(v) ? v.filter(name => GROUP_KEYS.has(name)) : DEFAULT_OPEN
  } catch {
    return DEFAULT_OPEN
  }
}

// 项目拆解 tab 与相关数据：仅当本地存在个人拆解数据（content.local.ts）时显示
const INTERVIEW_FRAMEWORK = LOCAL?.INTERVIEW_FRAMEWORK ?? []
const TEARDOWN_PROJECTS = [LOCAL?.WEKNORA, LOCAL?.ONYX].filter(p => p != null)
const COMPARE_ROWS = LOCAL?.COMPARE_ROWS ?? []
const TEARDOWN_METHOD = LOCAL?.TEARDOWN_METHOD ?? []
const SHOW_TEARDOWN = TEARDOWN_PROJECTS.length > 0

function ProgressRing({ value, size = 88 }: { value: number; size?: number }) {
  const r = (size - 10) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth="8"
          className="stroke-muted" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth="8"
          strokeLinecap="round" className="stroke-primary transition-all duration-500"
          strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-medium tabular-nums leading-none">{Math.round(value)}%</span>
      </div>
    </div>
  )
}

type StepItem = { t: string; e?: string } | { step: string; desc: string } | string

function StepList({ steps, numbered = true }: { steps: StepItem[]; numbered?: boolean }) {
  const items = steps.map(s =>
    typeof s === 'string' ? { t: s } : 't' in s ? s : { t: s.step, e: s.desc }
  )
  return (
    <ol className="space-y-2.5">
      {items.map((s, i) => (
        <li key={s.t} className="flex gap-3 text-sm">
          {numbered ? (
            <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
              {i + 1}
            </span>
          ) : (
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-muted-foreground" />
          )}
          <span>
            <span className="font-medium">{s.t}</span>
            {s.e && <span className="block text-xs text-muted-foreground leading-relaxed mt-0.5">{s.e}</span>}
          </span>
        </li>
      ))}
    </ol>
  )
}

export default function Home() {
  const [checked, setChecked] = useState<Record<string, boolean>>(loadProgress)
  const [openCats, setOpenCats] = useState<string[]>(loadOpen)
  // tab 状态同步到 URL（?tab=checklist），刷新 / 分享后停留在原 tab；理论地图是默认首页
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = searchParams.get('tab') ?? 'theory'
  const setTab = (t: string) => setSearchParams(t === 'theory' ? {} : { tab: t }, { replace: true })
  // 站内跳转（枝节索引 / 卡片引用点击 / 从哪开始入口）：切到理论地图并定位学习点 / 展开篇章
  // nonce 每次递增：保证连续点同一个入口时 TheoryMap 也能识别为「新的一次聚焦」
  const nonceRef = useRef(0)
  const [theoryFocus, setTheoryFocus] = useState<{ ref?: string; chapters?: string[]; nonce: number } | null>(null)

  useEffect(() => {
    localStorage.setItem(STORE_KEY, JSON.stringify(checked))
  }, [checked])

  useEffect(() => {
    localStorage.setItem(OPEN_KEY, JSON.stringify(openCats))
  }, [openCats])

  // 统一跳转处理器：切 tab（同步 ?tab= URL）+ 展开清单组 + 滚动锚点 / 理论点聚焦
  useEffect(() => {
    // 定时器句柄提到外面：卸载 / 重订阅时清掉还没触发的滚动，避免在已切走的 tab 上滚
    let timer: ReturnType<typeof setTimeout> | undefined
    const off = onJump(t => {
      setSearchParams(t.tab === 'theory' ? {} : { tab: t.tab }, { replace: true })
      if (t.expand) setOpenCats(prev => (prev.includes(t.expand!) ? prev : [...prev, t.expand!]))
      if (t.tab === 'theory') {
        // anchor = 定位到具体学习点；chapters = 仅展开篇章（从哪开始入口），两者都经 theoryFocus 交给 TheoryMap
        setTheoryFocus({ ref: t.anchor, chapters: t.chapters, nonce: ++nonceRef.current })
      } else if (t.anchor) {
        // 等目标 tab 渲染完成后再滚动
        clearTimeout(timer)
        timer = setTimeout(() => {
          document.getElementById(t.anchor!)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 300)
      }
    })
    return () => {
      off()
      clearTimeout(timer)
    }
  }, [setSearchParams])

  // 只统计仍然存在的叶子（数据更新后旧 key 不再计入）
  const done = useMemo(
    () => Object.entries(checked).filter(([k, v]) => v && ITEM_IDS.has(k)).length,
    [checked]
  )

  function toggleItem(id: string) {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const stats = [
    { icon: MapIcon, label: '理论学习点', value: THEORY_TOTAL, unit: '个' },
    { icon: ListChecks, label: '叶子（项目+练习）', value: LEAF_TOTAL, unit: '片' },
    { icon: Leaf, label: '学习卡片', value: CARDS.length, unit: '张' },
    { icon: CheckCircle2, label: '已完成', value: done, unit: '片' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/[0.04] via-background to-background">
      {/* Hero */}
      <header className="relative overflow-hidden border-b bg-card/60 backdrop-blur">
        {/* 装饰光晕：增加首屏层次，不承载信息 */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-28 right-[8%] h-80 w-80 rounded-full bg-primary/[0.06] blur-3xl dark:bg-primary/[0.14]" />
          <div className="absolute -bottom-36 left-[28%] h-80 w-80 rounded-full bg-emerald-500/[0.08] blur-3xl dark:bg-emerald-400/[0.10]" />
        </div>
        <div className="absolute right-4 top-4 z-10">
          <ThemeToggle />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-wrap items-center gap-8">
            <div className="flex-1 min-w-64">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <Sparkles className="h-3.5 w-3.5" />
                s2ai · science to AI · 公开学习树
              </div>
              <h1 className="text-3xl font-medium tracking-tight">AI 学习树</h1>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xl">
                面向想系统学大模型 / Agent 的人——零基础转行或有基础进阶。
                理论是树（理论地图），项目是叶子（叶子清单），互相挂靠；
                只做索引、顺序和取舍，详细内容在官方文档里。
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {['Agent 开发', 'RAG / 知识库', 'LLM 后训练', '强化学习', '模型量化', '多模态', '具身智能', '量化交易'].map(t => (
                  <span key={t} className="rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {STARTERS.map(s => (
                  <div key={s.who} className="rounded-lg border bg-background p-3 transition-colors hover:border-primary/30">
                    <p className="text-xs font-medium">从哪开始 · {s.who}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 mb-2">{s.desc}</p>
                    <ol className="space-y-1.5">
                      {s.steps.map((st, i) => {
                        const step = typeof st === 'string' ? { t: st } : st
                        return (
                          <li key={step.t} className="flex gap-1.5 text-xs text-muted-foreground">
                            <span className="flex h-4 w-4 flex-none items-center justify-center rounded-full bg-muted text-[10px] font-medium">
                              {i + 1}
                            </span>
                            {step.to ? (
                              // 入口路径可点击：复用 jump.ts 总线切 tab + 展开对应组 / 篇章
                              <button
                                onClick={() => jumpTo(step.to!)}
                                className="text-left leading-relaxed hover:text-primary hover:underline underline-offset-2 transition-colors"
                                title="点击跳转到对应板块"
                              >
                                {step.t}
                              </button>
                            ) : (
                              <span className="leading-relaxed">{step.t}</span>
                            )}
                          </li>
                        )
                      })}
                    </ol>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-6">
              <ProgressRing value={LEAF_TOTAL > 0 ? (done / LEAF_TOTAL) * 100 : 0} />
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                {stats.map(s => (
                  <div key={s.label} className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-muted">
                      <s.icon className="h-4 w-4 text-muted-foreground" />
                    </span>
                    <div>
                      <div className="text-lg font-medium tabular-nums leading-none">
                        {s.value}<span className="text-xs font-normal text-muted-foreground ml-0.5">{s.unit}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-6">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="sticky top-3 z-20 mb-6 flex-wrap h-auto gap-1 border bg-card/90 p-1.5 shadow-sm backdrop-blur">
            <TabsTrigger value="theory" className="gap-1.5"><MapIcon className="h-3.5 w-3.5" />理论地图</TabsTrigger>
            <TabsTrigger value="checklist" className="gap-1.5"><ListChecks className="h-3.5 w-3.5" />叶子清单</TabsTrigger>
            <TabsTrigger value="cards" className="gap-1.5"><Leaf className="h-3.5 w-3.5" />学习卡片</TabsTrigger>
            {SHOW_TEARDOWN && (
              <TabsTrigger value="teardown" className="gap-1.5"><Briefcase className="h-3.5 w-3.5" />项目拆解</TabsTrigger>
            )}
            <TabsTrigger value="inbox" className="gap-1.5"><InboxIcon className="h-3.5 w-3.5" />收集箱</TabsTrigger>
          </TabsList>

          {/* 理论地图（树） */}
          <TabsContent value="theory">
            <TheoryMap focus={theoryFocus} />
          </TabsContent>

          {/* 叶子清单：树上长出的全部叶子 */}
          <TabsContent value="checklist">
            <div className="flex items-center justify-end mb-4">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => { if (window.confirm('确定重置全部进度？')) setChecked({}) }}
              >
                <RotateCcw className="h-3.5 w-3.5" /> 重置进度
              </Button>
            </div>
            <Leaves checked={checked} open={openCats} onToggleOpen={setOpenCats} onToggle={toggleItem} />
          </TabsContent>

          {/* 学习卡片（叶子详情） */}
          <TabsContent value="cards">
            <Cards />
          </TabsContent>

          {/* 项目拆解（仅本地存在 content.local.ts 时显示） */}
          {SHOW_TEARDOWN && (
          <TabsContent value="teardown" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">项目讲述框架（适用于两个项目）</CardTitle>
                <CardDescription>按六步讲，控制在 3–5 分钟</CardDescription>
              </CardHeader>
              <CardContent>
                <StepList steps={INTERVIEW_FRAMEWORK} />
              </CardContent>
            </Card>

            {TEARDOWN_PROJECTS.map(p => (
              <Card key={p.name} className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-base">{p.name}</CardTitle>
                    <a
                      href={`https://${p.repo}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-muted-foreground font-mono hover:underline inline-flex items-center gap-1"
                    >
                      {p.repo} <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <CardDescription className="text-sm leading-relaxed">{p.oneliner}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div>
                    <h4 className="text-sm font-medium mb-2">部署时必须讲清</h4>
                    <ul className="space-y-1.5 text-sm text-muted-foreground">
                      {p.deploy.map(d => <li key={d} className="flex gap-2"><span className="flex-none">·</span>{d}</li>)}
                    </ul>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-medium mb-2">架构拆解要点</h4>
                    <div className="space-y-3">
                      {p.teardown.map(t => (
                        <div key={t.title}>
                          <p className="text-sm font-medium">{t.title}</p>
                          <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                            {t.points.map(pt => <li key={pt} className="flex gap-2"><span className="flex-none">·</span>{pt}</li>)}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-medium mb-2">可能的追问</h4>
                    <div className="space-y-2">
                      {p.qa.map(qa => (
                        <div key={qa.q} className="rounded-md bg-muted px-3 py-2 text-sm">
                          <p className="font-medium">Q：{qa.q}</p>
                          <p className="text-muted-foreground">A：{qa.a}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-base">两个项目对比</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  主动对比显深度：WeKnora 教我「知识如何被组织和维护」，Onyx 教我「检索如何安全地覆盖全公司数据源」，手搓 RAG 教我每一环为什么难。
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="py-2 pr-4 font-medium">维度</th>
                        <th className="py-2 pr-4 font-medium">WeKnora</th>
                        <th className="py-2 font-medium">Onyx</th>
                      </tr>
                    </thead>
                    <tbody>
                      {COMPARE_ROWS.map(r => (
                        <tr key={r.dim} className="border-b last:border-0 hover:bg-muted/50">
                          <td className="py-2 pr-4 font-medium whitespace-nowrap">{r.dim}</td>
                          <td className="py-2 pr-4 text-muted-foreground">{r.weknora}</td>
                          <td className="py-2 text-muted-foreground">{r.onyx}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">五步拆解方法</CardTitle>
              </CardHeader>
              <CardContent>
                <StepList steps={TEARDOWN_METHOD} numbered={false} />
              </CardContent>
            </Card>
          </TabsContent>
          )}

          {/* 收集箱 */}
          <TabsContent value="inbox">
            <Inbox />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t mt-8 bg-card/60">
        <div className="mx-auto max-w-6xl px-6 py-5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span>S2AI · science to AI ｜ 一棵预制的 AI 学习树：理论地图 + 叶子清单 · 数据驱动、可私有化生长</span>
          <span className="ml-auto flex gap-4">
            <a href="https://github.com/chenxiaoyu0505/S2AI" target="_blank" rel="noreferrer" className="hover:underline inline-flex items-center gap-1">GitHub 仓库 <ExternalLink className="h-3 w-3" /></a>
            {SHOW_TEARDOWN && (
              <>
                <a href="https://github.com/Tencent/WeKnora" target="_blank" rel="noreferrer" className="hover:underline inline-flex items-center gap-1">WeKnora <ExternalLink className="h-3 w-3" /></a>
                <a href="https://www.onyx.app/" target="_blank" rel="noreferrer" className="hover:underline inline-flex items-center gap-1">Onyx <ExternalLink className="h-3 w-3" /></a>
              </>
            )}
          </span>
        </div>
      </footer>
    </div>
  )
}
