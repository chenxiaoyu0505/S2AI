// 学习卡片（cards）—— 树上的叶子：挂在任意节点上的粗粒度知识索引卡
// 由 Agent 端制作（见 AGENTS.md 任务手册 6），静态站只读展示。
// 设计约束（DESIGN.md §8）：不是笔记不是教程；一屏看完；
// next（推荐的相关学习）只指向树上的节点——理论点编号 / 清单项 id / 卡片 id / 收集箱条目。

export interface StudyCard {
  id: string              // 唯一 id，如 card-gqa
  name: string            // 名称
  target: string          // 分类：挂回树的位置（理论点编号 / 清单项 id / 收集箱 url / 另一张卡 id）
  url: string             // 链接（官方文档 / 论文 / 仓库）
  tags: string[]          // 关键技术栈/知识点（3–5 个）
  next: string[]          // 推荐的相关学习：指向树上节点的 id/编号
  madeBy?: string         // 制作方式：自己写的 / 让模型帮忙（可选）
  date?: string           // YYYY-MM（可选）
}

export const CARDS: StudyCard[] = [
  {
    id: 'card-gqa',
    name: 'GQA（分组查询注意力）',
    target: '02-M1.3',
    url: 'https://arxiv.org/abs/2305.13245',
    tags: ['KV Cache', 'MHA / MQA / GQA', '推理显存优化', 'LLaMA'],
    next: ['03-M1.1', '02-M2.4', 'q-vram'],
    madeBy: '让模型帮忙',
    date: '2026-10',
  },
  {
    id: 'card-kvcache',
    name: 'KV Cache 原理与显存估算',
    target: '03-M1.1',
    url: 'https://huggingface.co/docs/transformers/kv_cache',
    tags: ['自回归推理', '显存构成', 'MHA / GQA / MLA 差异'],
    next: ['card-gqa', '03-M1.4', 'q-vram'],
    madeBy: '让模型帮忙',
    date: '2026-10',
  },
  {
    id: 'card-lora',
    name: 'LoRA（低秩适配）',
    target: '02-M5.2',
    url: 'https://arxiv.org/abs/2106.09685',
    tags: ['PEFT', '低秩矩阵', 'QLoRA', '显存友好微调'],
    next: ['08-M2.1', 'p-sft', '02-M5.3'],
    madeBy: '让模型帮忙',
    date: '2026-10',
  },
]
