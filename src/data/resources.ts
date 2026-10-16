// 资源导航 + 多模态专题 · 内容数据
import type { ChecklistCat } from './content'

export interface ResLink {
  name: string
  url: string
  intro: string
  learn: string
}

export interface ResCat {
  name: string
  links: ResLink[]
}

export const RESOURCES: ResCat[] = [
  { name: '基础工具', links: [
    { name: 'PyTorch', url: 'https://pytorch.org/', intro: '深度学习训练与推理的基础框架', learn: '张量操作、自动求导、训练循环、模型保存加载' },
    { name: 'Hugging Face', url: 'https://huggingface.co/', intro: '最大的开源模型与数据集社区', learn: 'Transformers 快速上手：模型加载、推理、评测、发布' },
    { name: 'uv', url: 'https://docs.astral.sh/uv/', intro: '极快的 Python 包与环境管理器', learn: '项目初始化、依赖锁定、虚拟环境管理，替代 pip + venv' },
    { name: 'Docker', url: 'https://docs.docker.com/', intro: '容器化部署标准', learn: 'Dockerfile 编写、Compose 编排，把训练/推理环境固化成一键启动' },
    { name: 'Weights & Biases', url: 'https://wandb.ai/', intro: '实验跟踪与模型管理 SaaS', learn: '记录训练曲线、超参数、产物，管理对比多组实验' },
    { name: 'Ollama', url: 'https://ollama.com/', intro: '本地运行大模型最简单的工具', learn: '拉取模型、REST API 调用、多模态模型运行、Modelfile 定制' },
    { name: 'llama.cpp', url: 'https://github.com/ggml-org/llama.cpp', intro: 'C/C++ 高性能推理引擎，GGUF 量化格式', learn: 'GGUF 量化、CPU/消费级 GPU 推理、server 模式提供 API' },
    { name: 'vLLM', url: 'https://docs.vllm.ai/', intro: 'GPU 高吞吐大模型服务框架', learn: '连续批处理、PagedAttention、OpenAI 兼容 API、多模态服务' },
    { name: 'LiteLLM', url: 'https://docs.litellm.ai/', intro: '统一调用 100+ 模型的网关', learn: '统一接口、负载均衡、fallback、成本追踪' },
  ]},
  { name: 'Agent 开发', links: [
    { name: 'LangChain', url: 'https://docs.langchain.com/oss/python/learn', intro: 'LLM 应用集成框架', learn: '模型、提示词、工具、检索器组件，快速构建工具调用 Agent' },
    { name: 'LangGraph', url: 'https://langchain-ai.github.io/langgraph/', intro: '有状态图驱动的 Agent 工作流', learn: '状态、路由、重试、人工审批、持久化与恢复' },
    { name: 'Pydantic AI', url: 'https://ai.pydantic.dev/', intro: '类型安全的 Python Agent 框架', learn: '结构化输出、依赖注入、类型校验的开发体验' },
    { name: 'AutoGen', url: 'https://microsoft.github.io/autogen/stable/index.html', intro: '微软多 Agent 协作框架', learn: '多智能体消息通信、事件驱动、可视化原型' },
    { name: 'MCP', url: 'https://modelcontextprotocol.io/', intro: 'Agent 连接外部工具的标准协议', learn: '写一个 MCP Server：资源、工具、提示三要素' },
    { name: 'Langfuse', url: 'https://langfuse.com/docs', intro: 'LLM 应用可观测平台，可自托管', learn: 'trace 调用链、延迟、Token、费用与评估记录' },
    { name: 'LangSmith', url: 'https://www.langchain.com/langsmith', intro: 'LangChain 官方调试评测平台', learn: 'trace、调试、数据集与评估，与 LangGraph 深度集成' },
  ]},
  { name: 'RAG 与知识库', links: [
    { name: 'LlamaIndex', url: 'https://docs.llamaindex.ai/', intro: '以数据接入和 RAG 工作流见长', learn: '索引、检索器、查询引擎，接入上百种数据源' },
    { name: 'Haystack', url: 'https://docs.haystack.deepset.ai/', intro: 'Pipeline 式 RAG/Agent 框架，偏生产化', learn: '用 Pipeline 组合检索、生成、Agent 组件' },
    { name: 'Qdrant', url: 'https://qdrant.tech/documentation/', intro: 'Rust 写的向量数据库', learn: '本地 Docker 部署、向量+稀疏检索、过滤与 payload' },
    { name: 'pgvector', url: 'https://github.com/pgvector/pgvector', intro: 'PostgreSQL 向量检索扩展', learn: '在已有业务库上做向量检索，HNSW 索引' },
    { name: 'Milvus', url: 'https://milvus.io/docs', intro: '面向大规模分布式向量检索', learn: '集群部署、分区、GPU 索引' },
    { name: 'Ragas', url: 'https://docs.ragas.io/', intro: 'RAG 评估框架', learn: '检索质量、答案忠实度、相关性评测指标' },
  ]},
  { name: 'LLM 后训练', links: [
    { name: 'Transformers', url: 'https://huggingface.co/docs/transformers/', intro: '模型加载与训练基础库', learn: 'Trainer、模型卡、推理 API' },
    { name: 'Datasets', url: 'https://huggingface.co/docs/datasets/', intro: '数据集加载处理库', learn: '加载、变换、流式处理、发布数据集' },
    { name: 'PEFT', url: 'https://huggingface.co/docs/peft/', intro: '参数高效微调库', learn: 'LoRA / QLoRA 配置、adapter 合并与加载' },
    { name: 'TRL', url: 'https://huggingface.co/docs/trl/', intro: 'Transformer 强化学习训练库', learn: 'SFT、DPO、GRPO、奖励模型全流程' },
    { name: 'Unsloth', url: 'https://docs.unsloth.ai/', intro: '消费级 GPU 微调加速', learn: '2 倍速度省一半显存，入门微调最快路径' },
    { name: 'Axolotl', url: 'https://docs.axolotl.ai/', intro: 'YAML 配置式微调框架', learn: '一份配置跑 SFT/LoRA/DPO/GRPO，多卡训练' },
    { name: 'DeepSpeed', url: 'https://www.deepspeed.ai/', intro: '微软分布式训练库', learn: 'ZeRO 显存优化、多 GPU 训练' },
    { name: 'lm-evaluation-harness', url: 'https://github.com/EleutherAI/lm-evaluation-harness', intro: '标准基准评测工具', learn: '在标准任务上对比 base 与微调模型' },
  ]},
  { name: '强化学习', links: [
    { name: 'Gymnasium', url: 'https://gymnasium.farama.org/', intro: '标准 RL 环境接口', learn: '环境封装、Step/Reset 循环，所有 RL 库的基础' },
    { name: 'Stable-Baselines3', url: 'https://stable-baselines3.readthedocs.io/', intro: '可靠的 RL 基线库', learn: 'PPO/SAC/DQN 快速跑通 CartPole、LunarLander' },
    { name: 'TorchRL', url: 'https://docs.pytorch.org/rl/', intro: 'PyTorch 原生 RL 库', learn: '模块化构建自定义算法、离线 RL' },
    { name: 'RLlib', url: 'https://docs.ray.io/en/latest/rllib/', intro: 'Ray 生态分布式 RL', learn: '大规模并行采样、多智能体训练' },
    { name: 'PettingZoo', url: 'https://pettingzoo.farama.org/', intro: '多智能体环境标准', learn: '多 Agent 环境的接口与对局' },
  ]},
  { name: '具身智能（仿真）', links: [
    { name: 'MuJoCo', url: 'https://mujoco.readthedocs.io/', intro: '高性能物理仿真器', learn: 'XML 建模、控制器编写、机器人学习入门' },
    { name: 'ManiSkill', url: 'https://maniskill.readthedocs.io/', intro: 'GPU 并行机器人操作学习平台', learn: '抓取/放置任务训练，PPO 与模仿学习对比' },
    { name: 'Isaac Lab', url: 'https://isaac-sim.github.io/IsaacLab/', intro: 'NVIDIA GPU 并行机器人学习', learn: 'RL/示范学习/运动规划，云端 GPU 运行' },
    { name: 'Habitat', url: 'https://aihabitat.org/', intro: '室内导航与移动操作研究平台', learn: '视觉语言导航任务' },
    { name: 'LeRobot', url: 'https://huggingface.co/docs/lerobot/', intro: 'Hugging Face 机器人学习生态', learn: '数据集格式、策略训练、真机接口' },
    { name: 'ROS 2', url: 'https://docs.ros.org/', intro: '机器人中间件标准', learn: '节点通信、消息、传感器系统集成' },
  ]},
  { name: '自动驾驶（仿真）', links: [
    { name: 'CARLA', url: 'https://carla.readthedocs.io/', intro: '基于 Unreal 的开源智驾仿真器', learn: '传感器、场景测试、规则/RL 控制器对比' },
    { name: 'nuPlan', url: 'https://nuplan-devkit.readthedocs.io/', intro: '规划数据集 + 闭环评测', learn: 'imitation planning 与闭环指标' },
    { name: 'Autoware', url: 'https://autowarefoundation.github.io/', intro: 'ROS 2 全栈开源自动驾驶', learn: '感知-定位-规划-控制完整链路' },
    { name: 'OpenPCDet', url: 'https://github.com/open-mmlab/OpenPCDet', intro: 'LiDAR 3D 检测工具箱', learn: 'PointPillars/PointRCNN 训练与评测' },
    { name: 'MMDetection3D', url: 'https://mmdetection3d.readthedocs.io/', intro: '多模态 3D 感知工具箱', learn: '摄像头+LiDAR 融合感知' },
    { name: 'SUMO', url: 'https://sumo.dlr.de/docs/', intro: '轻量交通流仿真', learn: '多车调度与交通决策研究' },
  ]},
  { name: '量化交易', links: [
    { name: 'Qlib', url: 'https://github.com/microsoft/qlib', intro: '微软开源 AI 量化平台', learn: '数据→模型→回测全流程、因子表达式与自定义模型' },
    { name: 'Backtrader', url: 'https://www.backtrader.com/docu/', intro: '经典 Python 回测框架', learn: '策略编写、技术指标、回测引擎原理' },
    { name: 'vectorbt', url: 'https://vectorbt.dev/', intro: '向量化高速回测', learn: '大规模参数扫描、样本外检验避免过拟合' },
    { name: 'FinRL', url: 'https://github.com/AI4Finance-Foundation/FinRL', intro: '深度学习用于量化金融', learn: 'RL 交易环境、组合分配、股票池管理' },
    { name: 'AKShare', url: 'https://akshare.akfamily.xyz/', intro: '开源金融数据接口', learn: '行情/财报数据获取、清洗与对齐' },
  ]},
  { name: '量子计算', links: [
    { name: 'Qiskit', url: 'https://docs.quantum.ibm.com/guides', intro: 'IBM 量子生态主 SDK', learn: '电路构建、模拟、云端真机实验' },
    { name: 'Cirq', url: 'https://quantumai.google/cirq', intro: 'Google 量子电路框架', learn: 'NISQ 电路与研究工具链' },
    { name: 'PennyLane', url: 'https://docs.pennylane.ai/', intro: '量子机器学习框架', learn: '连接 PyTorch/JAX 的混合优化，VQE/QAOA' },
    { name: 'Amazon Braket', url: 'https://docs.aws.amazon.com/braket/latest/developerguide/', intro: 'AWS 托管量子平台', learn: '模拟器与多家 QPU 按任务计费访问' },
  ]},
]

// ---- 多模态专题（速查 tab） ----

export const MM_CAT: ChecklistCat = {
  name: '多模态',
  opt: true,
  items: [
    { id: 'm-vlm', t: '跑通本地 VLM 图文问答', e: 'Ollama + Qwen3-VL 或 LLaVA，理解视觉编码器 + 连接器架构' },
    { id: 'm-doc', t: '文档 / 图表 / 截图理解测试', e: 'OCR、表格抽取、UI 截图分析，对比 Qwen3-VL / MiniCPM-V / InternVL' },
    { id: 'm-video', t: '视频理解', e: '抽帧 + Qwen3-VL 视频理解，衔接世界模型' },
    { id: 'm-audio', t: '语音识别与理解', e: 'Whisper / FunASR 转写 + 大模型总结' },
    { id: 'm-rag', t: '多模态 RAG', e: 'CLIP / SigLIP 跨模态向量检索，图片入库' },
    { id: 'm-deploy', t: '多模态服务化与微调入门', e: 'vLLM 多模态 API、LLaVA 系模型 LoRA 微调' },
  ],
}

export const MM_PATH = [
  { t: '跑通本地 VLM 图文问答', e: 'Ollama 一条命令拉 Qwen3-VL 或 LLaVA，理解「视觉编码器（ViT）+ 连接器（MLP）+ 语言模型」三段式架构' },
  { t: '文档、图表与截图理解', e: 'OCR / 表格抽取 / UI 截图分析；对比 Qwen3-VL（多语言 OCR 最强）、MiniCPM-V（密集文档）、InternVL（代码截图）' },
  { t: '视频理解', e: '抽帧策略 + Qwen3-VL 原生视频输入；进一步衔接世界模型的表征预测路线' },
  { t: '音频理解', e: 'Whisper / FunASR 转写，接大模型做摘要与问答' },
  { t: '多模态 RAG', e: 'CLIP / SigLIP 把图片变成向量，与文本统一检索（图文互搜、以图搜图）' },
  { t: '服务化与微调', e: 'vLLM 部署多模态 API；用 LLaVA 官方脚本做小数据集 LoRA 微调' },
]

export const MM_MODELS = [
  { name: 'Qwen3-VL', size: '2B–235B(MoE)', vram: '约 1.5 GB 起（INT4）', point: '多语言 OCR 最强、原生视频理解、Visual Agent 操作界面' },
  { name: 'InternVL 系列', size: '2B–78B', vram: '约 6 GB 起', point: '视觉塔大、细粒度强，代码截图与 UI 分析突出' },
  { name: 'LLaVA / LLaVA-OneVision', size: '7B–13B', vram: '约 6 GB 起', point: '社区最大、教程最多，微调文档完善，入门最安全' },
  { name: 'MiniCPM-V', size: '1.3B–8B', vram: '约 1 GB 起', point: '端侧 OCR 之王，密集文档与高 DPI 扫描件' },
  { name: 'Gemma 3 / 4', size: '4B–27B', vram: '约 3 GB 起', point: '140+ 语言、轻量多模态，本地部署友好' },
  { name: 'Whisper / FunASR', size: 'tiny–large-v3', vram: '约 1 GB 起', point: '语音识别事实标准 / 中文语音首选' },
]

export const MM_LINKS: ResLink[] = [
  { name: 'Qwen3-VL（Hugging Face）', url: 'https://huggingface.co/Qwen', intro: '阿里 Qwen 系列官方模型页', learn: '模型卡、视觉 Agent 用法、视频理解示例' },
  { name: 'LLaVA（GitHub）', url: 'https://github.com/haotian-liu/LLaVA', intro: '最流行的开源 VLM 项目', learn: '架构图、训练代码、微调教程' },
  { name: 'InternVL（GitHub）', url: 'https://github.com/OpenGVLab/InternVL', intro: 'OpenGVLab 通用多模态模型', learn: '文档/UI 任务基准、部署脚本' },
  { name: 'Ollama 视觉模型', url: 'https://ollama.com/search?c=vision', intro: '本地跑 VLM 最简单方式', learn: '一条 pull 命令 + REST API 传图' },
  { name: 'OpenCLIP', url: 'https://github.com/mlfoundations/open_clip', intro: 'CLIP 的开源实现', learn: '图文对比学习、跨模态 embedding 抽取' },
  { name: 'Whisper（GitHub）', url: 'https://github.com/openai/whisper', intro: 'OpenAI 语音识别模型', learn: '多语言转写、词级时间戳' },
]
