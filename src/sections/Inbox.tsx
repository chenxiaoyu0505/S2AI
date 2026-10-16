import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Inbox as InboxIcon, ExternalLink, GraduationCap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { INBOX, type InboxItem, type InboxLevel } from '@/data/inbox'
import { loadGrads, saveGrads, makeGradDraft, gradFeedText, isGradStale, type GradDraft } from '@/lib/graduated'

const LEVEL_STYLE: Record<InboxLevel, string> = {
  观望: 'bg-muted text-muted-foreground',
  跟练: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  深入: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
}

/** 复制 Agent 指令到剪贴板，成功/失败都有反馈 */
function copyFeed(text: string, successMsg: string) {
  navigator.clipboard?.writeText(text)
    .then(() => toast.success(successMsg, { description: '粘贴给你的 Agent 即可永久入库' }))
    .catch(() => toast.error('复制失败', { description: '请检查浏览器剪贴板权限后重试' }))
}

export default function Inbox() {
  const cats = [...new Set(INBOX.map(i => i.cat))]
  // 分类筛选也持久化：切 tab / 刷新后保持上次的筛选（无效值回退到「全部」）
  const [filter, setFilter] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('s2ai-inbox-filter')
      return saved && (saved === '全部' || cats.includes(saved)) ? saved : '全部'
    } catch {
      return '全部'
    }
  })
  const [grads, setGrads] = useState<GradDraft[]>(loadGrads)
  const [notice, setNotice] = useState('')
  const shown = filter === '全部' ? INBOX : INBOX.filter(i => i.cat === filter)

  useEffect(() => {
    localStorage.setItem('s2ai-inbox-filter', filter)
  }, [filter])

  // 提示条 8 秒后自动消失，避免长期挂着旧消息
  useEffect(() => {
    if (!notice) return
    const timer = setTimeout(() => setNotice(''), 8000)
    return () => clearTimeout(timer)
  }, [notice])

  function graduate(item: InboxItem) {
    const draft = makeGradDraft(item)
    const next = [...grads.filter(g => g.url !== item.url), draft]
    setGrads(next)
    saveGrads(next)
    copyFeed(gradFeedText(draft), `「${item.name}」的入库指令已复制`)
    setNotice(`「${item.name}」已毕业：卡片草稿已存到本机（学习卡片 tab 可见），入库指令已复制，粘贴给你的 Agent 即永久入库。`)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
        项目收集箱：学习途中看到好项目但暂时没空学？先把链接丢给你的 Agent 收录进来——
        自动补一句解析、归到树上对应位置、给出下潜路径，之后按「观望 → 跟练 → 深入」按需投入。
        <span className="block text-xs mt-1">
          已收录 {INBOX.length} 个 ｜ 收录方式：把项目网址发给你的 Agent（协议见仓库 AGENTS.md 收录手册；
          收录时 Agent 会做「概念提炼」——条目上标注的"涉及概念"就是理论线的新增建议）。
          学完的条目点「毕业」自动生成本机学习卡片，喂给 Agent 后永久入库。
        </span>
      </p>
      {notice && (
        <p className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 rounded-md px-3 py-2">{notice}</p>
      )}

      {INBOX.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground flex items-center gap-2">
            <InboxIcon className="h-4 w-4" /> 收集箱还是空的——看到想学的项目，把它的官网链接发给我就行。
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex flex-wrap gap-1.5">
            {['全部', ...cats].map(c => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  filter === c
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-muted-foreground hover:bg-accent'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {shown.map(item => (
              <Card key={item.url} className="transition-shadow hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium underline-offset-4 hover:underline inline-flex items-center gap-1"
                    >
                      {item.name}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <Badge variant="secondary" className="text-xs">{item.cat}</Badge>
                    <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-medium ${LEVEL_STYLE[item.level]}`}>
                      {item.level}
                    </span>
                  </div>
                  <CardDescription className="text-sm leading-relaxed">{item.intro}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-1.5 text-sm">
                  <p className="flex gap-2 leading-relaxed">
                    <span className="flex-none w-14 text-xs font-medium text-foreground/70 pt-0.5">为什么收</span>
                    <span className="text-muted-foreground">{item.why}</span>
                  </p>
                  <p className="flex gap-2 leading-relaxed">
                    <span className="flex-none w-14 text-xs font-medium text-foreground/70 pt-0.5">怎么下潜</span>
                    <span className="text-muted-foreground">{item.dive}</span>
                  </p>
                  {item.concept && (
                    <p className="flex gap-2 leading-relaxed">
                      <span className="flex-none w-14 text-xs font-medium text-foreground/70 pt-0.5">涉及概念</span>
                      <span className="text-muted-foreground">{item.concept}
                        <span className="text-xs text-muted-foreground/60">（理论线增补建议，待入库）</span>
                      </span>
                    </p>
                  )}
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <span className="text-xs text-muted-foreground/60">收录于 {item.added}</span>
                    {(() => {
                      const draft = grads.find(g => g.url === item.url)
                      const graduated = Boolean(item.graduated || draft)
                      const stale = draft ? isGradStale(draft, item.graduated) : false
                      if (!graduated) {
                        return (
                          <button
                            onClick={() => graduate(item)}
                            className="ml-auto inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                            title="生成本机学习卡片并复制入库指令"
                          >
                            <GraduationCap className="h-3 w-3" />毕业
                          </button>
                        )
                      }
                      return (
                        <>
                          <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-medium">
                            <GraduationCap className="h-3 w-3" />已毕业
                          </span>
                          {stale && draft && (
                            <span className="inline-flex items-center gap-1.5 text-[11px] text-amber-600 dark:text-amber-400">
                              本机草稿已超 7 天未入库
                              <button
                                onClick={() => {
                                  copyFeed(gradFeedText(draft), `已重新复制「${item.name}」的入库指令`)
                                  setNotice(`已重新复制「${item.name}」的入库指令，粘贴给你的 Agent 即可永久入库。`)
                                }}
                                className="underline underline-offset-2 hover:text-foreground transition-colors"
                              >
                                重新复制指令
                              </button>
                            </span>
                          )}
                        </>
                      )
                    })()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
