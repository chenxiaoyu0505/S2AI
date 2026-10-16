import { useEffect, useMemo, useState } from 'react'
import {
  ListChecks, Link2, Briefcase, Images,
  CheckCircle2, Layers, ExternalLink, Sparkles, RotateCcw, Circle,
  Map as MapIcon, Cpu, Inbox as InboxIcon, BookOpen, Search,
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import {
  CHECKLIST, LOCAL, STARTERS,
} from '@/data/content'
import {
  RESOURCES, MM_CAT, MM_PATH, MM_MODELS, MM_LINKS,
} from '@/data/resources'
import { THEORY_TOTAL } from '@/data/theory'
import TheoryMap from '@/sections/TheoryMap'
import ModelCards from '@/sections/ModelCards'
import Inbox from '@/sections/Inbox'

const STORE_KEY = 'ai-study-progress-v1'

function loadProgress(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || '{}')
  } catch {
    return {}
  }
}

// 本地个人类目（content.local.ts，不进 git）；多模态插在「模型量化」之后（索引 5）
const BASE_CATS = [...CHECKLIST, ...(LOCAL?.EXTRA_CATS ?? [])]
const ALL_CATS = [...BASE_CATS.slice(0, 5), MM_CAT, ...BASE_CATS.slice(5)]
const TOTAL = ALL_CATS.reduce((n, c) => n + c.items.length, 0)
const RES_COUNT = RESOURCES.reduce((n, c) => n + c.links.length, 0) + MM_LINKS.length

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

  useEffect(() => {
    localStorage.setItem(STORE_KEY, JSON.stringify(checked))
  }, [checked])

  const done = useMemo(() => Object.values(checked).filter(Boolean).length, [checked])

  const stats = [
    { icon: ListChecks, label: '项目清单项', value: TOTAL, unit: '项' },
    { icon: BookOpen, label: '理论学习点', value: THEORY_TOTAL, unit: '个' },
    { icon: Link2, label: '官网直达', value: RES_COUNT, unit: '+' },
    { icon: CheckCircle2, label: '已完成', value: done, unit: '项' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/[0.04] via-background to-background">
      {/* Hero */}
      <header className="border-b bg-card/60 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex flex-wrap items-center gap-8">
            <div className="flex-1 min-w-64">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <Sparkles className="h-3.5 w-3.5" />
                s2ai · science to AI · 公开学习树
              </div>
              <h1 className="text-3xl font-medium tracking-tight">AI 学习树</h1>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xl">
                面向想系统学大模型 / Agent 的人——零基础转行或有基础进阶。
                理论地图告诉你先学什么，项目清单告诉你先做什么，互相挂靠；
                只做索引、顺序和取舍，详细内容在官方文档里。
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {['Agent 开发', 'RAG / 知识库', 'LLM 后训练', '强化学习', '模型量化', '理论地图', '项目清单', '多模态'].map(t => (
                  <span key={t} className="rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {STARTERS.map(s => (
                  <div key={s.who} className="rounded-lg border bg-background p-3">
                    <p className="text-xs font-medium">从哪开始 · {s.who}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 mb-2">{s.desc}</p>
                    <ol className="space-y-1.5">
                      {s.steps.map((st, i) => (
                        <li key={st} className="flex gap-1.5 text-xs text-muted-foreground">
                          <span className="flex h-4 w-4 flex-none items-center justify-center rounded-full bg-muted text-[10px] font-medium">
                            {i + 1}
                          </span>
                          <span className="leading-relaxed">{st}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-6">
              <ProgressRing value={(done / TOTAL) * 100} />
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                {stats.map(s => (
                  <div key={s.label} className="flex items-center gap-2">
                    <s.icon className="h-4 w-4 text-muted-foreground" />
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
        <Tabs defaultValue="checklist">
          <TabsList className="mb-6 flex-wrap h-auto gap-1 bg-card border p-1.5">
            <TabsTrigger value="checklist" className="gap-1.5"><ListChecks className="h-3.5 w-3.5" />项目清单</TabsTrigger>
            <TabsTrigger value="theory" className="gap-1.5"><MapIcon className="h-3.5 w-3.5" />理论地图</TabsTrigger>
            <TabsTrigger value="resources" className="gap-1.5"><Link2 className="h-3.5 w-3.5" />资源导航</TabsTrigger>
            <TabsTrigger value="reference" className="gap-1.5"><Search className="h-3.5 w-3.5" />速查</TabsTrigger>
            {SHOW_TEARDOWN && (
              <TabsTrigger value="teardown" className="gap-1.5"><Briefcase className="h-3.5 w-3.5" />项目拆解</TabsTrigger>
            )}
            <TabsTrigger value="inbox" className="gap-1.5"><InboxIcon className="h-3.5 w-3.5" />项目收集箱</TabsTrigger>
          </TabsList>

          {/* 项目清单 */}
          <TabsContent value="checklist">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">学完一项勾一项，进度自动保存在本机浏览器。</p>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => { if (window.confirm('确定重置全部进度？')) setChecked({}) }}
              >
                <RotateCcw className="h-3.5 w-3.5" /> 重置进度
              </Button>
            </div>
            <Accordion type="multiple" defaultValue={ALL_CATS.slice(0, 3).map(c => c.name)} className="space-y-3">
              {ALL_CATS.map(cat => {
                const cn = cat.items.filter(i => checked[i.id]).length
                const allDone = cn === cat.items.length
                return (
                  <AccordionItem key={cat.name} value={cat.name}
                    className={`rounded-lg border bg-card px-4 transition-shadow hover:shadow-md ${allDone ? 'border-emerald-500/40' : ''}`}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex flex-1 items-center gap-3 pr-2">
                        {allDone
                          ? <CheckCircle2 className="h-4 w-4 flex-none text-emerald-500" />
                          : <Circle className="h-4 w-4 flex-none text-muted-foreground/50" />}
                        <span className={`text-sm font-medium ${cat.opt ? 'text-muted-foreground' : ''}`}>
                          {cat.name}
                        </span>
                        {cat.opt && <Badge variant="secondary" className="text-xs">支线</Badge>}
                        <span className="ml-auto text-xs tabular-nums text-muted-foreground">
                          {cn} / {cat.items.length}
                        </span>
                        <div className="w-24">
                          <Progress value={(cn / cat.items.length) * 100} className="h-1.5" />
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid gap-1 pb-2 md:grid-cols-2">
                        {cat.items.map(item => (
                          <label
                            key={item.id}
                            className="flex cursor-pointer items-start gap-2.5 rounded-md px-2 py-1.5 hover:bg-accent transition-colors"
                          >
                            <Checkbox
                              className="mt-0.5"
                              checked={!!checked[item.id]}
                              onCheckedChange={v =>
                                setChecked(prev => ({ ...prev, [item.id]: v === true }))
                              }
                            />
                            <span className={`text-sm leading-relaxed ${checked[item.id] ? 'text-muted-foreground line-through' : ''}`}>
                              {item.t}
                              {item.e && <span className="block text-xs text-muted-foreground">{item.e}</span>}
                            </span>
                            {item.ref && (
                              <Badge variant="outline"
                                className="ml-auto flex-none text-[10px] px-1.5 py-0 h-4 font-mono text-muted-foreground"
                                title={`关联理论点 ${item.ref}`}>
                                {item.ref}
                              </Badge>
                            )}
                          </label>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          </TabsContent>

          {/* 理论地图 */}
          <TabsContent value="theory">
            <TheoryMap />
          </TabsContent>

          {/* 资源导航 */}
          <TabsContent value="resources" className="space-y-6">
            <p className="text-sm text-muted-foreground">
              路线中提到的全部项目官网直达链接，每个附简介和「学什么」。点击名称在新标签页打开。
            </p>
            {RESOURCES.map(cat => (
              <div key={cat.name}>
                <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Layers className="h-4 w-4 text-muted-foreground" />{cat.name}
                  <span className="text-xs font-normal text-muted-foreground">{cat.links.length} 个</span>
                </h3>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {cat.links.map(l => (
                    <Card key={l.name} className="group transition-shadow hover:shadow-md">
                      <CardHeader className="pb-2">
                        <a
                          href={l.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-medium underline-offset-4 hover:underline group-hover:text-primary inline-flex items-center gap-1"
                        >
                          {l.name}
                          <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                        </a>
                        <CardDescription className="text-xs leading-relaxed">{l.intro}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-xs text-muted-foreground">
                          <span className="font-medium text-foreground/70">学什么：</span>{l.learn}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
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

          {/* 速查（工具书：模型 + 多模态，不参与学习顺序，随时来查） */}
          <TabsContent value="reference" className="space-y-8">
            <section>
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Cpu className="h-4 w-4 text-muted-foreground" />模型速查
              </h3>
              <ModelCards />
            </section>

            <section className="space-y-6">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Images className="h-4 w-4 text-muted-foreground" />多模态速查
              </h3>
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-base">多模态学习路径</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    图像 + 文本是起点，逐步扩展到文档 OCR、视频、音频和跨模态检索。核心架构是「视觉编码器（ViT）+ 连接器 + 语言模型」三段式，先跑通再深入。
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <StepList steps={MM_PATH} />
                </CardContent>
              </Card>

              <Card className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-base">主流开源多模态模型速查</CardTitle>
                  <CardDescription>2026 年本地可跑的常见选择，按显存从低到高</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-left">
                          <th className="py-2 pr-4 font-medium">模型</th>
                          <th className="py-2 pr-4 font-medium">规模</th>
                          <th className="py-2 pr-4 font-medium">最低显存</th>
                          <th className="py-2 font-medium">亮点</th>
                        </tr>
                      </thead>
                      <tbody>
                        {MM_MODELS.map(m => (
                          <tr key={m.name} className="border-b last:border-0 hover:bg-muted/50">
                            <td className="py-2 pr-4 font-medium whitespace-nowrap">{m.name}</td>
                            <td className="py-2 pr-4 text-muted-foreground whitespace-nowrap">{m.size}</td>
                            <td className="py-2 pr-4 text-muted-foreground whitespace-nowrap">{m.vram}</td>
                            <td className="py-2 text-muted-foreground">{m.point}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Layers className="h-4 w-4 text-muted-foreground" />官方资源直达
                </h4>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {MM_LINKS.map(l => (
                    <Card key={l.name} className="group transition-shadow hover:shadow-md">
                      <CardHeader className="pb-2">
                        <a
                          href={l.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-medium underline-offset-4 hover:underline group-hover:text-primary inline-flex items-center gap-1"
                        >
                          {l.name}
                          <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                        </a>
                        <CardDescription className="text-xs leading-relaxed">{l.intro}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-xs text-muted-foreground">
                          <span className="font-medium text-foreground/70">学什么：</span>{l.learn}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
          </TabsContent>

          {/* 项目收集箱 */}
          <TabsContent value="inbox">
            <Inbox />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t mt-8 bg-card/60">
        <div className="mx-auto max-w-6xl px-6 py-5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span>S2AI · science to AI ｜ 一棵预制的 AI 学习树：理论地图 + 项目清单 · 数据驱动、可私有化生长</span>
          <span className="ml-auto flex gap-4">
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
