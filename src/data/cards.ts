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
  // ---- 模型种子卡（原速查板块瘦身并入，站长策展） ----
  {
    id: 'card-qwen3',
    name: 'Qwen3 系列',
    target: '02-M2.2',
    url: 'https://github.com/QwenLM/Qwen3',
    tags: ['GQA', 'MoE', '混合注意力', 'FP8', 'Apache 2.0'],
    next: ['02-M1.3', '02-M2.3', 'card-deepseek'],
    madeBy: '站长策展',
    date: '2026-10',
  },
  {
    id: 'card-deepseek',
    name: 'DeepSeek V3 / R1',
    target: '02-M2.4',
    url: 'https://github.com/deepseek-ai/DeepSeek-V3',
    tags: ['MoE', 'MLA', 'MTP', 'FP8 训练', 'MIT'],
    next: ['02-M1.3', '02-M4.5', 'card-mixtral'],
    madeBy: '站长策展',
    date: '2026-10',
  },
  {
    id: 'card-kimi-k2',
    name: 'Kimi K2',
    target: '02-M2.2',
    url: 'https://github.com/MoonshotAI/Kimi-K2',
    tags: ['MoE', 'MLA', 'MuonClip 优化器', 'Agentic RL'],
    next: ['02-M2.3', '05-M4.1', 'card-glm45'],
    madeBy: '站长策展',
    date: '2026-10',
  },
  {
    id: 'card-llama4',
    name: 'Llama 4 Scout / Maverick',
    target: '02-M2.5',
    url: 'https://github.com/meta-llama/llama-models',
    tags: ['MoE', '原生多模态', '超长上下文', '社区许可'],
    next: ['02-M2.3', 'card-llava'],
    madeBy: '站长策展',
    date: '2026-10',
  },
  {
    id: 'card-glm45',
    name: 'GLM-4.5 系列',
    target: '02-M2.2',
    url: 'https://github.com/zai-org/GLM-4.5',
    tags: ['MoE', 'Agent 任务', 'FP8 官方版', 'MIT'],
    next: ['02-M2.3', 'card-kimi-k2'],
    madeBy: '站长策展',
    date: '2026-10',
  },
  {
    id: 'card-mixtral',
    name: 'Mixtral 8x7B / 8x22B',
    target: '02-M2.3',
    url: 'https://github.com/mistralai/mistral-inference',
    tags: ['MoE 鼻祖', '稀疏激活 top-2', 'Apache 2.0', '单卡可跑'],
    next: ['02-M2.4', 'card-deepseek'],
    madeBy: '站长策展',
    date: '2026-10',
  },
  {
    id: 'card-qwen3vl',
    name: 'Qwen3-VL',
    target: 'm-vlm',
    url: 'https://huggingface.co/Qwen',
    tags: ['多语言 OCR', '原生视频理解', 'Visual Agent'],
    next: ['m-doc', 'm-video'],
    madeBy: '站长策展',
    date: '2026-10',
  },
  {
    id: 'card-internvl',
    name: 'InternVL 系列',
    target: 'm-doc',
    url: 'https://github.com/OpenGVLab/InternVL',
    tags: ['大视觉塔', '细粒度理解', '代码截图 / UI 分析'],
    next: ['m-vlm', 'card-llava'],
    madeBy: '站长策展',
    date: '2026-10',
  },
  {
    id: 'card-llava',
    name: 'LLaVA / LLaVA-OneVision',
    target: 'm-vlm',
    url: 'https://github.com/haotian-liu/LLaVA',
    tags: ['VLM 入门首选', '社区最大', '微调生态完善'],
    next: ['m-deploy', 'm-doc'],
    madeBy: '站长策展',
    date: '2026-10',
  },
  {
    id: 'card-minicpmv',
    name: 'MiniCPM-V',
    target: 'm-doc',
    url: 'https://github.com/OpenBMB/MiniCPM-V',
    tags: ['端侧部署', 'OCR', '密集文档'],
    next: ['m-vlm'],
    madeBy: '站长策展',
    date: '2026-10',
  },
  {
    id: 'card-gemma3',
    name: 'Gemma 3 / 4',
    target: 'm-vlm',
    url: 'https://ai.google.dev/gemma',
    tags: ['轻量多模态', '140+ 语言', '本地部署友好'],
    next: ['m-deploy'],
    madeBy: '站长策展',
    date: '2026-10',
  },
  {
    id: 'card-whisper',
    name: 'Whisper / FunASR',
    target: 'm-audio',
    url: 'https://github.com/openai/whisper',
    tags: ['语音识别', '多语言转写', '词级时间戳'],
    next: [],
    madeBy: '站长策展',
    date: '2026-10',
  },
]
