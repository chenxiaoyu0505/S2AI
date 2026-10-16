// AI 学习站 · 全部内容数据（公开版）
// 个人化内容（如项目拆解、个人学习规划）只放在 src/data/content.local.ts，不进 git

export interface ChecklistItem {
  id: string
  t: string
  e?: string
  /** 关联理论点编号（如 02-M5.2），显示为挂靠标记 */
  ref?: string
}

export interface ChecklistCat {
  name: string
  opt?: boolean
  items: ChecklistItem[]
}

/** 本地个人化内容的形状（src/data/content.local.ts，不进 git） */
export interface LocalContent {
  INTERVIEW_FRAMEWORK?: { step: string; desc: string }[]
  WEKNORA?: TeardownProject
  ONYX?: TeardownProject
  COMPARE_ROWS?: { dim: string; weknora: string; onyx: string }[]
  TEARDOWN_METHOD?: string[]
  EXTRA_CATS?: ChecklistCat[]
}

// 可选的本地私有数据文件：存在则合并进站点，不存在（如公开克隆）则全部为空
const localModule = Object.values(
  import.meta.glob<LocalContent>('./*.local.ts', { eager: true })
)[0]

export const LOCAL: LocalContent | undefined = localModule

export interface TeardownProject {
  name: string
  repo: string
  oneliner: string
  deploy: string[]
  teardown: { title: string; points: string[] }[]
  qa: { q: string; a: string }[]
}

export const CHECKLIST: ChecklistCat[] = [
  { name: '基础工具', items: [
    { id: 'f-py', t: 'Python + PyTorch 训练与推理基础' },
    { id: 'f-hf', t: 'Hugging Face Hub / Transformers', e: '跑通模型加载、数据集与评测' },
    { id: 'f-env', t: 'uv 虚拟环境与依赖管理' },
    { id: 'f-docker', t: 'Docker 固化训练与推理环境' },
    { id: 'f-serve', t: 'Ollama / llama.cpp / vLLM / LiteLLM', e: '本地模型运行与统一调用' },
  ]},
  { name: 'Agent 开发', items: [
    { id: 'a-loop', t: '手写 tool call 循环', e: 'LLM → tool call → 执行 → 回传，不用框架', ref: '04-M1.3' },
    { id: 'a-langchain', t: 'LangChain 工具调用 Agent' },
    { id: 'a-langgraph', t: 'LangGraph 状态机', e: '状态、路由、重试、人工审批、持久化' },
    { id: 'a-mcp', t: '编写一个 MCP Server 并被 Agent 调用', ref: '04-M2.3' },
    { id: 'a-trace', t: 'Langfuse / LangSmith trace 与离线评测' },
    { id: 'a-prod', t: '超时、权限控制与失败恢复' },
  ]},
  { name: 'RAG / 知识库', items: [
    { id: 'r-parse', t: 'PDF / Markdown / 网页解析与清洗' },
    { id: 'r-chunk', t: '固定切块 vs 语义切块对比' },
    { id: 'r-hybrid', t: 'BM25 + 向量混合检索', e: 'Qdrant / pgvector 本地部署', ref: '04-M4.3–4.5' },
    { id: 'r-emb', t: 'embedding 模型对比' },
    { id: 'r-rerank', t: 'reranker 重排', ref: '04-M4.5' },
    { id: 'r-cite', t: '带页码 / 原文位置的引用' },
    { id: 'r-eval', t: '检索与答案评测', e: 'Recall@K / MRR / nDCG / 忠实度（Ragas）', ref: '11-M3.4' },
    { id: 'r-index', t: '文档更新删除与索引版本管理' },
  ]},
  { name: 'LLM 后训练', items: [
    { id: 'p-data', t: '准备与检查高质量指令数据集' },
    { id: 'p-sft', t: 'LoRA / QLoRA SFT', e: '0.5B–3B 小模型，PEFT / Unsloth', ref: '02-M5.2 + 08-M2.1' },
    { id: 'p-eval', t: '独立测试集与 base / instruct 对比' },
    { id: 'p-dpo', t: '构造偏好数据完成 DPO', e: 'TRL', ref: '05-M3.3' },
    { id: 'p-grpo', t: '小规模 GRPO', e: '需可验证奖励', ref: '05-M4.1' },
    { id: 'p-deploy', t: 'vLLM / llama.cpp 部署与压测', ref: '03-M2.1' },
    { id: 'p-hybrid', t: '理解 Gated DeltaNet / 混合注意力架构', e: '线性注意力与 delta rule 概念 + 跑通 Qwen3-Next，理解 3:1 混合与 KV cache 差异', ref: '02-M2.6' },
  ]},
  { name: '模型量化（新增）', items: [
    { id: 'q-gguf', t: 'GGUF 量化跑通与对比', e: 'llama.cpp / Ollama 加载 Qwen3-8B，对比 Q4_K_M / Q8 的质量、速度与文件体积', ref: '03-M3.1' },
    { id: 'q-awq', t: 'AWQ / GPTQ 部署压测', e: 'vLLM 加载 4bit 量化模型，对比 bf16 的吞吐与显存', ref: '03-M3.2' },
    { id: 'q-vram', t: '手算推理显存', e: '权重 + KV Cache 逐项估算，复现「7B 塞进 24G」', ref: '08-M5.2' },
    { id: 'q-distill', t: '量化 vs 蒸馏辨析笔记', e: '各解决什么问题、能否组合、什么场景选哪个', ref: '03-M3.4' },
  ]},
  { name: '强化学习', items: [
    { id: 'rl-base', t: 'Gymnasium + Stable-Baselines3', e: 'CartPole / LunarLander / 连续控制' },
    { id: 'rl-hand', t: '手写 DQN 或 PPO', e: '不是只会调库', ref: '05-M1.3–1.4' },
    { id: 'rl-math', t: 'reward shaping / 随机种子 / 置信区间 / 训练稳定性' },
    { id: 'rl-torchrl', t: 'TorchRL 自定义环境或离线 RL' },
    { id: 'rl-trl', t: 'TRL 理解 rollout / reward / KL 约束', ref: '05-M3.2' },
  ]},
  { name: '具身智能（仿真）', items: [
    { id: 'e-mujoco', t: 'MuJoCo 环境与控制基础' },
    { id: 'e-mani', t: 'ManiSkill 训练抓取 / 放置策略' },
    { id: 'e-compare', t: '对比 PPO / 行为克隆 / 离线方法', e: '录 rollout 视频、成功率曲线、失败分类' },
  ]},
  { name: '自动驾驶（仿真）', opt: true, items: [
    { id: 'ad-carla', t: 'CARLA 仿真环境与传感器' },
    { id: 'ad-nuplan', t: 'nuPlan 规划与闭环评测' },
    { id: 'ad-ctrl', t: 'PID / MPC / RL 控制器对比' },
  ]},
  { name: '量子计算', opt: true, items: [
    { id: 'q-qiskit', t: 'Qiskit 电路构建与云端真机' },
    { id: 'q-algo', t: 'QAOA / VQE 求解小型问题' },
    { id: 'q-pennylane', t: 'PennyLane + PyTorch 变分量子分类器' },
  ]},
]

// 首页「从哪开始」：两类读者的入口路径
export const STARTERS = [
  {
    who: '零基础转行',
    desc: '从工具和基础理论开始，按顺序推进，不跳跃',
    steps: [
      '项目清单 · 基础工具组：Python / PyTorch / uv / Docker',
      '理论地图 · 01 篇章 DL 基础 + 02 篇章大模型基础',
      '回到项目清单：Agent 开发组动手起步',
    ],
  },
  {
    who: '有基础进阶',
    desc: '直接进主线，边学边把真实项目收进收集箱',
    steps: [
      '理论地图 · 04 篇章 Agent + 02 篇章大模型基础',
      '项目清单 · Agent 开发 / RAG 组',
      '收集箱收一个真实项目开练（观望 → 跟练）',
    ],
  },
]
