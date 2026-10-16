// 叶子层（leaves）—— 长在理论树上的项目与实践项
// 迁移自原 CHECKLIST（48 项）+ RESOURCES（62 链接），去重合并，2026-10 一次性迁移（scripts/migrate-leaves.py）。
//
// 树的模型：理论 = 树（篇章=枝干，模块/学习点=枝节），项目 = 叶子。
// 落脚三级：anchor='root' 长在树根（全树基础工具）；anchor='04' 长在枝干；anchor='02-M5.2' 长在枝节；
// anchor='wild' = 野生叶子（已进树但未落户：树还没长出对应枝干，长出后移入）。
// 生长规则：归类不下 → 长新枝干（篇章）；再不行 → 长新树（新 tab）。

export type LeafAnchor = string // 'root' | 篇章 id（'01'–'12'）| 理论点编号（'02-M5.2'）| 'wild'

export interface Leaf {
  id: string          // 唯一 id，leaf- 前缀
  name: string        // 叶子名（项目 / 实践项）
  url: string         // 真实项目链接；空串 = 练习项（动手任务，非项目）
  anchor: LeafAnchor  // 树上落脚处（见文件头注释）
  tags: string[]      // 枝节索引（理论点编号）+ 自由关键词；野生叶子的标签即其分类依据
  intro: string       // 一句话：是什么 / 学什么
  opt?: boolean       // 支线
  practice?: boolean  // 练习项（无项目链接的动手任务）
}

export const LEAVES: Leaf[] = [
  { id: 'leaf-pytorch', name: 'PyTorch', url: 'https://pytorch.org/', anchor: 'root', tags: ['张量', '自动求导', '训练循环'], intro: '深度学习训练与推理的基础框架' },
  { id: 'leaf-hf', name: 'Hugging Face', url: 'https://huggingface.co/', anchor: 'root', tags: ['Transformers', '数据集', '评测社区'], intro: '最大的开源模型与数据集社区' },
  { id: 'leaf-uv', name: 'uv', url: 'https://docs.astral.sh/uv/', anchor: 'root', tags: ['依赖管理', '虚拟环境'], intro: '极快的 Python 包与环境管理器' },
  { id: 'leaf-docker', name: 'Docker', url: 'https://docs.docker.com/', anchor: 'root', tags: ['容器化', '环境固化'], intro: '容器化部署标准，固化训练/推理环境' },
  { id: 'leaf-ollama', name: 'Ollama', url: 'https://ollama.com/', anchor: 'root', tags: ['本地推理', '多模态运行'], intro: '本地运行大模型最简单的工具' },
  { id: 'leaf-llamacpp', name: 'llama.cpp', url: 'https://github.com/ggml-org/llama.cpp', anchor: 'root', tags: ['GGUF', 'CPU 推理'], intro: 'C/C++ 高性能推理引擎，GGUF 量化格式' },
  { id: 'leaf-litellm', name: 'LiteLLM', url: 'https://docs.litellm.ai/', anchor: 'root', tags: ['统一网关', '成本追踪'], intro: '统一调用 100+ 模型的网关' },
  { id: 'leaf-wandb', name: 'Weights & Biases', url: 'https://wandb.ai/', anchor: 'root', tags: ['实验跟踪'], intro: '实验跟踪与模型管理 SaaS' },
  { id: 'leaf-langchain', name: 'LangChain', url: 'https://docs.langchain.com/oss/python/learn', anchor: '04', tags: ['组件', '工具调用'], intro: 'LLM 应用集成框架' },
  { id: 'leaf-langgraph', name: 'LangGraph', url: 'https://langchain-ai.github.io/langgraph/', anchor: '04', tags: ['状态机', '路由', '人工审批'], intro: '有状态图驱动的 Agent 工作流' },
  { id: 'leaf-mcp', name: 'MCP 协议', url: 'https://modelcontextprotocol.io/', anchor: '04-M2.3', tags: ['标准协议', '工具接入'], intro: 'Agent 连接外部工具的标准协议' },
  { id: 'leaf-pydanticai', name: 'Pydantic AI', url: 'https://ai.pydantic.dev/', anchor: '04', tags: ['类型安全', '结构化输出'], intro: '类型安全的 Python Agent 框架' },
  { id: 'leaf-autogen', name: 'AutoGen', url: 'https://microsoft.github.io/autogen/stable/index.html', anchor: '04', tags: ['多 Agent 协作', '事件驱动'], intro: '微软多 Agent 协作框架' },
  { id: 'leaf-langfuse', name: 'Langfuse', url: 'https://langfuse.com/docs', anchor: '11-M4.1', tags: ['trace', '可观测', '可自托管'], intro: 'LLM 应用可观测平台' },
  { id: 'leaf-langsmith', name: 'LangSmith', url: 'https://www.langchain.com/langsmith', anchor: '11-M4.1', tags: ['trace', '评测数据集'], intro: 'LangChain 官方调试评测平台' },
  { id: 'leaf-a-loop', name: '手写 tool call 循环', url: '', anchor: '04-M1.3', tags: ['tool call', 'Agent 循环'], intro: 'LLM → tool call → 执行 → 回传，不用框架', practice: true },
  { id: 'leaf-a-prod', name: 'Agent 超时/权限/失败恢复', url: '', anchor: '04', tags: ['可靠性', '生产化'], intro: '超时、权限控制与失败恢复', practice: true },
  { id: 'leaf-llamaindex', name: 'LlamaIndex', url: 'https://docs.llamaindex.ai/', anchor: '04', tags: ['数据接入', '查询引擎'], intro: '以数据接入和 RAG 工作流见长' },
  { id: 'leaf-haystack', name: 'Haystack', url: 'https://docs.haystack.deepset.ai/', anchor: '04', tags: ['Pipeline', '生产化'], intro: 'Pipeline 式 RAG/Agent 框架，偏生产化' },
  { id: 'leaf-qdrant', name: 'Qdrant', url: 'https://qdrant.tech/documentation/', anchor: '04-M4.3', tags: ['向量库', 'Rust', '过滤'], intro: 'Rust 写的向量数据库' },
  { id: 'leaf-pgvector', name: 'pgvector', url: 'https://github.com/pgvector/pgvector', anchor: '04-M4.3', tags: ['向量索引', 'HNSW'], intro: 'PostgreSQL 向量检索扩展' },
  { id: 'leaf-milvus', name: 'Milvus', url: 'https://milvus.io/docs', anchor: '04-M4.3', tags: ['分布式向量检索'], intro: '面向大规模分布式向量检索' },
  { id: 'leaf-ragas', name: 'Ragas', url: 'https://docs.ragas.io/', anchor: '11-M3.4', tags: ['RAG 评测', '忠实度'], intro: 'RAG 评估框架' },
  { id: 'leaf-r-parse', name: '文档解析与清洗', url: '', anchor: '04', tags: ['PDF', 'Markdown', '网页'], intro: '解析与清洗流水线：为 chunking 质量打底', practice: true },
  { id: 'leaf-r-chunk', name: '切块策略对比', url: '', anchor: '04-M4.2', tags: ['固定切块', '语义切块'], intro: '固定切块 vs 语义切块对比实验', practice: true },
  { id: 'leaf-r-hybrid', name: '混合检索', url: '', anchor: '04-M4.4', tags: ['BM25', '向量', 'Qdrant'], intro: 'BM25 + 向量混合检索，本地部署跑通', practice: true },
  { id: 'leaf-r-emb', name: 'Embedding 模型对比', url: '', anchor: '04-M4.3', tags: ['向量模型', '选型'], intro: '主流 embedding 模型横向对比', practice: true },
  { id: 'leaf-r-rerank', name: 'Reranker 重排', url: '', anchor: '04-M4.5', tags: ['cross-encoder', '重排'], intro: 'reranker 重排实践', practice: true },
  { id: 'leaf-r-cite', name: '带出处的引用', url: '', anchor: '04-M4.1', tags: ['页码', '原文定位'], intro: '生成带页码 / 原文位置的引用', practice: true },
  { id: 'leaf-r-eval', name: '检索与答案评测', url: '', anchor: '11-M3.4', tags: ['Recall@K', 'MRR', 'nDCG'], intro: '检索与答案评测（Ragas）', practice: true },
  { id: 'leaf-r-index', name: '索引版本管理', url: '', anchor: '04', tags: ['文档更新', '索引版本'], intro: '文档更新删除与索引版本管理', practice: true },
  { id: 'leaf-transformers', name: 'Transformers', url: 'https://huggingface.co/docs/transformers/', anchor: '02', tags: ['Trainer', '推理 API'], intro: '模型加载与训练基础库' },
  { id: 'leaf-datasets', name: 'Datasets', url: 'https://huggingface.co/docs/datasets/', anchor: '10', tags: ['数据加载', '流式处理'], intro: '数据集加载处理库' },
  { id: 'leaf-peft', name: 'PEFT', url: 'https://huggingface.co/docs/peft/', anchor: '02-M5.2', tags: ['LoRA', 'adapter'], intro: '参数高效微调库' },
  { id: 'leaf-trl', name: 'TRL', url: 'https://huggingface.co/docs/trl/', anchor: '05', tags: ['SFT', 'DPO', 'GRPO'], intro: 'Transformer 强化学习训练库，后训练全流程' },
  { id: 'leaf-unsloth', name: 'Unsloth', url: 'https://docs.unsloth.ai/', anchor: '02-M5.2', tags: ['微调加速', '省显存'], intro: '消费级 GPU 微调加速' },
  { id: 'leaf-axolotl', name: 'Axolotl', url: 'https://docs.axolotl.ai/', anchor: '02', tags: ['YAML 配置', '多卡训练'], intro: 'YAML 配置式微调框架' },
  { id: 'leaf-deepspeed', name: 'DeepSpeed', url: 'https://www.deepspeed.ai/', anchor: '03-M4.3', tags: ['ZeRO', '分布式训练'], intro: '微软分布式训练库' },
  { id: 'leaf-lmeval', name: 'lm-evaluation-harness', url: 'https://github.com/EleutherAI/lm-evaluation-harness', anchor: '02-M4.6', tags: ['基准评测'], intro: '标准基准评测工具' },
  { id: 'leaf-p-data', name: '指令数据集准备与检查', url: '', anchor: '05-M2.2', tags: ['数据质量', '指令数据'], intro: '准备与检查高质量指令数据集', practice: true },
  { id: 'leaf-p-sft', name: 'LoRA / QLoRA SFT', url: '', anchor: '02-M5.2', tags: ['PEFT', 'Unsloth'], intro: '0.5B–3B 小模型微调实战', practice: true },
  { id: 'leaf-p-eval', name: 'base / instruct 对比评测', url: '', anchor: '02-M4.6', tags: ['独立测试集'], intro: '独立测试集与 base / instruct 对比', practice: true },
  { id: 'leaf-p-dpo', name: 'DPO 偏好优化', url: '', anchor: '05-M3.3', tags: ['偏好数据', 'TRL'], intro: '构造偏好数据完成 DPO', practice: true },
  { id: 'leaf-p-grpo', name: '小规模 GRPO', url: '', anchor: '05-M4.1', tags: ['可验证奖励'], intro: '小规模 GRPO（需可验证奖励）', practice: true },
  { id: 'leaf-p-deploy', name: '部署与压测', url: '', anchor: '03-M2.1', tags: ['vLLM', '压测'], intro: 'vLLM / llama.cpp 部署与压测', practice: true },
  { id: 'leaf-p-hybrid', name: 'Gated DeltaNet / 混合注意力', url: '', anchor: '02-M1.3', tags: ['02-M2.6', '线性注意力', 'Qwen3-Next'], intro: '理解混合注意力架构并跑通 Qwen3-Next', practice: true },
  { id: 'leaf-gymnasium', name: 'Gymnasium', url: 'https://gymnasium.farama.org/', anchor: '05', tags: ['环境接口', 'Step/Reset'], intro: '标准 RL 环境接口，所有 RL 库的基础' },
  { id: 'leaf-sb3', name: 'Stable-Baselines3', url: 'https://stable-baselines3.readthedocs.io/', anchor: '05', tags: ['PPO', 'SAC', '基线'], intro: '可靠的 RL 基线库' },
  { id: 'leaf-torchrl', name: 'TorchRL', url: 'https://docs.pytorch.org/rl/', anchor: '05', tags: ['模块化', '离线 RL'], intro: 'PyTorch 原生 RL 库' },
  { id: 'leaf-rllib', name: 'RLlib', url: 'https://docs.ray.io/en/latest/rllib/', anchor: '05', tags: ['分布式采样', '多智能体'], intro: 'Ray 生态分布式 RL' },
  { id: 'leaf-pettingzoo', name: 'PettingZoo', url: 'https://pettingzoo.farama.org/', anchor: '05', tags: ['多智能体环境'], intro: '多智能体环境标准' },
  { id: 'leaf-rl-hand', name: '手写 DQN / PPO', url: '', anchor: '05-M1.3', tags: ['05-M1.4', '策略梯度'], intro: '手写 DQN 或 PPO，不是只会调库', practice: true },
  { id: 'leaf-rl-math', name: 'RL 训练稳定性', url: '', anchor: '05-M1.6', tags: ['reward shaping', '置信区间'], intro: 'reward shaping / 随机种子 / 置信区间 / 训练稳定性', practice: true },
  { id: 'leaf-rl-trleval', name: 'TRL rollout / reward / KL', url: '', anchor: '05-M3.2', tags: ['rollout', 'KL 约束'], intro: 'TRL 理解 rollout / reward / KL 约束', practice: true },
  { id: 'leaf-vllm', name: 'vLLM', url: 'https://docs.vllm.ai/', anchor: '03-M2.1', tags: ['PagedAttention', '连续批处理'], intro: 'GPU 高吞吐大模型服务框架' },
  { id: 'leaf-q-gguf', name: 'GGUF 量化跑通与对比', url: '', anchor: '03-M3.1', tags: ['llama.cpp', 'Ollama', 'Q4_K_M', 'Q8'], intro: 'llama.cpp / Ollama 加载 Qwen3-8B，对比质量、速度与体积', practice: true },
  { id: 'leaf-q-awq', name: 'AWQ / GPTQ 部署压测', url: '', anchor: '03-M3.2', tags: ['vLLM', '4bit', '吞吐', '显存'], intro: 'vLLM 加载 4bit 量化模型，对比 bf16 的吞吐与显存', practice: true },
  { id: 'leaf-q-vram', name: '手算推理显存', url: '', anchor: '08-M5.2', tags: ['KV Cache', '显存估算', '7B 塞进 24G'], intro: '权重 + KV Cache 逐项估算，复现「7B 塞进 24G」', practice: true },
  { id: 'leaf-q-distill', name: '量化 vs 蒸馏辨析', url: '', anchor: '03-M3.4', tags: ['知识蒸馏', 'PTQ', 'QAT', '取舍'], intro: '各解决什么问题、能否组合、什么场景选哪个', practice: true },
  { id: 'leaf-qwen3vl', name: 'Qwen3-VL', url: 'https://huggingface.co/Qwen', anchor: '06', tags: ['视觉 Agent', '视频理解'], intro: '阿里 Qwen 多模态官方模型页' },
  { id: 'leaf-llava', name: 'LLaVA', url: 'https://github.com/haotian-liu/LLaVA', anchor: '06', tags: ['VLM 入门', '微调生态'], intro: '最流行的开源 VLM 项目' },
  { id: 'leaf-internvl', name: 'InternVL', url: 'https://github.com/OpenGVLab/InternVL', anchor: '06', tags: ['细粒度理解', '文档/UI'], intro: 'OpenGVLab 通用多模态模型' },
  { id: 'leaf-minicpmv', name: 'MiniCPM-V', url: 'https://github.com/OpenBMB/MiniCPM-V', anchor: '06', tags: ['端侧部署', 'OCR'], intro: '端侧多模态，密集文档理解' },
  { id: 'leaf-whisper', name: 'Whisper / FunASR', url: 'https://github.com/openai/whisper', anchor: '06-M4.1', tags: ['语音识别', '时间戳'], intro: '多语言语音识别与转写' },
  { id: 'leaf-openclip', name: 'OpenCLIP', url: 'https://github.com/mlfoundations/open_clip', anchor: '06', tags: ['图文对比学习', '跨模态向量'], intro: 'CLIP 的开源实现' },
  { id: 'leaf-m-vlm', name: '本地 VLM 图文问答', url: '', anchor: '06', tags: ['Ollama', '视觉编码器'], intro: '跑通本地 VLM 图文问答', practice: true },
  { id: 'leaf-m-doc', name: '文档/图表/截图理解', url: '', anchor: '06', tags: ['OCR', '表格抽取'], intro: '文档 / 图表 / 截图理解测试与对比', practice: true },
  { id: 'leaf-m-video', name: '视频理解', url: '', anchor: '06-M4.2', tags: ['抽帧', '视频问答'], intro: '抽帧 + 视频理解，衔接世界模型', practice: true },
  { id: 'leaf-m-rag', name: '多模态 RAG', url: '', anchor: '06', tags: ['CLIP', '跨模态检索'], intro: 'CLIP / SigLIP 跨模态向量检索，图片入库', practice: true },
  { id: 'leaf-m-deploy', name: '多模态服务化与微调', url: '', anchor: '06', tags: ['vLLM 多模态', 'LoRA 微调'], intro: '多模态服务化与微调入门', practice: true },
  { id: 'leaf-mujoco', name: 'MuJoCo', url: 'https://mujoco.readthedocs.io/', anchor: '07', tags: ['物理仿真', '控制'], intro: '高性能物理仿真器' },
  { id: 'leaf-maniskill', name: 'ManiSkill', url: 'https://maniskill.readthedocs.io/', anchor: '07', tags: ['GPU 并行', '操作学习'], intro: 'GPU 并行机器人操作学习平台' },
  { id: 'leaf-isaaclab', name: 'Isaac Lab', url: 'https://isaac-sim.github.io/IsaacLab/', anchor: '07', tags: ['GPU 并行', 'RL/模仿学习'], intro: 'NVIDIA GPU 并行机器人学习' },
  { id: 'leaf-habitat', name: 'Habitat', url: 'https://aihabitat.org/', anchor: '07', tags: ['视觉语言导航'], intro: '室内导航与移动操作研究平台' },
  { id: 'leaf-lerobot', name: 'LeRobot', url: 'https://huggingface.co/docs/lerobot/', anchor: '07', tags: ['真机接口', '数据集格式'], intro: 'Hugging Face 机器人学习生态' },
  { id: 'leaf-ros2', name: 'ROS 2', url: 'https://docs.ros.org/', anchor: '07', tags: ['中间件', '传感器集成'], intro: '机器人中间件标准' },
  { id: 'leaf-e-mani', name: '抓取/放置策略训练', url: '', anchor: '07', tags: ['PPO', '行为克隆'], intro: 'ManiSkill 训练抓取 / 放置策略', practice: true },
  { id: 'leaf-e-compare', name: '具身方法对比', url: '', anchor: '07', tags: ['成功率曲线', '失败分类'], intro: '对比 PPO / 行为克隆 / 离线方法', practice: true },
  { id: 'leaf-carla', name: 'CARLA', url: 'https://carla.readthedocs.io/', anchor: '07', tags: ['传感器', '仿真场景'], intro: '基于 Unreal 的开源智驾仿真器', opt: true },
  { id: 'leaf-nuplan', name: 'nuPlan', url: 'https://nuplan-devkit.readthedocs.io/', anchor: '07', tags: ['闭环评测', '规划'], intro: '规划数据集 + 闭环评测', opt: true },
  { id: 'leaf-autoware', name: 'Autoware', url: 'https://autowarefoundation.github.io/', anchor: '07', tags: ['全栈自动驾驶'], intro: 'ROS 2 全栈开源自动驾驶', opt: true },
  { id: 'leaf-openpcdet', name: 'OpenPCDet', url: 'https://github.com/open-mmlab/OpenPCDet', anchor: '07', tags: ['LiDAR 3D 检测'], intro: 'LiDAR 3D 检测工具箱', opt: true },
  { id: 'leaf-mmdet3d', name: 'MMDetection3D', url: 'https://mmdetection3d.readthedocs.io/', anchor: '07', tags: ['多模态 3D 感知'], intro: '摄像头+LiDAR 融合感知工具箱', opt: true },
  { id: 'leaf-sumo', name: 'SUMO', url: 'https://sumo.dlr.de/docs/', anchor: '07', tags: ['交通流仿真'], intro: '轻量交通流仿真', opt: true },
  { id: 'leaf-ad-ctrl', name: '控制器对比', url: '', anchor: '07', tags: ['PID', 'MPC', 'RL 控制'], intro: 'PID / MPC / RL 控制器对比', opt: true, practice: true },
  { id: 'leaf-qlib', name: 'Qlib', url: 'https://github.com/microsoft/qlib', anchor: '12', tags: ['全流程', '因子表达式'], intro: '微软开源 AI 量化平台' },
  { id: 'leaf-backtrader', name: 'Backtrader', url: 'https://www.backtrader.com/docu/', anchor: '12-M1.3', tags: ['策略编写', '回测引擎'], intro: '经典 Python 回测框架' },
  { id: 'leaf-vectorbt', name: 'vectorbt', url: 'https://vectorbt.dev/', anchor: '12-M1.4', tags: ['向量化回测', '参数扫描'], intro: '向量化高速回测' },
  { id: 'leaf-finrl', name: 'FinRL', url: 'https://github.com/AI4Finance-Foundation/FinRL', anchor: '12-M5.3', tags: ['RL 交易环境'], intro: '深度学习用于量化金融' },
  { id: 'leaf-akshare', name: 'AKShare', url: 'https://akshare.akfamily.xyz/', anchor: '12-M1.2', tags: ['金融数据接口'], intro: '开源金融数据接口' },
  { id: 'leaf-qt-alpha', name: '因子挖掘实战', url: '', anchor: '12-M2.3', tags: ['遗传规划', 'AlphaGen', 'IC'], intro: '遗传规划或 LLM 辅助生成因子', practice: true },
  { id: 'leaf-qt-rl', name: 'RL 交易决策', url: '', anchor: '05-M1.3', tags: ['12-M5.3', '组合管理', '交易执行'], intro: 'RL 用于组合管理或交易执行', practice: true },
  { id: 'leaf-qiskit', name: 'Qiskit', url: 'https://docs.quantum.ibm.com/guides', anchor: 'wild', tags: ['量子计算', 'IBM 生态'], intro: 'IBM 量子生态主 SDK', opt: true },
  { id: 'leaf-q-algo', name: 'QAOA / VQE 求解', url: '', anchor: 'wild', tags: ['量子算法', '变分电路'], intro: 'QAOA / VQE 求解小型问题', opt: true, practice: true },
  { id: 'leaf-pennylane', name: 'PennyLane', url: 'https://docs.pennylane.ai/', anchor: 'wild', tags: ['量子机器学习', '混合优化'], intro: '量子机器学习框架，连接 PyTorch/JAX', opt: true },
  { id: 'leaf-braket', name: 'Amazon Braket', url: 'https://docs.aws.amazon.com/braket/latest/developerguide/', anchor: 'wild', tags: ['云量子平台'], intro: 'AWS 托管量子平台（暂未收录进清单主干）', opt: true },
  { id: 'leaf-cirq', name: 'Cirq', url: 'https://quantumai.google/cirq', anchor: 'wild', tags: ['Google 量子'], intro: 'Google 量子电路框架（暂未收录进清单主干）', opt: true },
]

export const LEAF_TOTAL = LEAVES.length

// 清单分组键：树根 → 各篇章（按理论地图顺序）→ 野生
export function leafGroupKey(anchor: string): string {
  return anchor === 'root' || anchor === 'wild' ? anchor : anchor.split('-')[0]
}

// 练习项不冒充叶子链接，但计入清单进度
export const LEAF_PRACTICE_IDS = LEAVES.filter(l => l.practice).map(l => l.id)
