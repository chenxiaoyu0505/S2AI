// AI 学习站 · 全部内容数据（公开版）
// 个人化内容（如面试拆解）只放在 src/data/content.local.ts，不进 git

export interface ChecklistItem {
  id: string
  t: string
  e?: string
  /** 关联八股考点编号（如 02-M5.2），显示为挂靠标记 */
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

export interface Direction {
  rank: string
  name: string
  tag: string
  tagKind: 'main' | 'core' | 'base' | 'side'
  tools: string
  work: string
  top?: boolean
}

export interface TeardownProject {
  name: string
  repo: string
  oneliner: string
  deploy: string[]
  teardown: { title: string; points: string[] }[]
  qa: { q: string; a: string }[]
}

export interface JepaNode {
  name: string
  year: string
  key?: boolean
  desc: string
}

export const DIRECTIONS: Direction[] = [
  { rank: '1', name: 'Agent 开发', tag: '第一主线', tagKind: 'main', top: true,
    tools: 'LangChain → LangGraph → MCP → trace / 评测 / 人工审批',
    work: '带执行记录的科研或求职助手' },
  { rank: '2', name: 'RAG / 知识库', tag: '主线', tagKind: 'main', top: true,
    tools: '解析 → 混合检索 → reranker → 引用 → Ragas 评测',
    work: '带出处回答与评测看板的论文知识库' },
  { rank: '3', name: 'LLM 后训练与推理', tag: '主线', tagKind: 'main', top: true,
    tools: 'SFT / LoRA → DPO → GRPO → vLLM 部署压测',
    work: '微调模型 + 数据集 + 实验报告' },
  { rank: '4', name: '强化学习', tag: '共同基础', tagKind: 'core',
    tools: 'Gymnasium + SB3，手写 DQN / PPO，衔接 TRL',
    work: '具身、智驾、RLHF 的公共底座' },
  { rank: '5', name: '具身智能仿真', tag: '仿真优先', tagKind: 'core',
    tools: 'ManiSkill / MuJoCo，PPO vs 行为克隆对比',
    work: '无需真机，普通笔记本可起步' },
  { rank: '6', name: '自动驾驶仿真', tag: '可选支线', tagKind: 'base',
    tools: 'CARLA + nuPlan 闭环评测，感知 / 规划 / 控制',
    work: '全栈路线 CARLA + ROS 2 + Autoware 门槛最高' },
  { rank: '7', name: '量子计算', tag: '独立支线', tagKind: 'side',
    tools: 'Qiskit / PennyLane，VQE / QAOA / 变分量子分类',
    work: '仅申请相关实验室时投入' },
  { rank: '+', name: 'JEPA / 世界模型', tag: '科研支线', tagKind: 'base',
    tools: '自监督世界模型，LeCun 自主智能路线',
    work: '与具身智能、强化学习联动' },
]

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
    { id: 'q-distill', t: '量化 vs 蒸馏辨析笔记', e: '各解决什么问题、能否组合、面试怎么答', ref: '03-M3.4' },
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
  { name: 'JEPA / 世界模型', opt: true, items: [
    { id: 'j-code', t: '跑通 I-JEPA / V-JEPA 官方代码' },
    { id: 'j-mini', t: '小数据集训练迷你 JEPA', e: '与 MAE 像素重建对比' },
    { id: 'j-plan', t: '动作条件预测 + 隐空间规划', e: 'V-JEPA 2-AC 思路，CEM / MPC' },
    { id: 'j-sim', t: 'MuJoCo / ManiSkill 上对比 PPO / BC' },
  ]},
  { name: 'REA 工具', opt: true, items: [
    { id: 'rea-install', t: '安装 rea-agents 并接入编码 Agent', e: 'Node 24.11+，MCP 登记进客户端' },
    { id: 'rea-demo', t: '跟练恐龙加速 demo', e: '读运行中脚本 → 复刻规则 → 核对数字' },
    { id: 'rea-own', t: '用 REA 分析自己的网页 / 小项目' },
  ]},
]

export const JEPA_NODES: JepaNode[] = [
  { name: 'JEPA 理论框架', year: '2022', desc: 'LeCun 立场论文《A Path Towards Autonomous Machine Intelligence》：感知、世界模型、代价、执行器、记忆、配置器六大模块。' },
  { name: 'I-JEPA', year: '2023', key: true, desc: '图像掩码区域的隐空间预测，EMA teacher 防坍塌，学习语义图像表征。' },
  { name: 'V-JEPA', year: '2024', key: true, desc: '扩展到视频：预测时空掩码区域的表征，从纯特征预测中学到运动与物理规律。' },
  { name: 'V-JEPA 2 / 2-AC', year: '2025', key: true, desc: '百万小时视频预训练 + 少量机器人数据后训练，实现零样本机器人规划（抓取、放置），无需任务特定奖励。' },
  { name: 'V-JEPA 2.1 · VL-JEPA · MC-JEPA', year: '2025–2026', desc: '更稠密的交互敏感表征；视觉–语言 JEPA 先在嵌入空间预测语义再解码文本；多模态联合嵌入。' },
  { name: 'LeJEPA · LeWorldModel', year: '2025–2026', desc: 'SIGReg 单一高斯正则替代复杂防坍塌技巧；端到端从像素稳定训练隐空间动力学，配 CEM + MPC 做隐空间规划。' },
]

export const JEPA_STEPS = [
  { t: '跑通 I-JEPA / V-JEPA 官方代码与预训练特征评测', e: '理解 encoder + predictor + EMA teacher 三件套' },
  { t: '在小数据集上训练迷你 JEPA', e: 'ViT + EMA teacher + 掩码预测，与 MAE 像素重建对比' },
  { t: '加入动作条件预测与隐空间规划', e: '沿 V-JEPA 2-AC 思路：目标表征 + CEM / MPC 搜索动作序列' },
  { t: '在 MuJoCo / ManiSkill 上对比基线', e: '与 PPO、行为克隆比较成功率和样本效率，录制 rollout 视频' },
]

export const REA_STEPS = [
  { t: 'rea-agents 是什么', e: 'MCP 工具：连接本机 Chrome 调试端口（CDP），让编码 Agent 读取正在运行的网页脚本——分析自己或已授权的页面' },
  { t: '安装与接入', e: 'Node 24.11+；npx rea-agents setup --client <agent> 把 MCP 登记进 Kimi / Codex 等客户端' },
  { t: '跟练官方 demo', e: '调试端口开 Chrome → inspect_web_page 读 index.js → 复刻恐龙加速规则 → 数值核对' },
  { t: '用 REA 分析自己的项目', e: '逆向思路 + 浏览器自动化，衔接 Agent 工具链学习' },
]

export const JEPA_NOTE = 'JEPA 向上衔接具身智能仿真（ManiSkill / MuJoCo）与强化学习（KL 约束、reward），向下是自监督表示学习，是「仿真项目」的高价值选题。REA 则属于 Agent 工具链：练习 MCP 接入、浏览器调试端口与逆向分析思路。延伸方向：循环隐空间推理（looped latent refinement / latent reasoning），把推理预算投入到表征迭代而非生成 token。'

export const WORKS = [
  { kind: '作品一 · 工程型', title: '生产化 Agent / RAG 系统', desc: '搜索本地资料、查询网页、生成报告；高风险操作请求人工确认；每一步执行留痕。' },
  { kind: '作品二 · 实验型', title: '后训练 / 具身智能 / 自动驾驶 / 世界模型', desc: '含消融实验与失败案例分析的可复现实验项目；JEPA 世界模型规划是推荐的差异化选题。' },
]

export const WORK_REQUIREMENTS = [
  '完整 README 和架构说明',
  '可复现的环境与实验命令',
  'Docker 或明确的依赖文件',
  '定量评测指标和基线对比',
  '失败案例与局限性分析',
  '演示截图或视频',
  '清晰的 Git 提交记录',
]
