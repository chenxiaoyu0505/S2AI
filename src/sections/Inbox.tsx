import { useEffect, useState } from 'react'
import { Inbox as InboxIcon, ExternalLink, Bot, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { INBOX, type InboxLevel } from '@/data/inbox'
import { jumpTo } from '@/lib/jump'
import IndexNote from '@/components/IndexNote'

const LEVEL_STYLE: Record<InboxLevel, string> = {
  观望: 'bg-muted text-muted-foreground',
  跟练: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  深入: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
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
  const shown = filter === '全部' ? INBOX : INBOX.filter(i => i.cat === filter)

  useEffect(() => {
    localStorage.setItem('s2ai-inbox-filter', filter)
  }, [filter])

  return (
    <div className="space-y-4">
      <IndexNote />
      <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
        项目收集箱：学习途中看到好项目但暂时没空学？先收录进来——
        自动补一句解析、归到树上对应位置、给出下潜路径，之后按「观望 → 跟练 → 深入」按需投入。
        <span className="block text-xs mt-1">
          下面展示的是公开学习树的收集箱（{INBOX.length} 个条目，由维护者的 Agent 收录）；
          网页版只做展示——想拥有自己的收集箱，见下方「部署到自己的 Agent」。
        </span>
      </p>

      {/* 引流卡：网页版展示，正式启用需部署到自己的 Agent（同 Kimi 官网自荐模式） */}
      <Card className="border-primary/30 bg-gradient-to-r from-primary/[0.06] to-transparent">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Bot className="h-4 w-4 text-primary" />
            <CardDescription className="text-sm font-medium text-foreground">
              想让收集箱为你工作？把 S2AI 部署到你自己的 Agent
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="text-muted-foreground leading-relaxed">
            网页上你只能看；部署后，你的 Agent 就是你的私人收集箱——把项目链接丢给它，
            自动解析、归位、给下潜路径，学完一键「毕业」生成学习卡片挂回你的树。
          </p>
          <ol className="space-y-1 text-xs text-muted-foreground">
            <li className="flex gap-1.5"><span className="flex-none font-medium">1.</span>打开 GitHub 仓库，把项目克隆或 Fork 到你的电脑（支持 Kimi / Claude Code / Cursor 等 Agent）</li>
            <li className="flex gap-1.5"><span className="flex-none font-medium">2.</span>让你的 Agent 读仓库里的 AGENTS.md——收录 / 制卡 / 毕业等 9 个任务手册即开即用</li>
            <li className="flex gap-1.5"><span className="flex-none font-medium">3.</span>之后把项目链接发给它即可，数据存在你自己的仓库，与公开站互不影响</li>
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

      {INBOX.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground flex items-center gap-2">
            <InboxIcon className="h-4 w-4" /> 公开收集箱还是空的。
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
                    <button
                      onClick={() => {
                        const group = item.cat.split(' · ')[0].trim()
                        jumpTo({ tab: 'checklist', expand: group })
                      }}
                      className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground hover:underline underline-offset-2"
                      title="跳到项目清单对应分组"
                    >
                      {item.cat}
                    </button>
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
                    {item.graduated && (
                      <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-medium">
                        已毕业（挂回学习卡片）
                      </span>
                    )}
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
