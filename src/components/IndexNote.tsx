import { Compass } from 'lucide-react'

/** 全站定位提示：本站只做索引和顺序，不提供详细内容（见 DESIGN.md §3 定位） */
export default function IndexNote() {
  return (
    <p className="flex items-start gap-1.5 rounded-md border bg-muted/40 px-3 py-2 text-xs text-muted-foreground max-w-3xl">
      <Compass className="h-3.5 w-3.5 mt-px flex-none" />
      本站只做索引、顺序和取舍，不提供详细内容——想学哪个点，顺着链接去它的官方文档 / 仓库 / 论文。
    </p>
  )
}
