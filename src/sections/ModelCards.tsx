import { ExternalLink, Cpu, Scale } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MODEL_CARDS, MODEL_GUIDE_ROWS, MODEL_CARDS_UPDATED } from '@/data/models'

export default function ModelCards() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
        主流开放权重模型速查（对应八股考点 02-M2.2 主流模型横向对比）。模型迭代极快，
        每张卡的信息截止 <span className="font-medium text-foreground/80">{MODEL_CARDS_UPDATED}</span>，看的时候留意日期戳。
      </p>

      <div className="grid gap-3 md:grid-cols-2">
        {MODEL_CARDS.map(m => (
          <Card key={m.name} className="transition-shadow hover:shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="text-base">{m.name}</CardTitle>
                <Badge variant="secondary" className="text-xs">{m.org}</Badge>
                <span className="ml-auto text-xs text-muted-foreground">{m.released}</span>
              </div>
              <CardDescription className="text-sm leading-relaxed">{m.highlight}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1.5 text-sm">
              {[
                ['参数', m.params],
                ['架构', m.arch],
                ['上下文', m.context],
                ['许可证', m.license],
                ['量化', m.quant],
              ].map(([k, v]) => (
                <p key={k} className="flex gap-2 leading-relaxed">
                  <span className="flex-none w-14 text-xs font-medium text-foreground/70 pt-0.5">{k}</span>
                  <span className="text-muted-foreground">{v}</span>
                </p>
              ))}
              <p className="flex gap-2 leading-relaxed pt-1 border-t mt-2">
                <span className="flex-none w-14 text-xs font-medium text-foreground/70 pt-0.5">怎么选</span>
                <span className="text-muted-foreground">{m.fit}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2"><Scale className="h-4 w-4 text-muted-foreground" />Dense vs MoE 选型速查</CardTitle>
          <CardDescription>面试高频对比题，也是本地部署前第一件事</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2 pr-4 font-medium">维度</th>
                  <th className="py-2 pr-4 font-medium">Dense</th>
                  <th className="py-2 font-medium">MoE</th>
                </tr>
              </thead>
              <tbody>
                {MODEL_GUIDE_ROWS.map(r => (
                  <tr key={r.dim} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-2 pr-4 font-medium whitespace-nowrap">{r.dim}</td>
                    <td className="py-2 pr-4 text-muted-foreground">{r.dense}</td>
                    <td className="py-2 text-muted-foreground">{r.moe}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2"><Cpu className="h-4 w-4 text-muted-foreground" />量化速记（对应考点 03-M3）</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 md:grid-cols-2 text-sm text-muted-foreground">
            {[
              'GGUF（llama.cpp）：本地首选，Q4_K_M 是质量/体积平衡点',
              'AWQ / GPTQ：GPU 推理常用 4bit，vLLM / ExLlama 直接加载',
              '官方 FP8（DeepSeek / GLM / Qwen）优先于社区再量化',
              '量化降显存不降「总参数字节」之外的东西——MoE 省算力不省显存',
            ].map(s => <li key={s} className="flex gap-2"><span className="flex-none">·</span>{s}</li>)}
          </ul>
          <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
            动手入口：
            <a href="https://huggingface.co/Qwen" target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline inline-flex items-center gap-0.5">Qwen 官方 HF <ExternalLink className="h-3 w-3" /></a> ·
            <a href="https://huggingface.co/deepseek-ai" target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline inline-flex items-center gap-0.5">DeepSeek 官方 HF <ExternalLink className="h-3 w-3" /></a> ·
            <a href="https://huggingface.co/moonshotai" target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline inline-flex items-center gap-0.5">Moonshot AI 官方 HF <ExternalLink className="h-3 w-3" /></a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
