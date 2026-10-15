// 主流开源模型卡片 · 数据更新于 2026-10-15（首批）
// 事实来源：各官方模型卡 / 技术报告 / NVIDIA·IBM 发布页，详见会话记录
// 注意：模型信息时效性极强，更新某张卡时同步改 updated 字段

export interface ModelCard {
  name: string
  org: string
  released: string
  params: string        // 总参数 / 激活参数
  arch: string          // Dense / MoE + 注意力方案
  context: string
  license: string
  quant: string         // 量化支持
  highlight: string
  fit: string           // 什么场景选它
}

export const MODEL_CARDS: ModelCard[] = [
  {
    name: 'Qwen3 系列',
    org: '阿里通义',
    released: '2025-04（Next 版 2025-09）',
    params: 'Dense 0.6B–32B ｜ MoE 30B-A3B / 235B-A22B / Next-80B-A3B',
    arch: 'GQA；MoE 版 128 专家 top-8；Next 版 Gated DeltaNet + Attention 3:1 混合',
    context: '原生 32K，YaRN 至 128K（Coder 至 1M）',
    license: 'Apache 2.0',
    quant: '官方 FP8 版本；GGUF / AWQ / GPTQ 社区生态最全',
    highlight: '思考/非思考双模式一套权重切换；119 种语言；36T token 训练',
    fit: '中文场景与本地部署首选，尺寸覆盖边缘到旗舰，许可证最宽松',
  },
  {
    name: 'DeepSeek V3 / R1',
    org: '深度求索',
    released: 'V3 2024-12 ｜ R1 2025-01 ｜ V3.2 2025-12',
    params: '671B 总参 / 37B 激活（R1-Distill 1.5B–70B）',
    arch: 'MoE 256 路由专家 + 1 共享专家 top-8；MLA；MTP 多 token 预测',
    context: '128K（V3.2 引入 DSA 稀疏注意力降长文本成本）',
    license: 'MIT（V3-0324 起权重转 MIT）',
    quant: '原生 FP8 权重训练与发布；GGUF / FP8 部署生态成熟',
    highlight: 'MLA 压缩 KV Cache + FP8 训练 = 训练效率标杆；R1 纯 RL 激发推理',
    fit: '推理能力（数学/代码）对标 o1 的开源方案，论文与面试必讲架构',
  },
  {
    name: 'Kimi K2',
    org: '月之暗面',
    released: '2025-07（K2 系，K2.5/2.6 为后续迭代）',
    params: '1T 总参 / 32B 激活',
    arch: 'MoE 384 专家 top-8 + 1 共享；MLA（q/kv LoRA 秩 1536/512）；MuonClip 优化器',
    context: '128K（0905 版扩至 256K）',
    license: '修改版 MIT（Modified MIT）',
    quant: 'Block-FP8 权重发布；K2 Thinking 原生 INT4（量化感知训练）',
    highlight: 'Agentic RL 大规模工具调用训练；SWE-bench / τ²-bench 开源 SOTA',
    fit: '代码与 Agent 任务的开源旗舰，注意「开放权重 ≠ 严格开源」的许可辨析',
  },
  {
    name: 'Llama 4 Scout / Maverick',
    org: 'Meta',
    released: '2025-04',
    params: 'Scout 109B / Maverick 400B，均 17B 激活',
    arch: 'MoE：Scout 16 专家 top-1，Maverick 128 专家 + 1 共享；原生多模态',
    context: 'Scout 10M ｜ Maverick 1M',
    license: 'Llama 社区许可证（月活超 7 亿企业需单独授权）',
    quant: '官方 int4 优化（单张 H100 可跑 Scout）；GGUF / vLLM 支持',
    highlight: '超长上下文 + 原生图像理解；MoE 化后同激活参数更大容量',
    fit: '多模态与超长文档场景；研究英语生态与许可限制之间的取舍',
  },
  {
    name: 'GLM-4.5 系列',
    org: '智谱 AI',
    released: '2025-07（4.6 为后续迭代）',
    params: '355B 总参 / 32B 激活（Air 版 106B-A12B）',
    arch: 'MoE 160 专家；思考/非思考混合推理双模式',
    context: '128K',
    license: 'MIT',
    quant: '官方 FP8 版本开源（含权重、代码、推理解析器）',
    highlight: '专为 Agent 任务设计（工具调用、推理一体化）；国产算力友好',
    fit: 'Agent 应用与国产部署场景，MIT 可自由商用',
  },
  {
    name: 'Mixtral 8x7B / 8x22B',
    org: 'Mistral AI',
    released: '2023-12 ｜ 2024-04',
    params: '47B-A12.9B ｜ 141B-A39B',
    arch: 'MoE 鼻祖：8 专家 top-2 稀疏激活，共享注意力',
    context: '32K ｜ 64K',
    license: 'Apache 2.0',
    quant: 'GGUF / AWQ 生态最成熟的 MoE，单卡 4090 可跑 8x7B Q4',
    highlight: '首个证明「稀疏激活 ≈ 更大 Dense 质量」的开源模型',
    fit: 'MoE 原理入门与低成本本地推理的经典教材级模型',
  },
]

export const MODEL_GUIDE_ROWS: { dim: string; dense: string; moe: string }[] = [
  { dim: '推理成本', dense: '每 token 激活全部参数，成本随总参数线性涨', moe: '只激活 top-k 专家，成本按激活参数算（如 1T 的 K2 只花 32B 的钱）' },
  { dim: '显存占用', dense: '权重全量常驻（7B bf16 ≈ 14 GB）', moe: '专家权重也要全量常驻显存——省算力不省显存，MoE 部署先看总参数' },
  { dim: '微调', dense: 'LoRA/QLoRA 生态最成熟', moe: '专家路由让微调更难，通常只调共享层/注意力（如 LoRA 冻结路由）' },
  { dim: '典型场景', dense: '中小尺寸（≤32B）本地部署、SFT 实验', moe: '大容量服务：Qwen3-235B、Kimi K2、DeepSeek V3 档' },
  { dim: '量化注意', dense: 'Q4 质量损失小，GGUF 一键搞定', moe: '专家权重分布差异大，优先选官方量化版（FP8/INT4）再考虑社区 GGUF' },
]

export const MODEL_CARDS_UPDATED = '2026-10'
