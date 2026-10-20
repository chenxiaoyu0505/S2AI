import { useMemo, useRef, useState, type SyntheticEvent } from 'react'
import { ArrowRight, BookX, CheckCircle2, Crown, Download, Lock, RotateCcw, Swords, Upload, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { QUIZ, type QuizQuestion } from '@/data/quiz'
import { THEORY_CHAPTERS } from '@/data/theory'

// 闯关自测：一个模块 = 一关（关卡 id = '02-M1'）。≥80% 通关，按得分给 1–3 星；
// 软解锁——通关后高亮下一关，但任何关卡都不上锁。进度 / 星级 / 错题本存本机 localStorage。
const QUIZ_KEY = 's2ai-quiz-v1'
const PASS = 0.8
const BOSS_SIZE = 8
const BOSS_MIN_LEVELS = 2 // 一个篇章至少 2 关有题才开放 Boss 关

interface LevelRecord { best: number; stars: number; at: string }
interface QuizProgress { levels: Record<string, LevelRecord>; wrong: Record<string, string> }

const QUIZ_IDS = new Set(QUIZ.map(q => q.id))

function loadQuiz(): QuizProgress {
  try {
    const v = JSON.parse(localStorage.getItem(QUIZ_KEY) || '{}')
    return { levels: v.levels ?? {}, wrong: v.wrong ?? {} }
  } catch {
    return { levels: {}, wrong: {} }
  }
}

function saveQuiz(p: QuizProgress) {
  localStorage.setItem(QUIZ_KEY, JSON.stringify(p))
}

function starsOf(score: number) {
  if (score >= 1) return 3
  if (score >= 0.9) return 2
  if (score >= PASS) return 1
  return 0
}

const levelOf = (pointId: string) => pointId.split('.')[0] // '02-M1.3' → '02-M1'
const today = () => new Date().toISOString().slice(0, 10)

function Stars({ n, className = '' }: { n: number; className?: string }) {
  return (
    <span className={`whitespace-nowrap text-amber-600 dark:text-amber-400 ${className}`}>
      {'★'.repeat(n)}<span className="text-muted-foreground/40">{'☆'.repeat(3 - n)}</span>
    </span>
  )
}

function shuffle<T>(arr: T[]) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

type View =
  | { kind: 'hub' }
  | { kind: 'play'; title: string; levelId: string | null; qs: QuizQuestion[] }
  | { kind: 'result'; title: string; levelId: string | null; qs: QuizQuestion[]; scores: number[] }
  | { kind: 'wrong' }

function QuizDialog({ open, setOpen, chapterId, startLevel, onChange }: { open: boolean; setOpen: (o: boolean) => void; chapterId: string; startLevel: string; onChange: (p: QuizProgress) => void }) {
  // 弹窗经 portal 渲染，但 React 事件仍沿组件树冒泡：入口位于手风琴触发器内时，
  // 不拦截的话在弹窗里点击会顺带收起 / 展开篇章
  const stop = (e: SyntheticEvent) => e.stopPropagation()
  return (
    <span onClick={stop} onKeyDown={stop} onPointerDown={stop} className="contents">
      <Dialog open={open} onOpenChange={o => { setOpen(o); if (!o) onChange(loadQuiz()) }}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          {open && <QuizHub chapterId={chapterId} startLevel={startLevel} onChange={onChange} />}
        </DialogContent>
      </Dialog>
    </span>
  )
}

/** 理论地图模块标题旁的「闯关」按钮：模块有题才渲染，显示题数与已获星级 */
export function QuizEntry({ chapterId, moduleName }: { chapterId: string; moduleName: string }) {
  const mod = moduleName.match(/^(M\d+)/)?.[1]
  const levelId = `${chapterId}-${mod}`
  const count = useMemo(() => QUIZ.filter(q => levelOf(q.pointId) === levelId).length, [levelId])
  const [open, setOpen] = useState(false)
  const [progress, setProgress] = useState<QuizProgress>(loadQuiz)
  if (!mod || count === 0) return null
  const rec = progress.levels[levelId]
  return (
    <>
      <button
        type="button"
        onClick={() => { setProgress(loadQuiz()); setOpen(true) }}
        className="ml-2 inline-flex h-6 items-center gap-1.5 rounded-md border border-amber-500/50 bg-amber-500/15 px-2.5 text-xs font-medium text-amber-800 shadow-xs hover:bg-amber-500/25 dark:text-amber-300 transition-colors align-middle"
        title={`闯关自测：${count} 题，≥80% 通关`}
      >
        <Swords className="h-3.5 w-3.5" />闯关自测 · {count} 题
        <Stars n={rec?.stars ?? 0} className="text-[11px]" />
      </button>
      <QuizDialog open={open} setOpen={setOpen} chapterId={chapterId} startLevel={levelId} onChange={setProgress} />
    </>
  )
}

/** 篇章标题上的「本章可闯关」小标识（位于手风琴触发器内，故用 span 而非 button） */
export function ChapterQuizBadge({ chapterId }: { chapterId: string }) {
  const count = useMemo(() => QUIZ.filter(q => q.pointId.startsWith(chapterId + '-')).length, [chapterId])
  const [open, setOpen] = useState(false)
  const [, setProgress] = useState<QuizProgress>(loadQuiz)
  if (count === 0) return null
  const openHub = (e: SyntheticEvent) => { e.stopPropagation(); e.preventDefault(); setOpen(true) }
  return (
    <>
      <span
        role="button"
        tabIndex={0}
        onClick={openHub}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') openHub(e) }}
        className="inline-flex flex-none items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-800 hover:bg-amber-500/20 dark:text-amber-300 transition-colors"
        title={`本章共 ${count} 道自测题，点击打开关卡列表`}
      >
        <Swords className="h-3 w-3" />本章可闯关
      </span>
      <QuizDialog open={open} setOpen={setOpen} chapterId={chapterId} startLevel="" onChange={setProgress} />
    </>
  )
}

function QuizHub({ chapterId, startLevel, onChange }: { chapterId: string; startLevel: string; onChange: (p: QuizProgress) => void }) {
  const ch = THEORY_CHAPTERS.find(c => c.id === chapterId)!
  const [progress, setProgressState] = useState<QuizProgress>(loadQuiz)
  const [view, setView] = useState<View>({ kind: 'hub' })
  const fileRef = useRef<HTMLInputElement>(null)

  function titleOf(levelId: string) {
    const m = levelId.split('-')[1]
    const mo = ch.modules.find(x => x.name.startsWith(m + ' '))
    return mo ? `${chapterId} · ${mo.name}` : levelId
  }

  function setProgress(p: QuizProgress) {
    setProgressState(p)
    saveQuiz(p)
    onChange(p)
  }

  // 本篇章的关卡（按模块顺序，只列有题的模块）
  const levels = ch.modules
    .map(mo => `${chapterId}-${mo.name.match(/^(M\d+)/)?.[1]}`)
    .map(id => ({ id, qs: QUIZ.filter(q => levelOf(q.pointId) === id) }))
    .filter(l => l.qs.length > 0)
  const pool = levels.flatMap(l => l.qs)
  const wrongQs = QUIZ.filter(q => progress.wrong[q.id])

  function finish(v: Extract<View, { kind: 'play' }>, scores: number[]) {
    const score = scores.reduce((a, b) => a + b, 0) / scores.length
    const wrong = { ...progress.wrong }
    v.qs.forEach((q, i) => { if (scores[i] < 1) wrong[q.id] = today(); else delete wrong[q.id] })
    const levels = { ...progress.levels }
    if (v.levelId) {
      const prev = levels[v.levelId]
      if (!prev || score > prev.best) levels[v.levelId] = { best: score, stars: starsOf(score), at: today() }
    }
    setProgress({ levels, wrong })
    setView({ kind: 'result', title: v.title, levelId: v.levelId, qs: v.qs, scores })
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify({ app: 's2ai-quiz', version: 1, ...progress }, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `s2ai-quiz-progress-${today()}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  function importJson(file: File) {
    file.text().then(t => {
      try {
        const v = JSON.parse(t)
        if (typeof v !== 'object' || !v || typeof v.levels !== 'object') throw new Error('bad')
        const wrong = Object.fromEntries(Object.entries(v.wrong ?? {}).filter(([k]) => QUIZ_IDS.has(k))) as Record<string, string>
        setProgress({ levels: v.levels, wrong })
        window.alert('自测进度已导入')
      } catch {
        window.alert('导入失败：不是有效的自测进度文件')
      }
    })
  }

  if (view.kind === 'play') {
    return <Play key={view.title + view.qs.map(q => q.id).join()} view={view} onBack={() => setView({ kind: 'hub' })} onFinish={s => finish(view, s)} />
  }

  if (view.kind === 'result') {
    const score = view.scores.reduce((a, b) => a + b, 0) / view.scores.length
    const stars = starsOf(score)
    const passed = score >= PASS
    const idx = levels.findIndex(l => l.id === view.levelId)
    const next = idx >= 0 ? levels[idx + 1] : undefined
    return (
      <div className="space-y-4">
        <DialogHeader>
          <DialogTitle>{passed ? '通关！' : '还差一点'}</DialogTitle>
          <DialogDescription>{view.title}</DialogDescription>
        </DialogHeader>
        <div className="rounded-lg border bg-card p-5 text-center space-y-2">
          <Stars n={stars} className="text-3xl tracking-widest" />
          <div className="text-2xl font-medium tabular-nums">{Math.round(score * 100)}<span className="text-sm text-muted-foreground"> 分</span></div>
          <p className="text-xs text-muted-foreground">≥80 通关 · ≥90 两星 · 100 三星{view.levelId && progress.levels[view.levelId] ? ` ｜ 本关最佳 ${Math.round(progress.levels[view.levelId].best * 100)} 分` : ''}</p>
        </div>
        <div className="space-y-1">
          {view.qs.map((q, i) => (
            <div key={q.id} className="flex items-start gap-2 text-sm">
              {view.scores[i] >= 1
                ? <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-emerald-500" />
                : <XCircle className="mt-0.5 h-4 w-4 flex-none text-rose-500" />}
              <span className="min-w-0"><span className="font-mono text-xs text-muted-foreground mr-1.5">{q.pointId}</span>{q.question}</span>
              <span className="ml-auto flex-none text-xs tabular-nums text-muted-foreground">{Math.round(view.scores[i] * 100)}%</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setView({ kind: 'play', title: view.title, levelId: view.levelId, qs: view.levelId ? view.qs : shuffle(view.qs) })}>
            <RotateCcw className="h-3.5 w-3.5" />再闯一次
          </Button>
          {view.scores.some(s => s < 1) && (
            <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setView({ kind: 'wrong' })}>
              <BookX className="h-3.5 w-3.5" />看错题本
            </Button>
          )}
          {passed && next && (
            <Button size="sm" className="gap-1.5" onClick={() => setView({ kind: 'play', title: titleOf(next.id), levelId: next.id, qs: next.qs })}>
              下一关<ArrowRight className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={() => setView({ kind: 'hub' })}>返回关卡列表</Button>
        </div>
      </div>
    )
  }

  if (view.kind === 'wrong') {
    return (
      <div className="space-y-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><BookX className="h-4 w-4" />错题本</DialogTitle>
          <DialogDescription>没拿满分的题会进来；重练时答对即移出。共 {wrongQs.length} 题。</DialogDescription>
        </DialogHeader>
        {wrongQs.length === 0
          ? <p className="py-8 text-center text-sm text-muted-foreground">错题本是空的 🎉</p>
          : (
            <div className="space-y-3">
              {wrongQs.map(q => (
                <div key={q.id} className="rounded-md border p-3 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-mono">{q.pointId}</span>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">{TYPE_LABEL[q.type]}</Badge>
                    <span className="ml-auto">{progress.wrong[q.id]}</span>
                  </div>
                  <p className="text-sm">{q.question}</p>
                  {q.type === 'choice' && q.options && q.answer !== undefined && (
                    <p className="text-xs text-emerald-700 dark:text-emerald-400">正确答案：{String.fromCharCode(65 + q.answer)}. {q.options[q.answer]}</p>
                  )}
                  <p className="text-xs text-muted-foreground leading-relaxed">{q.explanation}</p>
                </div>
              ))}
            </div>
          )}
        <div className="flex flex-wrap gap-2">
          {wrongQs.length > 0 && (
            <Button size="sm" className="gap-1.5" onClick={() => setView({ kind: 'play', title: '错题重练', levelId: null, qs: shuffle(wrongQs) })}>
              <RotateCcw className="h-3.5 w-3.5" />重练错题
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={() => setView({ kind: 'hub' })}>返回关卡列表</Button>
        </div>
      </div>
    )
  }

  // hub：关卡列表
  const firstUnpassed = levels.findIndex(l => (progress.levels[l.id]?.best ?? 0) < PASS)
  const bossOpen = levels.length >= BOSS_MIN_LEVELS
  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2"><Swords className="h-4 w-4" />闯关自测 · {ch.id} {ch.name}</DialogTitle>
        <DialogDescription>一个模块一关，≥80% 通关并按得分给 1–3 星。关卡不上锁，通关后高亮下一关。进度只存本机。</DialogDescription>
      </DialogHeader>
      <div className="space-y-2">
        {levels.map((l, i) => {
          const rec = progress.levels[l.id]
          const highlight = i === firstUnpassed
          return (
            <button key={l.id} type="button"
              onClick={() => setView({ kind: 'play', title: titleOf(l.id), levelId: l.id, qs: l.qs })}
              className={`flex w-full items-center gap-3 rounded-md border px-3 py-2.5 text-left transition-colors hover:bg-accent ${highlight ? 'border-primary/60 bg-primary/5' : ''}`}>
              <span className="text-xs font-mono text-muted-foreground">第 {i + 1} 关</span>
              <span className="min-w-0 flex-1 text-sm truncate">{titleOf(l.id).split(' · ')[1]}</span>
              {l.id === startLevel && <span className="hidden sm:inline text-[10px] text-muted-foreground">本模块</span>}
              <span className="text-xs text-muted-foreground">{l.qs.length} 题</span>
              {rec ? <Stars n={rec.stars} className="text-xs" /> : highlight ? <Badge className="text-[10px] h-4 px-1.5">下一关</Badge> : null}
            </button>
          )
        })}
        <div className={`flex items-center gap-3 rounded-md border border-dashed px-3 py-2.5 ${bossOpen ? '' : 'opacity-60'}`}>
          {bossOpen ? <Crown className="h-4 w-4 text-amber-500" /> : <Lock className="h-4 w-4 text-muted-foreground" />}
          <span className="flex-1 text-sm">Boss 关 · 全篇章随机混合 {BOSS_SIZE} 题</span>
          {bossOpen
            ? <Button size="sm" variant="outline" onClick={() => setView({ kind: 'play', title: `${ch.id} · Boss 关`, levelId: `${ch.id}-BOSS`, qs: shuffle(pool).slice(0, BOSS_SIZE) })}>挑战</Button>
            : <span className="text-xs text-muted-foreground">即将开放（本篇章 ≥{BOSS_MIN_LEVELS} 关有题后开放）</span>}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setView({ kind: 'wrong' })}>
          <BookX className="h-3.5 w-3.5" />错题本 {wrongQs.length}
        </Button>
        <Button size="sm" variant="ghost" className="gap-1.5" onClick={exportJson}><Download className="h-3.5 w-3.5" />导出进度</Button>
        <Button size="sm" variant="ghost" className="gap-1.5" onClick={() => fileRef.current?.click()}><Upload className="h-3.5 w-3.5" />导入进度</Button>
        <input ref={fileRef} type="file" accept="application/json,.json" className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) importJson(f); e.target.value = '' }} />
      </div>
    </div>
  )
}

const TYPE_LABEL: Record<QuizQuestion['type'], string> = { choice: '选择', short: '简答', code: '手撕' }

function Play({ view, onBack, onFinish }: { view: Extract<View, { kind: 'play' }>; onBack: () => void; onFinish: (scores: number[]) => void }) {
  const [i, setI] = useState(0)
  const [scores, setScores] = useState<number[]>([])
  const [picked, setPicked] = useState<number | null>(null)
  const [text, setText] = useState('')
  const [revealed, setRevealed] = useState(false)
  const [ticks, setTicks] = useState<boolean[]>([])
  const [selfScore, setSelfScore] = useState<number | null>(null)
  const q = view.qs[i]

  const current: number | null =
    q.type === 'choice' ? (picked === null ? null : picked === q.answer ? 1 : 0)
      : q.type === 'short' ? (revealed ? ticks.filter(Boolean).length / (q.keyPoints?.length || 1) : null)
        : selfScore

  function next() {
    if (current === null) return
    const s = [...scores, current]
    if (i + 1 >= view.qs.length) { onFinish(s); return }
    setScores(s); setI(i + 1); setPicked(null); setText(''); setRevealed(false); setTicks([]); setSelfScore(null)
  }

  return (
    <div className="space-y-4 min-w-0">
      <DialogHeader>
        <DialogTitle className="pr-6">{view.title}</DialogTitle>
        <DialogDescription className="flex items-center gap-2">
          第 {i + 1} / {view.qs.length} 题
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">{TYPE_LABEL[q.type]}</Badge>
          <span className="font-mono text-xs">{q.pointId}</span>
        </DialogDescription>
      </DialogHeader>
      <Progress value={(i / view.qs.length) * 100} className="h-1.5" />
      <p className="text-sm leading-relaxed font-medium">{q.question}</p>

      {q.type === 'choice' && (
        <div className="space-y-2">
          {q.options?.map((o, k) => {
            const done = picked !== null
            const isAns = k === q.answer
            const cls = !done ? 'hover:bg-accent'
              : isAns ? 'border-emerald-500/60 bg-emerald-500/10'
                : k === picked ? 'border-rose-500/60 bg-rose-500/10' : 'opacity-60'
            return (
              <button key={k} type="button" disabled={done} onClick={() => setPicked(k)}
                className={`flex w-full items-start gap-2 rounded-md border px-3 py-2 text-left text-sm transition-colors ${cls}`}>
                <span className="font-mono text-xs text-muted-foreground mt-0.5">{String.fromCharCode(65 + k)}</span>
                <span className="min-w-0 flex-1">{o}</span>
                {done && isAns && <CheckCircle2 className="h-4 w-4 flex-none text-emerald-500" />}
                {done && !isAns && k === picked && <XCircle className="h-4 w-4 flex-none text-rose-500" />}
              </button>
            )
          })}
        </div>
      )}

      {(q.type === 'short' || q.type === 'code') && (
        <Textarea value={text} onChange={e => setText(e.target.value)} disabled={revealed}
          placeholder={q.type === 'code' ? '在这里写代码（不会运行，写完点「看参考」自评）' : '先用自己的话作答，再点「看要点」对照勾选'}
          className={`min-h-28 text-sm ${q.type === 'code' ? 'font-mono text-xs' : ''}`} />
      )}

      {(q.type === 'short' || q.type === 'code') && !revealed && (
        <Button size="sm" variant="outline" onClick={() => { setRevealed(true); setTicks((q.keyPoints ?? []).map(() => false)) }}>
          {q.type === 'short' ? '看要点' : '看参考'}
        </Button>
      )}

      {q.type === 'short' && revealed && (
        <div className="space-y-1.5 rounded-md border p-3">
          <p className="text-xs text-muted-foreground">勾选你答到的要点（得分 = 命中比例）</p>
          {q.keyPoints?.map((kp, k) => (
            <div key={k} role="checkbox" aria-checked={!!ticks[k]} tabIndex={0}
              onClick={() => setTicks(t => t.map((v, j) => j === k ? !v : v))}
              onKeyDown={e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setTicks(t => t.map((v, j) => j === k ? !v : v)) } }}
              className="flex cursor-pointer items-start gap-2 rounded px-1 py-1 text-sm hover:bg-accent">
              <Checkbox className="mt-0.5 pointer-events-none" checked={!!ticks[k]} aria-hidden />
              <span className="min-w-0">{kp}</span>
            </div>
          ))}
        </div>
      )}

      {q.type === 'code' && revealed && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">参考实现</p>
          <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs leading-relaxed"><code>{q.reference}</code></pre>
          <p className="text-xs text-muted-foreground">测试用例（复制到本地跑一遍自检）</p>
          <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs leading-relaxed"><code>{q.tests}</code></pre>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">自评：</span>
            {[{ v: 1, l: '全对' }, { v: 0.5, l: '部分正确' }, { v: 0, l: '没写出来' }].map(o => (
              <Button key={o.l} size="sm" variant={selfScore === o.v ? 'default' : 'outline'} onClick={() => setSelfScore(o.v)}>{o.l}</Button>
            ))}
          </div>
        </div>
      )}

      {((q.type === 'choice' && picked !== null) || (q.type !== 'choice' && revealed)) && (
        <div className="rounded-md bg-muted/60 p-3 text-xs leading-relaxed space-y-1">
          <p><span className="font-medium">解析：</span>{q.explanation}</p>
          {q.source && <p>出处：<a href={q.source.url} target="_blank" rel="noreferrer" className="text-primary hover:underline underline-offset-2">{q.source.title}</a></p>}
        </div>
      )}

      <div className="flex items-center gap-2">
        <Button size="sm" variant="ghost" onClick={onBack}>关卡列表</Button>
        <Button size="sm" className="ml-auto gap-1.5" disabled={current === null} onClick={next}>
          {i + 1 >= view.qs.length ? '交卷' : '下一题'}<ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}
