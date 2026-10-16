import { Leaf, ExternalLink, CornerDownRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CARDS } from '@/data/cards'
import { THEORY_CHAPTERS } from '@/data/theory'
import { CHECKLIST } from '@/data/content'
import { INBOX } from '@/data/inbox'

interface NodeRef {
  label: string
  hint: string
}

// 把卡片上的节点引用解析成可读标签：理论点编号 / 清单项 id / 卡片 id / 收集箱条目
function resolveNode(ref: string): NodeRef | null {
  const m = ref.match(/^(\d{2})-M(\d+\.\d+)$/)
  if (m) {
    const ch = THEORY_CHAPTERS.find(c => c.id === m[1])
    const pt = ch?.modules.flatMap(mo => mo.points).find(p => p.id === `M${m[2]}`)
    if (ch && pt) return { label: pt.name, hint: `理论点 ${ref}` }
  }
  for (const cat of CHECKLIST) {
    const it = cat.items.find(i => i.id === ref)
    if (it) return { label: it.t, hint: `项目清单 · ${cat.name}` }
  }
  const card = CARDS.find(c => c.id === ref)
  if (card) return { label: card.name, hint: '学习卡片' }
  const item = INBOX.find(i => i.url === ref || i.name === ref)
  if (item) return { label: item.name, hint: '收集箱条目' }
  return null
}

export default function Cards() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
        学习卡片是树上的叶子：挂在任意节点上的粗粒度知识索引卡——不是笔记、不是教程，
        一张卡让人 30 秒判断"这是什么、跟我什么关系、接下来去哪"。
        <span className="block text-xs mt-1">
          已制作 {CARDS.length} 张 ｜ 制作方式：让 Agent 帮你做（协议见仓库 AGENTS.md 制卡手册；
          支持"学过后补卡"和"学前做卡带着走"两种触发）
        </span>
      </p>

      {CARDS.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground flex items-center gap-2">
            <Leaf className="h-4 w-4" /> 还没有学习卡片——学过一个知识点后，让 Agent 帮你做一张挂到树上。
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {CARDS.map(card => {
            const target = resolveNode(card.target)
            return (
              <Card key={card.id} className="transition-shadow hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <a
                      href={card.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium underline-offset-4 hover:underline inline-flex items-center gap-1"
                    >
                      {card.name}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    {target && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4"
                        title={`挂在树上：${target.hint}`}>
                        {target.hint}
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="flex gap-2 text-xs leading-relaxed">
                    <span className="flex-none w-14 font-medium text-foreground/70">分类</span>
                    <span>{target ? target.label : card.target}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-1.5 text-sm">
                  <p className="flex gap-2">
                    <span className="flex-none w-14 text-xs font-medium text-foreground/70 pt-0.5">技术栈</span>
                    <span className="flex flex-wrap gap-1">
                      {card.tags.map(t => (
                        <span key={t} className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">{t}</span>
                      ))}
                    </span>
                  </p>
                  <p className="flex gap-2">
                    <span className="flex-none w-14 text-xs font-medium text-foreground/70 pt-0.5">接下来</span>
                    <span className="space-y-0.5 min-w-0">
                      {card.next.map(ref => {
                        const node = resolveNode(ref)
                        return (
                          <span key={ref} className="flex items-start gap-1 text-xs text-muted-foreground leading-relaxed">
                            <CornerDownRight className="h-3 w-3 mt-0.5 flex-none" />
                            <span>
                              {node ? node.label : ref}
                              {node && <span className="text-muted-foreground/60">（{node.hint}）</span>}
                            </span>
                          </span>
                        )
                      })}
                    </span>
                  </p>
                  {(card.madeBy || card.date) && (
                    <p className="text-xs text-muted-foreground/60 pt-1">
                      {[card.madeBy, card.date].filter(Boolean).join(' · ')}
                    </p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
