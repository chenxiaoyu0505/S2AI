import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import { Leaf, ExternalLink, CornerDownRight, Undo2, X, Bot, ArrowRight, Search, ChevronLeft, ChevronRight, ChevronsDownUp, ChevronsUpDown } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { CARDS } from '@/data/cards'
import { THEORY_CHAPTERS } from '@/data/theory'
import { LEAVES } from '@/data/leaves'
import { LOCAL, TASK_MANUAL_COUNT } from '@/data/content'
import { INBOX } from '@/data/inbox'
import { loadDemoted, saveDemoted, demoteFeedText } from '@/lib/demoted'
import { jumpTo, onJump } from '@/lib/jump'
import HL from '@/components/HL'
import IndexNote from '@/components/IndexNote'

// 叶子全集（含本地个人叶子），否则挂在其上的卡片解析失败
const ALL_LEAVES = [...LEAVES, ...(LOCAL?.EXTRA_LEAVES ?? [])]
const CHAPTER_NAMES = new Map(THEORY_CHAPTERS.map(c => [c.id, c.name]))

/** 复制 Agent 指令到剪贴板，成功/失败都有反馈 */
function copyFeed(text: string, successMsg: string) {
  // clipboard 在非安全上下文（http + 非 localhost，如局域网 IP 访问 dev server）下为 undefined——
  // 先接住 Promise 再链 then/catch，否则 undefined.then 直接抛 TypeError，且 catch 挂不上、用户零反馈
  const pending = navigator.clipboard?.writeText(text)
  if (!pending) {
    toast.error('复制失败', { description: '当前环境无剪贴板权限（需 HTTPS 或 localhost 访问），请手动选中复制' })
    return
  }
  pending
    .then(() => toast.success(successMsg, { description: '粘贴给你的 Agent 即可执行' }))
    .catch(() => toast.error('复制失败', { description: '请检查浏览器剪贴板权限后重试' }))
}

interface NodeRef {
  label: string
  hint: string
}

// 把卡片上的节点引用解析成可读标签：理论点编号 / 叶子 id / 卡片 id / 收集箱条目
function resolveNode(ref: string): NodeRef | null {
  const m = ref.match(/^(\d{2})-M(\d+\.\d+)$/)
  if (m) {
    const ch = THEORY_CHAPTERS.find(c => c.id === m[1])
    const pt = ch?.modules.flatMap(mo => mo.points).find(p => p.id === `M${m[2]}`)
    if (ch && pt) return { label: pt.name, hint: `理论点 ${ref}` }
  }
  const leaf = ALL_LEAVES.find(l => l.id === ref)
  if (leaf) {
    const g = leaf.anchor === 'root' ? '树根' : leaf.anchor === 'wild' ? '野生' : `${leaf.anchor.split('-')[0]} · ${CHAPTER_NAMES.get(leaf.anchor.split('-')[0]) ?? ''}`
    return { label: leaf.name, hint: `叶子清单 · ${g}` }
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
  // 卡片 id 自带 card- 前缀，直接作为 anchor（不要再拼一次前缀）
  if (CARDS.some(c => c.id === ref)) return { tab: 'cards', anchor: ref }
  if (ALL_LEAVES.some(l => l.id === ref)) return { tab: 'checklist', anchor: ref }
  if (INBOX.some(i => i.url === ref || i.name === ref)) return { tab: 'inbox' }
  return null
}

// 卡片 ↔ 叶子：target/next 与叶子的 id / anchor / 标签相交即相关——
// 卡片挂在理论点上时，锚在同枝节的叶子也算相关（双向关联的主通道）
function relatedLeaves(card: (typeof CARDS)[number]) {
  const keys = new Set([card.target, ...card.next])
  return ALL_LEAVES.filter(l => keys.has(l.id) || keys.has(l.anchor) || l.tags.some(t => keys.has(t)))
}

// 卡片归组：优先按 target 的理论点篇章，其次按 target 叶子的锚点篇章，
// 再按 next 里第一个理论点兜底；挂到树根/野生叶子/收集箱的归「跨篇章」
function chapterOf(card: (typeof CARDS)[number]): string {
  const m = card.target.match(/^(\d{2})-M/)
  if (m) return m[1]
  const leaf = ALL_LEAVES.find(l => l.id === card.target)
  if (leaf) {
    const am = leaf.anchor.match(/^(\d{2})/)
    return am ? am[1] : 'other'
  }
  for (const r of card.next) {
    const mm = r.match(/^(\d{2})-M/)
    if (mm) return mm[1]
  }
  return 'other'
}

// 展开的组也持久化（key 与理论地图 / 叶子清单同一套命名约定）
const OPEN_KEY = 'ai-study-cards-open-v1'

/**
 * 组内卡片的横向滑动轨：移动端原生触摸滑动，桌面端用左右箭头 / 触控板横滚。
 * 卡片数量增长后每组只占据一条固定高度的轨道，纵向滚动成本不随卡片数增长。
 */
function CardRail({ children, count }: { children: ReactNode; count: number }) {
  const railRef = useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)
  // 手机端位置指示（第几张 / 共几张）：原生横滑没有箭头，靠圆点提示「还能往右滑」
  const [active, setActive] = useState(0)

  // 滚动位置变化时更新箭头可用态（内容不超过一屏时两个箭头都禁用）
  useEffect(() => {
    const el = railRef.current
    if (!el) return
    const update = () => {
      setCanPrev(el.scrollLeft > 4)
      setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
      const first = el.querySelector<HTMLElement>(':scope > *')
      const w = first ? first.offsetWidth + 12 : el.clientWidth
      // 滚到底时最后几张可能对不齐起点，直接记为最后一张
      const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 4
      setActive(atEnd ? count - 1 : Math.round(el.scrollLeft / w))
    }
    update()
    el.addEventListener('scroll', update, { passive: true })
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', update)
      ro.disconnect()
    }
  }, [count])

  const step = (dir: 1 | -1) => {
    const el = railRef.current
    if (!el) return
    // 一次滚动约一张卡片的宽度
    const card = el.querySelector<HTMLElement>(':scope > *')
    const w = card ? card.offsetWidth + 12 : el.clientWidth * 0.8
    el.scrollBy({ left: dir * w, behavior: 'smooth' })
  }

  return (
    <div className="relative group/rail">
      <div
        ref={railRef}
        className="-mx-3 flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-px-3 px-3 pt-1 pb-2 scroll-smooth [scrollbar-width:none] md:mx-0 md:scroll-px-0 md:px-0 md:[scrollbar-width:thin] [-webkit-overflow-scrolling:touch]"
      >
        {children}
      </div>
      {count > 1 && (
        <div className="flex items-center justify-center gap-1.5 pt-1 md:hidden" aria-hidden>
          {Array.from({ length: count }, (_, i) => (
            <span key={i} className={`h-1.5 rounded-full transition-all ${i === active ? 'w-4 bg-foreground/60' : 'w-1.5 bg-foreground/20'}`} />
          ))}
          <span className="ml-1.5 text-[11px] tabular-nums text-muted-foreground">{active + 1} / {count} · 左右滑动</span>
        </div>
      )}
      {/* 桌面端左右箭头（触屏设备直接滑动，不显示） */}
      {count > 1 && (
        <>
          <button
            onClick={() => step(-1)}
            disabled={!canPrev}
            className="hidden md:flex absolute -left-2 top-1/2 -translate-y-1/2 z-10 h-7 w-7 items-center justify-center rounded-full border bg-background/95 shadow-sm text-muted-foreground transition-all hover:text-foreground disabled:opacity-0 disabled:pointer-events-none"
            title="上一张"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => step(1)}
            disabled={!canNext}
            className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 h-7 w-7 items-center justify-center rounded-full border bg-background/95 shadow-sm text-muted-foreground transition-all hover:text-foreground disabled:opacity-0 disabled:pointer-events-none"
            title="下一张"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  )
}

export default function Cards() {
  const [demoted, setDemoted] = useState<string[]>(loadDemoted)
  const [query, setQuery] = useState('')

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

  // 卡片按挂靠的篇章分组（组顺序 = 理论地图篇章顺序，跨篇章垫底）。
  // 数量增长后扫读成本集中在组头列表，不再随卡片总数线性变长。
  const groups = useMemo(() => {
    const byChapter = new Map<string, typeof CARDS>()
    for (const card of CARDS) {
      const key = chapterOf(card)
      byChapter.set(key, [...(byChapter.get(key) ?? []), card])
    }
    const ordered: { key: string; name: string; cards: typeof CARDS }[] = []
    for (const ch of THEORY_CHAPTERS) {
      const cards = byChapter.get(ch.id)
      if (cards?.length) ordered.push({ key: ch.id, name: `${ch.id} · ${ch.name}`, cards })
    }
    const other = byChapter.get('other')
    if (other?.length) ordered.push({ key: 'other', name: '跨篇章 · 收集箱', cards: other })
    return ordered
  }, [])

  const groupKeys = useMemo(() => new Set(groups.map(g => g.key)), [groups])

  // 首次访问默认展开卡片最多的一组，之后记住用户自己的选择（同叶子清单的持久化约定）
  const [open, setOpen] = useState<string[]>(() => {
    try {
      const v = JSON.parse(localStorage.getItem(OPEN_KEY) || 'null')
      if (Array.isArray(v)) {
        const kept = v.filter(k => groupKeys.has(k))
        // 用户主动全部收起（存的就是 []）要尊重；只有「存了值但数据更新后全部失效」才回退默认
        if (kept.length > 0 || v.length === 0) return kept
      }
    } catch { /* 数据损坏时回退默认 */ }
    const biggest = groups.reduce<(typeof groups)[number] | undefined>(
      (a, b) => (b.cards.length > (a?.cards.length ?? -1) ? b : a), undefined)
    return biggest ? [biggest.key] : []
  })

  useEffect(() => {
    localStorage.setItem(OPEN_KEY, JSON.stringify(open))
  }, [open])

  // 跨板块跳卡片（理论地图「卡 N」/ 叶子清单芯片 / 卡片间「接下来」互指）只带 anchor 不带分组。
  // 分组折叠后目标卡片若在收起组里，元素尚未渲染，Home 的延迟滚动会静默失败——
  // 这里订阅同一总线先把所在组展开（子组件 effect 先于父组件，展开先于 Home 的 300ms 滚动）。
  useEffect(() => onJump(t => {
    if (t.tab !== 'cards' || !t.anchor) return
    const card = CARDS.find(c => c.id === t.anchor)
    if (!card) return
    const key = chapterOf(card)
    setOpen(prev => (prev.includes(key) ? prev : [...prev, key]))
  }), [])

  // 搜索：按名称 / 技术栈 / 分类 / 相关叶子 / 接下来引用的名称过滤。
  // 命中组强制展开，收起不持久化——与理论地图 / 叶子清单同一套搜索态约定。
  const q = query.trim().toLowerCase()
  const filtered = useMemo(() => {
    if (!q) return null
    return groups.map(g => ({
      ...g,
      cards: g.cards.filter(card => [
        card.name, ...card.tags,
        resolveNode(card.target)?.label ?? card.target,
        ...card.next.map(r => resolveNode(r)?.label ?? r),
        ...relatedLeaves(card).map(l => l.name),
      ].join(' ').toLowerCase().includes(q)),
    })).filter(g => g.cards.length > 0)
  }, [q, groups])
  const matchCount = filtered ? filtered.reduce((n, g) => n + g.cards.length, 0) : 0
  const view = filtered ?? groups

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
            挂在理论点 / 叶子 / 收集箱条目任意节点，叶子之间互相指路，学不动还能一键退回收集箱。
          </p>
          <ol className="space-y-1 text-xs text-muted-foreground">
            <li className="flex gap-1.5"><span className="flex-none font-medium">1.</span>打开 GitHub 仓库，把项目克隆或 Fork 到你的电脑（支持 Kimi / Claude Code / Cursor 等 Agent）</li>
            <li className="flex gap-1.5"><span className="flex-none font-medium">2.</span>让你的 Agent 读仓库里的 AGENTS.md——制卡 / 收录 / 毕业等 {TASK_MANUAL_COUNT} 个任务手册即开即用</li>
            <li className="flex gap-1.5"><span className="flex-none font-medium">3.</span>学过后对它说"帮我给 xxx 做张学习卡片"即可，支持学前做卡带着走</li>
          </ol>
          <div className="pt-1">
            <a
              href="https://github.com/chenxiaoyu0505/S2AI"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2.5 md:py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
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
        <>
          {/* 搜索框：按名称 / 技术栈 / 分类 / 相关叶子过滤，命中组强制展开（不持久化） */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="搜索卡片：名称 / 技术栈，如「LoRA」「MoE」"
                className="h-10 pl-8 pr-10 md:h-8 md:pr-7 md:text-sm"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-0 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center text-muted-foreground hover:text-foreground transition-colors md:right-2 md:h-auto md:w-auto"
                  title="清空搜索"
                  aria-label="清空搜索"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            {q ? (
              <span className="text-xs text-muted-foreground">
                命中 {matchCount} 张卡片（{filtered?.length ?? 0} 个分组）
              </span>
            ) : (
              /* 全选：一键展开 / 收起全部组（写入持久化，与手动点组头等价） */
              <span className="flex items-center gap-1">
                <button
                  onClick={() => setOpen(groups.map(g => g.key))}
                  disabled={open.length === groups.length}
                  className="inline-flex items-center gap-1 rounded-full border px-3 py-2 md:px-2.5 md:py-1 text-[12px] md:text-[11px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-40 disabled:pointer-events-none"
                  title="展开全部分组"
                >
                  <ChevronsUpDown className="h-3 w-3" />全部展开
                </button>
                <button
                  onClick={() => setOpen([])}
                  disabled={open.length === 0}
                  className="inline-flex items-center gap-1 rounded-full border px-3 py-2 md:px-2.5 md:py-1 text-[12px] md:text-[11px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-40 disabled:pointer-events-none"
                  title="收起全部分组"
                >
                  <ChevronsDownUp className="h-3 w-3" />全部收起
                </button>
              </span>
            )}
          </div>

          {/* 按挂靠篇章分组折叠：卡片增多后扫读组头即可定位，不用滚完全部卡片 */}
          <Accordion type="multiple" value={q ? (filtered?.map(g => g.key) ?? []) : open} onValueChange={v => { if (!q) setOpen(v) }} className="space-y-3">
            {view.map(g => (
              <AccordionItem key={g.key} value={g.key} className="rounded-lg border bg-card px-3 md:px-4 transition-shadow hover:shadow-md">
                <AccordionTrigger className="hover:no-underline">
                  {/* 与理论地图 / 叶子清单同一修法：窄屏时计数落到第二行，组名保持单行 */}
                  <div className="flex flex-1 min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5 pr-2 text-left">
                    <Leaf className="h-4 w-4 flex-none text-muted-foreground/50" />
                    <span className="text-sm font-medium min-w-0">{g.name}</span>
                    <span className="ml-auto flex-none text-xs tabular-nums text-muted-foreground">{g.cards.length} 张</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {/* 组内横向滑动：卡片定宽等高，移动端左右滑动浏览，数量再多也只占一条轨道 */}
                  <CardRail count={g.cards.length}>
                    {g.cards.map(card => {
                      const target = resolveNode(card.target)
                      const leaves = relatedLeaves(card)
                      return (
                        <Card
                          key={card.id}
                          id={card.id}
                          className="w-[86%] sm:w-[330px] lg:w-[360px] flex-none snap-start flex flex-col transition-shadow hover:shadow-md scroll-mt-20"
                        >
                          <CardHeader className="pb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <a
                                href={card.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm font-medium underline-offset-4 hover:underline inline-flex items-center gap-1"
                              >
                                <HL text={card.name} q={q} />
                                <ExternalLink className="h-3 w-3" />
                              </a>
                              {target ? (
                                refJump(card.target) ? (
                                  <button
                                    onClick={() => {
                                      const j = refJump(card.target)
                                      if (j) jumpTo(j)
                                    }}
                                    className="rounded-full border px-2 md:px-1.5 py-0 h-7 md:h-4 text-[12px] md:text-[10px] text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
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
                          <CardContent className="flex-1 flex flex-col space-y-1.5 text-sm">
                            <p className="flex gap-2">
                              <span className="flex-none w-14 text-xs font-medium text-foreground/70 pt-0.5">技术栈</span>
                              <span className="flex flex-wrap gap-1">
                                {card.tags.map(t => (
                                  <span key={t} className="rounded bg-muted px-1.5 py-0.5 text-[12px] md:text-[11px] text-muted-foreground">{t}</span>
                                ))}
                              </span>
                            </p>
                            {leaves.length > 0 && (
                              <p className="flex gap-2">
                                <span className="flex-none w-14 text-xs font-medium text-foreground/70 pt-0.5">相关叶子</span>
                                <span className="flex flex-wrap gap-1 min-w-0">
                                  {leaves.map(leaf => (
                                    <span key={leaf.id} className="inline-flex items-center gap-1">
                                      {leaf.url ? (
                                        <a
                                          href={leaf.url}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="rounded-full border bg-background px-2.5 py-1 md:px-2 md:py-0 text-[12px] md:text-[11px] text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors inline-flex items-center gap-1"
                                          title={`叶子：${leaf.intro}，点击直达项目官网`}
                                        >
                                          <Leaf className="h-2.5 w-2.5" />{leaf.name}
                                          <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                                        </a>
                                      ) : (
                                        <button
                                          onClick={() => jumpTo({ tab: 'checklist', anchor: leaf.id })}
                                          className="rounded-full border border-dashed px-2.5 py-1 md:px-2 md:py-0 text-[12px] md:text-[11px] text-muted-foreground/80 hover:text-primary hover:border-primary/50 transition-colors inline-flex items-center gap-1"
                                          title={`练习项：${leaf.intro}，点击在叶子清单中定位`}
                                        >
                                          <Leaf className="h-2.5 w-2.5" />{leaf.name}
                                        </button>
                                      )}
                                    </span>
                                  ))}
                                </span>
                              </p>
                            )}
                            {card.next.length > 0 && (
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
                                            className="py-1 md:py-0 text-left hover:text-primary hover:underline underline-offset-2 transition-colors"
                                            title={`${node?.hint ?? ref}，点击跳转`}
                                          >
                                            {node ? node.label : ref}
                                            {node && <span className="text-muted-foreground/80">（{node.hint}）</span>}
                                          </button>
                                        ) : (
                                          <span>
                                            {node ? node.label : ref}
                                            {node && <span className="text-muted-foreground/80">（{node.hint}）</span>}
                                          </span>
                                        )}
                                      </span>
                                    )
                                  })}
                                </span>
                              </p>
                            )}
                            <div className="flex items-center gap-2 pt-1">
                              <span className="text-xs text-muted-foreground/80">
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
                                  className="ml-auto inline-flex items-center gap-1 rounded-full border px-3 py-1.5 md:px-2.5 md:py-0.5 text-[12px] md:text-[11px] text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
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
                  </CardRail>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {q && filtered && filtered.length === 0 && (
            <p className="text-sm text-muted-foreground py-10 text-center">
              没有找到匹配「{query.trim()}」的卡片——换个关键词试试
            </p>
          )}
        </>
      )}
    </div>
  )
}
