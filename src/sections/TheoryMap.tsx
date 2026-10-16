import { useEffect, useMemo, useState } from 'react'
import { BookOpenCheck, Circle, CheckCircle2, RotateCcw, Star } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { THEORY_CHAPTERS, THEORY_TOTAL, THEORY_DONE } from '@/data/theory'

const STORE_KEY = 'ai-study-theory-v1'
const THEORY_MODULES = THEORY_CHAPTERS.reduce((n, c) => n + c.modules.length, 0)

function loadProgress(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || '{}')
  } catch {
    return {}
  }
}

function FreqStars({ freq }: { freq: number }) {
  if (!freq) return null
  return (
    <span className={`text-xs whitespace-nowrap ${freq >= 3 ? 'text-amber-500' : 'text-muted-foreground/60'}`}>
      {'★'.repeat(freq)}{'☆'.repeat(3 - freq)}
    </span>
  )
}

export default function TheoryMap() {
  const [checked, setChecked] = useState<Record<string, boolean>>(loadProgress)

  useEffect(() => {
    localStorage.setItem(STORE_KEY, JSON.stringify(checked))
  }, [checked])

  const done = useMemo(() => Object.values(checked).filter(Boolean).length, [checked])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
          大模型 / Agent 算法岗面试考点地图：{THEORY_CHAPTERS.length} 篇章 · {THEORY_MODULES} 模块 · {THEORY_TOTAL} 考点，数据源自八股笔记目录总览。
          <span className="block text-xs mt-1">
            ★★★ 必问 · ★★ 高频 · ★ 中频 ｜ 「笔记 ✓」= 本地已有成文笔记（{THEORY_DONE} 篇）｜ 勾选 = 我已通过验收，进度存本机
          </span>
        </p>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-lg font-medium tabular-nums leading-none">{done}<span className="text-xs font-normal text-muted-foreground"> / {THEORY_TOTAL}</span></div>
            <div className="text-xs text-muted-foreground mt-0.5">已通过验收</div>
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

      <Accordion type="multiple" defaultValue={['02', '04', '03']} className="space-y-3">
        {THEORY_CHAPTERS.map(ch => {
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
                    ? <CheckCircle2 className="h-4 w-4 flex-none text-emerald-500" />
                    : <Circle className="h-4 w-4 flex-none text-muted-foreground/50" />}
                  <span className="text-sm font-medium whitespace-nowrap">{ch.id} · {ch.name}</span>
                  <span className={`text-xs ${ch.weight >= 3 ? 'text-amber-500' : 'text-muted-foreground/60'}`}>{'★'.repeat(ch.weight)}</span>
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
                    <span className="font-medium">P0 必学：</span>{ch.p0}
                  </p>
                )}
                <div className="space-y-3 pb-2">
                  {ch.modules.map(mo => (
                    <div key={mo.name}>
                      <p className="text-xs font-medium text-muted-foreground mb-1">{mo.name}
                        <span className="ml-2 font-normal text-muted-foreground/60">{mo.points.length} 考点</span>
                      </p>
                      <div className="grid gap-1 md:grid-cols-2">
                        {mo.points.map(p => {
                          const key = `${ch.id}-${p.id}`
                          const on = !!checked[key]
                          return (
                            <label key={key}
                              className="flex cursor-pointer items-start gap-2.5 rounded-md px-2 py-1.5 hover:bg-accent transition-colors">
                              <Checkbox className="mt-0.5" checked={on}
                                onCheckedChange={v => setChecked(prev => ({ ...prev, [key]: v === true }))} />
                              <span className={`text-sm leading-relaxed min-w-0 ${on ? 'text-muted-foreground line-through' : ''}`}>
                                <span className="font-mono text-xs text-muted-foreground/70 mr-1.5">{p.id}</span>
                                {p.name}
                              </span>
                              <span className="ml-auto flex items-center gap-1.5 flex-none pt-0.5">
                                {p.done && (
                                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 gap-0.5">
                                    <BookOpenCheck className="h-2.5 w-2.5" />笔记
                                  </Badge>
                                )}
                                <FreqStars freq={p.freq} />
                              </span>
                            </label>
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

      <Separator />
      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
        <Star className="h-3 w-3" />
        数据由 scripts/generate-theory.py 从八股笔记目录总览自动生成；笔记每过一篇验收，重跑脚本即同步。
      </p>
    </div>
  )
}
