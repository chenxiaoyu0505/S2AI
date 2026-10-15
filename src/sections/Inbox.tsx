import { useState } from 'react'
import { Inbox as InboxIcon, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { INBOX, type InboxLevel } from '@/data/inbox'

const LEVEL_STYLE: Record<InboxLevel, string> = {
  观望: 'bg-muted text-muted-foreground',
  跟练: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  深入: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
}

export default function Inbox() {
  const cats = [...new Set(INBOX.map(i => i.cat))]
  const [filter, setFilter] = useState<string>('全部')
  const shown = filter === '全部' ? INBOX : INBOX.filter(i => i.cat === filter)

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
        项目收集箱：看到好项目但小白直接学太费时间？先把链接丢给学习站的 Agent 收录进来——
        自动补一句解析、归到对应模块、给出下潜路径。之后按「观望 → 跟练 → 深入」按需投入，不焦虑。
        <span className="block text-xs mt-1">已收录 {INBOX.length} 个 ｜ 更新方式：把项目网址发给 Agent 即可</span>
      </p>

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
                  <p className="text-xs text-muted-foreground/60 pt-1">收录于 {item.added}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
