# -*- coding: utf-8 -*-
"""一次性迁移：content.ts 的 CHECKLIST（48 项）+ resources.ts 的 RESOURCES（62 链接）
合并去重为叶子层 src/data/leaves.ts。

树的模型（DESIGN.md §5）：理论是树（篇章=枝干，模块/学习点=枝节），项目是叶子。
叶子落脚分三级：anchor='root' 长在树根（全树基础工具）；anchor='04' 长在枝干；
anchor='02-M5.2' 长在枝节。归不了类的挂 wild（野生叶子），树生长后再落户。

每行 = (id, 名称, url, anchor, tags, intro, opt, practice)
- url 为空 = 练习项（动手任务，不是项目，清单里以「练习」样式呈现，不冒充叶子链接）
- tags 里带理论点编号的 = 枝节索引（原 ref 语义），其余为自由关键词
- opt = 支线；wild 叶子 anchor 写 'wild'
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'src' / 'data' / 'leaves.ts'

# fmt: off
LEAVES = [
    # ---------- 树根层：全树基础工具（anchor='root'） ----------
    ('leaf-pytorch', 'PyTorch', 'https://pytorch.org/', 'root', ['张量', '自动求导', '训练循环'], '深度学习训练与推理的基础框架', False, False),
    ('leaf-hf', 'Hugging Face', 'https://huggingface.co/', 'root', ['Transformers', '数据集', '评测社区'], '最大的开源模型与数据集社区', False, False),
    ('leaf-uv', 'uv', 'https://docs.astral.sh/uv/', 'root', ['依赖管理', '虚拟环境'], '极快的 Python 包与环境管理器', False, False),
    ('leaf-docker', 'Docker', 'https://docs.docker.com/', 'root', ['容器化', '环境固化'], '容器化部署标准，固化训练/推理环境', False, False),
    ('leaf-ollama', 'Ollama', 'https://ollama.com/', 'root', ['本地推理', '多模态运行'], '本地运行大模型最简单的工具', False, False),
    ('leaf-llamacpp', 'llama.cpp', 'https://github.com/ggml-org/llama.cpp', 'root', ['GGUF', 'CPU 推理'], 'C/C++ 高性能推理引擎，GGUF 量化格式', False, False),
    ('leaf-litellm', 'LiteLLM', 'https://docs.litellm.ai/', 'root', ['统一网关', '成本追踪'], '统一调用 100+ 模型的网关', False, False),
    ('leaf-wandb', 'Weights & Biases', 'https://wandb.ai/', 'root', ['实验跟踪'], '实验跟踪与模型管理 SaaS', False, False),

    # ---------- 04 枝干：Agent ----------
    ('leaf-langchain', 'LangChain', 'https://docs.langchain.com/oss/python/learn', '04', ['组件', '工具调用'], 'LLM 应用集成框架', False, False),
    ('leaf-langgraph', 'LangGraph', 'https://langchain-ai.github.io/langgraph/', '04', ['状态机', '路由', '人工审批'], '有状态图驱动的 Agent 工作流', False, False),
    ('leaf-mcp', 'MCP 协议', 'https://modelcontextprotocol.io/', '04-M2.3', ['标准协议', '工具接入'], 'Agent 连接外部工具的标准协议', False, False),
    ('leaf-pydanticai', 'Pydantic AI', 'https://ai.pydantic.dev/', '04', ['类型安全', '结构化输出'], '类型安全的 Python Agent 框架', False, False),
    ('leaf-autogen', 'AutoGen', 'https://microsoft.github.io/autogen/stable/index.html', '04', ['多 Agent 协作', '事件驱动'], '微软多 Agent 协作框架', False, False),
    ('leaf-langfuse', 'Langfuse', 'https://langfuse.com/docs', '11-M4.1', ['trace', '可观测', '可自托管'], 'LLM 应用可观测平台', False, False),
    ('leaf-langsmith', 'LangSmith', 'https://www.langchain.com/langsmith', '11-M4.1', ['trace', '评测数据集'], 'LangChain 官方调试评测平台', False, False),
    ('leaf-a-loop', '手写 tool call 循环', '', '04-M1.3', ['tool call', 'Agent 循环'], 'LLM → tool call → 执行 → 回传，不用框架', False, True),
    ('leaf-a-prod', 'Agent 超时/权限/失败恢复', '', '04', ['可靠性', '生产化'], '超时、权限控制与失败恢复', False, True),

    # ---------- 04 枝干：RAG / 知识库 ----------
    ('leaf-llamaindex', 'LlamaIndex', 'https://docs.llamaindex.ai/', '04', ['数据接入', '查询引擎'], '以数据接入和 RAG 工作流见长', False, False),
    ('leaf-haystack', 'Haystack', 'https://docs.haystack.deepset.ai/', '04', ['Pipeline', '生产化'], 'Pipeline 式 RAG/Agent 框架，偏生产化', False, False),
    ('leaf-qdrant', 'Qdrant', 'https://qdrant.tech/documentation/', '04-M4.3', ['向量库', 'Rust', '过滤'], 'Rust 写的向量数据库', False, False),
    ('leaf-pgvector', 'pgvector', 'https://github.com/pgvector/pgvector', '04-M4.3', ['向量索引', 'HNSW'], 'PostgreSQL 向量检索扩展', False, False),
    ('leaf-milvus', 'Milvus', 'https://milvus.io/docs', '04-M4.3', ['分布式向量检索'], '面向大规模分布式向量检索', False, False),
    ('leaf-ragas', 'Ragas', 'https://docs.ragas.io/', '11-M3.4', ['RAG 评测', '忠实度'], 'RAG 评估框架', False, False),
    ('leaf-r-parse', '文档解析与清洗', '', '04', ['PDF', 'Markdown', '网页'], '解析与清洗流水线：为 chunking 质量打底', False, True),
    ('leaf-r-chunk', '切块策略对比', '', '04-M4.2', ['固定切块', '语义切块'], '固定切块 vs 语义切块对比实验', False, True),
    ('leaf-r-hybrid', '混合检索', '', '04-M4.4', ['BM25', '向量', 'Qdrant'], 'BM25 + 向量混合检索，本地部署跑通', False, True),
    ('leaf-r-emb', 'Embedding 模型对比', '', '04-M4.3', ['向量模型', '选型'], '主流 embedding 模型横向对比', False, True),
    ('leaf-r-rerank', 'Reranker 重排', '', '04-M4.5', ['cross-encoder', '重排'], 'reranker 重排实践', False, True),
    ('leaf-r-cite', '带出处的引用', '', '04-M4.1', ['页码', '原文定位'], '生成带页码 / 原文位置的引用', False, True),
    ('leaf-r-eval', '检索与答案评测', '', '11-M3.4', ['Recall@K', 'MRR', 'nDCG'], '检索与答案评测（Ragas）', False, True),
    ('leaf-r-index', '索引版本管理', '', '04', ['文档更新', '索引版本'], '文档更新删除与索引版本管理', False, True),

    # ---------- 02/05 枝干：LLM 后训练 ----------
    ('leaf-transformers', 'Transformers', 'https://huggingface.co/docs/transformers/', '02', ['Trainer', '推理 API'], '模型加载与训练基础库', False, False),
    ('leaf-datasets', 'Datasets', 'https://huggingface.co/docs/datasets/', '10', ['数据加载', '流式处理'], '数据集加载处理库', False, False),
    ('leaf-peft', 'PEFT', 'https://huggingface.co/docs/peft/', '02-M5.2', ['LoRA', 'adapter'], '参数高效微调库', False, False),
    ('leaf-trl', 'TRL', 'https://huggingface.co/docs/trl/', '05', ['SFT', 'DPO', 'GRPO'], 'Transformer 强化学习训练库，后训练全流程', False, False),
    ('leaf-unsloth', 'Unsloth', 'https://docs.unsloth.ai/', '02-M5.2', ['微调加速', '省显存'], '消费级 GPU 微调加速', False, False),
    ('leaf-axolotl', 'Axolotl', 'https://docs.axolotl.ai/', '02', ['YAML 配置', '多卡训练'], 'YAML 配置式微调框架', False, False),
    ('leaf-deepspeed', 'DeepSpeed', 'https://www.deepspeed.ai/', '03-M4.3', ['ZeRO', '分布式训练'], '微软分布式训练库', False, False),
    ('leaf-lmeval', 'lm-evaluation-harness', 'https://github.com/EleutherAI/lm-evaluation-harness', '02-M4.6', ['基准评测'], '标准基准评测工具', False, False),
    ('leaf-p-data', '指令数据集准备与检查', '', '05-M2.2', ['数据质量', '指令数据'], '准备与检查高质量指令数据集', False, True),
    ('leaf-p-sft', 'LoRA / QLoRA SFT', '', '02-M5.2', ['PEFT', 'Unsloth'], '0.5B–3B 小模型微调实战', False, True),
    ('leaf-p-eval', 'base / instruct 对比评测', '', '02-M4.6', ['独立测试集'], '独立测试集与 base / instruct 对比', False, True),
    ('leaf-p-dpo', 'DPO 偏好优化', '', '05-M3.3', ['偏好数据', 'TRL'], '构造偏好数据完成 DPO', False, True),
    ('leaf-p-grpo', '小规模 GRPO', '', '05-M4.1', ['可验证奖励'], '小规模 GRPO（需可验证奖励）', False, True),
    ('leaf-p-deploy', '部署与压测', '', '03-M2.1', ['vLLM', '压测'], 'vLLM / llama.cpp 部署与压测', False, True),
    ('leaf-p-hybrid', 'Gated DeltaNet / 混合注意力', '', '02-M1.3', ['02-M2.6', '线性注意力', 'Qwen3-Next'], '理解混合注意力架构并跑通 Qwen3-Next', False, True),

    # ---------- 05 枝干：强化学习 ----------
    ('leaf-gymnasium', 'Gymnasium', 'https://gymnasium.farama.org/', '05', ['环境接口', 'Step/Reset'], '标准 RL 环境接口，所有 RL 库的基础', False, False),
    ('leaf-sb3', 'Stable-Baselines3', 'https://stable-baselines3.readthedocs.io/', '05', ['PPO', 'SAC', '基线'], '可靠的 RL 基线库', False, False),
    ('leaf-torchrl', 'TorchRL', 'https://docs.pytorch.org/rl/', '05', ['模块化', '离线 RL'], 'PyTorch 原生 RL 库', False, False),
    ('leaf-rllib', 'RLlib', 'https://docs.ray.io/en/latest/rllib/', '05', ['分布式采样', '多智能体'], 'Ray 生态分布式 RL', False, False),
    ('leaf-pettingzoo', 'PettingZoo', 'https://pettingzoo.farama.org/', '05', ['多智能体环境'], '多智能体环境标准', False, False),
    ('leaf-rl-hand', '手写 DQN / PPO', '', '05-M1.3', ['05-M1.4', '策略梯度'], '手写 DQN 或 PPO，不是只会调库', False, True),
    ('leaf-rl-math', 'RL 训练稳定性', '', '05-M1.6', ['reward shaping', '置信区间'], 'reward shaping / 随机种子 / 置信区间 / 训练稳定性', False, True),
    ('leaf-rl-trleval', 'TRL rollout / reward / KL', '', '05-M3.2', ['rollout', 'KL 约束'], 'TRL 理解 rollout / reward / KL 约束', False, True),

    # ---------- 03 枝干：AI Infra ----------
    ('leaf-vllm', 'vLLM', 'https://docs.vllm.ai/', '03-M2.1', ['PagedAttention', '连续批处理'], 'GPU 高吞吐大模型服务框架', False, False),

    # 03 量化实操（原清单「模型量化」组，全部为练习项）
    ('leaf-q-gguf', 'GGUF 量化跑通与对比', '', '03-M3.1', ['llama.cpp', 'Ollama', 'Q4_K_M', 'Q8'], 'llama.cpp / Ollama 加载 Qwen3-8B，对比质量、速度与体积', False, True),
    ('leaf-q-awq', 'AWQ / GPTQ 部署压测', '', '03-M3.2', ['vLLM', '4bit', '吞吐', '显存'], 'vLLM 加载 4bit 量化模型，对比 bf16 的吞吐与显存', False, True),
    ('leaf-q-vram', '手算推理显存', '', '08-M5.2', ['KV Cache', '显存估算', '7B 塞进 24G'], '权重 + KV Cache 逐项估算，复现「7B 塞进 24G」', False, True),
    ('leaf-q-distill', '量化 vs 蒸馏辨析', '', '03-M3.4', ['知识蒸馏', 'PTQ', 'QAT', '取舍'], '各解决什么问题、能否组合、什么场景选哪个', False, True),

    # ---------- 06 枝干：多模态 ----------
    ('leaf-qwen3vl', 'Qwen3-VL', 'https://huggingface.co/Qwen', '06', ['视觉 Agent', '视频理解'], '阿里 Qwen 多模态官方模型页', False, False),
    ('leaf-llava', 'LLaVA', 'https://github.com/haotian-liu/LLaVA', '06', ['VLM 入门', '微调生态'], '最流行的开源 VLM 项目', False, False),
    ('leaf-internvl', 'InternVL', 'https://github.com/OpenGVLab/InternVL', '06', ['细粒度理解', '文档/UI'], 'OpenGVLab 通用多模态模型', False, False),
    ('leaf-minicpmv', 'MiniCPM-V', 'https://github.com/OpenBMB/MiniCPM-V', '06', ['端侧部署', 'OCR'], '端侧多模态，密集文档理解', False, False),
    ('leaf-whisper', 'Whisper / FunASR', 'https://github.com/openai/whisper', '06-M4.1', ['语音识别', '时间戳'], '多语言语音识别与转写', False, False),
    ('leaf-openclip', 'OpenCLIP', 'https://github.com/mlfoundations/open_clip', '06', ['图文对比学习', '跨模态向量'], 'CLIP 的开源实现', False, False),
    ('leaf-m-vlm', '本地 VLM 图文问答', '', '06', ['Ollama', '视觉编码器'], '跑通本地 VLM 图文问答', False, True),
    ('leaf-m-doc', '文档/图表/截图理解', '', '06', ['OCR', '表格抽取'], '文档 / 图表 / 截图理解测试与对比', False, True),
    ('leaf-m-video', '视频理解', '', '06-M4.2', ['抽帧', '视频问答'], '抽帧 + 视频理解，衔接世界模型', False, True),
    ('leaf-m-rag', '多模态 RAG', '', '06', ['CLIP', '跨模态检索'], 'CLIP / SigLIP 跨模态向量检索，图片入库', False, True),
    ('leaf-m-deploy', '多模态服务化与微调', '', '06', ['vLLM 多模态', 'LoRA 微调'], '多模态服务化与微调入门', False, True),

    # ---------- 07 枝干：具身智能与智驾 ----------
    ('leaf-mujoco', 'MuJoCo', 'https://mujoco.readthedocs.io/', '07', ['物理仿真', '控制'], '高性能物理仿真器', False, False),
    ('leaf-maniskill', 'ManiSkill', 'https://maniskill.readthedocs.io/', '07', ['GPU 并行', '操作学习'], 'GPU 并行机器人操作学习平台', False, False),
    ('leaf-isaaclab', 'Isaac Lab', 'https://isaac-sim.github.io/IsaacLab/', '07', ['GPU 并行', 'RL/模仿学习'], 'NVIDIA GPU 并行机器人学习', False, False),
    ('leaf-habitat', 'Habitat', 'https://aihabitat.org/', '07', ['视觉语言导航'], '室内导航与移动操作研究平台', False, False),
    ('leaf-lerobot', 'LeRobot', 'https://huggingface.co/docs/lerobot/', '07', ['真机接口', '数据集格式'], 'Hugging Face 机器人学习生态', False, False),
    ('leaf-ros2', 'ROS 2', 'https://docs.ros.org/', '07', ['中间件', '传感器集成'], '机器人中间件标准', False, False),
    ('leaf-e-mani', '抓取/放置策略训练', '', '07', ['PPO', '行为克隆'], 'ManiSkill 训练抓取 / 放置策略', False, True),
    ('leaf-e-compare', '具身方法对比', '', '07', ['成功率曲线', '失败分类'], '对比 PPO / 行为克隆 / 离线方法', False, True),
    ('leaf-carla', 'CARLA', 'https://carla.readthedocs.io/', '07', ['传感器', '仿真场景'], '基于 Unreal 的开源智驾仿真器', True, False),
    ('leaf-nuplan', 'nuPlan', 'https://nuplan-devkit.readthedocs.io/', '07', ['闭环评测', '规划'], '规划数据集 + 闭环评测', True, False),
    ('leaf-autoware', 'Autoware', 'https://autowarefoundation.github.io/', '07', ['全栈自动驾驶'], 'ROS 2 全栈开源自动驾驶', True, False),
    ('leaf-openpcdet', 'OpenPCDet', 'https://github.com/open-mmlab/OpenPCDet', '07', ['LiDAR 3D 检测'], 'LiDAR 3D 检测工具箱', True, False),
    ('leaf-mmdet3d', 'MMDetection3D', 'https://mmdetection3d.readthedocs.io/', '07', ['多模态 3D 感知'], '摄像头+LiDAR 融合感知工具箱', True, False),
    ('leaf-sumo', 'SUMO', 'https://sumo.dlr.de/docs/', '07', ['交通流仿真'], '轻量交通流仿真', True, False),
    ('leaf-ad-ctrl', '控制器对比', '', '07', ['PID', 'MPC', 'RL 控制'], 'PID / MPC / RL 控制器对比', True, True),

    # ---------- 12 枝干：量化交易 ----------
    ('leaf-qlib', 'Qlib', 'https://github.com/microsoft/qlib', '12', ['全流程', '因子表达式'], '微软开源 AI 量化平台', False, False),
    ('leaf-backtrader', 'Backtrader', 'https://www.backtrader.com/docu/', '12-M1.3', ['策略编写', '回测引擎'], '经典 Python 回测框架', False, False),
    ('leaf-vectorbt', 'vectorbt', 'https://vectorbt.dev/', '12-M1.4', ['向量化回测', '参数扫描'], '向量化高速回测', False, False),
    ('leaf-finrl', 'FinRL', 'https://github.com/AI4Finance-Foundation/FinRL', '12-M5.3', ['RL 交易环境'], '深度学习用于量化金融', False, False),
    ('leaf-akshare', 'AKShare', 'https://akshare.akfamily.xyz/', '12-M1.2', ['金融数据接口'], '开源金融数据接口', False, False),
    ('leaf-qt-alpha', '因子挖掘实战', '', '12-M2.3', ['遗传规划', 'AlphaGen', 'IC'], '遗传规划或 LLM 辅助生成因子', False, True),
    ('leaf-qt-rl', 'RL 交易决策', '', '05-M1.3', ['12-M5.3', '组合管理', '交易执行'], 'RL 用于组合管理或交易执行', False, True),

    # ---------- 野生叶子：树还没长出对应枝干（wild） ----------
    ('leaf-qiskit', 'Qiskit', 'https://docs.quantum.ibm.com/guides', 'wild', ['量子计算', 'IBM 生态'], 'IBM 量子生态主 SDK', True, False),
    ('leaf-q-algo', 'QAOA / VQE 求解', '', 'wild', ['量子算法', '变分电路'], 'QAOA / VQE 求解小型问题', True, True),
    ('leaf-pennylane', 'PennyLane', 'https://docs.pennylane.ai/', 'wild', ['量子机器学习', '混合优化'], '量子机器学习框架，连接 PyTorch/JAX', True, False),
    ('leaf-braket', 'Amazon Braket', 'https://docs.aws.amazon.com/braket/latest/developerguide/', 'wild', ['云量子平台'], 'AWS 托管量子平台（暂未收录进清单主干）', True, False),
    ('leaf-cirq', 'Cirq', 'https://quantumai.google/cirq', 'wild', ['Google 量子'], 'Google 量子电路框架（暂未收录进清单主干）', True, False),
]
# fmt: on


def emit():
    lines = [
        '// 叶子层（leaves）—— 长在理论树上的项目与实践项',
        '// 迁移自原 CHECKLIST（48 项）+ RESOURCES（62 链接），去重合并，2026-10 一次性迁移（scripts/migrate-leaves.py）。',
        '//',
        '// 树的模型：理论 = 树（篇章=枝干，模块/学习点=枝节），项目 = 叶子。',
        '// 落脚三级：anchor=\'root\' 长在树根（全树基础工具）；anchor=\'04\' 长在枝干；anchor=\'02-M5.2\' 长在枝节；',
        '// anchor=\'wild\' = 野生叶子（已进树但未落户：树还没长出对应枝干，长出后移入）。',
        '// 生长规则：归类不下 → 长新枝干（篇章）；再不行 → 长新树（新 tab）。',
        '',
        'export type LeafAnchor = string // \'root\' | 篇章 id（\'01\'–\'12\'）| 理论点编号（\'02-M5.2\'）| \'wild\'',
        '',
        'export interface Leaf {',
        '  id: string          // 唯一 id，leaf- 前缀',
        '  name: string        // 叶子名（项目 / 实践项）',
        '  url: string         // 真实项目链接；空串 = 练习项（动手任务，非项目）',
        '  anchor: LeafAnchor  // 树上落脚处（见文件头注释）',
        '  tags: string[]      // 枝节索引（理论点编号）+ 自由关键词；野生叶子的标签即其分类依据',
        '  intro: string       // 一句话：是什么 / 学什么',
        '  opt?: boolean       // 支线',
        '  practice?: boolean  // 练习项（无项目链接的动手任务）',
        '}',
        '',
        'export const LEAVES: Leaf[] = [',
    ]
    for id, name, url, anchor, tags, intro, opt, practice in LEAVES:
        flags = []
        if opt:
            flags.append('opt: true')
        if practice:
            flags.append('practice: true')
        tail = (', ' + ', '.join(flags)) if flags else ''
        tagstr = ', '.join(f"'{t}'" for t in tags)
        lines.append(
            f"  {{ id: '{id}', name: '{name}', url: '{url}', anchor: '{anchor}', "
            f"tags: [{tagstr}], intro: '{intro}'{tail} }},"
        )
    lines += [
        ']',
        '',
        "export const LEAF_TOTAL = LEAVES.length",
        '',
        '// 清单分组键：树根 → 各篇章（按理论地图顺序）→ 野生',
        "export function leafGroupKey(anchor: string): string {",
        "  return anchor === 'root' || anchor === 'wild' ? anchor : anchor.split('-')[0]",
        '}',
        '',
        '// 练习项不冒充叶子链接，但计入清单进度',
        "export const LEAF_PRACTICE_IDS = LEAVES.filter(l => l.practice).map(l => l.id)",
    ]
    return '\n'.join(lines) + '\n'


if __name__ == '__main__':
    ids = [l[0] for l in LEAVES]
    dup = {i for i in ids if ids.count(i) > 1}
    if dup:
        raise SystemExit(f'叶子 id 重复：{dup}')
    OUT.write_text(emit(), encoding='utf-8')
    n_practice = sum(1 for l in LEAVES if l[7])
    n_wild = sum(1 for l in LEAVES if l[3] == 'wild')
    print(f'写出 {OUT.relative_to(ROOT)}：{len(LEAVES)} 片叶子（练习 {n_practice}，野生 {n_wild}）')
