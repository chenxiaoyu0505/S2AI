import { useState } from 'react'
import { toast } from 'sonner'
import { Leaf, ExternalLink, CornerDownRight, Undo2, X, Bot, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CARDS } from '@/data/cards'
import { THEORY_CHAPTERS } from '@/data/theory'
import { CHECKLIST, LOCAL } from '@/data/content'
import { MM_CAT } from '@/data/resources'
import { INBOX } from '@/data/inbox'
import { loadDemoted, saveDemoted, demoteFeedText } from '@/lib/demoted'
import { jumpTo } from '@/lib/jump'
import IndexNote from '@/components/IndexNote'

// 和 Home 相同的类目全集（含多模态与本地个人类目），否则挂在这些节点上的卡片解析失败
const ALL_CATS = [...CHECKLIST, MM_CAT, ...(LOCAL?.EXTRA_CATS ?? [])]

/** 复制 Agent 指令到剪贴板，成功/失败都有反馈 */
function copyFeed(text: string, successMsg: string) {
  navigator.clipboard?.writeText(text)
    .then(() => toast.success(successMsg, { description: '粘贴给你的 Agent 即可执行' }))
    .catch(() => toast.error('复制失败', { description: '请检查浏览器剪贴板权限后重试' }))
}

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
  for (const cat of ALL_CATS) {
    const it = cat.items.find(i => i.id === ref)
    if (it) return { label: it.t, hint: `项目清单 · ${cat.name}` }
  }
  const card = CARDS.find(c => c.id === ref)
  if (card) return { label: card.name, hint: '学习卡片' }
  const item = INBOX.find(i => i.url === ref || i.name === ref)
  if (item) return { label: item.name, hint: '收集箱条目' }
  return null
}

// 节点引用 → 跨板块跳转目标（反向链接可点击）
function refJump(ref: string): { tab: 'checklist' | 'theory' | 'cards' | 'inbox'; anchor?: string } | null {
  if (/^\d{2}-M\d+\.\d+$/.test(ref)) return { tab: 'theory', anchor: ref }
  if (CARDS.some(c => c.id === ref)) return { tab: 'cards', anchor: `card-${ref}` }
  if (CHECKLIST.some(cat => cat.items.some(i => i.id === ref)) || MM_CAT.items.some(i => i.id === ref)) {
    return { tab: 'checklist', anchor: `item-${ref}` }
  }
  if (INBOX.some(i => i.url === ref || i.name === ref)) return { tab: 'inbox' }
  return null
}

export default function Cards() {
  const [demoted, setDemoted] = useState<string[]>(loadDemoted)

  function demote(card: (typeof CARDS)[number]) {
    copyFeed(demoteFeedText(card), `「${card.name}」的退回指令已复制`)
    setDemoted(prev => {
      const next = [...new Set([...prev, card.id])]
      saveDemoted(next)
      return next
    })
  }

  function unmarkDemote(id: string) {
    setDemoted(prev => {
      const next = prev.filter(i => i !== id)
      saveDemoted(next)
      return next
    })
  }

  return (
    <div className="space-y-4">
      <IndexNote />
      <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
        学习卡片是树上的叶子：挂在任意节点上的粗粒度知识索引卡——不是笔记、不是教程，
        一张卡让人 30 秒判断"这是什么、跟我什么关系、接下来去哪"。
        <span className="block text-xs mt-1">
          已制作 {CARDS.length} 张 ｜ 下面是公开学习树的卡片（由维护者的 Agent 制作）；
          网页版只做展示——想拥有自己的卡片，见下方「让 Agent 帮你做卡」。
        </span>
      </p>

      {/* 引流卡：网页版展示，制卡需部署到自己的 Agent（同收集箱引流模式） */}
      <Card className="border-primary/30 bg-gradient-to-r from-primary/[0.06] to-transparent">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Bot className="h-4 w-4 text-primary" />
            <CardDescription className="text-sm font-medium text-foreground">
              想要自己的学习卡片？让 Agent 帮你做一张
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="text-muted-foreground leading-relaxed">
            网页上你只能看；部署后，卡片随你的学习生长——学过一个知识点就让你的 Agent 做一张挂到树上，
            挂在理论点 / 清单项 / 收集箱条目任意节点，叶子之间互相指路，学不动还能一键退回收集箱。
          </p>
          <ol className="space-y-1 text-xs text-muted-foreground">
            <li className="flex gap-1.5"><span className="flex-none font-medium">1.</span>打开 GitHub 仓库，把项目克隆或 Fork 到你的电脑（支持 Kimi / Claude Code / Cursor 等 Agent）</li>
            <li className="flex gap-1.5"><span className="flex-none font-medium">2.</span>让你的 Agent 读仓库里的 AGENTS.md——制卡 / 收录 / 毕业等 9 个任务手册即开即用</li>
            <li className="flex gap-1.5"><span className="flex-none font-medium">3.</span>学过后对它说"帮我给 xxx 做张学习卡片"即可，支持学前做卡带着走</li>
          </ol>
          <div className="pt-1">
            <a
              href="https://github.com/chenxiaoyu0505/S2AI"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              前往 GitHub 仓库部署 <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </CardContent>
      </Card>

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
              <Card key={card.id} id={`card-${card.id}`} className="transition-shadow hover:shadow-md scroll-mt-20">
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
                    {target ? (
                      refJump(card.target) ? (
                        <button
                          onClick={() => {
                            const j = refJump(card.target)
                            if (j) jumpTo(j)
                          }}
                          className="rounded-full border px-1.5 py-0 h-4 text-[10px] text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
                          title={`挂在树上：${target.hint}，点击跳转`}
                        >
                          {target.hint}
                        </button>
                      ) : (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4"
                          title={`挂在树上：${target.hint}`}>
                          {target.hint}
                        </Badge>
                      )
                    ) : null}
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
                        const jump = refJump(ref)
                        return (
                          <span key={ref} className="flex items-start gap-1 text-xs text-muted-foreground leading-relaxed">
                            <CornerDownRight className="h-3 w-3 mt-0.5 flex-none" />
                            {jump ? (
                              <button
                                onClick={() => jumpTo(jump)}
                                className="text-left hover:text-primary hover:underline underline-offset-2 transition-colors"
                                title={`${node?.hint ?? ref}，点击跳转`}
                              >
                                {node ? node.label : ref}
                                {node && <span className="text-muted-foreground/60">（{node.hint}）</span>}
                              </button>
                            ) : (
                              <span>
                                {node ? node.label : ref}
                                {node && <span className="text-muted-foreground/60">（{node.hint}）</span>}
                              </span>
                            )}
                          </span>
                        )
                      })}
                    </span>
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-xs text-muted-foreground/60">
                      {[card.madeBy, card.date].filter(Boolean).join(' · ')}
                    </span>
                    {demoted.includes(card.id) ? (
                      <span className="ml-auto inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-medium">
                        已申请退回
                        <button
                          onClick={() => unmarkDemote(card.id)}
                          className="hover:text-foreground transition-colors"
                          title="撤回退回申请（只影响本机标记，公共数据需 Agent 操作后才会变）"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ) : (
                      <button
                        onClick={() => demote(card)}
                        className="ml-auto inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                        title="学不动 / 优先级下降时退回收集箱：复制 Agent 指令，Agent 执行移除卡片并清理引用"
                      >
                        <Undo2 className="h-3 w-3" />退回收集箱
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
