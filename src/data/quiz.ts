// 闯关自测题库（试点：02 篇章 M1 Transformer 骨架）
// 约定见 AGENTS.md 任务手册 12「题目收录约定」。题目按学习点编号挂载，不改 theory.ts；
// 一个模块 = 一关（关卡 id 形如 '02-M1'），由 pointId 自动推导，无需另行登记。

export type QuizType = 'choice' | 'short' | 'code'

export interface QuizSource { title: string; url: string }

export interface QuizQuestion {
  id: string               // 唯一，q- 前缀，如 'q-02-m1-1-a'
  pointId: string          // 理论点完整编号，如 '02-M1.1'（必须在 theory.ts 存在）
  type: QuizType
  question: string
  options?: string[]       // choice：2–6 个选项
  answer?: number          // choice：正确选项下标（从 0 开始）
  keyPoints?: string[]     // short：答题要点（自评勾选，得分 = 命中比例）
  reference?: string       // code：参考实现
  tests?: string           // code：测试用例 / 自检方法（文本）
  explanation: string      // 解析（所有题型必填）
  source: QuizSource       // 出处（必填，优先原始论文 / 官方文档）
  extraSources?: QuizSource[] // 补充出处：一题涉及多个方法 / 工具时，为其余部分列出各自来源
}

const AIAYN: QuizSource = { title: 'Attention Is All You Need（arXiv 1706.03762）', url: 'https://arxiv.org/abs/1706.03762' }
const GQA: QuizSource = { title: 'GQA（arXiv 2305.13245）', url: 'https://arxiv.org/abs/2305.13245' }
const MQA: QuizSource = { title: 'Fast Transformer Decoding: One Write-Head is All You Need（arXiv 1911.02150）', url: 'https://arxiv.org/abs/1911.02150' }
const DSV2: QuizSource = { title: 'DeepSeek-V2（arXiv 2405.04434）', url: 'https://arxiv.org/abs/2405.04434' }
const PRELN: QuizSource = { title: 'On Layer Normalization in the Transformer Architecture（arXiv 2002.04745）', url: 'https://arxiv.org/abs/2002.04745' }
const RMSN: QuizSource = { title: 'Root Mean Square Layer Normalization（arXiv 1910.07467）', url: 'https://arxiv.org/abs/1910.07467' }
const LN: QuizSource = { title: 'Layer Normalization（arXiv 1607.06450）', url: 'https://arxiv.org/abs/1607.06450' }
const ROPE: QuizSource = { title: 'RoFormer（arXiv 2104.09864）', url: 'https://arxiv.org/abs/2104.09864' }
const ALIBI: QuizSource = { title: 'ALiBi: Train Short, Test Long（arXiv 2108.12409）', url: 'https://arxiv.org/abs/2108.12409' }
const ADAM: QuizSource = { title: 'Adam（arXiv 1412.6980）', url: 'https://arxiv.org/abs/1412.6980' }
const ADAMW: QuizSource = { title: 'Decoupled Weight Decay Regularization（arXiv 1711.05101）', url: 'https://arxiv.org/abs/1711.05101' }
const RNNDIFF: QuizSource = { title: 'On the difficulty of training RNNs（arXiv 1211.5063）', url: 'https://arxiv.org/abs/1211.5063' }
const CLIPDOC: QuizSource = { title: 'PyTorch 文档：clip_grad_norm_', url: 'https://docs.pytorch.org/docs/stable/generated/torch.nn.utils.clip_grad_norm_.html' }
const GLOROT: QuizSource = { title: 'Understanding the difficulty of training deep feedforward neural networks（AISTATS 2010）', url: 'https://proceedings.mlr.press/v9/glorot10a.html' }
const DLBOOK_NUM: QuizSource = { title: 'Deep Learning（Goodfellow 等）第 4 章 数值计算', url: 'https://www.deeplearningbook.org/contents/numerical.html' }
const LLAMA: QuizSource = { title: 'LLaMA（arXiv 2302.13971）', url: 'https://arxiv.org/abs/2302.13971' }
const BN: QuizSource = { title: 'Batch Normalization（arXiv 1502.03167）', url: 'https://arxiv.org/abs/1502.03167' }
const GN: QuizSource = { title: 'Group Normalization（arXiv 1803.08494）', url: 'https://arxiv.org/abs/1803.08494' }
const DROPOUT: QuizSource = { title: 'Dropout（JMLR 2014, Srivastava et al.）', url: 'https://jmlr.org/papers/v15/srivastava14a.html' }
const DROPDOC: QuizSource = { title: 'PyTorch 文档：nn.Dropout', url: 'https://docs.pytorch.org/docs/stable/generated/torch.nn.Dropout.html' }
const MODDOC: QuizSource = { title: 'PyTorch 文档：nn.Module（train / eval）', url: 'https://docs.pytorch.org/docs/stable/generated/torch.nn.Module.html' }
const GLU: QuizSource = { title: 'GLU Variants Improve Transformer（arXiv 2002.05202）', url: 'https://arxiv.org/abs/2002.05202' }
const SWITCH: QuizSource = { title: 'Switch Transformers（arXiv 2101.03961）', url: 'https://arxiv.org/abs/2101.03961' }
const SGMOE: QuizSource = { title: 'Sparsely-Gated Mixture-of-Experts（arXiv 1701.06538）', url: 'https://arxiv.org/abs/1701.06538' }
const DSV3: QuizSource = { title: 'DeepSeek-V3 Technical Report（arXiv 2412.19437）', url: 'https://arxiv.org/abs/2412.19437' }
const KAPLAN: QuizSource = { title: 'Scaling Laws for Neural Language Models（arXiv 2001.08361）', url: 'https://arxiv.org/abs/2001.08361' }
const CHINCHILLA: QuizSource = { title: 'Training Compute-Optimal LLMs / Chinchilla（arXiv 2203.15556）', url: 'https://arxiv.org/abs/2203.15556' }
const MIXPREC: QuizSource = { title: 'Mixed Precision Training（arXiv 1710.03740）', url: 'https://arxiv.org/abs/1710.03740' }
const GOYAL: QuizSource = { title: 'Accurate, Large Minibatch SGD（arXiv 1706.02677）', url: 'https://arxiv.org/abs/1706.02677' }
const PALM: QuizSource = { title: 'PaLM（arXiv 2204.02311）', url: 'https://arxiv.org/abs/2204.02311' }
const MMLU: QuizSource = { title: 'MMLU（arXiv 2009.03300）', url: 'https://arxiv.org/abs/2009.03300' }
const JUDGE: QuizSource = { title: 'Judging LLM-as-a-Judge（arXiv 2306.05685）', url: 'https://arxiv.org/abs/2306.05685' }
const GPT3: QuizSource = { title: 'Language Models are Few-Shot Learners（arXiv 2005.14165）', url: 'https://arxiv.org/abs/2005.14165' }
const LORA: QuizSource = { title: 'LoRA（arXiv 2106.09685）', url: 'https://arxiv.org/abs/2106.09685' }
const QLORA: QuizSource = { title: 'QLoRA（arXiv 2305.14314）', url: 'https://arxiv.org/abs/2305.14314' }
const EWC: QuizSource = { title: 'Overcoming catastrophic forgetting（arXiv 1612.00796）', url: 'https://arxiv.org/abs/1612.00796' }
const LORALESS: QuizSource = { title: 'LoRA Learns Less and Forgets Less（arXiv 2405.09673）', url: 'https://arxiv.org/abs/2405.09673' }
const NUCLEUS: QuizSource = { title: 'The Curious Case of Neural Text Degeneration（arXiv 1904.09751）', url: 'https://arxiv.org/abs/1904.09751' }
const HALLU: QuizSource = { title: 'A Survey on Hallucination in LLMs（arXiv 2311.05232）', url: 'https://arxiv.org/abs/2311.05232' }
const AMPDOC: QuizSource = { title: 'PyTorch 文档：Automatic Mixed Precision', url: 'https://docs.pytorch.org/docs/stable/amp.html' }
const BF16: QuizSource = { title: 'Google Cloud 文档：bfloat16 数值格式', url: 'https://cloud.google.com/tpu/docs/bfloat16' }
const RECIPE: QuizSource = { title: 'A Recipe for Training Neural Networks（Karpathy, 2019）', url: 'https://karpathy.github.io/2019/04/25/recipe/' }
const DLBOOK_PRAC: QuizSource = { title: 'Deep Learning（Goodfellow 等）第 11 章 实践方法论', url: 'https://www.deeplearningbook.org/contents/guidelines.html' }
const CODEX: QuizSource = { title: 'Evaluating LLMs Trained on Code / HumanEval（arXiv 2107.03374）', url: 'https://arxiv.org/abs/2107.03374' }
const SWEAGENT: QuizSource = { title: 'SWE-agent（arXiv 2405.15793）', url: 'https://arxiv.org/abs/2405.15793' }
const FLASH: QuizSource = { title: 'FlashAttention（arXiv 2205.14135）', url: 'https://arxiv.org/abs/2205.14135' }
const SPLITWISE: QuizSource = { title: 'Splitwise（arXiv 2311.18677）', url: 'https://arxiv.org/abs/2311.18677' }
const VLLM: QuizSource = { title: 'vLLM / PagedAttention（arXiv 2309.06180）', url: 'https://arxiv.org/abs/2309.06180' }
const INTQ: QuizSource = { title: 'Quantization and Training of NNs for Integer-Arithmetic-Only Inference（arXiv 1712.05877）', url: 'https://arxiv.org/abs/1712.05877' }
const INT8: QuizSource = { title: 'LLM.int8()（arXiv 2208.07339）', url: 'https://arxiv.org/abs/2208.07339' }
const GPTQP: QuizSource = { title: 'GPTQ（arXiv 2210.17323）', url: 'https://arxiv.org/abs/2210.17323' }
const AWQP: QuizSource = { title: 'AWQ（arXiv 2306.00978）', url: 'https://arxiv.org/abs/2306.00978' }
const GGUF: QuizSource = { title: 'ggml 文档：GGUF 文件格式', url: 'https://github.com/ggml-org/ggml/blob/master/docs/gguf.md' }
const SMOOTH: QuizSource = { title: 'SmoothQuant（arXiv 2211.10438）', url: 'https://arxiv.org/abs/2211.10438' }
const ZERO: QuizSource = { title: 'ZeRO（arXiv 1910.02054）', url: 'https://arxiv.org/abs/1910.02054' }
const RECOMP: QuizSource = { title: 'Reducing Activation Recomputation（arXiv 2205.05198）', url: 'https://arxiv.org/abs/2205.05198' }
const MEGATRON: QuizSource = { title: 'Megatron-LM（arXiv 1909.08053）', url: 'https://arxiv.org/abs/1909.08053' }
const GPIPE: QuizSource = { title: 'GPipe（arXiv 1811.06965）', url: 'https://arxiv.org/abs/1811.06965' }
const FSDP: QuizSource = { title: 'PyTorch FSDP（arXiv 2304.11277）', url: 'https://arxiv.org/abs/2304.11277' }
const AGSURVEY: QuizSource = { title: 'The Rise and Potential of LLM Based Agents（arXiv 2309.07864）', url: 'https://arxiv.org/abs/2309.07864' }
const WENG: QuizSource = { title: 'LLM Powered Autonomous Agents（Lilian Weng, 2023）', url: 'https://lilianweng.github.io/posts/2023-06-23-agent/' }
const BEA: QuizSource = { title: 'Building effective agents（Anthropic）', url: 'https://www.anthropic.com/engineering/building-effective-agents' }
const SC: QuizSource = { title: 'Self-Consistency（arXiv 2203.11171）', url: 'https://arxiv.org/abs/2203.11171' }
const ZSCOT: QuizSource = { title: 'Large Language Models are Zero-Shot Reasoners（arXiv 2205.11916）', url: 'https://arxiv.org/abs/2205.11916' }
const REACT: QuizSource = { title: 'ReAct（arXiv 2210.03629）', url: 'https://arxiv.org/abs/2210.03629' }
const REFLEXION: QuizSource = { title: 'Reflexion（arXiv 2303.11366）', url: 'https://arxiv.org/abs/2303.11366' }
const METR: QuizSource = { title: 'Measuring AI Ability to Complete Long Software Tasks（arXiv 2503.14499）', url: 'https://arxiv.org/abs/2503.14499' }
const OSWORLD: QuizSource = { title: 'OSWorld（arXiv 2404.07972）', url: 'https://arxiv.org/abs/2404.07972' }
const WEBARENA: QuizSource = { title: 'WebArena（arXiv 2307.13854）', url: 'https://arxiv.org/abs/2307.13854' }
const OAI_FC: QuizSource = { title: 'OpenAI 文档：Function calling', url: 'https://developers.openai.com/api/docs/guides/function-calling' }
const TOOLFORMER: QuizSource = { title: 'Toolformer（arXiv 2302.04761）', url: 'https://arxiv.org/abs/2302.04761' }
const MCP_ARCH: QuizSource = { title: 'MCP 官方文档：Architecture overview', url: 'https://modelcontextprotocol.io/docs/learn/architecture' }
const CTXENG: QuizSource = { title: 'Effective context engineering for AI agents（Anthropic）', url: 'https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents' }
const MEMGPT: QuizSource = { title: 'MemGPT（arXiv 2310.08560）', url: 'https://arxiv.org/abs/2310.08560' }
const GENAGENTS: QuizSource = { title: 'Generative Agents（arXiv 2304.03442）', url: 'https://arxiv.org/abs/2304.03442' }
const MEM0: QuizSource = { title: 'Mem0（arXiv 2504.19413）', url: 'https://arxiv.org/abs/2504.19413' }
const MEMOS: QuizSource = { title: 'MemOS（arXiv 2507.03724）', url: 'https://arxiv.org/abs/2507.03724' }
const RAGP: QuizSource = { title: 'Retrieval-Augmented Generation（arXiv 2005.11401）', url: 'https://arxiv.org/abs/2005.11401' }
const RAGSURVEY: QuizSource = { title: 'RAG for LLMs: A Survey（arXiv 2312.10997）', url: 'https://arxiv.org/abs/2312.10997' }
const DPR: QuizSource = { title: 'Dense Passage Retrieval（arXiv 2004.04906）', url: 'https://arxiv.org/abs/2004.04906' }
const HNSW: QuizSource = { title: 'HNSW（arXiv 1603.09320）', url: 'https://arxiv.org/abs/1603.09320' }
const FAISS: QuizSource = { title: 'The Faiss library（arXiv 2401.08281）', url: 'https://arxiv.org/abs/2401.08281' }
const BM25: QuizSource = { title: 'Elastic：Practical BM25 Part 2', url: 'https://www.elastic.co/blog/practical-bm25-part-2-the-bm25-algorithm-and-its-variables' }
const RRF: QuizSource = { title: 'Elasticsearch 文档：Reciprocal rank fusion', url: 'https://www.elastic.co/docs/reference/elasticsearch/rest-apis/reciprocal-rank-fusion' }
const COLBERT: QuizSource = { title: 'ColBERT（arXiv 2004.12832）', url: 'https://arxiv.org/abs/2004.12832' }
const MONOBERT: QuizSource = { title: 'Passage Re-ranking with BERT（arXiv 1901.04085）', url: 'https://arxiv.org/abs/1901.04085' }
const HYDE: QuizSource = { title: 'HyDE（arXiv 2212.10496）', url: 'https://arxiv.org/abs/2212.10496' }
const SELFRAG: QuizSource = { title: 'Self-RAG（arXiv 2310.11511）', url: 'https://arxiv.org/abs/2310.11511' }
const GRAPHRAG: QuizSource = { title: 'GraphRAG（arXiv 2404.16130）', url: 'https://arxiv.org/abs/2404.16130' }
const RAGFUSION: QuizSource = { title: 'RAG-Fusion（arXiv 2402.03367）', url: 'https://arxiv.org/abs/2402.03367' }
const REWRITE: QuizSource = { title: 'Query Rewriting for RAG（arXiv 2305.14283）', url: 'https://arxiv.org/abs/2305.14283' }
const INJECT: QuizSource = { title: 'Not what you have signed up for: 间接提示注入（arXiv 2302.12173）', url: 'https://arxiv.org/abs/2302.12173' }
const OWASP: QuizSource = { title: 'OWASP Top 10 for LLM Applications', url: 'https://genai.owasp.org/llm-top-10/' }
const DUALLLM: QuizSource = { title: 'The Dual LLM pattern（Simon Willison, 2023）', url: 'https://simonwillison.net/2023/Apr/25/dual-llm-pattern/' }
const LOSTMID: QuizSource = { title: 'Lost in the Middle（arXiv 2307.03172）', url: 'https://arxiv.org/abs/2307.03172' }
const TOOLS_A: QuizSource = { title: 'Writing effective tools for AI agents（Anthropic）', url: 'https://www.anthropic.com/engineering/writing-tools-for-agents' }
const SKILLS: QuizSource = { title: 'Claude 文档：Agent Skills overview', url: 'https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview' }
const HARNESS: QuizSource = { title: 'Effective harnesses for long-running agents（Anthropic）', url: 'https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents' }
const CC_BP: QuizSource = { title: 'Claude Code 文档：Best practices', url: 'https://code.claude.com/docs/en/best-practices' }
const CC_PERM: QuizSource = { title: 'Claude Code 文档：Permissions', url: 'https://code.claude.com/docs/en/permissions' }
const LG_HITL: QuizSource = { title: 'LangGraph 文档：Interrupts（human-in-the-loop）', url: 'https://langchain-ai.github.io/langgraph/concepts/human_in_the_loop/' }
const OAI_SO: QuizSource = { title: 'OpenAI 文档：Structured outputs', url: 'https://developers.openai.com/api/docs/guides/structured-outputs' }
const STRIPE_IDEM: QuizSource = { title: 'Stripe 文档：Idempotent requests', url: 'https://docs.stripe.com/api/idempotent_requests' }
const PPO: QuizSource = { title: 'Proximal Policy Optimization（arXiv 1707.06347）', url: 'https://arxiv.org/abs/1707.06347' }
const TRPO: QuizSource = { title: 'Trust Region Policy Optimization（arXiv 1502.05477）', url: 'https://arxiv.org/abs/1502.05477' }
const GAE: QuizSource = { title: 'Generalized Advantage Estimation（arXiv 1506.02438）', url: 'https://arxiv.org/abs/1506.02438' }
const INSTRUCTGPT: QuizSource = { title: 'InstructGPT（arXiv 2203.02155）', url: 'https://arxiv.org/abs/2203.02155' }
const LIMA: QuizSource = { title: 'LIMA: Less Is More for Alignment（arXiv 2305.11206）', url: 'https://arxiv.org/abs/2305.11206' }
const CEDOC: QuizSource = { title: 'PyTorch 文档：CrossEntropyLoss（ignore_index）', url: 'https://docs.pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html' }
const SUMHF: QuizSource = { title: 'Learning to summarize from human feedback（arXiv 2009.01325）', url: 'https://arxiv.org/abs/2009.01325' }
const RMOVER: QuizSource = { title: 'Scaling Laws for Reward Model Overoptimization（arXiv 2210.10760）', url: 'https://arxiv.org/abs/2210.10760' }
const DPOP: QuizSource = { title: 'Direct Preference Optimization（arXiv 2305.18290）', url: 'https://arxiv.org/abs/2305.18290' }
const IPO: QuizSource = { title: 'IPO：A General Theoretical Paradigm（arXiv 2310.12036）', url: 'https://arxiv.org/abs/2310.12036' }
const KTO: QuizSource = { title: 'KTO（arXiv 2402.01306）', url: 'https://arxiv.org/abs/2402.01306' }
const ORPO: QuizSource = { title: 'ORPO（arXiv 2403.07691）', url: 'https://arxiv.org/abs/2403.07691' }
const SIMPO: QuizSource = { title: 'SimPO（arXiv 2405.14734）', url: 'https://arxiv.org/abs/2405.14734' }
const DPOVSPPO: QuizSource = { title: 'Is DPO Superior to PPO for LLM Alignment?（arXiv 2404.10719）', url: 'https://arxiv.org/abs/2404.10719' }
const DSMATH: QuizSource = { title: 'DeepSeekMath / GRPO（arXiv 2402.03300）', url: 'https://arxiv.org/abs/2402.03300' }
const DAPO: QuizSource = { title: 'DAPO（arXiv 2503.14476）', url: 'https://arxiv.org/abs/2503.14476' }
const R1: QuizSource = { title: 'DeepSeek-R1（arXiv 2501.12948）', url: 'https://arxiv.org/abs/2501.12948' }
const RLVRLIMIT: QuizSource = { title: 'Does RL Really Incentivize Reasoning Capacity Beyond the Base Model?（arXiv 2504.13837）', url: 'https://arxiv.org/abs/2504.13837' }
const PRM: QuizSource = { title: 'Let’s Verify Step by Step（arXiv 2305.20050）', url: 'https://arxiv.org/abs/2305.20050' }
const PROCOUT: QuizSource = { title: 'Process- and outcome-based feedback（arXiv 2211.14275）', url: 'https://arxiv.org/abs/2211.14275' }
const SEARCHR1: QuizSource = { title: 'Search-R1（arXiv 2503.09516）', url: 'https://arxiv.org/abs/2503.09516' }
const RAGEN: QuizSource = { title: 'RAGEN（arXiv 2504.20073）', url: 'https://arxiv.org/abs/2504.20073' }
const IHIER: QuizSource = { title: 'The Instruction Hierarchy（arXiv 2404.13208）', url: 'https://arxiv.org/abs/2404.13208' }
const STRUQ: QuizSource = { title: 'StruQ（arXiv 2402.06363）', url: 'https://arxiv.org/abs/2402.06363' }
const SPOTLIGHT: QuizSource = { title: 'Spotlighting（arXiv 2403.14720）', url: 'https://arxiv.org/abs/2403.14720' }
const HYBRIDFLOW: QuizSource = { title: 'HybridFlow / verl（arXiv 2409.19256）', url: 'https://arxiv.org/abs/2409.19256' }
const OPENRLHF: QuizSource = { title: 'OpenRLHF（arXiv 2405.11143）', url: 'https://arxiv.org/abs/2405.11143' }
const WENG_RH: QuizSource = { title: 'Reward Hacking in Reinforcement Learning（Lilian Weng, 2024）', url: 'https://lilianweng.github.io/posts/2024-11-28-reward-hacking/' }

export const QUIZ: QuizQuestion[] = [
  // ---------- 02-M1.1 自注意力机制 ----------
  { id: 'q-02-m1-1-a', pointId: '02-M1.1', type: 'choice',
    question: '缩放点积注意力 softmax(QK^T / √d_k)V 中，为什么要除以 √d_k？',
    options: ['为了让注意力权重之和等于 1', 'd_k 较大时点积的方差随 d_k 增大，softmax 会被推入梯度极小的饱和区', '为了减少矩阵乘法的计算量', '为了让 Q 和 K 的范数相等'],
    answer: 1,
    explanation: '若 q、k 各分量独立、均值 0、方差 1，则 q·k 的方差为 d_k。点积过大使 softmax 接近 one-hot、梯度极小；除以 √d_k 把方差拉回 1。权重和为 1 是 softmax 本身保证的。',
    source: AIAYN },
  { id: 'q-02-m1-1-b', pointId: '02-M1.1', type: 'code',
    question: '用 PyTorch 手写缩放点积注意力：输入 q,k,v 形状 (B, H, L, d)，可选 mask（True 表示屏蔽），返回输出与注意力权重。',
    reference: `import math, torch

def sdpa(q, k, v, mask=None):
    d = q.size(-1)
    scores = q @ k.transpose(-2, -1) / math.sqrt(d)   # (B, H, L, L)
    if mask is not None:
        scores = scores.masked_fill(mask, float('-inf'))
    attn = torch.softmax(scores, dim=-1)               # 内部已做减 max 的数值稳定处理
    return attn @ v, attn`,
    tests: `q = k = v = torch.randn(2, 4, 5, 8)
out, attn = sdpa(q, k, v)
assert out.shape == (2, 4, 5, 8)
assert torch.allclose(attn.sum(-1), torch.ones(2, 4, 5))
ref = torch.nn.functional.scaled_dot_product_attention(q, k, v)
assert torch.allclose(out, ref, atol=1e-5)
causal = torch.triu(torch.ones(5, 5, dtype=torch.bool), 1)
_, a = sdpa(q, k, v, causal)
assert (a[..., 0, 1:] == 0).all()   # 第 0 个位置只看自己`,
    explanation: '要点：转置的是 k 的最后两维；缩放因子是 √d（每头维度）；mask 在 softmax 之前用 -inf 填充；softmax 沿最后一维（key 维）。',
    source: AIAYN },
  { id: 'q-02-m1-1-c', pointId: '02-M1.1', type: 'short',
    question: '比较自注意力层与循环层（RNN）的每层计算复杂度、顺序操作数和最大路径长度（序列长 n、表示维度 d）。',
    keyPoints: ['自注意力每层复杂度 O(n²·d)', '自注意力顺序操作数 O(1)，可完全并行', '自注意力任意两位置最大路径长度 O(1)', '循环层每层复杂度 O(n·d²)，顺序操作数与路径长度均为 O(n)', '当 n < d 时自注意力更省计算；长序列下 n² 成为瓶颈'],
    explanation: '见原论文 Table 1。路径长度短意味着长程依赖更容易学；n² 的显存与计算开销是 FlashAttention、稀疏/线性注意力等工作的出发点。',
    source: AIAYN },

  // ---------- 02-M1.2 多头注意力 ----------
  { id: 'q-02-m1-2-a', pointId: '02-M1.2', type: 'choice',
    question: 'Transformer base 中 d_model = 512、头数 h = 8，原论文每个头的 d_k（= d_v）是多少？',
    options: ['512', '256', '64', '8'],
    answer: 2,
    explanation: 'd_k = d_v = d_model / h = 64。每头维度变小，使多头注意力的总计算量与单头全维度注意力相近。',
    source: AIAYN },
  { id: 'q-02-m1-2-b', pointId: '02-M1.2', type: 'short',
    question: '为什么用多头注意力而不是一个 d_model 维的单头注意力？',
    keyPoints: ['多个头可在不同的表示子空间、不同位置上同时关注信息', '单头注意力的加权平均会抑制这种能力', '每头维度 = d_model/h，总计算量与单头全维度相近', '各头输出拼接后再经输出投影 W^O 融合'],
    explanation: '原论文 3.2.2：Multi-head attention allows the model to jointly attend to information from different representation subspaces at different positions；单头时 averaging inhibits this。',
    source: AIAYN },
  { id: 'q-02-m1-2-c', pointId: '02-M1.2', type: 'choice',
    question: '忽略偏置，标准多头注意力层（W^Q、W^K、W^V、W^O）的参数量是多少？',
    options: ['d_model²', '3·d_model²', '4·d_model²', '4·h·d_model²'],
    answer: 2,
    explanation: 'Q/K/V 三个投影各为 d_model × (h·d_k) = d_model²，输出投影 W^O 也是 d_model²，合计 4·d_model²，与头数 h 无关。',
    source: AIAYN },

  // ---------- 02-M1.3 注意力变体 ----------
  { id: 'q-02-m1-3-a', pointId: '02-M1.3', type: 'choice',
    question: 'MQA（Multi-Query Attention）相对 MHA 改了什么？',
    options: ['所有查询头共享同一组 K 和 V', '每个头的 Q 也共享', '去掉了 softmax', '把注意力换成卷积'],
    answer: 0,
    explanation: 'MQA 保留多个查询头，但只有一个 K 头和一个 V 头，显著减小增量解码时的 KV Cache 和显存带宽开销，代价是可能有质量损失。',
    source: MQA },
  { id: 'q-02-m1-3-b', pointId: '02-M1.3', type: 'choice',
    question: '某模型有 32 个查询头，改为 GQA 并分成 8 组（8 个 KV 头），在其他条件不变时 KV Cache 变为原 MHA 的多少？',
    options: ['1/32', '1/8', '1/4', '不变'],
    answer: 2,
    explanation: 'KV Cache 与 KV 头数成正比：8/32 = 1/4。GQA 介于 MHA（组数 = 头数）与 MQA（组数 = 1）之间；论文还提出用原 MHA 检查点均值池化 KV 头、再用约 5% 预训练算力 uptrain 的转换方法。',
    source: GQA },
  { id: 'q-02-m1-3-c', pointId: '02-M1.3', type: 'short',
    question: '简述 DeepSeek-V2 的 MLA（Multi-head Latent Attention）如何压缩 KV Cache，以及为什么需要「解耦 RoPE」。',
    keyPoints: ['把 K、V 联合低秩压缩成一个潜向量 c_KV，推理时只缓存潜向量', 'K/V 的上投影矩阵可被吸收进 W^Q 与 W^O，推理时不必显式还原 K、V', 'RoPE 与位置相关，放在 K 上会让上投影矩阵无法被吸收', '因此额外用一小段携带 RoPE 的解耦 query/key（共享的 k^R）单独承载位置信息，也一并缓存'],
    explanation: 'DeepSeek-V2 论文 2.1 节：MLA 的 KV Cache 远小于 MHA，相当于约 2.25 组的 GQA，而效果优于 MHA。',
    source: DSV2 },

  // ---------- 02-M1.5 Pre-Norm / Post-Norm ----------
  { id: 'q-02-m1-5-a', pointId: '02-M1.5', type: 'choice',
    question: '根据 Xiong et al. (2020) 的分析，Post-LN Transformer 为什么通常需要学习率 warmup？',
    options: ['初始化时靠近输出层的参数期望梯度很大，直接用大学习率不稳定', '因为 Post-LN 没有残差连接', '因为 LayerNorm 的参数需要先预热', '因为 Post-LN 的注意力是稀疏的'],
    answer: 0,
    explanation: '论文用平均场理论证明：Post-LN 初始化时输出层附近梯度大，需要 warmup；把 LN 放进残差分支内（Pre-LN）后梯度在初始化时表现良好，可去掉 warmup 并加快训练。',
    source: PRELN },
  { id: 'q-02-m1-5-b', pointId: '02-M1.5', type: 'short',
    question: '写出 Post-Norm 与 Pre-Norm 子层的计算式，并比较它们的优缺点。',
    keyPoints: ['Post-Norm：x_{l+1} = LN(x_l + F(x_l))', 'Pre-Norm：x_{l+1} = x_l + F(LN(x_l))', 'Pre-Norm 存在一条不经过 LN 的恒等残差通路，深层训练更稳定、对 warmup 不敏感', 'Pre-Norm 需要在最后一层之后额外加一个 LN', '常见观点：Post-Norm 调好后效果可能更好，但深层难训；当前主流 LLM 多用 Pre-Norm（常配 RMSNorm）'],
    explanation: '原始 Transformer 是 Post-Norm；GPT-2 之后的大模型普遍采用 Pre-Norm。',
    source: PRELN },
  { id: 'q-02-m1-5-c', pointId: '02-M1.5', type: 'choice',
    question: '把一个 Post-Norm 模型改成 Pre-Norm，除了移动每个子层里的 LN 位置，通常还需要做什么？',
    options: ['去掉所有残差连接', '在最后一个 Transformer 层之后、输出投影之前加一个最终 LN', '把 LayerNorm 换成 BatchNorm', '把学习率调成 0'],
    answer: 1,
    explanation: 'Pre-Norm 的残差主干从不归一化，各层输出不断累加，因此需要在输出前加最终 LN（如 GPT-2 的 ln_f、LLaMA 的 final norm）。',
    source: PRELN },

  // ---------- 02-M1.6 LayerNorm / RMSNorm ----------
  { id: 'q-02-m1-6-a', pointId: '02-M1.6', type: 'choice',
    question: 'RMSNorm 相比 LayerNorm 去掉了什么？',
    options: ['重缩放（除以统计量）', '减均值的重中心化（以及偏置项）', '可学习的增益参数 g', 'epsilon'],
    answer: 1,
    explanation: 'RMSNorm 只用均方根 RMS(x) = √(mean(x²)) 做重缩放，保留增益 g，去掉减均值；论文认为 LN 的收益主要来自重缩放不变性，计算更省。',
    source: RMSN },
  { id: 'q-02-m1-6-b', pointId: '02-M1.6', type: 'code',
    question: '用 PyTorch 实现 RMSNorm 模块（沿最后一维归一化，带可学习权重 weight，eps 默认 1e-6）。',
    reference: `import torch, torch.nn as nn

class RMSNorm(nn.Module):
    def __init__(self, dim, eps=1e-6):
        super().__init__()
        self.eps = eps
        self.weight = nn.Parameter(torch.ones(dim))

    def forward(self, x):
        rms_inv = torch.rsqrt(x.pow(2).mean(-1, keepdim=True) + self.eps)
        return x * rms_inv * self.weight`,
    tests: `x = torch.randn(2, 3, 16)
y = RMSNorm(16)(x)
assert y.shape == x.shape
# 权重为 1 时，每个向量的均方根应约等于 1
assert torch.allclose(y.pow(2).mean(-1), torch.ones(2, 3), atol=1e-4)
# 与 PyTorch 2.4+ 内置实现对照（可选）
# ref = nn.RMSNorm(16, eps=1e-6)(x); assert torch.allclose(y, ref, atol=1e-6)`,
    explanation: '注意 eps 加在均方之内再开根；不减均值、不加偏置。混合精度下常先把 x 转成 float32 计算再转回。',
    source: RMSN },
  { id: 'q-02-m1-6-c', pointId: '02-M1.6', type: 'choice',
    question: 'Transformer 里为什么普遍用 LayerNorm 而不是 BatchNorm？',
    options: ['LayerNorm 参数更多，表达能力更强', 'LayerNorm 对每个样本（每个 token）在特征维上归一化，不依赖 batch 统计量，对变长序列和小 batch 友好、训练推理一致', 'BatchNorm 无法反向传播', 'LayerNorm 不需要可学习参数'],
    answer: 1,
    explanation: 'LN 原论文指出它不依赖 mini-batch，可直接用于 RNN、训练和测试计算一致；BN 在变长序列、padding、小 batch 下统计量不稳定。',
    source: LN },

  // ---------- 02-M1.7 位置编码 ----------
  { id: 'q-02-m1-7-a', pointId: '02-M1.7', type: 'choice',
    question: 'RoPE 对位置 m 的 query 和位置 n 的 key 分别做旋转后，二者内积具有什么性质？',
    options: ['只依赖绝对位置 m', '只依赖内容向量与相对位置 m − n', '与位置无关', '只依赖 m + n'],
    answer: 1,
    explanation: 'RoPE 把向量两两分组做角度 mθ_i 的二维旋转，R_m^T R_n = R_{n−m}，因此 q_m·k_n 只与相对位置有关——用绝对位置的方式实现了相对位置编码。',
    source: ROPE },
  { id: 'q-02-m1-7-b', pointId: '02-M1.7', type: 'short',
    question: '对比原始 Transformer 的正弦位置编码与 RoPE：怎么加、加在哪、频率怎么取？',
    keyPoints: ['正弦编码：PE(pos,2i) = sin(pos/10000^{2i/d})，PE(pos,2i+1) = cos(同上)', '正弦编码加到输入词向量上（加性、只在输入层）', 'RoPE 在每层注意力里对 q、k 乘以旋转矩阵（乘性），不作用于 v', 'RoPE 频率 θ_i = 10000^{−2i/d}，维度两两一组旋转', 'RoPE 具有随相对距离增大而衰减的长程衰减性质'],
    explanation: '两者频率形式相同，区别在注入方式：加性绝对编码 vs. 对 q/k 的乘性旋转。外推方法（PI、NTK-aware、YaRN）都是在 RoPE 的频率上做文章。',
    source: ROPE },
  { id: 'q-02-m1-7-c', pointId: '02-M1.7', type: 'choice',
    question: 'ALiBi 是怎样注入位置信息的？',
    options: ['在词向量上加可学习的位置向量', '不加位置向量，在注意力分数上加与 query-key 距离成正比的负偏置，每个头斜率不同', '对 q、k 做旋转', '在 FFN 里加位置门控'],
    answer: 1,
    explanation: 'ALiBi 去掉位置嵌入，给注意力分数加 −m·|i−j| 的线性偏置（m 为头相关的固定斜率，呈几何数列），论文显示短序列训练、长序列推理时外推性好。',
    source: ALIBI },

  // ---------- 02-M1.9 完整前向流程 ----------
  { id: 'q-02-m1-9-a', pointId: '02-M1.9', type: 'short',
    question: '按顺序描述一个 LLaMA 式 Decoder-only 模型从输入 token id 到下一个 token 概率的完整前向流程。',
    keyPoints: ['token id → 词嵌入（Embedding 查表）', '重复 N 层：RMSNorm → 因果掩码多头注意力（q、k 施加 RoPE，推理时读写 KV Cache）→ 残差相加', '每层第二个子层：RMSNorm → FFN（SwiGLU）→ 残差相加', '最后一层后接最终 RMSNorm', 'LM Head 线性投影到词表得到 logits（可与词嵌入权重共享）→ softmax 得到概率 / 采样'],
    explanation: '这是 Pre-Norm 结构。位置信息在每层注意力内部通过 RoPE 注入，而不是在输入层相加。',
    source: LLAMA },
  { id: 'q-02-m1-9-b', pointId: '02-M1.9', type: 'choice',
    question: 'Decoder 的因果掩码通常怎么实现？',
    options: ['softmax 之后把上三角权重乘 0', 'softmax 之前把 j > i（未来位置）的分数置为 −∞', '把输入序列反转', '对 V 做下三角截断'],
    answer: 1,
    explanation: '在 softmax 前置 −∞（原论文说 setting to −∞），softmax 后这些位置权重为 0 且每行仍归一化；softmax 之后再乘 0 会破坏归一化。',
    source: AIAYN },
  { id: 'q-02-m1-9-c', pointId: '02-M1.9', type: 'code',
    question: '手写数值稳定的 softmax（NumPy，沿任意 axis），并说明为什么直接 exp(x)/sum(exp(x)) 不安全。',
    reference: `import numpy as np

def softmax(x, axis=-1):
    x = x - np.max(x, axis=axis, keepdims=True)   # 平移不改变结果
    e = np.exp(x)
    return e / np.sum(e, axis=axis, keepdims=True)`,
    tests: `x = np.array([[1000.0, 1001.0, 1002.0], [-1.0, 0.0, 1.0]])
p = softmax(x)
assert np.all(np.isfinite(p))
assert np.allclose(p.sum(-1), 1.0)
assert np.allclose(p[0], p[1])   # 平移不变性：两行只差一个常数
# 朴素实现 np.exp(1000.0) 会溢出成 inf，得到 nan`,
    explanation: 'softmax(x) = softmax(x − c)，取 c = max(x) 后最大指数为 e⁰ = 1，不会上溢，分母至少为 1 也不会下溢成 0。求 log-softmax 时同理用 log-sum-exp 技巧。',
    source: DLBOOK_NUM },
  // ---------- 01-M2.1 优化器 ----------
  { id: 'q-01-m2-1-a', pointId: '01-M2.1', type: 'choice',
    question: 'Adam 为什么要对一阶、二阶矩估计做偏差修正（除以 1 − β^t）？',
    options: ['为了让学习率随步数衰减', '矩估计以 0 初始化，训练初期会偏向 0，修正后才是无偏估计', '为了防止梯度爆炸', '为了实现权重衰减'],
    answer: 1,
    explanation: 'm、v 初始化为 0，前几步的指数滑动平均明显偏小（β 接近 1 时尤甚）。论文第 3 节推导：除以 1 − β1^t、1 − β2^t 即可修正这一初始化偏差。',
    source: ADAM },
  { id: 'q-01-m2-1-b', pointId: '01-M2.1', type: 'choice',
    question: 'AdamW 与「Adam + L2 正则」的关键区别是什么？',
    options: ['AdamW 不使用二阶矩', 'AdamW 把权重衰减从梯度里解耦出来，直接作用在参数上，不被自适应分母缩放', 'AdamW 去掉了动量', '两者完全等价'],
    answer: 1,
    explanation: '对 SGD 而言 L2 正则与权重衰减等价，但对 Adam 不等价：L2 项进入梯度后会被 √v 缩放，梯度大的参数反而衰减得少。AdamW 把衰减项单独施加在参数更新上。',
    source: ADAMW },
  { id: 'q-01-m2-1-c', pointId: '01-M2.1', type: 'code',
    question: '用 NumPy 写 AdamW 的单步更新：输入参数 w、梯度 g、状态 m, v、步数 t（从 1 开始），超参 lr, β1, β2, eps, wd；返回新的 w, m, v。',
    reference: `import numpy as np

def adamw_step(w, g, m, v, t, lr=1e-3, b1=0.9, b2=0.999, eps=1e-8, wd=0.01):
    m = b1 * m + (1 - b1) * g
    v = b2 * v + (1 - b2) * g * g
    m_hat = m / (1 - b1 ** t)
    v_hat = v / (1 - b2 ** t)
    w = w - lr * (m_hat / (np.sqrt(v_hat) + eps) + wd * w)   # 衰减项与自适应项解耦
    return w, m, v`,
    tests: `w = np.array([1.0, -2.0]); g = np.array([0.5, 0.5])
w1, m, v = adamw_step(w, g, np.zeros(2), np.zeros(2), t=1, wd=0.0)
# 第 1 步偏差修正后 m_hat = g，v_hat = g²，更新量约等于 lr·sign(g)
assert np.allclose(w - w1, 1e-3, atol=1e-6)
# 与 torch.optim.AdamW 对照（可选）：同样的初值和超参，结果应一致`,
    explanation: '要点：m、v 先更新再修正；eps 加在开根之后；权重衰减项 wd·w 不进入 m、v。第 1 步更新幅度约为 lr，这是 Adam 步长有界的性质。',
    source: ADAMW },

  // ---------- 01-M2.3 梯度消失与爆炸 ----------
  { id: 'q-01-m2-3-a', pointId: '01-M2.3', type: 'choice',
    question: 'sigmoid 函数导数的最大值是多少？这为什么会导致深层网络梯度消失？',
    options: ['1，不会导致梯度消失', '0.25，连乘多层后梯度按指数缩小', '0.5，只影响第一层', '无上界，会导致梯度爆炸'],
    answer: 1,
    explanation: 'σ′(x) = σ(x)(1 − σ(x))，在 x = 0 处取最大值 0.25。反向传播时每层都乘上一个 ≤0.25 的因子（再乘权重），层数一多梯度就指数级衰减。Glorot 与 Bengio 的实验也观察到 sigmoid 网络深层易饱和、训练困难。',
    source: GLOROT },
  { id: 'q-01-m2-3-b', pointId: '01-M2.3', type: 'choice',
    question: '按范数裁剪梯度（如 PyTorch 的 clip_grad_norm_）做了什么？',
    options: ['把每个梯度元素截断到 [−c, c]', '若所有梯度拼接后的总范数超过阈值，就整体等比例缩放，使总范数等于阈值，方向不变', '把梯度置零', '把学习率减半'],
    answer: 1,
    explanation: 'Pascanu 等提出按范数裁剪应对梯度爆炸：‖g‖ > c 时令 g ← c·g/‖g‖。与逐元素截断不同，它保持梯度方向。PyTorch 的 clip_grad_norm_ 计算的是所有参数梯度拼接后的总范数。',
    source: CLIPDOC },
  { id: 'q-01-m2-3-c', pointId: '01-M2.3', type: 'short',
    question: '说明梯度消失 / 爆炸的成因，并列举常见的缓解手段。',
    keyPoints: ['成因：反向传播是各层雅可比矩阵的连乘，因子持续 <1 则消失、>1 则爆炸（RNN 沿时间展开尤甚）', '激活函数：用 ReLU 类替代饱和的 sigmoid / tanh', '合理初始化：Xavier / He 初始化保持各层方差稳定', '残差连接：提供恒等通路，梯度可直接回传（ResNet）', '归一化层（BN / LN）与梯度裁剪（针对爆炸）'],
    explanation: 'Pascanu 等从动力系统角度分析了 RNN 中的梯度消失与爆炸并提出梯度裁剪；ResNet 用残差学习让很深的网络也能训练。',
    source: RNNDIFF },

  // ---------- 01-M2.4 归一化族 ----------
  { id: 'q-01-m2-4-a', pointId: '01-M2.4', type: 'choice',
    question: '对形状为 (N, C, H, W) 的特征，Group Normalization 在 G = 1 和 G = C 时分别退化为什么？',
    options: ['BN 和 LN', 'LN 和 IN', 'IN 和 BN', 'LN 和 BN'],
    answer: 1,
    explanation: 'GN 对每个样本把通道分成 G 组，在组内 (C/G, H, W) 上求统计量。G = 1 时在整个 (C, H, W) 上归一化，即 LN；G = C 时每个通道单独在 (H, W) 上归一化，即 IN。BN 则是跨 batch 在 (N, H, W) 上求统计量。',
    source: GN },
  { id: 'q-01-m2-4-b', pointId: '01-M2.4', type: 'choice',
    question: 'BatchNorm 在推理（eval）阶段用什么统计量做归一化？',
    options: ['当前测试 batch 的均值和方差', '训练期间累积的滑动平均均值和方差（running mean / var）', '固定为均值 0、方差 1', '每个样本自己的均值方差'],
    answer: 1,
    explanation: 'BN 论文：推理时用总体统计量代替 mini-batch 统计量，使输出只依赖输入本身；实现上通常是训练时维护的滑动平均。这也是 train / eval 模式必须切换的原因之一。',
    source: BN },
  { id: 'q-01-m2-4-c', pointId: '01-M2.4', type: 'short',
    question: '比较 BatchNorm 与 LayerNorm：统计维度、对 batch 的依赖、适用场景。',
    keyPoints: ['BN 对每个通道跨 batch 统计（N, H, W），LN 对每个样本跨特征维统计', 'BN 依赖 batch 大小，小 batch 时统计量噪声大；LN 与 batch 无关', 'BN 训练 / 推理行为不同（需 running 统计量），LN 训练推理一致', 'BN 常用于 CNN；LN 常用于 RNN / Transformer 等变长序列模型', '两者都带可学习的缩放 γ 和平移 β'],
    explanation: 'GN 论文第 1 节指出 BN 的误差在 batch 变小时迅速上升，这也是 GN / LN 这类与 batch 无关的方法的出发点。',
    source: GN },

  // ---------- 01-M2.6 train / eval 模式与 dropout ----------
  { id: 'q-01-m2-6-a', pointId: '01-M2.6', type: 'choice',
    question: 'PyTorch 的 nn.Dropout(p) 在训练模式下，对保留下来的元素做了什么？',
    options: ['不做处理', '乘以 1/(1 − p)，这样推理时直接恒等输出即可', '乘以 p', '乘以 1 − p'],
    answer: 1,
    explanation: 'PyTorch 文档：训练时以概率 p 置零，并把输出缩放 1/(1 − p)；eval 模式下 Dropout 只是恒等函数（inverted dropout）。原论文的做法是测试时把权重乘以保留概率，两者期望一致。',
    source: DROPDOC },
  { id: 'q-01-m2-6-b', pointId: '01-M2.6', type: 'choice',
    question: '关于 model.eval()，下列说法正确的是？',
    options: ['它会关闭自动求导，不再记录计算图', '它只影响 Dropout、BatchNorm 等在训练 / 推理中行为不同的模块，不关闭梯度计算；推理时还应配合 torch.no_grad()', '它会冻结所有参数，使其不能再被优化', '它会把模型转成半精度'],
    answer: 1,
    explanation: 'PyTorch 文档说明 eval() 等价于 train(False)，只对 Dropout、BatchNorm 等特定模块有影响；它与 torch.no_grad() / requires_grad 无关。',
    source: MODDOC },
  { id: 'q-01-m2-6-c', pointId: '01-M2.6', type: 'code',
    question: '用 PyTorch 张量运算手写 inverted dropout 的前向：dropout(x, p, training)。',
    reference: `import torch

def dropout(x, p=0.5, training=True):
    if not training or p == 0.0:
        return x
    if p == 1.0:
        return torch.zeros_like(x)
    mask = (torch.rand_like(x) > p).to(x.dtype)
    return x * mask / (1.0 - p)`,
    tests: `x = torch.ones(100000)
y = dropout(x, 0.3)
assert abs(y.mean().item() - 1.0) < 0.02        # 期望不变
assert abs((y == 0).float().mean().item() - 0.3) < 0.02
assert torch.equal(dropout(x, 0.3, training=False), x)`,
    explanation: '训练时随机置零并除以保留概率 1 − p，保持期望不变；推理时直接返回输入。注意 p = 1 的边界情况。',
    source: DROPOUT },
  // ---------- 02-M2.1 LLaMA 结构选择 ----------
  { id: 'q-02-m2-1-a', pointId: '02-M2.1', type: 'choice',
    question: 'LLaMA（第一代）相对原始 Transformer 的三处主要结构改动，不包括下列哪一项？',
    options: ['Pre-normalization（用 RMSNorm 归一化每个子层的输入）', 'SwiGLU 激活函数', '旋转位置编码 RoPE', '可学习的绝对位置嵌入'],
    answer: 3,
    explanation: 'LLaMA 论文 2.2 节列出三处改动：受 GPT-3 启发的 Pre-normalization（RMSNorm）、受 PaLM 启发的 SwiGLU、受 GPT-Neo 启发的 RoPE，并去掉了绝对位置嵌入。',
    source: LLAMA },
  { id: 'q-02-m2-1-b', pointId: '02-M2.1', type: 'code',
    question: '用 PyTorch 实现 LLaMA 式 SwiGLU FFN：FFN(x) = W2(SiLU(W1 x) ⊙ W3 x)，三个线性层均无偏置。',
    reference: `import torch, torch.nn as nn, torch.nn.functional as F

class SwiGLU(nn.Module):
    def __init__(self, dim, hidden):
        super().__init__()
        self.w1 = nn.Linear(dim, hidden, bias=False)   # 门控分支
        self.w3 = nn.Linear(dim, hidden, bias=False)   # 值分支
        self.w2 = nn.Linear(hidden, dim, bias=False)   # 输出投影

    def forward(self, x):
        return self.w2(F.silu(self.w1(x)) * self.w3(x))`,
    tests: `m = SwiGLU(64, 172)
x = torch.randn(2, 5, 64)
assert m(x).shape == (2, 5, 64)
# 参数量 = 3 · dim · hidden
assert sum(p.numel() for p in m.parameters()) == 3 * 64 * 172`,
    explanation: 'SwiGLU 有三个矩阵，为保持与普通 FFN（两个矩阵、隐藏层 4d）参数量相当，LLaMA 把隐藏维取为 2/3·4d。SiLU(x) = x·σ(x)，即 β = 1 的 Swish。',
    source: GLU },
  { id: 'q-02-m2-1-c', pointId: '02-M2.1', type: 'short',
    question: '说明 LLaMA 选择 Pre-Norm + RMSNorm、SwiGLU、RoPE 各自的动机。',
    keyPoints: ['Pre-Norm：归一化子层输入，提升训练稳定性', 'RMSNorm：去掉减均值，计算更省', 'SwiGLU：门控 FFN，在同等参数量下效果更好（GLU Variants 论文的实验）', 'SwiGLU 隐藏维取 2/3·4d 以保持参数量', 'RoPE：在每层对 q、k 施加相对位置信息，替代绝对位置嵌入'],
    explanation: 'LLaMA 论文明确说明三处改动分别借鉴自 GPT-3、PaLM 与 GPT-Neo。',
    source: LLAMA },

  // ---------- 02-M2.3 MoE 混合专家 ----------
  { id: 'q-02-m2-3-a', pointId: '02-M2.3', type: 'choice',
    question: 'Switch Transformer 的路由与此前 MoE（如 Shazeer 2017 的 top-k，k > 1）相比，最大的简化是什么？',
    options: ['每个 token 只路由到 1 个专家（top-1）', '去掉了门控网络', '所有专家共享参数', '每个 token 路由到全部专家'],
    answer: 0,
    explanation: 'Switch Transformer 把路由简化为 k = 1，减少路由计算和通信，并配合专家容量（capacity factor）与负载均衡辅助损失。',
    source: SWITCH },
  { id: 'q-02-m2-3-b', pointId: '02-M2.3', type: 'short',
    question: 'MoE 为什么需要负载均衡？Switch Transformer 的辅助损失是怎么设计的？',
    keyPoints: ['不加约束时门控容易塌缩到少数专家，其他专家得不到训练、计算资源浪费', '专家有容量上限（capacity factor），超出的 token 会被丢弃（溢出）', 'Switch 辅助损失 = α · N · Σ_i f_i · P_i', 'f_i 是被路由到专家 i 的 token 比例，P_i 是路由器分给专家 i 的平均概率', '均匀分布时该损失最小；α 取较小值（论文用 10⁻²）'],
    explanation: 'f_i 本身不可导，乘上可导的 P_i 使损失能反传到路由器。',
    source: SWITCH },
  { id: 'q-02-m2-3-c', pointId: '02-M2.3', type: 'code',
    question: '用 PyTorch 写一个 top-k 路由：输入 token 表示 x (T, d) 与路由权重 W (d, E)，返回每个 token 选中的 k 个专家下标及归一化后的门控权重。',
    reference: `import torch

def topk_route(x, W, k=2):
    logits = x @ W                                   # (T, E)
    top_val, top_idx = logits.topk(k, dim=-1)        # (T, k)
    gates = torch.softmax(top_val, dim=-1)           # 只在选中的 k 个专家上归一化
    return top_idx, gates`,
    tests: `x, W = torch.randn(6, 16), torch.randn(16, 8)
idx, g = topk_route(x, W, k=2)
assert idx.shape == (6, 2) and g.shape == (6, 2)
assert torch.allclose(g.sum(-1), torch.ones(6))
# 选中的确实是 logits 最大的两个
assert torch.equal(idx[:, 0], (x @ W).argmax(-1))`,
    explanation: '对应 Shazeer 2017 的 Softmax(KeepTopK(H(x), k))：先取 top-k，未选中的置为 −∞ 再 softmax，等价于只在 k 个值上做 softmax。论文还在 logits 上加可调噪声帮助均衡。',
    source: SGMOE },

  // ---------- 02-M2.4 DeepSeek 架构专题 ----------
  { id: 'q-02-m2-4-a', pointId: '02-M2.4', type: 'choice',
    question: '根据 DeepSeek-V3 技术报告，模型的总参数量与每个 token 激活的参数量分别是多少？',
    options: ['671B / 37B', '236B / 21B', '671B / 671B', '405B / 37B'],
    answer: 0,
    explanation: '报告摘要：671B total parameters with 37B activated for each token。236B / 21B 是 DeepSeek-V2 的数字。',
    source: DSV3 },
  { id: 'q-02-m2-4-b', pointId: '02-M2.4', type: 'choice',
    question: 'DeepSeek-V3 的「无辅助损失负载均衡」是怎么做的？',
    options: ['完全不做负载均衡', '为每个专家维护一个偏置项，只在选 top-k 时加到亲和度分数上，并按专家负载动态调整（过载调低、欠载调高）', '每个 token 随机分配专家', '把所有专家合并成一个'],
    answer: 1,
    explanation: '报告 2.1.2 节：偏置只用于路由选择，门控权重仍由原始亲和度计算；训练中按负载调整偏置，以减少辅助损失对模型效果的干扰（报告另保留了一个很小的序列级平衡损失）。',
    source: DSV3 },
  { id: 'q-02-m2-4-c', pointId: '02-M2.4', type: 'short',
    question: '简述 DeepSeek-V3 的多 token 预测（MTP）目标与 FP8 训练。',
    keyPoints: ['MTP：用依次串联的 MTP 模块在每个位置额外预测后续 token，保持完整的因果链', 'MTP 模块与主模型共享嵌入层和输出头', 'MTP 提供更密的训练信号；推理时可丢弃，也可用于投机解码', 'FP8 混合精度：大部分 GEMM 用 FP8 计算，对精度敏感的部分保留 BF16 / FP32', '使用细粒度（分块 / 分 tile）量化缓解 FP8 动态范围不足的问题'],
    explanation: '以上均出自 DeepSeek-V3 技术报告 2.2 节（MTP）与 3.3 节（FP8 训练）。',
    source: DSV3 },

  // ---------- 02-M4.3 Scaling Law ----------
  { id: 'q-02-m4-3-a', pointId: '02-M4.3', type: 'choice',
    question: 'Chinchilla 论文关于计算最优训练的核心结论是什么？',
    options: ['算力增加时应主要增大模型，数据量基本不变', '模型参数量与训练 token 数应等比例扩展：模型翻倍，token 数也翻倍', '应主要增加训练 token，模型不变', '模型越小越好'],
    answer: 1,
    explanation: '论文摘要：for every doubling of model size the number of training tokens should also be doubled。据此训练的 Chinchilla（70B，1.4T token）用与 Gopher（280B）相同的算力取得更好效果。',
    source: CHINCHILLA },
  { id: 'q-02-m4-3-b', pointId: '02-M4.3', type: 'code',
    question: '用近似 C ≈ 6·N·D（N 参数量，D 训练 token 数）和「每参数约 20 个 token」的经验比例，写函数根据算力预算 C（FLOPs）估算计算最优的 N 与 D。',
    reference: `import math

def chinchilla_optimal(C, tokens_per_param=20):
    # C = 6 N D,  D = r N  =>  N = sqrt(C / (6 r))
    N = math.sqrt(C / (6 * tokens_per_param))
    D = tokens_per_param * N
    return N, D`,
    tests: `N, D = chinchilla_optimal(6 * 70e9 * 1.4e12)
assert abs(N / 70e9 - 1) < 0.01 and abs(D / 1.4e12 - 1) < 0.01   # 还原 Chinchilla 70B / 1.4T
assert abs(6 * N * D - 6 * 70e9 * 1.4e12) / (6 * 70e9 * 1.4e12) < 1e-9`,
    explanation: '6ND 是 Kaplan 论文中训练算力的常用近似（前向约 2N、反向约 4N FLOPs/token）；20 token/参数由 Chinchilla 70B / 1.4T 推出，是粗略经验值。',
    source: CHINCHILLA },
  { id: 'q-02-m4-3-c', pointId: '02-M4.3', type: 'short',
    question: '对比 Kaplan（2020）与 Chinchilla（2022）两篇 Scaling Law 工作的结论差异。',
    keyPoints: ['Kaplan：损失与模型大小、数据量、算力分别呈幂律关系', 'Kaplan：大模型样本效率更高，计算最优是训练很大的模型、用相对少的数据、在收敛前停止', 'Chinchilla：模型和数据应等比例扩展，当时的大模型普遍训练不足（token 太少）', 'Chinchilla 用三种方法拟合（固定模型族改变 token、IsoFLOP 曲线、参数化损失拟合）得到一致结论', '实践影响：同等算力下更小的模型训练更多 token，推理也更便宜'],
    explanation: 'Kaplan 摘要原话：optimally compute-efficient training involves training very large models on a relatively modest amount of data and stopping significantly before convergence。',
    source: KAPLAN },

  // ---------- 02-M4.5 训练稳定性 ----------
  { id: 'q-02-m4-5-a', pointId: '02-M4.5', type: 'choice',
    question: 'FP16 混合精度训练中，loss scaling 的作用是什么？',
    options: ['加快前向计算', '把损失放大后再反传，让很小的梯度值不在 FP16 中下溢为 0，更新前再缩回', '降低显存占用', '代替学习率 warmup'],
    answer: 1,
    explanation: 'Micikevicius 等指出很多激活梯度小于 FP16 可表示的最小值，会下溢为 0。放大损失使梯度整体平移进可表示范围，更新 FP32 主权重前再除以同一系数。',
    source: MIXPREC },
  { id: 'q-02-m4-5-b', pointId: '02-M4.5', type: 'choice',
    question: 'Goyal 等的大 batch 训练中，batch 扩大 k 倍时学习率如何调整？为什么需要 warmup？',
    options: ['学习率不变；warmup 用于节省显存', '学习率也乘以 k（线性缩放规则）；训练初期网络变化剧烈，直接用大学习率会不稳定，所以先逐步升高', '学习率除以 k；warmup 用于防止过拟合', '学习率乘以 √k；不需要 warmup'],
    answer: 1,
    explanation: '论文提出 Linear Scaling Rule，并用 gradual warmup（前若干 epoch 从小学习率线性升到目标值）解决训练初期的优化困难。',
    source: GOYAL },
  { id: 'q-02-m4-5-c', pointId: '02-M4.5', type: 'short',
    question: '大模型预训练中出现 loss spike，PaLM 是怎么处理的？还有哪些常见的预防手段？',
    keyPoints: ['PaLM：从 spike 前约 100 步的检查点重启，并跳过约 200–500 个数据 batch', 'PaLM 观察到 spike 不是由单个坏 batch 引起，而是特定数据与参数状态的组合', '预防：学习率 warmup 与合适的峰值学习率', '预防：梯度裁剪、用 BF16 替代 FP16、监控梯度范数', '预防：Pre-Norm 等更稳定的结构'],
    explanation: 'PaLM 论文 Training Instability 一节 描述了上述「回滚 + 跳过数据」的做法。',
    source: PALM },

  // ---------- 02-M4.6 评测体系 ----------
  { id: 'q-02-m4-6-a', pointId: '02-M4.6', type: 'choice',
    question: 'MMLU 基准由什么构成？',
    options: ['57 个学科的多项选择题，覆盖 STEM、人文、社科等', '164 道 Python 编程题', '多轮对话的人工偏好打分', '数学竞赛证明题'],
    answer: 0,
    explanation: 'MMLU 包含 57 个任务（初等数学、美国历史、计算机科学、法律等），以零样本 / 少样本多选题形式评测知识与问题求解能力。164 道 Python 题是 HumanEval。',
    source: MMLU },
  { id: 'q-02-m4-6-b', pointId: '02-M4.6', type: 'short',
    question: 'LLM-as-a-Judge 有哪些已知偏差？如何缓解？',
    keyPoints: ['位置偏差：倾向于某个位置（如第一个）的回答', '冗长偏差：倾向于更长的回答', '自我增强偏差：倾向于自己（或同源模型）生成的回答', '缓解：交换两个回答的位置各评一次，不一致则判平局或丢弃', '缓解：给参考答案 / 思维链引导评分，并与人工标注做一致性校准'],
    explanation: '论文发现 GPT-4 作为评委与人类偏好的一致率超过 80%，与人类之间的一致率相当，但需注意上述偏差。',
    source: JUDGE },
  { id: 'q-02-m4-6-c', pointId: '02-M4.6', type: 'choice',
    question: 'GPT-3 论文是用什么方法检测评测集与训练数据的重叠（数据污染）的？',
    options: ['人工逐条比对', '统计 13-gram 重叠，把与训练集有重叠的样本标为可能污染，再比较干净子集上的效果', '比较困惑度', '不做检测'],
    answer: 1,
    explanation: 'GPT-3 论文第 4 节与附录 C 用 13-gram 重叠过滤，并在去除重叠后的「干净」子集上重新评测，以估计污染的影响。',
    source: GPT3 },

  // ---------- 02-M5.1 全参 vs PEFT ----------
  { id: 'q-02-m5-1-a', pointId: '02-M5.1', type: 'choice',
    question: 'LoRA 论文报告，与用 Adam 全参微调 GPT-3 175B 相比，LoRA 能把可训练参数和显存需求分别降低多少？',
    options: ['10 倍 / 10 倍', '10,000 倍 / 3 倍', '100 倍 / 100 倍', '3 倍 / 10,000 倍'],
    answer: 1,
    explanation: '摘要原文：reduce the number of trainable parameters by 10,000 times and the GPU memory requirement by 3 times。显存只降 3 倍，是因为冻结的基座权重仍要放在显存里。',
    source: LORA },
  { id: 'q-02-m5-1-b', pointId: '02-M5.1', type: 'choice',
    question: 'QLoRA 的三项关键技术是？',
    options: ['4-bit NormalFloat（NF4）、双重量化、分页优化器', 'FP8 训练、MoE、MTP', '知识蒸馏、剪枝、早停', 'Adapter、Prefix Tuning、Prompt Tuning'],
    answer: 0,
    explanation: 'QLoRA 把冻结基座量化为 4-bit NF4，对量化常数再量化（double quantization），用 paged optimizers 应对显存峰值，梯度经量化基座反传到 LoRA 适配器，能在单张 48GB GPU 上微调 65B 模型。',
    source: QLORA },
  { id: 'q-02-m5-1-c', pointId: '02-M5.1', type: 'short',
    question: '什么时候选全参微调，什么时候选 PEFT（如 LoRA）？',
    keyPoints: ['PEFT 只训练少量参数，显存与存储开销小，一个基座可挂多个任务适配器', 'LoRA 合并后无额外推理延迟', '全参微调可塑性最强，适合数据量大、与预训练分布差异大的任务（如继续预训练、新领域 / 新语言）', 'PEFT 改动小，对原有能力的遗忘通常更少', '资源受限可结合量化（QLoRA）'],
    explanation: 'LoRA Learns Less and Forgets Less 的实验发现：在代码、数学等目标领域 LoRA 通常不及全参微调，但更好地保留了基座在原任务上的能力。',
    source: LORALESS },

  // ---------- 02-M5.2 LoRA ----------
  { id: 'q-02-m5-2-a', pointId: '02-M5.2', type: 'choice',
    question: 'LoRA 中 ΔW = BA，A 与 B 是如何初始化的？为什么？',
    options: ['A、B 都初始化为 0', 'A 随机高斯初始化、B 初始化为 0，使训练开始时 ΔW = 0，模型输出与原模型一致', 'A 为 0、B 随机，使梯度为 0', '都用预训练权重的奇异向量初始化'],
    answer: 1,
    explanation: 'LoRA 论文：A 用随机高斯初始化，B 初始化为 0，所以开始时 ΔW = BA = 0；ΔW 再按 α/r 缩放。若两者都为 0 则梯度也为 0，无法训练。',
    source: LORA },
  { id: 'q-02-m5-2-b', pointId: '02-M5.2', type: 'code',
    question: '用 PyTorch 实现 LoRALinear：包住一个冻结的 nn.Linear，加上秩为 r 的旁路 BA，输出 = base(x) + (α/r)·x Aᵀ Bᵀ。',
    reference: `import math, torch, torch.nn as nn

class LoRALinear(nn.Module):
    def __init__(self, base: nn.Linear, r=8, alpha=16):
        super().__init__()
        self.base = base
        for p in self.base.parameters():
            p.requires_grad_(False)
        self.A = nn.Parameter(torch.randn(r, base.in_features) / math.sqrt(r))
        self.B = nn.Parameter(torch.zeros(base.out_features, r))
        self.scale = alpha / r

    def forward(self, x):
        return self.base(x) + (x @ self.A.T @ self.B.T) * self.scale

    @torch.no_grad()
    def merge(self):   # 推理前合并，无额外延迟
        self.base.weight += self.scale * self.B @ self.A`,
    tests: `base = nn.Linear(32, 16)
m = LoRALinear(base, r=4)
x = torch.randn(3, 32)
assert torch.allclose(m(x), base(x))                  # 初始 ΔW = 0
assert sum(p.numel() for p in m.parameters() if p.requires_grad) == 4 * (32 + 16)
m.B.data.normal_(); y = m(x); m.merge()
assert torch.allclose(base(x), y, atol=1e-5)          # 合并后结果一致`,
    explanation: '要点：基座冻结；B 零初始化；缩放系数 α/r；合并后 W = W0 + (α/r)BA，推理不增加计算。',
    source: LORA },
  { id: 'q-02-m5-2-c', pointId: '02-M5.2', type: 'choice',
    question: 'LoRA 为什么不会引入额外的推理延迟（相比 Adapter 层）？',
    options: ['因为 LoRA 只在训练时使用', '训练完可把 BA 直接加到 W0 上合并成一个矩阵，推理结构与原模型完全相同', '因为 LoRA 用了更快的 kernel', '因为 LoRA 减少了层数'],
    answer: 1,
    explanation: 'LoRA 论文强调：部署时显式计算 W = W0 + BA 并照常推理，没有额外延迟；Adapter 则在网络中串行插入新层，会增加推理延迟。',
    source: LORA },

  // ---------- 02-M5.5 微调实践 ----------
  { id: 'q-02-m5-5-a', pointId: '02-M5.5', type: 'choice',
    question: 'EWC（Elastic Weight Consolidation）缓解灾难性遗忘的思路是？',
    options: ['回放全部旧数据', '在新任务损失上加一个二次惩罚，按 Fisher 信息衡量各参数对旧任务的重要性，限制重要参数偏离旧值', '为每个任务训练独立模型', '冻结所有层'],
    answer: 1,
    explanation: 'EWC 论文：对旧任务重要的权重（Fisher 信息大）学习得更慢，像被弹簧拉回旧值。',
    source: EWC },
  { id: 'q-02-m5-5-b', pointId: '02-M5.5', type: 'short',
    question: '小样本微调大模型容易过拟合，有哪些实用手段？',
    keyPoints: ['用 PEFT（LoRA 等）减少可训练参数', '降低学习率、减少 epoch，按验证集早停', '保证数据质量与多样性，必要时做数据增强 / 改写', '混入通用数据，兼顾防遗忘', '加正则（weight decay、dropout），并留出独立验证集监控'],
    explanation: 'DL 书第 11 章的实践方法论：先确定指标与验证集，再据训练 / 验证误差判断是过拟合还是欠拟合并对症调整。',
    source: DLBOOK_PRAC },
  { id: 'q-02-m5-5-c', pointId: '02-M5.5', type: 'choice',
    question: '根据 LoRA Learns Less and Forgets Less 的实验，LoRA 与全参微调相比：',
    options: ['在目标领域学得更多、遗忘也更多', '在目标领域通常不及全参微调，但对基座原有能力的遗忘更少', '两者完全一样', 'LoRA 无法用于代码和数学'],
    answer: 1,
    explanation: '论文在代码和数学上对比两者：LoRA 目标领域效果多数情况下不如全参，但更好地保持了基座在目标领域之外任务上的表现，且比 weight decay、dropout 等正则更能缓解遗忘。',
    source: LORALESS },

  // ---------- 02-M6.1 解码策略 ----------
  { id: 'q-02-m6-1-a', pointId: '02-M6.1', type: 'choice',
    question: 'Nucleus（top-p）采样是怎么选候选集的？',
    options: ['固定取概率最高的 k 个 token', '取累计概率刚好达到 p 的最小 token 集合，在其中重新归一化后采样', '只取概率最高的 1 个', '从整个词表均匀采样'],
    answer: 1,
    explanation: 'Holtzman 等提出 top-p：候选集大小随分布形状动态变化——分布尖时集合小，分布平时集合大，而 top-k 的 k 是固定的。',
    source: NUCLEUS },
  { id: 'q-02-m6-1-b', pointId: '02-M6.1', type: 'code',
    question: '用 PyTorch 实现带 temperature 的 top-p 采样：输入一维 logits，返回采样到的 token id。',
    reference: `import torch

def sample_top_p(logits, p=0.9, temperature=1.0):
    probs = torch.softmax(logits / temperature, dim=-1)
    sorted_p, sorted_idx = probs.sort(descending=True)
    cum = sorted_p.cumsum(-1)
    keep = cum - sorted_p < p            # 保留到累计概率首次 ≥ p 的那个 token
    sorted_p = sorted_p * keep
    sorted_p = sorted_p / sorted_p.sum()
    choice = torch.multinomial(sorted_p, 1)
    return sorted_idx[choice].item()`,
    tests: `logits = torch.tensor([5.0, 4.0, 0.0, -1.0])
# p 很小时退化为贪心
assert all(sample_top_p(logits, p=0.01) == 0 for _ in range(50))
# 概率 0 附近的长尾 token 不应被采到
ids = {sample_top_p(logits, p=0.9) for _ in range(500)}
assert ids <= {0, 1}`,
    explanation: '要点：先除以 temperature 再 softmax；排序后用「累计概率减去自身 < p」保证至少保留一个 token；截断后重新归一化。',
    source: NUCLEUS },
  { id: 'q-02-m6-1-c', pointId: '02-M6.1', type: 'short',
    question: '比较 greedy、beam search、top-k、top-p 和 temperature 的特点与适用场景。',
    keyPoints: ['greedy：每步取最大概率，确定性强，开放式生成易重复', 'beam search：保留多条候选求近似最大似然，适合翻译等有标准答案的任务；开放式生成易平淡重复', 'top-k：固定截断 k 个候选，k 不随分布自适应', 'top-p：按累计概率动态截断，兼顾多样性与质量', 'temperature：缩放 logits，T < 1 更尖锐保守，T > 1 更平坦多样，T → 0 趋近 greedy'],
    explanation: 'Holtzman 等发现以最大似然为目标的解码（含 beam search）在开放式生成中会产生乏味、重复的文本（degeneration）。',
    source: NUCLEUS },

  // ---------- 02-M6.3 幻觉 ----------
  { id: 'q-02-m6-3-a', pointId: '02-M6.3', type: 'choice',
    question: 'Huang 等的幻觉综述把 LLM 幻觉分为哪两大类？',
    options: ['事实性幻觉与忠实性幻觉', '语法幻觉与语义幻觉', '训练幻觉与推理幻觉', '视觉幻觉与文本幻觉'],
    answer: 0,
    explanation: '事实性幻觉（factuality）指输出与可验证的真实世界事实不符或捏造；忠实性幻觉（faithfulness）指输出偏离用户指令、给定上下文或自身逻辑。',
    source: HALLU },
  { id: 'q-02-m6-3-b', pointId: '02-M6.3', type: 'choice',
    question: '按该综述的分类，「用户要求把一段话翻译成英文，模型却回答了其中的问题」属于哪类幻觉？',
    options: ['事实捏造', '忠实性幻觉中的指令不一致', '事实不一致', '不属于幻觉'],
    answer: 1,
    explanation: '综述把忠实性幻觉细分为指令不一致（instruction inconsistency）、上下文不一致和逻辑不一致；偏离用户指令属于第一种。',
    source: HALLU },
  { id: 'q-02-m6-3-c', pointId: '02-M6.3', type: 'short',
    question: '幻觉从哪些环节产生？分别有什么缓解手段？',
    keyPoints: ['数据：预训练数据中的错误、过时信息与知识长尾', '训练：预训练 / 对齐阶段的目标与能力不匹配（如迎合用户、超出知识边界作答）', '推理：解码随机性、注意力对长上下文的利用不足', '缓解：数据清洗与去重、检索增强（RAG）引入外部知识', '缓解：对齐阶段鼓励承认不知道、事实性解码与事后校验 / 引用'],
    explanation: '综述按数据、训练、推理三阶段归纳成因，并对应整理了缓解方法。',
    source: HALLU },

  // ---------- 02-M7.3 训练稳定性调试 ----------
  { id: 'q-02-m7-3-a', pointId: '02-M7.3', type: 'choice',
    question: '为什么用 BF16 训练通常比 FP16 更不容易溢出？',
    options: ['BF16 尾数位更多，精度更高', 'BF16 有 8 位指数，动态范围与 FP32 相同；代价是尾数只有 7 位、精度较低', 'BF16 占用 32 位', 'BF16 不参与反向传播'],
    answer: 1,
    explanation: 'Google 文档：bfloat16 为 1 位符号、8 位指数、7 位尾数，指数位与 FP32 一致；FP16 只有 5 位指数，容易上溢 / 下溢。',
    source: BF16 },
  { id: 'q-02-m7-3-b', pointId: '02-M7.3', type: 'choice',
    question: 'PyTorch 的 GradScaler（动态 loss scaling）检测到梯度中出现 inf / NaN 时会怎么做？',
    options: ['终止训练', '跳过这一步的 optimizer.step()，并调小缩放系数', '把 inf 替换成 0 继续更新', '把学习率调大'],
    answer: 1,
    explanation: 'PyTorch AMP 文档：scaler.step() 会先反缩放梯度，若含 inf / NaN 则跳过本次参数更新；scaler.update() 随后降低 scale，连续若干步正常后再逐步增大。',
    source: AMPDOC },
  { id: 'q-02-m7-3-c', pointId: '02-M7.3', type: 'short',
    question: '训练中 loss 突然变成 NaN，给出一套排查思路。',
    keyPoints: ['定位首次出现 NaN 的步，检查该步的数据（空样本、异常长度、标签越界）', '监控梯度范数 / 各层激活与权重范数，找到最先异常的层', '检查数值操作：log(0)、除以 0、softmax / exp 溢出、eps 设置', '混合精度：确认 loss scaling 是否生效，考虑切到 BF16 或让敏感算子用 FP32', '降低学习率、加 / 收紧梯度裁剪、延长 warmup，从最近的健康检查点恢复'],
    explanation: '思路与 Karpathy 的训练 recipe 一致：先保证可复现、逐步加复杂度，并对每个环节做可视化 / 监控。',
    source: RECIPE },

  // ---------- 02-M8.1 复杂度手推 ----------
  { id: 'q-02-m8-1-a', pointId: '02-M8.1', type: 'choice',
    question: '序列长 n、模型维度 d 时，一层自注意力中 QKᵀ 与「注意力权重 × V」两次矩阵乘的总 FLOPs 约为多少（一次乘加记 2 FLOPs）？',
    options: ['2·n·d', '4·n²·d', 'n²', '8·n·d²'],
    answer: 1,
    explanation: 'QKᵀ：(n×d)·(d×n) 约 2n²d FLOPs；权重 (n×n) 乘 V (n×d) 也约 2n²d，合计约 4n²d。Q/K/V/O 四个投影另需约 8nd² FLOPs，与 n 成线性。',
    source: AIAYN },
  { id: 'q-02-m8-1-b', pointId: '02-M8.1', type: 'code',
    question: '写函数计算 KV Cache 显存（字节）：参数为层数 L、KV 头数 n_kv、每头维度 d_h、序列长度 s、batch 大小 b、每元素字节数 bytes。',
    reference: `def kv_cache_bytes(L, n_kv, d_h, s, b=1, bytes_per=2):
    # 2 = K 和 V 各一份
    return 2 * L * n_kv * d_h * s * b * bytes_per`,
    tests: `# 32 层、32 个 KV 头、每头 128 维、FP16、4096 token、batch 1
assert kv_cache_bytes(32, 32, 128, 4096) == 2 * 1024**3        # 2 GiB
# 改为 GQA 8 个 KV 头：变为 1/4
assert kv_cache_bytes(32, 8, 128, 4096) == 512 * 1024**2`,
    explanation: '每 token 每层要存 K、V 各 n_kv·d_h 个元素。MHA 下 n_kv = 头数，GQA 下为组数，MQA 下为 1——这正是 GQA 论文降低显存带宽的出发点。',
    source: GQA },
  { id: 'q-02-m8-1-c', pointId: '02-M8.1', type: 'choice',
    question: '自回归解码时使用 KV Cache，生成第 t 个 token 的注意力计算量与 t 的关系是？',
    options: ['与 t 无关', '与 t 成线性：新 query 只需与已缓存的 t 个 key / value 交互', '与 t² 成正比', '与 t³ 成正比'],
    answer: 1,
    explanation: '有 KV Cache 时每步只算新 token 的 q、k、v，注意力是 1×t 的打分，约 O(t·d)；不缓存则每步都要对整个前缀重算，单步约 O(t²·d)。',
    source: MQA },

  // ---------- 02-M8.2 Loss 不降系统排查 ----------
  { id: 'q-02-m8-2-a', pointId: '02-M8.2', type: 'choice',
    question: 'Karpathy 的训练 recipe 中，排查训练管线正确性时推荐的一个关键步骤是？',
    options: ['直接上最大模型训练', '先在一个很小的 batch 上过拟合，确认能把 loss 压到接近 0', '先调 dropout', '先换优化器'],
    answer: 1,
    explanation: 'Recipe 的「overfit one batch」：用少量样本把 loss 训到极低，做不到说明代码、标签或损失有 bug，而不是模型容量问题。',
    source: RECIPE },
  { id: 'q-02-m8-2-b', pointId: '02-M8.2', type: 'short',
    question: '训练 loss 一直不下降，给出系统的排查顺序。',
    keyPoints: ['检查数据：输入与标签是否对齐、预处理 / tokenizer 是否正确，可视化送进模型前的样本', '检查初始 loss 是否符合预期（如分类约为 ln(类别数)）', '在小 batch 上过拟合，验证管线与损失实现', '学习率：过大发散 / 震荡，过小几乎不动；做学习率扫描', '检查梯度：是否为 0 / 被 detach、参数是否被冻结、优化器是否拿到了正确的参数组'],
    explanation: 'Karpathy recipe 建议从简单可验证的基线开始、逐步加复杂度，并检查初始化时的 loss。',
    source: RECIPE },
  { id: 'q-02-m8-2-c', pointId: '02-M8.2', type: 'choice',
    question: '一个 10 分类模型刚初始化（输出近似均匀）时，交叉熵 loss 大约应是多少？',
    options: ['0', 'ln 10 ≈ 2.30', '10', '1'],
    answer: 1,
    explanation: '均匀预测下每个样本 −log(1/10) = ln 10 ≈ 2.303。Recipe 建议核对初始 loss，明显偏离通常说明初始化或损失实现有问题。',
    source: RECIPE },

  // ---------- 02-M9.4 代码 Agent 与执行反馈 ----------
  { id: 'q-02-m9-4-a', pointId: '02-M9.4', type: 'code',
    question: 'HumanEval 用无偏估计计算 pass@k：每题生成 n 个样本、其中 c 个通过，pass@k = 1 − C(n−c, k)/C(n, k)。写一个数值稳定的实现。',
    reference: `import numpy as np

def pass_at_k(n, c, k):
    if n - c < k:
        return 1.0
    # 1 - prod_{i=n-c+1}^{n} (1 - k/i)，避免直接算大组合数
    return 1.0 - np.prod(1.0 - k / np.arange(n - c + 1, n + 1))`,
    tests: `from math import comb
for n, c, k in [(10, 3, 1), (20, 5, 5), (200, 13, 10)]:
    assert abs(pass_at_k(n, c, k) - (1 - comb(n - c, k) / comb(n, k))) < 1e-12
assert abs(pass_at_k(10, 3, 1) - 0.3) < 1e-12   # k = 1 时就是通过率
assert pass_at_k(5, 3, 3) == 1.0`,
    explanation: 'Codex 论文指出直接用 1 − (1 − p̂)^k 有偏，并给出与上面相同的数值稳定实现。',
    source: CODEX },
  { id: 'q-02-m9-4-b', pointId: '02-M9.4', type: 'choice',
    question: 'SWE-agent 论文的核心概念「Agent-Computer Interface（ACI）」指什么？',
    options: ['一种新的模型结构', '为 LM Agent 专门设计的命令与反馈界面（如文件查看、搜索、编辑命令及其输出格式），而不是直接给它人类用的 shell', '一种硬件接口', '一个代码基准'],
    answer: 1,
    explanation: '论文指出 LM Agent 是一类新的终端用户，为它定制的 ACI 能显著提升其创建、编辑代码文件、浏览仓库和运行测试的能力。',
    source: SWEAGENT },
  { id: 'q-02-m9-4-c', pointId: '02-M9.4', type: 'short',
    question: '代码 Agent 如何利用执行反馈来改进结果？',
    keyPoints: ['循环：生成 / 修改代码 → 运行（测试、编译、复现脚本）→ 读取报错与输出 → 再修改', '先写复现问题的脚本或测试，用它判断是否修好', '界面设计：简洁、结构化的命令反馈（如编辑后立即做语法检查）减少无效步骤', '控制上下文：只展示相关文件片段与截断后的日志，避免淹没关键信息', '多次采样 + 用测试筛选（pass@k 思想）'],
    explanation: 'SWE-agent 的 ACI 设计（如编辑命令附带 linter、搜索结果摘要）就是围绕高质量执行反馈展开的。',
    source: SWEAGENT },
  // ---------- 03-M1.1 KV Cache 原理与显存计算 ----------
  { id: 'q-03-m1-1-a', pointId: '03-M1.1', type: 'choice',
    question: '自回归解码中为什么缓存 K 和 V，而不缓存 Q？',
    options: ['Q 太大放不下', '每步只有新 token 的 query 参与计算，历史 token 的 Q 之后不再使用；而它们的 K、V 每一步都要被新 query 访问', 'Q 可以从 V 推出来', '缓存 Q 会改变模型输出'],
    answer: 1,
    explanation: '因果注意力下第 t 步的输出只依赖 q_t 与 k_1..t、v_1..t。历史 K、V 不变，缓存后每步只算新 token 的 q、k、v。',
    source: MQA },
  { id: 'q-03-m1-1-b', pointId: '03-M1.1', type: 'choice',
    question: '32 层、32 个 KV 头、每头 128 维的模型，用 FP16 缓存，每个 token 的 KV Cache 约占多少？',
    options: ['16 KiB', '512 KiB', '8 MiB', '64 KiB'],
    answer: 1,
    explanation: '2（K、V）× 32 层 × 32 头 × 128 维 × 2 字节 = 524,288 字节 = 512 KiB；4096 个 token 就是 2 GiB。vLLM 论文也举例：OPT-13B 每个 token 的 KV Cache 约 800 KB。',
    source: VLLM },
  { id: 'q-03-m1-1-c', pointId: '03-M1.1', type: 'code',
    question: '实现带 KV Cache 的单步解码注意力：给定新 token 的 q、k、v（形状 (B, H, 1, d)）和已有缓存 (B, H, T, d)，拼接缓存并返回输出与新缓存。',
    reference: `import math, torch

def attend_with_cache(q, k, v, cache_k=None, cache_v=None):
    if cache_k is not None:
        k = torch.cat([cache_k, k], dim=2)
        v = torch.cat([cache_v, v], dim=2)
    scores = q @ k.transpose(-2, -1) / math.sqrt(q.size(-1))   # (B, H, 1, T+1)
    out = torch.softmax(scores, dim=-1) @ v                    # 新 token 可看全部历史，无需 mask
    return out, k, v`,
    tests: `B, H, T, d = 1, 2, 6, 8
x_q, x_k, x_v = (torch.randn(B, H, T, d) for _ in range(3))
full = torch.nn.functional.scaled_dot_product_attention(x_q, x_k, x_v, is_causal=True)
ck = cv = None
for t in range(T):
    o, ck, cv = attend_with_cache(x_q[:, :, t:t+1], x_k[:, :, t:t+1], x_v[:, :, t:t+1], ck, cv)
    assert torch.allclose(o, full[:, :, t:t+1], atol=1e-5)   # 与整段因果注意力逐步一致
assert ck.shape == (B, H, T, d)`,
    explanation: '要点：沿序列维（dim=2）拼接；单个新 query 能看到全部已缓存位置，所以不需要因果掩码；逐步结果应与整段因果注意力一致。',
    source: AIAYN },

  // ---------- 03-M1.2 Attention 推理复杂度与瓶颈 ----------
  { id: 'q-03-m1-2-a', pointId: '03-M1.2', type: 'choice',
    question: 'Splitwise 论文对 LLM 推理两个阶段的刻画是？',
    options: ['两个阶段都受算力限制', 'prompt 处理（prefill）是计算密集型，逐 token 生成（decode）是访存密集型', 'prefill 访存密集，decode 计算密集', '两个阶段都受网络带宽限制'],
    answer: 1,
    explanation: '摘要：a compute-intensive prompt computation, and a memory-intensive token generation。decode 每步只处理一个 token，却要读出全部权重与 KV Cache，算术强度低。',
    source: SPLITWISE },
  { id: 'q-03-m1-2-b', pointId: '03-M1.2', type: 'choice',
    question: 'FlashAttention 主要通过什么加速注意力？',
    options: ['近似注意力，牺牲精度', '分块（tiling）计算并在片上 SRAM 中完成 softmax，减少 GPU 高带宽显存（HBM）的读写，结果是精确的', '减少注意力头数', '把注意力换成卷积'],
    answer: 1,
    explanation: '论文称其为 IO-aware 的精确注意力：不在 HBM 中物化 n×n 注意力矩阵，用分块与在线 softmax 减少 HBM 访问；反向时重算而不存储注意力矩阵，额外显存与序列长度成线性。',
    source: FLASH },
  { id: 'q-03-m1-2-c', pointId: '03-M1.2', type: 'short',
    question: '分析标准注意力在推理时的计算与显存瓶颈，以及常见的优化方向。',
    keyPoints: ['计算 O(n²·d)、注意力矩阵显存 O(n²)，长序列下成为瓶颈', '标准实现受 HBM 读写限制（memory-bound），而不只是算力', 'decode 阶段每步读取整个 KV Cache，KV Cache 大小与带宽决定速度', '优化：FlashAttention 类 IO-aware kernel', '优化：MQA / GQA / MLA 减少 KV Cache，PagedAttention 管理缓存，量化 KV'],
    explanation: 'FlashAttention 论文指出注意力的瓶颈往往是显存访问而非 FLOPs；KV 侧的优化则针对 decode 阶段的访存。',
    source: FLASH },

  // ---------- 03-M1.4 显存构成与估算（推理） ----------
  { id: 'q-03-m1-4-a', pointId: '03-M1.4', type: 'choice',
    question: '一个 7B 参数的模型，FP16 / BF16 推理时仅权重大约占多少显存？',
    options: ['约 3.5 GB', '约 7 GB', '约 14 GB', '约 28 GB'],
    answer: 2,
    explanation: '每参数 2 字节：7×10⁹ × 2 ≈ 14 GB（约 13 GiB）。INT8 约 7 GB，4-bit 约 3.5 GB，FP32 约 28 GB。',
    source: INT8 },
  { id: 'q-03-m1-4-b', pointId: '03-M1.4', type: 'short',
    question: 'LLM 推理服务的显存由哪些部分组成？如何估算能支撑的并发？',
    keyPoints: ['模型权重：参数量 × 每参数字节数', 'KV Cache：2 × 层数 × KV 头数 × 每头维度 × 字节数 × token 数，随并发与长度线性增长', '激活与临时缓冲（推理时相对较小）以及框架 / CUDA 上下文开销', '并发上限 ≈（总显存 − 权重 − 预留）/ 每请求 KV Cache', '减小 KV Cache 的手段：GQA、KV 量化、PagedAttention 减少碎片'],
    explanation: 'vLLM 论文指出 KV Cache 管理不当（碎片、过度预留）会严重限制 batch 大小与吞吐。',
    source: VLLM },
  { id: 'q-03-m1-4-c', pointId: '03-M1.4', type: 'choice',
    question: 'LLM.int8() 是怎样在 8-bit 推理中保持大模型精度的？',
    options: ['所有权重统一用 int8', '向量级量化，并把少数含离群值的特征维单独用 16 位矩阵乘处理（混合精度分解）', '只量化 embedding', '训练时加噪声'],
    answer: 1,
    explanation: '论文发现大模型中出现系统性的离群特征，于是对超过阈值的维度用 FP16 计算，其余 99.9% 以上的值用 int8，显存约减半且几乎无损。',
    source: INT8 },

  // ---------- 03-M2.1 vLLM 与 PagedAttention ----------
  { id: 'q-03-m2-1-a', pointId: '03-M2.1', type: 'choice',
    question: 'PagedAttention 借鉴了操作系统的什么思想？',
    options: ['进程调度', '虚拟内存与分页：把 KV Cache 切成固定大小的块，逻辑上连续、物理上可不连续存放', '文件系统日志', '中断处理'],
    answer: 1,
    explanation: 'vLLM 论文：受虚拟内存和分页启发，用块表把逻辑块映射到物理块，按需分配，几乎消除外部碎片，只有每个序列最后一个块存在少量内部碎片。',
    source: VLLM },
  { id: 'q-03-m2-1-b', pointId: '03-M2.1', type: 'choice',
    question: '在并行采样 / beam search 中，vLLM 如何减少 KV Cache 的重复占用？',
    options: ['每个候选各自复制完整缓存', '多个序列共享 prompt 等相同前缀的物理块，用引用计数 + 写时复制（copy-on-write）', '禁止并行采样', '把缓存放到 CPU'],
    answer: 1,
    explanation: '块级共享配合引用计数，只有在某序列要修改共享块时才复制，显著降低多序列解码的显存。',
    source: VLLM },
  { id: 'q-03-m2-1-c', pointId: '03-M2.1', type: 'short',
    question: '传统推理系统的 KV Cache 管理有什么问题？vLLM 带来了什么效果？',
    keyPoints: ['传统做法按最大长度为每个请求预留连续显存，造成预留浪费', '内部碎片与外部碎片使实际利用率很低', 'PagedAttention 按块按需分配，KV Cache 浪费接近于零', '支持请求内与请求间的块共享', '论文报告在相同延迟下吞吐比 FasterTransformer、Orca 等提升 2–4 倍'],
    explanation: '以上出自 vLLM 论文摘要与正文的问题分析。',
    source: VLLM },

  // ---------- 03-M3.1 量化基础 ----------
  { id: 'q-03-m3-1-a', pointId: '03-M3.1', type: 'choice',
    question: '在仿射量化 r = S·(q − Z) 中，对称量化与非对称量化的区别是？',
    options: ['对称量化 Z = 0，范围关于 0 对称；非对称量化用零点 Z 适配偏移的分布（如 ReLU 后的激活）', '对称量化不需要缩放 S', '非对称量化只能用于权重', '两者没有区别'],
    answer: 0,
    explanation: 'Jacob 等的量化方案用 scale S 与 zero-point Z 把实数映射到整数并保证 0 可被精确表示。对称量化固定 Z = 0，计算更简单；非对称量化对非零中心的分布更省码值。',
    source: INTQ },
  { id: 'q-03-m3-1-b', pointId: '03-M3.1', type: 'code',
    question: '用 NumPy 实现逐张量对称 INT8 量化与反量化：scale = max|x| / 127，q = clip(round(x / scale), −127, 127)。',
    reference: `import numpy as np

def quantize_sym_int8(x):
    scale = np.abs(x).max() / 127.0
    if scale == 0:
        scale = 1.0
    q = np.clip(np.round(x / scale), -127, 127).astype(np.int8)
    return q, scale

def dequantize(q, scale):
    return q.astype(np.float32) * scale`,
    tests: `x = np.random.randn(1000).astype(np.float32)
q, s = quantize_sym_int8(x)
assert q.dtype == np.int8 and q.max() <= 127 and q.min() >= -127
err = np.abs(dequantize(q, s) - x).max()
assert err <= s / 2 + 1e-6          # 舍入误差不超过半个量化步长
assert quantize_sym_int8(np.zeros(4))[0].tolist() == [0, 0, 0, 0]`,
    explanation: '最大误差为 scale/2。离群值会拉大 max|x|、让其余值的分辨率变差，这正是 LLM.int8()、SmoothQuant、AWQ 等方法要解决的问题；逐通道 / 分组量化可以缓解。',
    source: INTQ },
  { id: 'q-03-m3-1-c', pointId: '03-M3.1', type: 'short',
    question: '比较 PTQ 与 QAT，并说明 LLM 量化为什么多用 PTQ。',
    keyPoints: ['PTQ（训练后量化）：训练完成后用少量校准数据确定量化参数，无需重新训练', 'QAT（量化感知训练）：训练中模拟量化（伪量化 + 直通估计）让模型适应量化误差，精度通常更好', 'QAT 需要完整训练流程与算力，对百亿参数的 LLM 成本很高', '因此 LLM 多用 PTQ（GPTQ、AWQ、SmoothQuant 等）', '粒度选择：逐张量 / 逐通道 / 分组（group-wise）影响精度与开销'],
    explanation: 'Jacob 等提出的量化感知训练（模拟量化）是 QAT 的经典方案；GPTQ 摘要强调其为 one-shot 训练后量化，可在数小时内完成 175B 模型。',
    source: INTQ },

  // ---------- 03-M3.2 GPTQ / AWQ / SmoothQuant / GGUF ----------
  { id: 'q-03-m3-2-a', pointId: '03-M3.2', type: 'choice',
    question: 'GPTQ 的核心方法与效果是？',
    options: ['量化感知训练', '基于近似二阶信息（Hessian）的逐层 one-shot 权重量化，约 4 个 GPU 小时可把 175B 模型量化到 3–4 bit', '只量化激活', '剪掉一半权重'],
    answer: 1,
    explanation: '摘要：one-shot weight quantization method based on approximate second-order information，可在约四个 GPU 小时内把 175B 模型量化到每权重 3 或 4 bit，精度损失很小。',
    source: GPTQP },
  { id: 'q-03-m3-2-b', pointId: '03-M3.2', type: 'choice',
    question: 'SmoothQuant 是如何实现 W8A8 量化的？',
    options: ['只量化权重', '用数学等价的逐通道缩放，把激活中的离群值「迁移」到权重上，使激活和权重都易于 8-bit 量化', '训练一个新模型', '把激活转成 FP32'],
    answer: 1,
    explanation: '摘要：权重容易量化而激活不容易，SmoothQuant 离线地把量化难度从激活迁移到权重，从而对 LLM 的权重和激活都做 INT8 量化。',
    source: SMOOTH },
  { id: 'q-03-m3-2-c', pointId: '03-M3.2', type: 'short',
    question: '说明 AWQ 的核心观察与做法，并解释 GGUF 是什么。',
    keyPoints: ['AWQ 观察：权重并非同等重要，只保护约 1% 的显著权重就能大幅降低量化误差', '显著权重按激活幅度（而非权重幅度）挑选', '做法：对显著通道做逐通道缩放而不是混合精度，对硬件友好', 'AWQ 不依赖反向传播或重建，对校准集过拟合风险小', 'GGUF：ggml / llama.cpp 使用的单文件模型格式，包含张量与元数据，便于加载与本地推理，支持多种量化类型'],
    explanation: 'AWQ 要点出自论文摘要；GGUF 的定义见 ggml 官方文档：一种用于存储 GGML 推理模型的二进制文件格式。',
    source: AWQP, extraSources: [GGUF] },

  // ---------- 03-M4.1 显存构成估算（训练） ----------
  { id: 'q-03-m4-1-a', pointId: '03-M4.1', type: 'choice',
    question: '按 ZeRO 论文的分析，用 Adam + 混合精度训练参数量为 Ψ 的模型，模型状态（不含激活）约占多少字节？',
    options: ['2Ψ', '4Ψ', '16Ψ', '32Ψ'],
    answer: 2,
    explanation: 'FP16 参数 2Ψ + FP16 梯度 2Ψ + 优化器状态 12Ψ（FP32 主参数、动量、方差各 4Ψ）= 16Ψ。7.5B 模型就是约 120 GB。',
    source: ZERO },
  { id: 'q-03-m4-1-b', pointId: '03-M4.1', type: 'code',
    question: '写函数估算训练时每张卡上的模型状态显存（GB），参数：参数量 psi、数据并行度 nd、ZeRO 阶段 stage（0–3），按 ZeRO 论文的 2 + 2 + 12 字节划分。',
    reference: `def zero_model_state_gb(psi, nd=1, stage=0):
    p, g, o = 2 * psi, 2 * psi, 12 * psi     # 参数 / 梯度 / 优化器状态（字节）
    if stage >= 1: o /= nd
    if stage >= 2: g /= nd
    if stage >= 3: p /= nd
    return (p + g + o) / 1e9`,
    tests: `psi = 7.5e9
assert round(zero_model_state_gb(psi)) == 120               # 16Ψ
assert round(zero_model_state_gb(psi, 64, 1), 1) == 31.4    # 4Ψ + 12Ψ/Nd
assert round(zero_model_state_gb(psi, 64, 2), 1) == 16.6    # 2Ψ + 14Ψ/Nd
assert round(zero_model_state_gb(psi, 64, 3), 2) == 1.88    # 16Ψ/Nd`,
    explanation: '这四个数字正是 ZeRO 论文 Figure 1 中 7.5B 模型、Nd = 64 的示例。激活显存需另外估算。',
    source: ZERO },
  { id: 'q-03-m4-1-c', pointId: '03-M4.1', type: 'choice',
    question: '激活重计算（activation checkpointing）用什么换什么？',
    options: ['用显存换计算速度', '前向时只保存部分激活，反向时重新计算其余激活：用额外计算换显存', '用精度换显存', '用通信换计算'],
    answer: 1,
    explanation: 'Korthikanti 等指出全量重计算会带来明显的额外计算开销，并提出序列并行 + 选择性重计算，只重算显存占用大但计算便宜的部分（如注意力的 softmax / dropout）。',
    source: RECOMP },

  // ---------- 03-M4.2 并行策略 ----------
  { id: 'q-03-m4-2-a', pointId: '03-M4.2', type: 'choice',
    question: 'Megatron-LM 的张量并行如何切分 Transformer 的 MLP（两个线性层）？',
    options: ['两个线性层都按行切', '第一层按列切、第二层按行切，前向只需在 MLP 输出处做一次 all-reduce', '只复制，不切分', '按层切到不同 GPU'],
    answer: 1,
    explanation: '第一层列切后每张卡得到部分隐藏维，GeLU 可独立计算；第二层行切后各卡得到部分和，一次 all-reduce 汇总。注意力按头切分同理。',
    source: MEGATRON },
  { id: 'q-03-m4-2-b', pointId: '03-M4.2', type: 'choice',
    question: 'GPipe 式流水线并行为什么要把 mini-batch 切成多个 micro-batch？',
    options: ['为了减少参数量', '让不同阶段可以同时处理不同 micro-batch，减少流水线气泡（设备空闲时间）', '为了做数据增强', '为了避免梯度累积'],
    answer: 1,
    explanation: 'GPipe 把模型按层切到多个设备，再把 batch 拆成 micro-batch 依次流过各阶段，所有 micro-batch 的梯度累积后同步更新；micro-batch 越多，气泡占比越小。',
    source: GPIPE },
  { id: 'q-03-m4-2-c', pointId: '03-M4.2', type: 'short',
    question: '概述 DP、TP、PP、EP、SP 五种并行各切什么、通信特点是什么。',
    keyPoints: ['DP：复制模型、切数据，反向后 all-reduce 梯度（ZeRO / FSDP 进一步切模型状态）', 'TP：层内切权重矩阵（如 Megatron 的列切 / 行切），每层都有集合通信，通常放在节点内高带宽互联上', 'PP：按层切成多个阶段，阶段间点对点传激活，需 micro-batch 减少气泡', 'EP：MoE 的不同专家放到不同设备，token 经 all-to-all 分发与汇聚', 'SP：沿序列维切分 LayerNorm、dropout 等 TP 未覆盖的部分，降低激活显存'],
    explanation: '大规模训练通常组合多种并行（如 TP 在节点内、PP 跨节点、DP 最外层）。SP 的定义见 Korthikanti 等。',
    source: RECOMP },

  // ---------- 03-M4.3 ZeRO 与 FSDP ----------
  { id: 'q-03-m4-3-a', pointId: '03-M4.3', type: 'choice',
    question: 'ZeRO 三个阶段依次在数据并行进程间切分了什么？',
    options: ['Stage 1 切参数、Stage 2 切梯度、Stage 3 切优化器状态', 'Stage 1 切优化器状态、Stage 2 再切梯度、Stage 3 再切参数', '三个阶段都只切激活', 'Stage 1 切激活、Stage 2 切参数、Stage 3 切数据'],
    answer: 1,
    explanation: 'ZeRO-DP 的 P_os、P_os+g、P_os+g+p：逐级切分优化器状态、梯度、参数。切参数时需在前向 / 反向按需 all-gather。',
    source: ZERO },
  { id: 'q-03-m4-3-b', pointId: '03-M4.3', type: 'short',
    question: '说明 ZeRO-3 / FSDP 的工作流程与通信代价。',
    keyPoints: ['每个进程只常驻自己那份参数、梯度与优化器状态分片', '前向计算某层（单元）前 all-gather 该层完整参数，用完释放', '反向时再次 all-gather 参数，计算梯度后 reduce-scatter，各进程只保留自己分片的梯度', '各进程用本地梯度分片更新本地参数分片', '通信量约为标准数据并行的 1.5 倍，可通过与计算重叠、预取下一层参数来隐藏'],
    explanation: 'ZeRO 论文分析了 P_os+g+p 的通信量约为基线 DP 的 1.5 倍；PyTorch FSDP 论文介绍了其工业级实现（分片单元、预取与通信计算重叠）。',
    source: FSDP },
  { id: 'q-03-m4-3-c', pointId: '03-M4.3', type: 'choice',
    question: '数据并行度 Nd = 64 时，ZeRO Stage 3 下每卡模型状态显存约为全量的多少？',
    options: ['1/2', '1/4', '1/64', '不变'],
    answer: 2,
    explanation: 'Stage 3 下参数、梯度、优化器状态全部切分，每卡为 16Ψ/Nd，即 1/64；代价是更多的 all-gather 通信。',
    source: ZERO },

  // ---------- 03-M4.4 混合精度 ----------
  { id: 'q-03-m4-4-a', pointId: '03-M4.4', type: 'short',
    question: 'Micikevicius 等提出的混合精度训练包含哪三项关键技术？',
    keyPoints: ['保留一份 FP32 主权重，用 FP16 做前向 / 反向，更新累加到 FP32 主权重上', 'loss scaling：放大损失防止小梯度在 FP16 中下溢', '矩阵乘用 FP16 输入、FP32 累加，再写回', '小的权重更新量若直接加到 FP16 权重会因精度不足被舍去，这是需要 FP32 主权重的原因'],
    explanation: '三项技术均出自该论文；它们让 FP16 训练能匹配 FP32 精度，同时显存与带宽减半。',
    source: MIXPREC },
  { id: 'q-03-m4-4-b', pointId: '03-M4.4', type: 'choice',
    question: 'FP16 与 BF16 的位数分配分别是（符号 / 指数 / 尾数）？',
    options: ['FP16：1/5/10；BF16：1/8/7', 'FP16：1/8/7；BF16：1/5/10', '两者都是 1/8/7', '两者都是 1/5/10'],
    answer: 0,
    explanation: 'BF16 用 8 位指数，动态范围与 FP32 一致、但精度较低；FP16 精度更高但范围窄，容易上溢 / 下溢，因此 FP16 通常需要 loss scaling。',
    source: BF16 },
  { id: 'q-03-m4-4-c', pointId: '03-M4.4', type: 'choice',
    question: '使用 PyTorch autocast 混合精度时，下列说法正确的是？',
    options: ['所有算子都会被转成低精度', 'autocast 按算子选择精度：矩阵乘、卷积等用低精度，对精度敏感的归约等算子保持 FP32', 'autocast 只在推理时生效', '用了 autocast 就不能用 GradScaler'],
    answer: 1,
    explanation: 'PyTorch AMP 文档：autocast 为每个算子自动选择精度（如 linear、matmul 用 float16，softmax、各类归约与损失函数等倾向 float32）；FP16 训练通常配合 GradScaler 使用。',
    source: AMPDOC },
  // ---------- 04-M1.1 Agent 定义与四要素 ----------
  { id: 'q-04-m1-1-a', pointId: '04-M1.1', type: 'choice',
    question: 'Lilian Weng 在 LLM Powered Autonomous Agents 中，把 LLM 作为大脑之外的 Agent 关键组件归纳为哪三项？',
    options: ['规划（Planning）、记忆（Memory）、工具使用（Tool use）', '训练、推理、部署', '感知、渲染、存储', '编码器、解码器、注意力'],
    answer: 0,
    explanation: '文中把 LLM 作为 Agent 的大脑，配合三大组件：规划（任务分解与自我反思）、记忆（短期 / 长期）、工具使用（调用外部 API）。连同 LLM 本身，就是常说的「四要素」。',
    source: WENG },
  { id: 'q-04-m1-1-b', pointId: '04-M1.1', type: 'choice',
    question: 'Anthropic 的 Building effective agents 如何区分 workflow 与 agent？',
    options: ['两者没有区别', 'workflow 通过预先定义的代码路径编排 LLM 与工具；agent 由 LLM 动态决定自己的流程与工具使用', 'workflow 用多个模型，agent 只用一个模型', 'agent 不能调用工具'],
    answer: 1,
    explanation: '原文：Workflows are systems where LLMs and tools are orchestrated through predefined code paths. Agents ... dynamically direct their own processes and tool usage。文章建议优先用最简单的方案，确有需要再引入 agent。',
    source: BEA },
  { id: 'q-04-m1-1-c', pointId: '04-M1.1', type: 'short',
    question: '用「大脑—感知—行动」框架说明 LLM Agent 的构成，并说明它与普通对话机器人的区别。',
    keyPoints: ['大脑：LLM 负责理解、推理、规划与决策，并依托记忆', '感知：接收文本以及图像、网页、环境状态等多模态输入', '行动：调用工具 / API、操作环境，产生对外部世界的影响', '闭环：行动结果作为新观察反馈给大脑，循环直至完成目标', '区别：普通对话只生成回复；Agent 面向目标，多步自主决策并与环境交互'],
    explanation: 'Xi 等的综述提出 brain、perception、action 三部分构成的 LLM Agent 通用框架。',
    source: AGSURVEY },

  // ---------- 04-M1.2 CoT 与 Self-Consistency ----------
  { id: 'q-04-m1-2-a', pointId: '04-M1.2', type: 'choice',
    question: 'Self-Consistency 是怎样改进思维链（CoT）推理的？',
    options: ['用更大的模型', '采样多条不同的推理路径，再对最终答案做多数表决（边缘化推理路径），替代贪心解码', '让模型自己检查语法', '把推理过程删掉'],
    answer: 1,
    explanation: '摘要：先采样一组多样的推理路径，再选出最一致的答案；直觉是复杂问题通常有多种思路通向唯一正确答案。论文报告在 GSM8K 上提升 17.9%。',
    source: SC },
  { id: 'q-04-m1-2-b', pointId: '04-M1.2', type: 'choice',
    question: 'Kojima 等提出的 Zero-shot-CoT 做法是？',
    options: ['提供大量人工示例', '在问题后加上「Let us think step by step」之类的提示，不给示例即可引出逐步推理', '微调模型', '使用检索'],
    answer: 1,
    explanation: '论文标题为 Large Language Models are Zero-Shot Reasoners：只需在答案前加 Let’s think step by step 就能显著提升算术、符号推理等任务；Wei 等原始 CoT 则是少样本示例中带推理过程。',
    source: ZSCOT },
  { id: 'q-04-m1-2-c', pointId: '04-M1.2', type: 'code',
    question: '实现 Self-Consistency 的聚合步骤：输入多条采样的完整回答文本，抽取每条最后出现的数字作为答案，返回出现次数最多的答案（并列时取最先出现的）。',
    reference: `import re
from collections import Counter

def self_consistency(samples):
    answers = []
    for s in samples:
        nums = re.findall(r'-?\\d+(?:\\.\\d+)?', s)
        if nums:
            answers.append(nums[-1])
    if not answers:
        return None
    counts = Counter(answers)
    best = max(counts.values())
    return next(a for a in answers if counts[a] == best)   # 并列取最先出现`,
    tests: `outs = ['先算 3+4=7，再乘 2 得 14', '答案是 14', '3*2+4 = 10', '所以结果为 14。']
assert self_consistency(outs) == '14'
assert self_consistency(['a 1', 'b 2']) == '1'
assert self_consistency(['没有数字']) is None`,
    explanation: '论文的聚合方式就是对最终答案做多数表决（也讨论了按概率加权，效果相近）。答案抽取规则需与任务格式匹配。',
    source: SC },

  // ---------- 04-M1.3 ReAct ----------
  { id: 'q-04-m1-3-a', pointId: '04-M1.3', type: 'choice',
    question: 'ReAct 的轨迹由哪几类步骤交替构成？',
    options: ['Thought（推理）、Action（行动）、Observation（观察）', 'Plan、Code、Test', 'Encode、Decode', 'Query、Key、Value'],
    answer: 0,
    explanation: 'ReAct 让模型交替生成推理轨迹与具体行动：推理用来制定和更新计划、处理异常，行动（如调用 Wikipedia API）从外部获取信息作为观察。',
    source: REACT },
  { id: 'q-04-m1-3-b', pointId: '04-M1.3', type: 'short',
    question: 'ReAct 相比纯 CoT 和纯行动（Act-only）各有什么优势？',
    keyPoints: ['相比纯 CoT：能通过行动从外部获取信息，缓解只靠参数知识带来的幻觉和错误传播', '相比纯 Act：推理轨迹帮助分解目标、跟踪进度、处理异常', '轨迹可读，便于人类理解与诊断（可解释性）', '论文在 HotpotQA / FEVER 上用 Wikipedia API，在 ALFWorld / WebShop 上做交互决策', '论文也提出 ReAct 与 CoT-SC 结合，按条件切换'],
    explanation: '以上要点均出自 ReAct 论文的摘要与实验部分。',
    source: REACT },
  { id: 'q-04-m1-3-c', pointId: '04-M1.3', type: 'choice',
    question: 'Reflexion 在 ReAct 类 Agent 之上增加了什么？',
    options: ['更新模型权重的强化学习', '用语言形式的反思：根据任务反馈生成自我反思文本，存入记忆，供后续尝试参考（不更新权重）', '更大的上下文窗口', '多模态输入'],
    answer: 1,
    explanation: 'Reflexion 称为 verbal reinforcement learning：不改权重，而是把对失败的语言反思保存在情节记忆缓冲区里，指导下一次尝试。',
    source: REFLEXION },

  // ---------- 04-M1.7 长程任务与错误累积 ----------
  { id: 'q-04-m1-7-a', pointId: '04-M1.7', type: 'choice',
    question: 'METR 的研究用什么指标衡量 AI 完成长任务的能力？发现了什么趋势？',
    options: ['token 吞吐量；每年翻倍', '50% 时间跨度（模型有 50% 成功率能完成的任务，人类专家需花多长时间）；自 2019 年起约每 7 个月翻一番', '参数量；每月翻倍', '基准得分；停滞不前'],
    answer: 1,
    explanation: '论文摘要：Claude 3.7 Sonnet 等前沿模型的 50% 时间跨度约 50 分钟，且自 2019 年以来约每七个月翻倍（2024 年可能加速）。',
    source: METR },
  { id: 'q-04-m1-7-b', pointId: '04-M1.7', type: 'choice',
    question: '若 Agent 每一步独立成功的概率为 0.95，一个需要 20 步全部正确的任务成功率约为？',
    options: ['95%', '约 36%', '约 80%', '约 5%'],
    answer: 1,
    explanation: '0.95²⁰ ≈ 0.358。错误累积让长程任务成功率随步数指数下降；METR 也指出时间跨度的增长主要来自可靠性提升与从错误中恢复的能力。',
    source: METR },
  { id: 'q-04-m1-7-c', pointId: '04-M1.7', type: 'short',
    question: '长程任务中如何减轻错误累积？',
    keyPoints: ['任务分解与检查点：拆成可验证的子目标，每步验证后再继续', '提供可执行的校验（测试、断言、截图对比），及早发现偏差', '反思与重试：失败时分析原因并回退到最近的正确状态', '上下文管理：压缩 / 记笔记，避免关键信息被淹没或遗忘', '人类在关键节点审批，或把高风险步骤交给确定性代码'],
    explanation: 'METR 指出时间跨度的提升主要来自更高的可靠性和适应错误的能力；Anthropic 的上下文工程文章也推荐 compaction、结构化笔记与子 Agent 来支撑长程任务。',
    source: CTXENG },

  // ---------- 04-M1.8 Computer Use / GUI / Browser Agent ----------
  { id: 'q-04-m1-8-a', pointId: '04-M1.8', type: 'choice',
    question: 'OSWorld 基准的特点是？',
    options: ['只评测纯文本问答', '在真实计算机环境（Ubuntu / Windows / macOS）中执行开放式任务，用基于执行结果的脚本评测；发布时人类成功率约 72%，最好的模型约 12%', '只评测网页购物', '只评测代码补全'],
    answer: 1,
    explanation: 'OSWorld 含 369 个跨真实应用与操作系统的任务；论文报告人类可完成 72.36%，当时最佳模型只有 12.24%，主要困难在 GUI grounding 与操作知识。',
    source: OSWORLD },
  { id: 'q-04-m1-8-b', pointId: '04-M1.8', type: 'choice',
    question: 'WebArena 提供的是什么样的评测环境？',
    options: ['静态网页截图问答', '可自托管的真实功能网站（电商、论坛、协作开发、内容管理等），Agent 需通过浏览器操作完成任务，按功能正确性评测', '纯 API 调用环境', '离线文本分类'],
    answer: 1,
    explanation: 'WebArena 搭建了四类常见领域的可交互网站及地图、维基等工具，任务以功能正确性判定；论文中最佳 GPT-4 Agent 端到端成功率仅 14.41%，人类为 78.24%。',
    source: WEBARENA },
  { id: 'q-04-m1-8-c', pointId: '04-M1.8', type: 'short',
    question: 'GUI / Browser Agent 获取界面状态有哪几种方式？各有什么取舍？',
    keyPoints: ['截图（视觉）：通用、贴近人类，但需要精确的坐标定位（grounding），token 开销大', '可访问性树 / DOM：结构化、可直接引用元素，但可能冗长或缺失信息', 'Set-of-Mark 等标注截图：在截图上给可交互元素编号，结合两者优点', '动作空间：点击、输入、滚动、快捷键等底层操作，或更高层的元素操作', '安全：真实环境中的操作可能不可逆，需要沙箱与人工确认'],
    explanation: 'OSWorld 论文对比了截图、可访问性树、截图 + 可访问性树和 Set-of-Mark 四种输入设置。',
    source: OSWORLD },

  // ---------- 04-M2.1 Function Calling 原理 ----------
  { id: 'q-04-m2-1-a', pointId: '04-M2.1', type: 'choice',
    question: '在 Function Calling 中，谁真正执行函数？',
    options: ['模型在服务器端直接执行', '模型只输出要调用的函数名与参数（结构化 JSON），由应用代码执行，再把结果作为新消息回传给模型', '浏览器自动执行', '函数不会被执行'],
    answer: 1,
    explanation: 'OpenAI 文档描述的流程：在请求中提供工具定义 → 模型返回 tool call → 应用执行代码 → 把工具输出发回模型 → 模型给出最终回复或继续调用。',
    source: OAI_FC },
  { id: 'q-04-m2-1-b', pointId: '04-M2.1', type: 'code',
    question: '写一个工具调用分发器：给定工具注册表 {name: (func, required_params)} 和模型返回的调用 {"name":..., "arguments": JSON 字符串}，校验工具存在、参数可解析且必填参数齐全，执行并返回 {"ok": bool, "result" 或 "error"}。',
    reference: `import json

def dispatch(registry, call):
    name = call.get('name')
    if name not in registry:
        return {'ok': False, 'error': f'unknown tool: {name}'}
    func, required = registry[name]
    try:
        args = json.loads(call.get('arguments') or '{}')
    except json.JSONDecodeError as e:
        return {'ok': False, 'error': f'bad arguments: {e}'}
    missing = [p for p in required if p not in args]
    if missing:
        return {'ok': False, 'error': f'missing params: {missing}'}
    try:
        return {'ok': True, 'result': func(**args)}
    except Exception as e:                 # 工具异常也要回传给模型，而不是让程序崩溃
        return {'ok': False, 'error': repr(e)}`,
    tests: `reg = {'add': (lambda a, b: a + b, ['a', 'b'])}
assert dispatch(reg, {'name': 'add', 'arguments': '{"a": 1, "b": 2}'}) == {'ok': True, 'result': 3}
assert not dispatch(reg, {'name': 'mul', 'arguments': '{}'})['ok']
assert 'missing' in dispatch(reg, {'name': 'add', 'arguments': '{"a": 1}'})['error']
assert 'bad arguments' in dispatch(reg, {'name': 'add', 'arguments': '{a:1'})['error']`,
    explanation: '模型生成的参数可能不合法，执行侧必须校验；错误信息应作为工具结果返回给模型，让它自行修正后重试。',
    source: OAI_FC },
  { id: 'q-04-m2-1-c', pointId: '04-M2.1', type: 'choice',
    question: 'Toolformer 是怎样让模型学会使用工具的？',
    options: ['人工标注大量工具调用数据', '自监督：让模型在文本中采样候选 API 调用并执行，只保留能降低后续 token 预测损失的调用，再用这些数据微调', '强化学习加人类反馈', '规则模板'],
    answer: 1,
    explanation: 'Toolformer 每个 API 只需少量示范，模型自己决定调用哪个 API、何时调用、传什么参数，并以「是否帮助预测后续文本」作为筛选标准。',
    source: TOOLFORMER },

  // ---------- 04-M2.3 MCP ----------
  { id: 'q-04-m2-3-a', pointId: '04-M2.3', type: 'choice',
    question: '按 MCP 官方架构文档，Host、Client、Server 的关系是？',
    options: ['一个 Client 连接多个 Host', 'Host 是 AI 应用，内部为每个 MCP Server 维护一个对应的 MCP Client（一对一连接）', 'Server 直接调用模型', '三者是同一个进程'],
    answer: 1,
    explanation: '文档：MCP Host 是协调管理一个或多个 MCP Client 的 AI 应用；每个 MCP Client 与一个 MCP Server 保持连接；Server 向 Client 提供上下文。',
    source: MCP_ARCH },
  { id: 'q-04-m2-3-b', pointId: '04-M2.3', type: 'choice',
    question: 'MCP Server 可以暴露的三类核心原语是？',
    options: ['Tools、Resources、Prompts', 'Models、Datasets、Metrics', 'Agents、Skills、Memories', 'Files、Sockets、Threads'],
    answer: 0,
    explanation: 'Tools：可执行函数（文件操作、API 调用、数据库查询）；Resources：提供上下文的数据源；Prompts：可复用的交互模板（系统提示、少样本示例）。',
    source: MCP_ARCH },
  { id: 'q-04-m2-3-c', pointId: '04-M2.3', type: 'short',
    question: '说明 MCP 的分层结构（数据层 / 传输层）与常见传输方式。',
    keyPoints: ['数据层：基于 JSON-RPC 2.0 的协议，定义消息结构、能力 / 版本发现与各类原语', '传输层：负责连接与消息传输、认证，同一 JSON-RPC 格式可跑在不同传输上', 'STDIO 传输：本地进程间通信，本地 Server 通常只服务一个 Client', 'Streamable HTTP 传输：远程 Server，通常服务多个 Client，推荐用 OAuth 获取认证令牌', '客户端也可暴露原语（如 elicitation：Server 向用户请求补充信息或确认）'],
    explanation: '以上均出自 MCP 官方 Architecture 文档。MCP 规范迭代较快，具体原语与弃用情况以当前版本文档为准。',
    source: MCP_ARCH },

  // ---------- 04-M3.1 短期记忆与上下文管理 ----------
  { id: 'q-04-m3-1-a', pointId: '04-M3.1', type: 'choice',
    question: 'Anthropic 所说的「context rot」指什么？',
    options: ['模型权重随时间退化', '上下文中的 token 越多，模型准确回忆其中信息的能力越下降', '上下文被恶意篡改', '缓存过期'],
    answer: 1,
    explanation: '文章引用 needle-in-a-haystack 类研究：as the number of tokens in the context window increases, the model’s ability to accurately recall information from that context decreases，因此上下文是有限且边际收益递减的资源。',
    source: CTXENG },
  { id: 'q-04-m3-1-b', pointId: '04-M3.1', type: 'code',
    question: '实现对话历史裁剪：保留 system 消息与最近的消息，使总 token 数不超过预算（token 数用 len(content)//4 近似），返回裁剪后的消息列表（保持原顺序）。',
    reference: `def trim_history(messages, budget, count=lambda m: len(m['content']) // 4):
    system = [m for m in messages if m['role'] == 'system']
    rest = [m for m in messages if m['role'] != 'system']
    used = sum(count(m) for m in system)
    kept = []
    for m in reversed(rest):                 # 从最新往前保留
        c = count(m)
        if used + c > budget:
            break
        kept.append(m)
        used += c
    return system + list(reversed(kept))`,
    tests: `msgs = [{'role': 'system', 'content': 's' * 40}] + [
    {'role': 'user' if i % 2 == 0 else 'assistant', 'content': str(i) * 40} for i in range(6)]
out = trim_history(msgs, budget=40)          # system 10 + 每条 10 → 保留最近 3 条
assert out[0]['role'] == 'system'
assert [m['content'][0] for m in out[1:]] == ['3', '4', '5']
assert sum(len(m['content']) // 4 for m in out) <= 40`,
    explanation: '滑动窗口是最简单的短期记忆策略；实际系统还会把被裁掉的部分摘要化（compaction），并注意不要把工具调用与其结果拆开。',
    source: CTXENG },
  { id: 'q-04-m3-1-c', pointId: '04-M3.1', type: 'short',
    question: '列举 Anthropic 推荐的长程 Agent 上下文管理技术，并说明各自做法。',
    keyPoints: ['Compaction：对接近上限的对话做摘要，用摘要开启新的上下文窗口', '清理旧工具结果：已处理过的工具调用原始输出可以安全移除', '结构化笔记（agentic memory）：定期把进度与要点写到上下文之外，需要时再读回', '子 Agent 架构：子 Agent 在干净的上下文中完成专门任务，只返回精简结果', 'Just-in-time 检索：只保存文件路径、查询等轻量引用，运行时再按需加载'],
    explanation: '以上均出自 Effective context engineering for AI agents。',
    source: CTXENG },

  // ---------- 04-M3.2 长期记忆 ----------
  { id: 'q-04-m3-2-a', pointId: '04-M3.2', type: 'choice',
    question: 'Generative Agents（斯坦福小镇）检索记忆时综合了哪三个因素打分？',
    options: ['时效性（recency）、重要性（importance）、相关性（relevance）', '长度、语言、格式', '作者、时间、地点', '频率、词性、情感'],
    answer: 0,
    explanation: '记忆流中的每条记录按 recency（指数衰减）、importance（LLM 打分）和 relevance（与当前情境的嵌入相似度）加权求和，取高分记忆放入上下文；此外还有 reflection 把记忆归纳成更高层的认识。',
    source: GENAGENTS },
  { id: 'q-04-m3-2-b', pointId: '04-M3.2', type: 'short',
    question: '设计长期记忆时需要处理哪些环节？',
    keyPoints: ['写入 / 抽取：从对话中提取值得长期保存的事实、偏好与事件，而不是存全部原文', '存储与索引：向量库、键值或图结构，附带时间戳与来源', '检索：按相关性、时效性、重要性综合召回', '更新与冲突消解：新信息与旧记忆矛盾时更新、合并或删除', '遗忘：衰减或淘汰过时、低价值记忆，控制规模与隐私风险'],
    explanation: 'Mem0 把记忆管理概括为动态抽取、整合（consolidating）与检索显著信息；其更新阶段由 LLM 决定 ADD / UPDATE / DELETE / NOOP。',
    source: MEM0 },
  { id: 'q-04-m3-2-c', pointId: '04-M3.2', type: 'choice',
    question: 'Generative Agents 中的「reflection」是什么？',
    options: ['删除旧记忆', '定期把近期观察归纳成更高层、更抽象的推断，并作为新记忆写回记忆流', '把记忆翻译成英文', '人工审核记忆'],
    answer: 1,
    explanation: '论文中 Agent 会周期性地基于近期记忆提问并归纳出 reflection，这些高层认识同样参与检索，帮助 Agent 做出更一致的行为。',
    source: GENAGENTS },

  // ---------- 04-M3.3 记忆框架 ----------
  { id: 'q-04-m3-3-a', pointId: '04-M3.3', type: 'choice',
    question: 'MemGPT 借鉴了什么系统思想来突破上下文窗口限制？',
    options: ['数据库事务', '操作系统的分层内存与虚拟内存：在快（上下文）与慢（外部存储）存储间移动数据，并用中断管理控制流', '编译器优化', '分布式共识'],
    answer: 1,
    explanation: '摘要：virtual context management, a technique drawing inspiration from hierarchical memory systems in traditional operating systems。Letta 是 MemGPT 团队后续的开源框架。',
    source: MEMGPT },
  { id: 'q-04-m3-3-b', pointId: '04-M3.3', type: 'choice',
    question: 'Mem0 论文提出的方法在基础版之外还给出了什么增强变体？',
    options: ['基于图的记忆表示（Mem0 with graph memory），捕捉对话要素之间的关系', '更大的模型', '纯规则记忆', '无记忆版本'],
    answer: 0,
    explanation: '摘要：在动态抽取、整合、检索显著信息的基础上，进一步提出利用图结构记忆捕捉复杂关系的增强版，并在 LOCOMO 基准上与六类基线比较。',
    source: MEM0 },
  { id: 'q-04-m3-3-c', pointId: '04-M3.3', type: 'short',
    question: '对比 MemGPT / Letta、Mem0、MemOS 的设计思路。',
    keyPoints: ['MemGPT / Letta：把 LLM 当作操作系统，自主通过函数调用在主上下文与外部存储（archival / recall）之间换入换出', 'Mem0：面向生产的记忆层，从对话中抽取、整合、检索显著事实，可选图记忆', 'MemOS：把记忆作为一等系统资源统一调度，覆盖参数记忆、激活记忆与明文记忆', '共同点：都在有限上下文之外提供持久记忆并按需检索', '选型看重点：Agent 自主管理（MemGPT）/ 轻量接入（Mem0）/ 系统级统一管理（MemOS）'],
    explanation: 'MemOS 论文提出用 MemCube 统一封装明文、激活与参数三类记忆，并像操作系统一样调度。',
    source: MEMOS },
  // ---------- 04-M4.1 RAG 基础流程 ----------
  { id: 'q-04-m4-1-a', pointId: '04-M4.1', type: 'choice',
    question: 'Lewis 等 2020 年的 RAG 模型由哪两部分记忆组成？',
    options: ['参数记忆（预训练 seq2seq 生成器）与非参数记忆（维基百科稠密向量索引，用神经检索器访问）', '两个相同的 GPT 模型', '关系数据库与规则引擎', '只有检索器，没有生成器'],
    answer: 0,
    explanation: '论文把预训练 seq2seq 模型（BART）作为参数记忆，把维基百科的稠密向量索引作为非参数记忆，用预训练的神经检索器（DPR）访问，并提出 RAG-Sequence 与 RAG-Token 两种形式。',
    source: RAGP },
  { id: 'q-04-m4-1-b', pointId: '04-M4.1', type: 'short',
    question: '描述一个 Naive RAG 系统的完整流程，并指出各环节常见问题。',
    keyPoints: ['索引：文档解析、清洗、切块（chunking），用 embedding 模型向量化后写入向量库', '检索：把查询向量化，按相似度召回 top-k 片段', '生成：把检索片段与问题拼成提示，交给 LLM 生成答案并附出处', '检索侧问题：召回不准 / 不全、片段冗余或噪声', '生成侧问题：幻觉、未忠实于检索内容、上下文过长导致信息被忽略'],
    explanation: 'Gao 等的 RAG 综述把演进分为 Naive RAG、Advanced RAG、Modular RAG，并总结了 Naive RAG 在检索、生成与增强环节的不足。',
    source: RAGSURVEY },
  { id: 'q-04-m4-1-c', pointId: '04-M4.1', type: 'choice',
    question: 'DPR（Dense Passage Retrieval）的检索器结构是？',
    options: ['单个 cross-encoder 联合编码问题和段落', '双编码器：问题与段落分别用两个 BERT 编码，用向量内积衡量相关性，段落向量可离线预计算', 'BM25', '生成式检索'],
    answer: 1,
    explanation: 'DPR 用 dual-encoder，在问题-段落对上用 in-batch negatives 训练，在开放域问答的 top-20 召回上大幅超过 BM25。',
    source: DPR },

  // ---------- 04-M4.2 Chunking 策略 ----------
  { id: 'q-04-m4-2-a', pointId: '04-M4.2', type: 'choice',
    question: '切块大小对 RAG 有什么影响？',
    options: ['越大越好', '块太大引入噪声、稀释相关信息并占用上下文；块太小语义不完整、丢失上下文，需要在两者间权衡', '越小越好', '没有影响'],
    answer: 1,
    explanation: 'RAG 综述讨论了 chunk 大小的权衡：大块包含更多上下文但噪声多、处理成本高，小块噪声少但可能无法完整表达语义；常见做法还有块间重叠（滑动窗口）与小块检索、大块返回。',
    source: RAGSURVEY },
  { id: 'q-04-m4-2-b', pointId: '04-M4.2', type: 'code',
    question: '实现带重叠的固定长度切块：chunk(text, size, overlap) 返回字符串列表，相邻块重叠 overlap 个字符，最后一块可以更短。',
    reference: `def chunk(text, size=500, overlap=50):
    assert 0 <= overlap < size
    step = size - overlap
    out = []
    for start in range(0, len(text), step):
        out.append(text[start:start + size])
        if start + size >= len(text):
            break
    return out`,
    tests: `t = ''.join(chr(97 + i % 26) for i in range(1200))
cs = chunk(t, 500, 50)
assert len(cs) == 3 and all(len(c) <= 500 for c in cs)
assert cs[0][-50:] == cs[1][:50]                  # 相邻块重叠
assert cs[0] + ''.join(c[50:] for c in cs[1:]) == t  # 去重后可还原原文
assert chunk('abc', 10, 2) == ['abc']`,
    explanation: '重叠能避免关键句被切断在两块之间。实际系统常按段落 / 句子 / 标题等结构边界递归切分，再控制长度。',
    source: RAGSURVEY },
  { id: 'q-04-m4-2-c', pointId: '04-M4.2', type: 'short',
    question: '比较几种常见的切块策略及其适用场景。',
    keyPoints: ['固定长度 + 重叠：简单通用，但可能切断语义', '按结构切分：按标题、段落、句子、代码函数等边界，保持语义完整', '递归切分：先按大边界切，超长再按更小边界切，兼顾结构与长度', '语义切分：按相邻句子嵌入相似度的变化点切分', '小块检索、大块返回（small-to-big）/ 给块附加标题等元数据，提升召回与上下文完整性'],
    explanation: 'RAG 综述在索引优化部分讨论了切块策略、元数据附加与小到大检索等方法。',
    source: RAGSURVEY },

  // ---------- 04-M4.3 Embedding 与向量检索 ----------
  { id: 'q-04-m4-3-a', pointId: '04-M4.3', type: 'choice',
    question: 'HNSW 的核心结构是？',
    options: ['哈希表', '多层邻近图：上层稀疏、下层稠密，查询从顶层入口贪心搜索逐层下沉，复杂度约为对数级', '倒排索引', 'B+ 树'],
    answer: 1,
    explanation: 'HNSW 构建分层的可导航小世界图，元素按指数衰减的概率分配到各层；查询从顶层开始贪心路由并逐层细化。',
    source: HNSW },
  { id: 'q-04-m4-3-b', pointId: '04-M4.3', type: 'code',
    question: '用 NumPy 实现余弦相似度 top-k 检索：输入查询向量 q (d,) 与文档矩阵 D (n, d)，返回相似度最高的 k 个下标（降序）与对应分数。',
    reference: `import numpy as np

def cosine_topk(q, D, k=5):
    qn = q / (np.linalg.norm(q) + 1e-12)
    Dn = D / (np.linalg.norm(D, axis=1, keepdims=True) + 1e-12)
    sims = Dn @ qn
    k = min(k, len(sims))
    idx = np.argpartition(-sims, k - 1)[:k]        # O(n) 选出前 k
    idx = idx[np.argsort(-sims[idx])]               # 再对 k 个排序
    return idx, sims[idx]`,
    tests: `rng = np.random.default_rng(0)
D = rng.normal(size=(100, 16)); q = D[42] * 3
idx, s = cosine_topk(q, D, 5)
assert idx[0] == 42 and abs(s[0] - 1) < 1e-9
assert np.all(np.diff(s) <= 0)
full = np.argsort(-(D @ q) / np.linalg.norm(D, axis=1))[:5]
assert set(idx) == set(full)`,
    explanation: '先归一化再做内积即余弦相似度；向量库里预先归一化后可直接用内积索引。大规模时用 HNSW / IVF-PQ 等近似最近邻替代暴力检索。',
    source: FAISS },
  { id: 'q-04-m4-3-c', pointId: '04-M4.3', type: 'short',
    question: '比较暴力检索、IVF、PQ 与 HNSW 等向量索引的取舍。',
    keyPoints: ['暴力（Flat）检索：精确，但每次查询 O(n·d)，适合小规模或做基准', 'IVF：先聚类成倒排桶，只搜索最近的若干桶（nprobe），用召回换速度', 'PQ（乘积量化）：把向量切段分别量化成码字，大幅压缩内存并加速距离计算，有精度损失', 'HNSW：图索引，召回高、查询快，但内存开销大、构建较慢', '调参在召回率、延迟、内存之间折中，可组合（如 IVF-PQ）'],
    explanation: 'Faiss 论文系统梳理了这些索引类型及其速度、精度与内存的权衡。',
    source: FAISS },

  // ---------- 04-M4.4 BM25 与混合检索 ----------
  { id: 'q-04-m4-4-a', pointId: '04-M4.4', type: 'choice',
    question: 'BM25 中参数 k1 与 b 分别控制什么？',
    options: ['k1 控制词频饱和，b 控制文档长度归一化的强度', 'k1 控制 IDF，b 控制停用词', '两者都控制向量维度', 'k1 控制学习率，b 控制 batch'],
    answer: 0,
    explanation: 'k1 决定词频饱和特性：限制单个查询词对得分的影响，使其趋于渐近线；b 决定文档长度归一化程度，b = 0 时不做长度归一化。',
    source: BM25 },
  { id: 'q-04-m4-4-b', pointId: '04-M4.4', type: 'code',
    question: '实现倒数排名融合（RRF）：输入多路检索的排序列表（文档 id 列表，名次从 1 开始），按 score(d) = Σ 1/(k + rank) 融合，返回按分数降序的 id 列表（k 默认 60）。',
    reference: `from collections import defaultdict

def rrf(rankings, k=60):
    score = defaultdict(float)
    for ranking in rankings:
        for rank, doc in enumerate(ranking, start=1):
            score[doc] += 1.0 / (k + rank)
    return sorted(score, key=lambda d: -score[d])`,
    tests: `bm25 = ['a', 'b', 'c']
dense = ['c', 'a', 'd']
out = rrf([bm25, dense])
assert out[0] == 'a'                 # 1/61 + 1/62 最高
assert set(out) == {'a', 'b', 'c', 'd'}
assert out.index('c') < out.index('b')`,
    explanation: 'RRF 只用名次、不依赖各路分数的尺度，适合融合 BM25 与向量检索。Elasticsearch 的 rank_constant 默认值即为 60，值越大低名次文档的影响越大。',
    source: RRF },
  { id: 'q-04-m4-4-c', pointId: '04-M4.4', type: 'short',
    question: '为什么要做 BM25 + 向量的混合检索？向量库选型要看哪些方面？',
    keyPoints: ['BM25 擅长精确词匹配（专有名词、编号、代码、罕见词）', '向量检索擅长语义匹配（同义改写、跨语言），但对精确词不敏感', '两者互补，融合（RRF 或加权）通常提升召回', '选型：数据规模与索引类型、延迟 / 吞吐、内存成本', '选型：元数据过滤、增量更新、混合检索原生支持、运维与生态'],
    explanation: 'Elasticsearch 用 RRF retriever 组合多个子检索器（如 BM25 与 kNN），各子检索器在公式中等权。',
    source: RRF },

  // ---------- 04-M4.5 重排 ----------
  { id: 'q-04-m4-5-a', pointId: '04-M4.5', type: 'choice',
    question: 'cross-encoder 重排器（如 monoBERT）与双编码器检索器的区别是？',
    options: ['没有区别', 'cross-encoder 把查询与文档拼接后联合编码，直接输出相关性分数，更准但无法离线预计算文档向量，只适合对少量候选重排', 'cross-encoder 更快', 'cross-encoder 不需要训练'],
    answer: 1,
    explanation: 'Nogueira 与 Cho 把 BERT 用作段落重排器：输入 [CLS] 查询 [SEP] 段落，在 MS MARCO 上取得显著提升。代价是每个候选都要跑一次完整模型。',
    source: MONOBERT },
  { id: 'q-04-m4-5-b', pointId: '04-M4.5', type: 'choice',
    question: 'ColBERT 的「late interaction」是怎么计算相关性的？',
    options: ['查询与文档各压成一个向量做内积', '查询与文档分别编码为逐 token 向量；对每个查询 token 取与文档 token 的最大相似度（MaxSim），再求和', '用 BM25 打分', '交叉注意力联合编码'],
    answer: 1,
    explanation: 'ColBERT 分别独立编码查询与文档（文档可离线预计算），再用廉价的 MaxSim 交互求和，在表达力与效率之间取得平衡。',
    source: COLBERT },
  { id: 'q-04-m4-5-c', pointId: '04-M4.5', type: 'short',
    question: '设计一个两阶段「召回 + 重排」检索流程，说明各阶段的取舍。',
    keyPoints: ['第一阶段召回：BM25 / 双编码器 / 混合检索，追求高召回、低延迟，取几十到几百个候选', '第二阶段重排：cross-encoder 或 ColBERT 对候选精排，追求高精度', '重排后只取 top-n 放进 LLM 上下文，控制 token 成本', '延迟与成本随候选数线性增长，需要折中候选数量', '可用领域数据微调重排器，并用 nDCG / MRR 等指标评估'],
    explanation: 'monoBERT 与 ColBERT 都定位于在初排之上重排；ColBERT 也可直接做端到端检索。',
    source: COLBERT },

  // ---------- 04-M4.6 高级 RAG ----------
  { id: 'q-04-m4-6-a', pointId: '04-M4.6', type: 'choice',
    question: 'HyDE 的做法是？',
    options: ['直接用原始查询检索', '先让 LLM 针对查询生成一篇假设性文档，再用其嵌入检索真实文档；假文档可能含错误细节，由编码器的稠密瓶颈过滤', '训练一个新的检索器', '用知识图谱检索'],
    answer: 1,
    explanation: 'HyDE（Hypothetical Document Embeddings）在无相关性标注的零样本场景下显著优于 Contriever，接近有监督微调的检索器。',
    source: HYDE },
  { id: 'q-04-m4-6-b', pointId: '04-M4.6', type: 'choice',
    question: 'Self-RAG 的关键机制是？',
    options: ['固定每次检索 5 篇文档', '训练模型生成特殊的反思 token，按需决定是否检索，并评判检索段落与自身生成的质量', '只用 BM25', '不使用检索'],
    answer: 1,
    explanation: 'Self-RAG 让单个 LM 按需检索，并通过 reflection tokens 评判检索与生成，推理时可据此控制行为。',
    source: SELFRAG },
  { id: 'q-04-m4-6-c', pointId: '04-M4.6', type: 'short',
    question: 'GraphRAG 和 RAG-Fusion 分别解决什么问题？怎么做？',
    keyPoints: ['GraphRAG 针对「数据集的主题是什么」这类全局问题，普通 RAG 难以回答（本质是面向查询的摘要）', 'GraphRAG 用 LLM 从文档抽取实体知识图谱，再为紧密相关的实体社区预先生成摘要', 'GraphRAG 回答时让每个社区摘要生成部分答案，再汇总成最终回答', 'RAG-Fusion 让 LLM 生成多个改写查询分别检索', 'RAG-Fusion 用倒数排名融合（RRF）合并多路结果后再生成'],
    explanation: 'GraphRAG 要点出自 Edge 等的摘要；RAG-Fusion 出自 Rackauckas 的论文。',
    source: GRAPHRAG },

  // ---------- 04-M4.9 生产级 RAG 调优 ----------
  { id: 'q-04-m4-9-a', pointId: '04-M4.9', type: 'choice',
    question: 'Rewrite-Retrieve-Read 框架的思路是？',
    options: ['先读后检索', '在检索前加一步查询改写（可用小模型作为可训练的改写器，以 LLM 阅读器的反馈做强化学习），再检索、再阅读生成', '只检索不生成', '用规则替换同义词'],
    answer: 1,
    explanation: 'Ma 等提出用改写弥合输入与检索所需知识之间的差距，并用 LLM reader 的反馈通过强化学习训练小的改写模型。',
    source: REWRITE },
  { id: 'q-04-m4-9-b', pointId: '04-M4.9', type: 'short',
    question: '线上 RAG 召回率不足，有哪些系统性的提升手段？',
    keyPoints: ['先建评测集，分别度量检索召回（Recall@k / MRR）与端到端答案质量，定位瓶颈', '查询侧：改写、扩展、多查询（RAG-Fusion）、HyDE、拆分子问题', '索引侧：调整切块与重叠、补充标题等元数据、清洗解析错误', '检索侧：BM25 + 向量多路召回再融合，调大候选数后用重排精选', '针对领域微调 embedding / 重排模型，并持续收集失败案例回流'],
    explanation: 'RAG 综述把这些归为 Advanced RAG 的检索前（pre-retrieval）与检索后（post-retrieval）优化。',
    source: RAGSURVEY },
  { id: 'q-04-m4-9-c', pointId: '04-M4.9', type: 'choice',
    question: 'RAG-Fusion 论文在 Infineon 产品问答上的评估中，发现的主要问题是什么？',
    options: ['答案普遍不准确', '当生成的改写查询与原问题相关性不足时，部分回答会偏离主题', '无法使用向量库', '必须人工标注训练数据'],
    answer: 1,
    explanation: '摘要：RAG-Fusion 通过从多个角度改写原查询，给出了准确且全面的回答；但 some answers strayed off topic when the generated queries’ relevance to the original query is insufficient。此外多查询意味着更多检索与 LLM 调用，系统设计时要计入成本与延迟。',
    source: RAGFUSION },

  // ---------- 04-M6.1 Agent 安全与威胁模型 ----------
  { id: 'q-04-m6-1-a', pointId: '04-M6.1', type: 'choice',
    question: '什么是「间接提示注入」（indirect prompt injection）？',
    options: ['用户直接在对话框输入恶意指令', '攻击者把指令藏在 Agent 会读取的外部数据（网页、邮件、文档、检索结果）中，模型处理这些数据时被劫持', '修改模型权重', '拒绝服务攻击'],
    answer: 1,
    explanation: 'Greshake 等指出 LLM 集成应用模糊了数据与指令的边界，攻击者可在数据中植入提示，远程影响应用行为，导致数据窃取、传播等危害。',
    source: INJECT },
  { id: 'q-04-m6-1-b', pointId: '04-M6.1', type: 'choice',
    question: 'Simon Willison 提出的「Dual LLM」模式是怎样隔离不可信内容的？',
    options: ['用两个相同模型投票', '特权 LLM 只接收可信输入并能调用工具；隔离 LLM 处理不可信内容但没有工具权限，其输出只以变量引用的形式传递，特权 LLM 不直接看到', '把所有内容都交给一个更大的模型', '加一个关键词过滤器'],
    answer: 1,
    explanation: '作者强调这是缓解而非彻底解决，需要由普通代码充当控制器在两者间传递变量。',
    source: DUALLLM },
  { id: 'q-04-m6-1-c', pointId: '04-M6.1', type: 'short',
    question: '为一个能读邮件、发邮件、访问内部文档的 Agent 做威胁建模，列出主要风险和防护措施。',
    keyPoints: ['风险：提示注入（OWASP LLM01），尤其是来自邮件 / 网页的间接注入', '风险：过度代理（Excessive Agency）——权限、功能或自主性过大导致越权操作', '风险：敏感信息泄露、通过工具或链接外泄数据', '防护：最小权限、按用户身份授权，工具作用域收窄；高风险操作需人工确认', '防护：隔离不可信内容、在沙箱中执行、记录审计日志并监控异常调用'],
    explanation: 'OWASP Top 10 for LLM Applications（2025）中 LLM01 为 Prompt Injection，LLM06 为 Excessive Agency。',
    source: OWASP },

  // ---------- 04-M7.2 上下文工程 ----------
  { id: 'q-04-m7-2-a', pointId: '04-M7.2', type: 'choice',
    question: 'Anthropic 对「上下文工程」的定位是？',
    options: ['只是写更长的提示词', '在 LLM 推理时策划和维护最优的 token 集合（系统提示、工具、示例、消息历史、外部数据等），目标是用尽可能少的高信号 token 达成期望行为', '训练更大的上下文窗口', '压缩模型参数'],
    answer: 1,
    explanation: '文章把上下文视为边际收益递减的有限资源，把提示工程看作上下文工程的一部分，强调找到最小的高信号 token 集合。',
    source: CTXENG },
  { id: 'q-04-m7-2-b', pointId: '04-M7.2', type: 'short',
    question: '如何组织 Agent 的系统提示与上下文？',
    keyPoints: ['系统提示用清晰直接的语言，处在合适的「高度」：既不写死脆弱的 if-else 逻辑，也不过于空泛', '用 XML 标签或 Markdown 标题把背景、指令、工具说明、输出格式分区', '工具集精简、职责不重叠，示例选少量多样的典型例子而非堆砌边界情况', '动态组装：按任务阶段按需加载信息（just-in-time），而不是一次塞满', '长程任务配合压缩、笔记与子 Agent 控制上下文规模'],
    explanation: '以上均出自 Effective context engineering for AI agents 对系统提示、工具、示例与长程任务的建议。',
    source: CTXENG },
  { id: 'q-04-m7-2-c', pointId: '04-M7.2', type: 'choice',
    question: '文章所说的「just-in-time」上下文策略是指？',
    options: ['一开始把所有相关数据都预处理进上下文', '只保存文件路径、存储的查询、链接等轻量标识，运行时用工具按需把数据加载进上下文', '缓存模型输出', '实时微调模型'],
    answer: 1,
    explanation: '文章举例 Claude Code 用这种方式分析大型数据库：写定向查询、用 head / tail 等命令查看，而不把完整数据对象载入上下文。',
    source: CTXENG },

  // ---------- 04-M7.3 Lost in the Middle ----------
  { id: 'q-04-m7-3-a', pointId: '04-M7.3', type: 'choice',
    question: 'Lost in the Middle 发现模型对长上下文中关键信息位置的敏感性呈什么形态？',
    options: ['位置无关', '关键信息在开头或结尾时效果最好，在中间时显著变差（U 形曲线）', '越靠后越好', '越靠前越差'],
    answer: 1,
    explanation: '论文在多文档问答与键值检索任务上观察到：即便是长上下文模型，相关信息位于输入中部时性能也会显著下降。',
    source: LOSTMID },
  { id: 'q-04-m7-3-b', pointId: '04-M7.3', type: 'short',
    question: '基于 Lost in the Middle 的结论，RAG / Agent 中如何更好地利用长上下文？',
    keyPoints: ['少而精：重排后只放最相关的片段，而不是检索越多越好', '把最关键的信息放在上下文开头或结尾（靠近问题处）', '对长文档先摘要 / 抽取再放入上下文', '把指令与问题放在上下文末尾附近，减少被中间内容淹没', '用针对位置的评测（如不同位置放置答案）验证系统'],
    explanation: '论文还发现，检索文档数增加到一定程度后，开放域问答的效果提升很快饱和。',
    source: LOSTMID },
  { id: 'q-04-m7-3-c', pointId: '04-M7.3', type: 'choice',
    question: 'Lost in the Middle 用了哪两类任务来研究长上下文利用？',
    options: ['多文档问答与合成键值检索', '翻译与摘要', '代码生成与数学证明', '图像描述与视觉问答'],
    answer: 0,
    explanation: '论文控制相关文档 / 键值对在输入中的位置与上下文长度，测量模型准确率的变化。',
    source: LOSTMID },

  // ---------- 04-M7.4 Token 预算与检索预算 ----------
  { id: 'q-04-m7-4-a', pointId: '04-M7.4', type: 'code',
    question: '实现检索预算分配：给定按相关性降序的候选片段 [(text, tokens)] 与 token 预算，贪心选入不超预算的片段（跳过放不下的，继续尝试后面更短的），返回选中的文本列表。',
    reference: `def pack_context(candidates, budget):
    picked, used = [], 0
    for text, tokens in candidates:            # 已按相关性降序
        if used + tokens <= budget:
            picked.append(text)
            used += tokens
    return picked`,
    tests: `cands = [('A', 300), ('B', 500), ('C', 150), ('D', 100)]
assert pack_context(cands, 600) == ['A', 'C', 'D']   # B 放不下被跳过
assert pack_context(cands, 0) == []
assert pack_context(cands, 2000) == ['A', 'B', 'C', 'D']`,
    explanation: '先给系统提示、对话历史与输出预留 token，再把剩余预算分给检索结果；按相关性贪心是简单有效的基线。',
    source: CTXENG },
  { id: 'q-04-m7-4-b', pointId: '04-M7.4', type: 'choice',
    question: 'Anthropic 在 Writing effective tools for AI agents 中提到，Claude Code 默认把单个工具响应限制在多少 token？',
    options: ['1,000', '25,000', '200,000', '不限制'],
    answer: 1,
    explanation: '原文：For Claude Code, we restrict tool responses to 25,000 tokens by default，并建议对可能很大的响应做分页、过滤、截断，截断时附上引导说明。',
    source: TOOLS_A },
  { id: 'q-04-m7-4-c', pointId: '04-M7.4', type: 'short',
    question: '如何为一个 Agent 系统制定 token 预算？',
    keyPoints: ['把上下文窗口拆分预算：系统提示、工具定义、历史、检索结果、输出各占多少', '检索预算：控制 top-k 与每片段长度，重排后按预算装填', '工具响应：分页、过滤、截断，并提供参数让 Agent 自行控制返回规模', '历史：滑动窗口 + 摘要压缩，清理已用过的工具原始输出', '监控每次请求与每任务的 token 用量与成本，设置上限与告警'],
    explanation: 'Anthropic 的工具与上下文工程两篇文章都强调 token 效率：上下文有限，应只保留高信号内容。',
    source: TOOLS_A },

  // ---------- 04-M7.5 工具作用域与上下文污染 ----------
  { id: 'q-04-m7-5-a', pointId: '04-M7.5', type: 'choice',
    question: 'Anthropic 为什么建议给工具加命名空间（如 asana_search、jira_search）？',
    options: ['为了好看', 'Agent 可能接入几十个 MCP Server、上百个工具，功能重叠或含义模糊的工具会让 Agent 选错；命名空间划清功能边界', '为了减少网络请求', '因为 API 要求'],
    answer: 1,
    explanation: '文章建议按服务或资源给工具加前缀分组，帮助 Agent 在合适的时机选对工具，并减少需要加载进上下文的工具描述。',
    source: TOOLS_A },
  { id: 'q-04-m7-5-b', pointId: '04-M7.5', type: 'choice',
    question: '关于工具设计，下列哪种做法符合文章的建议？',
    options: ['把每个底层 API 端点都包装成一个工具', '优先实现少量面向任务的整合工具（如 schedule_event 一次完成查空档并创建），返回有意义的上下文而不是原始 ID', '返回尽可能多的原始字段', '让工具描述尽量简短到一个词'],
    answer: 1,
    explanation: '文章指出工具过多或重叠会分散 Agent；应围绕高价值工作流整合功能，并返回人类可读的高信号信息（如名称而非 UUID）。',
    source: TOOLS_A },
  { id: 'q-04-m7-5-c', pointId: '04-M7.5', type: 'short',
    question: '什么是上下文污染？工具作用域如何缓解它？',
    keyPoints: ['上下文污染：无关工具描述、冗长工具输出、错误信息堆积，挤占注意力并误导后续决策', '按任务 / 阶段只暴露需要的工具（作用域收窄），而不是全量挂载', '工具输出精简、分页、截断，必要时只返回摘要', '把子任务交给子 Agent，在干净上下文中完成后只回传结果', '清理已处理的工具结果、压缩历史'],
    explanation: 'Anthropic 的上下文工程文章把清理工具结果与子 Agent 架构列为应对上下文污染的手段。',
    source: CTXENG },

  // ---------- 04-M8.1 Skill 与 Harness ----------
  { id: 'q-04-m8-1-a', pointId: '04-M8.1', type: 'choice',
    question: 'Claude Agent Skills 的「渐进式披露」（progressive disclosure）分哪几级加载？',
    options: ['一次性全部加载', '第 1 级：YAML frontmatter 中的名称与描述，启动时常驻（每个 Skill 约 100 token）；第 2 级：被触发时加载 SKILL.md 正文；第 3 级：按需读取附带的文件或运行脚本', '只加载脚本', '按字母顺序加载'],
    answer: 1,
    explanation: '官方文档的分级表：元数据始终加载约 100 token / Skill；正文在触发时加载，建议 5k token 以内；资源文件在访问前不占上下文，脚本只把输出放进上下文。',
    source: SKILLS },
  { id: 'q-04-m8-1-b', pointId: '04-M8.1', type: 'choice',
    question: 'Anthropic 在 Effective harnesses for long-running agents 中为跨多个上下文窗口的长任务设计了什么方案？',
    options: ['一次性超长上下文', '初始化 Agent 首次运行时搭好环境，编码 Agent 每个会话做增量进展并为下个会话留下清晰的工件（进度记录、git 提交等）', '让人类每步接管', '不保存任何状态'],
    answer: 1,
    explanation: '文章指出长程 Agent 的核心难题是每个新会话都从零记忆开始，因此用 initializer agent + coding agent 的双重方案衔接各会话。',
    source: HARNESS },
  { id: 'q-04-m8-1-c', pointId: '04-M8.1', type: 'short',
    question: '一个 Agent Harness 通常包含哪些部分？Skill 在其中扮演什么角色？',
    keyPoints: ['Agent 循环：调用模型、解析工具调用、执行、回传结果', '工具与执行环境：文件系统、shell、代码执行、MCP 等', '上下文管理：系统提示、记忆 / 笔记、压缩与子 Agent', '权限与安全：权限规则、沙箱、人工审批、日志', 'Skill：以文件夹形式打包指令、脚本和资料，按需渐进加载，让通用 Agent 获得领域能力而不占满上下文'],
    explanation: 'Skills 文档说明 Skill 运行在有文件系统和 bash 的代码执行环境中；Harness 文章展示了如何用环境、进度文件与提交记录支撑长任务。',
    source: SKILLS },

  // ---------- 04-M8.3 Agentic Coding ----------
  { id: 'q-04-m8-3-a', pointId: '04-M8.3', type: 'choice',
    question: '在 Claude Code 中，CLAUDE.md 的作用是？',
    options: ['存放 API 密钥', '一个在每次对话开始时被读取的特殊文件，用来写构建命令、代码风格与工作流规则等无法从代码推断的持久上下文', '模型权重文件', '日志文件'],
    answer: 1,
    explanation: '官方 Best practices：CLAUDE.md is a special file that Claude reads at the start of every conversation；可用 /init 生成初稿，建议保持简短易读。',
    source: CC_BP },
  { id: 'q-04-m8-3-b', pointId: '04-M8.3', type: 'choice',
    question: 'Claude Code 最佳实践中，为什么强调「给 Claude 一个验证工作的方法」？',
    options: ['为了节省 token', '没有可运行的检查（测试、构建、截图对比）时，「看起来完成了」是唯一信号，人就得亲自充当验证者；有检查才能放心让它自主完成', '为了让模型更快', '因为法律要求'],
    answer: 1,
    explanation: '文档原意：给它一个能运行的检查，这决定了你是需要盯着会话，还是可以走开。',
    source: CC_BP },
  { id: 'q-04-m8-3-c', pointId: '04-M8.3', type: 'short',
    question: '总结使用 Agentic Coding 工具（如 Claude Code、Cursor）的高效工作方式。',
    keyPoints: ['先探索、再规划、后编码：先让它读代码理解现状，确认计划再动手', '提供具体上下文：指明文件、约束、期望行为与示例', '提供验证手段：测试、构建、lint、截图，让它自检', '用项目说明文件（如 CLAUDE.md）沉淀命令、规范与工作流', '配置权限与工具（MCP、hooks、子 Agent），小步提交、审查 diff'],
    explanation: '以上对应 Claude Code Best practices 的各节：验证、Explore first then plan then code、提供具体上下文、CLAUDE.md、权限与扩展。',
    source: CC_BP },

  // ---------- 04-M8.4 HITL 人机协同 ----------
  { id: 'q-04-m8-4-a', pointId: '04-M8.4', type: 'choice',
    question: '在 LangGraph 中用 interrupt() 实现人工审批，需要哪些前提？',
    options: ['什么都不需要', '一个持久化图状态的 checkpointer、配置中的 thread_id，以及在需要暂停处调用 interrupt()；恢复时用 Command(resume=...) 传回人类输入', '必须用多线程', '必须连接数据库触发器'],
    answer: 1,
    explanation: 'LangGraph 文档：interrupt 时保存图状态并无限期等待；用同一 thread_id 调用 Command(resume=...) 恢复，resume 的值成为 interrupt() 的返回值。',
    source: LG_HITL },
  { id: 'q-04-m8-4-b', pointId: '04-M8.4', type: 'choice',
    question: 'LangGraph 从 interrupt 恢复时，节点从哪里继续执行？这带来什么要求？',
    options: ['从 interrupt 那一行继续；没有额外要求', '从该节点开头重新执行，interrupt 之前的代码会再跑一次，所以之前的副作用必须幂等（或移到 interrupt 之后 / 拆到别的节点）', '从图的起点重新执行', '跳过该节点'],
    answer: 1,
    explanation: '文档的 Rules of interrupts：恢复时 runtime restarts the entire node from the beginning；因此 interrupt 前的副作用应幂等，也不要用 try/except 包住 interrupt。',
    source: LG_HITL },
  { id: 'q-04-m8-4-c', pointId: '04-M8.4', type: 'short',
    question: '设计 Agent 的人工审批流（HITL），需要考虑哪些点？',
    keyPoints: ['确定审批点：发邮件、付款、删数据、对外发布等不可逆或高风险操作', '暂停时持久化状态（checkpoint），支持长时间等待与跨进程恢复', '向审批人展示足够上下文：动作、参数、理由、影响，支持批准 / 拒绝 / 编辑参数', '恢复后的执行要幂等，避免重复执行副作用', '记录审批日志，设置超时与默认拒绝策略'],
    explanation: 'LangGraph 文档列出的常见模式包括批准或拒绝、审查和编辑状态、在工具内中断以审查工具调用、校验人工输入。',
    source: LG_HITL },

  // ---------- 04-M8.5 权限管控 ----------
  { id: 'q-04-m8-5-a', pointId: '04-M8.5', type: 'choice',
    question: 'Claude Code 的权限规则（allow / ask / deny）按什么顺序评估？',
    options: ['allow → ask → deny，越具体的规则优先', 'deny → ask → allow，按此顺序第一个匹配的规则决定结果，规则的具体程度不改变顺序', '随机', '只看 allow'],
    answer: 1,
    explanation: '文档：Rules are evaluated in order: deny, then ask, then allow。例如宽泛的 deny Bash(aws *) 会挡住所有匹配调用，即使有更具体的 allow Bash(aws s3 ls)。',
    source: CC_PERM },
  { id: 'q-04-m8-5-b', pointId: '04-M8.5', type: 'choice',
    question: '按上述规则，同时配置了 deny「Bash(rm *)」和 allow「Bash(rm tmp.txt)」，Agent 执行 rm tmp.txt 会怎样？',
    options: ['被允许', '被拒绝，因为 deny 先于 allow 评估且已匹配', '弹出询问', '随机'],
    answer: 1,
    explanation: 'deny 优先，具体的 allow 无法覆盖宽泛的 deny——这是「默认拒绝优先」的安全设计。',
    source: CC_PERM },
  { id: 'q-04-m8-5-c', pointId: '04-M8.5', type: 'short',
    question: '如何为 Agent 设计权限管控体系？',
    keyPoints: ['最小权限：按任务只授予必要的工具与资源范围', '规则分层：deny 优先、ask 用于高风险操作、allow 用于安全的常规操作', '身份与授权：Agent 以用户身份访问数据，遵守原有 ACL，避免越权读取', '沙箱隔离：文件系统、网络访问受限的执行环境', '审计与监控：记录所有工具调用，检测异常（越权尝试、批量外发）并告警'],
    explanation: 'OWASP 把 Excessive Agency 列为 LLM 应用十大风险之一，建议最小化扩展功能与权限并对高影响操作要求人工批准。',
    source: OWASP },

  // ---------- 04-M8.6 Agent 可靠性 ----------
  { id: 'q-04-m8-6-a', pointId: '04-M8.6', type: 'choice',
    question: 'OpenAI Structured Outputs 与普通的 JSON 模式相比，提供了什么保证？',
    options: ['只保证输出是合法 JSON', '保证输出遵守你提供的 JSON Schema（如必填字段、枚举值），无需担心缺字段或枚举值非法', '保证内容事实正确', '保证更快'],
    answer: 1,
    explanation: '文档：Structured Outputs ensures the model will always generate responses that adhere to your supplied JSON Schema；需在 json_schema 中设置 strict: true。它保证格式，不保证内容正确。',
    source: OAI_SO },
  { id: 'q-04-m8-6-b', pointId: '04-M8.6', type: 'code',
    question: '实现带指数退避与幂等键的重试：call_with_retry(fn, max_retries, base_delay, sleep)，每次调用都传同一个 idempotency_key（uuid4 生成一次），仅对 TransientError 重试，第 i 次重试前等待 base_delay·2^i。',
    reference: `import uuid

class TransientError(Exception):
    pass

def call_with_retry(fn, max_retries=3, base_delay=0.5, sleep=None):
    import time
    sleep = sleep or time.sleep
    key = str(uuid.uuid4())                 # 同一逻辑操作只生成一次
    for attempt in range(max_retries + 1):
        try:
            return fn(idempotency_key=key)
        except TransientError:
            if attempt == max_retries:
                raise
            sleep(base_delay * (2 ** attempt))`,
    tests: `calls, waits = [], []
def flaky(idempotency_key):
    calls.append(idempotency_key)
    if len(calls) < 3:
        raise TransientError()
    return 'ok'
assert call_with_retry(flaky, sleep=waits.append) == 'ok'
assert len(set(calls)) == 1 and len(calls) == 3      # 重试复用同一个幂等键
assert waits == [0.5, 1.0]
try:
    call_with_retry(lambda idempotency_key: 1 / 0, sleep=waits.append); assert False
except ZeroDivisionError:
    pass                                              # 非瞬时错误不重试`,
    explanation: '服务端按幂等键去重：Stripe 文档说明同一 key 的重试会返回首次请求保存的结果。生产中还会加随机抖动（jitter）并设置总超时。',
    source: STRIPE_IDEM },
  { id: 'q-04-m8-6-c', pointId: '04-M8.6', type: 'short',
    question: '如何提升 Agent 在生产环境中的可靠性？',
    keyPoints: ['结构化输出：用 JSON Schema 约束工具参数与结果格式，解析失败时带错误信息重试', '幂等性：有副作用的操作带幂等键，重试不会重复执行', '重试与降级：对瞬时错误指数退避重试，失败时降级到更简单的路径或交给人工', '确定性：能用代码确定完成的步骤不交给模型，固定版本、temperature 等参数', '可观测：记录完整轨迹，设置步数 / 成本上限与超时，防止死循环'],
    explanation: 'Stripe 文档说明了幂等键的服务端语义（同一 key 的重试返回保存的结果，key 至少保存 24 小时后才可能被清理）。',
    source: STRIPE_IDEM },
  // ---------- 05-M1.4 PPO / TRPO / GAE ----------
  { id: 'q-05-m1-4-a', pointId: '05-M1.4', type: 'choice',
    question: 'PPO 的裁剪目标 L^CLIP 是什么形式？',
    options: ['E[r_t·A_t]', 'E[min(r_t·A_t, clip(r_t, 1−ε, 1+ε)·A_t)]，r_t 为新旧策略概率比', 'E[A_t²]', 'E[log π·V]'],
    answer: 1,
    explanation: 'PPO 论文第 3 节：取未裁剪与裁剪目标的较小值，得到原目标的悲观下界，防止概率比偏离 1 太远；论文实验中 ε = 0.2 效果最好。',
    source: PPO },
  { id: 'q-05-m1-4-b', pointId: '05-M1.4', type: 'choice',
    question: 'TRPO 与 PPO 在限制策略更新幅度上的区别是？',
    options: ['两者都不限制', 'TRPO 用 KL 散度约束的信赖域，需要共轭梯度等二阶近似求解；PPO 用概率比裁剪的一阶目标近似这一效果，实现更简单', 'PPO 用二阶方法，TRPO 用一阶', 'TRPO 只适用于离散动作'],
    answer: 1,
    explanation: 'TRPO 在平均 KL 约束下最大化替代目标；PPO 的动机正是保留 TRPO 的稳定性，同时只用一阶优化。',
    source: TRPO },
  { id: 'q-05-m1-4-c', pointId: '05-M1.4', type: 'code',
    question: '用 NumPy 实现 GAE：输入长度为 T 的 rewards、values（长度 T+1，最后一个是 bootstrap 值）、dones，返回 advantages 与 returns（= advantages + values[:T]）。',
    reference: `import numpy as np

def gae(rewards, values, dones, gamma=0.99, lam=0.95):
    T = len(rewards)
    adv = np.zeros(T)
    last = 0.0
    for t in reversed(range(T)):
        nonterminal = 1.0 - dones[t]
        delta = rewards[t] + gamma * values[t + 1] * nonterminal - values[t]
        last = delta + gamma * lam * nonterminal * last
        adv[t] = last
    return adv, adv + np.asarray(values[:T])`,
    tests: `r = np.array([1.0, 1.0, 1.0]); v = np.array([0.0, 0.0, 0.0, 0.0]); d = np.array([0, 0, 1])
adv, ret = gae(r, v, d, gamma=1.0, lam=1.0)
assert np.allclose(adv, [3, 2, 1])            # λ=1, V=0 时就是蒙特卡洛回报
adv0, _ = gae(r, np.array([0.5, 0.5, 0.5, 9.0]), d, gamma=0.9, lam=0.0)
assert np.allclose(adv0, [1 + 0.9 * 0.5 - 0.5, 1 + 0.9 * 0.5 - 0.5, 1 - 0.5])  # λ=0 退化为单步 TD 误差`,
    explanation: 'A_t = Σ (γλ)^l δ_{t+l}，δ_t = r_t + γV(s_{t+1}) − V(s_t)。λ 在偏差与方差之间折中：λ = 0 为单步 TD（低方差高偏差），λ = 1 为蒙特卡洛（高方差低偏差）。',
    source: GAE },

  // ---------- 05-M2.1 后训练全流程 ----------
  { id: 'q-05-m2-1-a', pointId: '05-M2.1', type: 'choice',
    question: 'InstructGPT 的训练流程依次是？',
    options: ['RM → SFT → PPO', '用示范数据做 SFT → 用人工排序比较数据训练奖励模型 → 用 PPO 针对奖励模型优化策略', '只做 SFT', 'PPO → SFT → RM'],
    answer: 1,
    explanation: '论文 Figure 2 的三步：SFT、RM、PPO；第 2、3 步可迭代进行。',
    source: INSTRUCTGPT },
  { id: 'q-05-m2-1-b', pointId: '05-M2.1', type: 'choice',
    question: 'InstructGPT 论文中，人类评估者对 1.3B InstructGPT 与 175B GPT-3 的偏好结果是？',
    options: ['更偏好 175B GPT-3', '更偏好 1.3B InstructGPT 的输出，尽管其参数量少 100 多倍', '两者无差别', '没有做人工评估'],
    answer: 1,
    explanation: '摘要：outputs from the 1.3B parameter InstructGPT model are preferred to outputs from the 175B GPT-3, despite having 100x fewer parameters。',
    source: INSTRUCTGPT },
  { id: 'q-05-m2-1-c', pointId: '05-M2.1', type: 'short',
    question: '什么是「对齐税」（alignment tax）？InstructGPT 怎么缓解？',
    keyPoints: ['对齐税：RLHF 后模型在部分公开 NLP 基准上性能回退', 'InstructGPT 提出 PPO-ptx：PPO 更新时混入预训练分布的梯度（预训练语言模型损失）', 'PPO-ptx 显著减少了回退，且不损害人类偏好评分', 'RL 目标中还有对 SFT 模型的逐 token KL 惩罚，防止偏离太远', '后训练要在偏好提升与通用能力保持之间权衡'],
    explanation: '论文在 SQuAD、DROP、HellaSwag、WMT 翻译等任务上观察到回退，并用 PPO-ptx 缓解。',
    source: INSTRUCTGPT },

  // ---------- 05-M2.2 SFT 数据构造 ----------
  { id: 'q-05-m2-2-a', pointId: '05-M2.2', type: 'choice',
    question: 'LIMA 论文的实验设置与核心结论是？',
    options: ['用 100 万条数据 RLHF', '只用 1,000 条精心挑选的指令数据对 65B LLaMA 做标准监督微调（不用 RL），效果很强；表明知识几乎都来自预训练，少量高质量数据即可教会输出格式', '数据越多越好', '必须用人类偏好'],
    answer: 1,
    explanation: '论文提出 Superficial Alignment Hypothesis；受控人工评估中 LIMA 在 43% 的情况下与 GPT-4 相当或更优。',
    source: LIMA },
  { id: 'q-05-m2-2-b', pointId: '05-M2.2', type: 'code',
    question: 'SFT 时通常只在回答部分计算损失。给定拼接后的 input_ids 与每条样本 prompt 的长度，构造 labels（prompt 位置与 padding 置为 −100），并用 PyTorch 计算移位后的交叉熵。',
    reference: `import torch, torch.nn.functional as F

def sft_labels(input_ids, prompt_lens, pad_id):
    labels = input_ids.clone()
    for i, n in enumerate(prompt_lens):
        labels[i, :n] = -100                       # 不在 prompt 上计算损失
    labels[input_ids == pad_id] = -100
    return labels

def sft_loss(logits, labels):
    # 第 t 个位置预测第 t+1 个 token
    return F.cross_entropy(logits[:, :-1].reshape(-1, logits.size(-1)),
                           labels[:, 1:].reshape(-1), ignore_index=-100)`,
    tests: `ids = torch.tensor([[5, 6, 7, 8, 0], [5, 9, 9, 0, 0]])
lab = sft_labels(ids, [2, 1], pad_id=0)
assert lab.tolist() == [[-100, -100, 7, 8, -100], [-100, 9, 9, -100, -100]]
logits = torch.randn(2, 5, 10, requires_grad=True)
loss = sft_loss(logits, lab); loss.backward()
assert torch.isfinite(loss)
assert logits.grad[0, 0].abs().sum() == 0   # 位置 0 预测的是 prompt 内 token，被忽略、无梯度`,
    explanation: 'CrossEntropyLoss 的 ignore_index 默认就是 −100，被忽略的位置不贡献损失与梯度。注意因果 LM 的标签要相对 logits 右移一位。',
    source: CEDOC },
  { id: 'q-05-m2-2-c', pointId: '05-M2.2', type: 'short',
    question: '构造 SFT 数据时，如何权衡质量与数量？有哪些常见做法？',
    keyPoints: ['质量优先：少量高质量、风格一致的数据往往胜过大量噪声数据（LIMA）', '多样性：覆盖不同任务类型、领域、难度与格式，避免分布单一', '一致性：统一回答风格与格式，清理错误、重复与有害样本', '数据来源：人工撰写、从强模型蒸馏 / 改写、真实用户问题，并做去重与过滤', '训练细节：只在回答上算损失、控制 epoch 防过拟合，留出评测集验证'],
    explanation: 'LIMA 的消融显示，提升数据多样性与质量比单纯扩大数量更有效。',
    source: LIMA },

  // ---------- 05-M3.1 Reward Model 训练 ----------
  { id: 'q-05-m3-1-a', pointId: '05-M3.1', type: 'choice',
    question: 'InstructGPT 的奖励模型损失是什么形式？',
    options: ['回归人类打分的 MSE', '成对排序损失：−log σ(r(x, y_w) − r(x, y_l))，y_w 为人类更偏好的回答', '交叉熵分类 10 档', 'KL 散度'],
    answer: 1,
    explanation: '这是 Bradley-Terry 形式的成对比较损失。InstructGPT 每个 prompt 让标注者对 K = 4~9 个回答排序，把同一 prompt 的 C(K,2) 个比较放进同一个 batch 元素，避免过拟合。',
    source: INSTRUCTGPT },
  { id: 'q-05-m3-1-b', pointId: '05-M3.1', type: 'choice',
    question: 'Gao 等研究奖励模型过度优化时，用什么替代真人评估？发现了什么？',
    options: ['人工逐条打分；没有过优化', '用一个固定的「金标准」RM 充当人类、为代理 RM 提供标签；随着对代理 RM 优化加深，金标准分数先升后降，且函数形式与优化方式（RL / best-of-n）有关', '用 BLEU', '用困惑度'],
    answer: 1,
    explanation: '这是古德哈特定律在 RLHF 中的定量刻画；论文还发现系数随 RM 参数量平滑变化。',
    source: RMOVER },
  { id: 'q-05-m3-1-c', pointId: '05-M3.1', type: 'short',
    question: '训练一个可靠的奖励模型要注意什么？',
    keyPoints: ['数据：成对比较 / 排序数据，标注规范清晰，检查标注者一致性', '模型：通常从 SFT 模型初始化，把 LM 头换成输出标量的头', '损失：成对 Bradley-Terry 损失，同一 prompt 的多个比较放在一起避免过拟合', '评估：在留出的偏好数据上看准确率，并检查长度等偏差', '使用：RM 是不完美代理，RL 时需 KL 约束、监控过优化，必要时迭代更新 RM'],
    explanation: 'Stiennon 等的摘要工作同样用成对比较训练 RM，并观察到对 RM 过度优化会让真实质量下降。',
    source: SUMHF },

  // ---------- 05-M3.2 PPO for LLM ----------
  { id: 'q-05-m3-2-a', pointId: '05-M3.2', type: 'choice',
    question: 'InstructGPT 的 RL 阶段，最终优化的奖励包含什么？',
    options: ['只有 RM 分数', 'RM 分数减去 β 倍的、当前策略相对 SFT 模型的逐 token KL 惩罚（PPO-ptx 还加预训练损失项）', '只有 KL', '人类实时打分'],
    answer: 1,
    explanation: 'KL 惩罚缓解对奖励模型的过度优化，防止策略输出偏离 SFT 分布太远。',
    source: INSTRUCTGPT },
  { id: 'q-05-m3-2-b', pointId: '05-M3.2', type: 'choice',
    question: '标准 PPO-RLHF 训练时通常需要同时维护哪些模型？',
    options: ['只有策略模型', 'Actor（策略）、Critic（价值模型）、Reference（冻结的 SFT 参考模型）、Reward Model 四个', '只有奖励模型', 'Actor 和 Reward Model 两个'],
    answer: 1,
    explanation: 'Critic 用于估计价值、计算优势（GAE）；Reference 用于计算 KL；RM 给出奖励。显存与调度开销大，这也是 GRPO 去掉 Critic、RL 框架（如 HybridFlow）优化调度的动机。',
    source: HYBRIDFLOW },
  { id: 'q-05-m3-2-c', pointId: '05-M3.2', type: 'short',
    question: '说明 PPO 中 Critic 的作用，以及 LLM 场景下训练 Critic 的难点。',
    keyPoints: ['Critic 估计状态价值 V(s)，作为基线降低策略梯度方差', '用 V 与奖励计算 TD 误差和 GAE 优势', 'LLM 场景奖励通常只在序列末尾给出（稀疏），逐 token 价值难以学准', 'Critic 一般与策略同规模，额外占用大量显存与计算', '因此出现去掉 Critic、用组内相对奖励作基线的方法（如 GRPO）'],
    explanation: 'DeepSeekMath 论文指出 PPO 的价值函数通常与策略同规模，带来显著开销，且只在最后一个 token 有奖励时难以训练准确的逐 token 价值。',
    source: DSMATH },

  // ---------- 05-M3.3 DPO 及变体 ----------
  { id: 'q-05-m3-3-a', pointId: '05-M3.3', type: 'code',
    question: '实现 DPO 损失：输入策略模型与参考模型在 chosen / rejected 回答上的序列对数概率（已对 token 求和），返回平均损失与隐式奖励差。',
    reference: `import torch.nn.functional as F

def dpo_loss(pi_chosen, pi_rejected, ref_chosen, ref_rejected, beta=0.1):
    chosen_reward = beta * (pi_chosen - ref_chosen)        # 隐式奖励 β·log(π/π_ref)
    rejected_reward = beta * (pi_rejected - ref_rejected)
    logits = chosen_reward - rejected_reward
    return -F.logsigmoid(logits).mean(), logits.detach()`,
    tests: `import torch
z = torch.zeros(4)
loss, m = dpo_loss(z, z, z, z)
assert abs(loss.item() - torch.log(torch.tensor(2.0)).item()) < 1e-6   # 与参考一致时损失为 ln2
better, _ = dpo_loss(torch.full((4,), 2.0), torch.full((4,), -2.0), z, z)
assert better < loss                                                  # 拉开差距后损失下降`,
    explanation: 'DPO 损失为 −log σ(β·log πθ(y_w)/π_ref(y_w) − β·log πθ(y_l)/π_ref(y_l))，把 RLHF 的 KL 约束奖励最大化问题化为在偏好数据上的分类损失，无需显式奖励模型与 RL 采样。',
    source: DPOP },
  { id: 'q-05-m3-3-b', pointId: '05-M3.3', type: 'choice',
    question: '下列关于 DPO 变体的描述，哪项正确？',
    options: ['KTO 需要成对偏好数据', 'SimPO 去掉参考模型，用长度归一化的平均对数概率作为隐式奖励，并加入目标间隔 γ', 'ORPO 需要先训练奖励模型', 'IPO 与 DPO 损失完全相同'],
    answer: 1,
    explanation: 'SimPO：reference-free，以平均对数概率为奖励并引入 target reward margin。KTO 只需「好 / 不好」的二元信号；ORPO 在 SFT 损失上加赔率比项，无需参考模型；IPO 用平方损失缓解 DPO 在确定性偏好下的过拟合。',
    source: SIMPO },
  { id: 'q-05-m3-3-c', pointId: '05-M3.3', type: 'short',
    question: '概述 IPO、KTO、ORPO 各自针对 DPO 的什么问题、怎么改。',
    keyPoints: ['IPO：指出 DPO 依赖 Bradley-Terry 假设，偏好接近确定时会过拟合、忽略 KL 正则；改用对隐式奖励差的平方回归损失', 'KTO：基于前景理论，只需单条样本的「好 / 不好」标签，不需要成对数据', 'ORPO：把偏好优化并入 SFT，用赔率比惩罚被拒回答，无需参考模型和单独的对齐阶段', '共同目标：降低数据、显存或训练流程成本，提升稳定性', '选择时看数据形态（成对 / 二元）与是否有参考模型预算'],
    explanation: '分别见 IPO（Azar 等）、KTO（Ethayarajh 等）、ORPO（Hong 等）论文。',
    source: IPO, extraSources: [KTO, ORPO] },

  // ---------- 05-M3.4 RLHF vs DPO ----------
  { id: 'q-05-m3-4-a', pointId: '05-M3.4', type: 'choice',
    question: 'Xu 等「Is DPO Superior to PPO for LLM Alignment?」的结论是？',
    options: ['DPO 在所有任务上都更好', '理论与实验显示 DPO 可能存在根本局限；找出关键实现因素后，PPO 在对话到代码生成的各测试中都超过其他对齐方法', '两者完全等价', 'PPO 无法用于 LLM'],
    answer: 1,
    explanation: '摘要原意如上；论文指出学术基准上 DPO 常领先，部分原因是 PPO 的实现细节没有调好。',
    source: DPOVSPPO },
  { id: 'q-05-m3-4-b', pointId: '05-M3.4', type: 'short',
    question: '对比 RLHF（PPO）与 DPO 的优缺点。',
    keyPoints: ['DPO：无需奖励模型和在线采样，实现简单、稳定、省资源', 'DPO：离线学习固定偏好数据，可能偏好分布外的回答，效果受数据覆盖度限制', 'PPO：在线采样探索，能利用奖励模型泛化，调好后上限更高', 'PPO：需维护多个模型，超参与实现细节敏感，工程成本高', '实践中常结合：先 SFT，再 DPO 或迭代 / 在线 DPO，或用 PPO / GRPO 做可验证奖励的 RL'],
    explanation: 'Xu 等的理论分析指出 DPO 可能找到利用分布外回答的解。',
    source: DPOVSPPO },
  { id: 'q-05-m3-4-c', pointId: '05-M3.4', type: 'choice',
    question: 'DPO 论文的核心推导是什么？',
    options: ['把奖励模型换成规则', '利用 KL 约束奖励最大化问题最优策略的闭式解，把奖励用策略与参考策略的对数概率比表示，代入 Bradley-Terry 偏好模型，得到只依赖策略的损失', '用强化学习训练奖励模型', '用对比学习预训练'],
    answer: 1,
    explanation: '论文副标题 Your Language Model is Secretly a Reward Model 即指隐式奖励 r(x,y) = β·log π(y|x)/π_ref(y|x) + 常数。',
    source: DPOP },

  // ---------- 05-M4.1 GRPO ----------
  { id: 'q-05-m4-1-a', pointId: '05-M4.1', type: 'code',
    question: '实现 GRPO 的组内相对优势（结果监督）：输入形状 (B, G) 的奖励（每个问题采样 G 个回答），返回 (r − 组均值) / (组标准差 + eps)。',
    reference: `import numpy as np

def grpo_advantages(rewards, eps=1e-6):
    r = np.asarray(rewards, dtype=float)
    mean = r.mean(axis=1, keepdims=True)
    std = r.std(axis=1, keepdims=True)
    return (r - mean) / (std + eps)`,
    tests: `adv = grpo_advantages([[1, 0, 0, 1], [1, 1, 1, 1]])
assert np.allclose(adv[0], [1, -1, -1, 1], atol=1e-4)
assert np.allclose(adv[1], 0)          # 全对（或全错）的组优势为 0，不提供梯度信号
assert adv.shape == (2, 4)`,
    explanation: '结果监督下，同一回答的每个 token 都使用这个优势。全对 / 全错的组没有学习信号，这正是 DAPO 动态采样要过滤的情况。',
    source: DSMATH },
  { id: 'q-05-m4-1-b', pointId: '05-M4.1', type: 'choice',
    question: 'GRPO 相对 PPO 的主要改动是？',
    options: ['去掉奖励模型', '去掉价值模型（Critic），用同一问题多次采样输出的组内平均奖励作为基线；KL 惩罚直接加在损失里而不是加到奖励中', '去掉裁剪', '改为离线学习'],
    answer: 1,
    explanation: 'DeepSeekMath 提出 GRPO 以减少 PPO 的显存占用；KL 项使用无偏估计 π_ref/π − log(π_ref/π) − 1。',
    source: DSMATH },
  { id: 'q-05-m4-1-c', pointId: '05-M4.1', type: 'short',
    question: 'DAPO 针对 GRPO 在大规模长 CoT 训练中的问题提出了哪四项技术？',
    keyPoints: ['Clip-Higher：解耦上下裁剪范围，提高上界，避免熵塌缩、保持探索', 'Dynamic Sampling：过滤组内奖励全对或全错（优势为 0）的样本，保持有效梯度', 'Token-Level Policy Gradient Loss：按 token 而非按样本平均损失，长回答的 token 不被稀释', 'Overlong Reward Shaping：对超长截断样本做软惩罚，减少奖励噪声', '论文用 Qwen2.5-32B 基座在 AIME 2024 上达到 50 分，并基于 verl 开源'],
    explanation: 'DAPO = Decoupled Clip and Dynamic sAmpling Policy Optimization。',
    source: DAPO },

  // ---------- 05-M4.2 RLVR 与 R1 ----------
  { id: 'q-05-m4-2-a', pointId: '05-M4.2', type: 'choice',
    question: 'DeepSeek-R1-Zero 是怎样训练的？',
    options: ['大量 SFT 后再 RL', '不经过 SFT，直接在基座模型上用 GRPO 做大规模 RL，奖励为基于规则的准确性奖励与格式奖励', '只用人类偏好 RLHF', '蒸馏自其他模型'],
    answer: 1,
    explanation: 'R1 报告：R1-Zero 用规则奖励（答案是否正确、是否按格式把思考放在指定标签里），未使用神经奖励模型以避免 reward hacking；训练中自发出现反思等行为。R1 则加入冷启动数据与多阶段训练改善可读性。',
    source: R1 },
  { id: 'q-05-m4-2-b', pointId: '05-M4.2', type: 'choice',
    question: 'Yue 等用大 k 的 pass@k 考察 RLVR 后发现了什么？',
    options: ['RLVR 在所有 k 下都显著超过基座', 'RLVR 模型在小 k（如 k = 1）时更好，但 k 很大时基座模型的 pass@k 更高；推理能力来源并受限于基座，而蒸馏能引入新的推理模式', 'RLVR 完全无效', 'pass@k 与 k 无关'],
    answer: 1,
    explanation: '论文认为当前 RLVR 主要提升采样效率，并未诱导出基座之外的全新推理模式；六种流行 RLVR 算法表现相近。',
    source: RLVRLIMIT },
  { id: 'q-05-m4-2-c', pointId: '05-M4.2', type: 'short',
    question: '什么是可验证奖励（RLVR）？设计时要注意什么？',
    keyPoints: ['奖励由程序可靠判定：数学答案比对、代码单元测试、格式校验等，而非学习得到的奖励模型', '优点：不易被 reward hacking，成本低、可大规模扩展', '答案抽取与判定要鲁棒（等价形式、单位、格式），否则引入奖励噪声', '题目难度要匹配模型能力，太难或太易都会让组内奖励无差异', '可加格式奖励、长度控制；只适用于有客观答案的任务'],
    explanation: 'DeepSeek-R1 用规则奖励而非神经奖励模型，理由是后者在大规模 RL 中易被 hack 且需额外训练资源。',
    source: R1 },

  // ---------- 05-M4.3 PRM vs ORM ----------
  { id: 'q-05-m4-3-a', pointId: '05-M4.3', type: 'choice',
    question: 'Lightman 等（Let’s Verify Step by Step）比较过程监督与结果监督的结论是？',
    options: ['结果监督更好', '在 MATH 上，过程监督训练的奖励模型显著优于结果监督；最佳模型解决了 MATH 代表性子集 78% 的题，并发布了 80 万条步骤级标注 PRM800K', '两者没有差别', '过程监督不需要标注'],
    answer: 1,
    explanation: '论文还发现主动学习能显著提升过程监督的效率。',
    source: PRM },
  { id: 'q-05-m4-3-b', pointId: '05-M4.3', type: 'choice',
    question: 'Uesato 等在 GSM8K 上比较过程与结果监督，得到什么结论？',
    options: ['过程监督在最终答案错误率上大幅领先', '纯结果监督能以更少标注达到相近的最终答案错误率；但要保证推理步骤正确，需要过程监督或模仿过程反馈的奖励模型', '结果监督完全无效', '两者都不能提升'],
    answer: 1,
    explanation: '论文把最终答案错误率从 16.8% 降到 12.7%，答案正确样本中的推理错误率从 14.0% 降到 3.4%。',
    source: PROCOUT },
  { id: 'q-05-m4-3-c', pointId: '05-M4.3', type: 'short',
    question: '比较 PRM 与 ORM 的优缺点与典型用法。',
    keyPoints: ['ORM：只看最终结果打分，标注便宜（甚至可由答案自动判定），但信号稀疏，可能奖励「答案对但过程错」', 'PRM：逐步打分，信号稠密，能定位错误步骤，更利于可解释与可靠推理', 'PRM 标注成本高（如 PRM800K 的人工步骤标注），步骤划分也有歧义', '典型用法：best-of-N 重排 / 验证器、搜索时引导（如 beam / 树搜索）、RL 中的稠密奖励', 'PRM 用作 RL 奖励时同样可能被 hack，需要谨慎'],
    explanation: '两篇论文共同表明：只看最终答案正确率时 ORM 已够用，但关注推理过程可靠性时过程监督更有优势。',
    source: PRM },

  // ---------- 05-M4.5 Agentic RL ----------
  { id: 'q-05-m4-5-a', pointId: '05-M4.5', type: 'choice',
    question: 'Search-R1 在多轮「推理 + 搜索」RL 中，为什么要对检索返回的 token 做掩码（retrieved token masking）？',
    options: ['为了节省显存', '检索内容不是策略生成的，不应计入策略梯度损失；屏蔽它们使 RL 训练更稳定', '为了隐藏隐私', '为了加速检索'],
    answer: 1,
    explanation: 'Search-R1 让 LLM 在逐步推理中自主生成搜索查询并接收实时检索结果，用 retrieved token masking 稳定训练，奖励只用简单的结果奖励。',
    source: SEARCHR1 },
  { id: 'q-05-m4-5-b', pointId: '05-M4.5', type: 'short',
    question: '与单轮 RLVR 相比，多轮工具调用的 Agentic RL 有哪些额外难点？',
    keyPoints: ['轨迹长、奖励稀疏且延迟，信用分配更难', '环境 / 工具返回的 token 需从损失中屏蔽，只优化模型自己生成的部分', 'rollout 需与真实或模拟环境交互，速度慢、有副作用，需要沙箱与异步调度', '训练易不稳定：如回声陷阱（Echo Trap，奖励方差断崖与梯度尖峰）', '奖励设计：结果奖励 + 格式 / 过程奖励，防止 reward hacking'],
    explanation: 'RAGEN 论文研究多轮 Agent RL（StarPO 框架），报告了 Echo Trap 现象及稳定化方法。',
    source: RAGEN },
  { id: 'q-05-m4-5-c', pointId: '05-M4.5', type: 'choice',
    question: 'RAGEN 论文中观察到的「Echo Trap」指什么？',
    options: ['模型重复用户输入', '多轮 Agent RL 训练中反复出现的不稳定模式：奖励方差断崖式下降并伴随梯度尖峰', '检索结果重复', '日志回显'],
    answer: 1,
    explanation: 'RAGEN 提出 StarPO 框架研究多轮 Agent RL，并给出稳定化变体 StarPO-S（轨迹过滤、引入 critic、梯度稳定化）来缓解。',
    source: RAGEN },

  // ---------- 05-M6.2 提示注入与指令隔离 ----------
  { id: 'q-05-m6-2-a', pointId: '05-M6.2', type: 'choice',
    question: 'OpenAI 的 Instruction Hierarchy 工作提出了什么？',
    options: ['所有指令一律平等', '训练模型区分指令优先级：系统消息 > 用户消息 > 第三方内容（如工具输出）；低优先级内容与高优先级指令冲突时选择性忽略', '禁止模型使用工具', '只接受英文指令'],
    answer: 1,
    explanation: '论文认为提示注入等攻击的根源之一是模型把所有输入视为同等优先级，并用合成数据训练出指令层级，提升鲁棒性且对常规能力影响很小。',
    source: IHIER },
  { id: 'q-05-m6-2-b', pointId: '05-M6.2', type: 'choice',
    question: 'StruQ 防御提示注入的思路是？',
    options: ['关键词过滤', '结构化查询：用安全前端把提示与数据放进不同的、带保留分隔符的通道，并用结构化指令微调让模型只执行提示部分的指令、忽略数据中的指令', '加大模型', '人工审核所有输入'],
    answer: 1,
    explanation: 'StruQ 把指令与数据从格式上分离，再训练模型遵循这种分离。',
    source: STRUQ },
  { id: 'q-05-m6-2-c', pointId: '05-M6.2', type: 'short',
    question: '从训练与提示两方面列举防御间接提示注入的手段。',
    keyPoints: ['训练侧：指令层级训练，让模型优先遵循系统 / 开发者指令', '训练侧：结构化指令微调（如 StruQ），区分指令通道与数据通道', '提示侧：Spotlighting——用分隔符、数据标记或编码（如 base64）标示外部内容来源', '系统侧：最小权限、高风险操作人工确认、隔离不可信内容（Dual LLM）', '评测：持续做注入攻击红队测试，没有单一方法能彻底解决'],
    explanation: 'Spotlighting 论文提出 delimiting、datamarking、encoding 三种变换，在实验中大幅降低了攻击成功率。',
    source: SPOTLIGHT },

  // ---------- 05-M7.2 RL Infra ----------
  { id: 'q-05-m7-2-a', pointId: '05-M7.2', type: 'choice',
    question: 'HybridFlow（verl）的核心设计是？',
    options: ['只用单控制器', '把单控制器与多控制器范式混合：单控制器灵活编排 RLHF 数据流，多控制器高效执行各节点内的分布式计算；并用 3D-HybridEngine 在训练与生成间高效重分片 Actor', '只用 CPU', '不支持 PPO'],
    answer: 1,
    explanation: '摘要：传统单控制器调度开销大，现有多控制器方案不够灵活，HybridFlow 将两者混合；3D-HybridEngine 实现训练与生成阶段间零冗余的 Actor 重分片。',
    source: HYBRIDFLOW },
  { id: 'q-05-m7-2-b', pointId: '05-M7.2', type: 'short',
    question: 'LLM 的 RL 训练系统有哪些主要瓶颈？常见的工程方案有哪些？',
    keyPoints: ['rollout（生成）往往占大部分时间，长 CoT 下更明显，需要接入 vLLM 等高效推理引擎', '训练与推理需要不同的并行布局，权重要在两者间同步 / 重分片', '多模型（actor / critic / ref / RM）的放置：共置（colocate）分时复用 vs 分离部署', '长尾样本导致负载不均：异步 rollout、动态批处理', '框架：OpenRLHF（Ray + vLLM）、verl（HybridFlow）等'],
    explanation: 'OpenRLHF 论文说明了用 Ray 调度、用 vLLM 加速生成的设计；HybridFlow 论文讨论了模型放置与重分片。',
    source: OPENRLHF },
  { id: 'q-05-m7-2-c', pointId: '05-M7.2', type: 'choice',
    question: 'OpenRLHF 框架主要用什么来加速 RLHF 中的样本生成？',
    options: ['纯 PyTorch 逐 token 生成', '集成 vLLM 做生成，并用 Ray 进行分布式调度', '只用 CPU 推理', '不做生成'],
    answer: 1,
    explanation: 'OpenRLHF 论文介绍其基于 Ray、vLLM、DeepSpeed 与 HuggingFace Transformers 构建，以提升 RLHF 训练效率。',
    source: OPENRLHF },

  // ---------- 05-M7.3 Reward Hacking ----------
  { id: 'q-05-m7-3-a', pointId: '05-M7.3', type: 'choice',
    question: '什么是 reward hacking？',
    options: ['黑客攻击奖励服务器', '策略利用奖励函数的缺陷或歧义获得高奖励，却没有真正完成预期任务', '奖励太低', '训练太慢'],
    answer: 1,
    explanation: 'Lilian Weng 的综述把它定义为 RL agent 利用奖励函数的缺陷或模糊之处获得高奖励而没有真正学会预期任务，在 RLHF 中尤为常见（如迎合、篡改单元测试）。',
    source: WENG_RH },
  { id: 'q-05-m7-3-b', pointId: '05-M7.3', type: 'short',
    question: 'RL 训练中如何发现和排查 reward hacking / 过优化？',
    keyPoints: ['监控代理奖励与独立评估（金标准 RM、人工抽检、下游基准）是否背离', '监控回答长度、KL、熵等统计量的异常变化（如长度暴涨）', '人工阅读高奖励样本，寻找钻空子的模式（套话、格式投机、改测试）', '对可验证任务加强判定器的鲁棒性，堵住漏洞', '缓解：KL 约束、早停、RM 集成 / 迭代更新、加长度惩罚'],
    explanation: 'Gao 等定量表明代理 RM 分数持续上升时金标准分数会先升后降；Weng 的综述总结了检测与缓解方法。',
    source: RMOVER },
  { id: 'q-05-m7-3-c', pointId: '05-M7.3', type: 'choice',
    question: '在 Gao 等的 RL 实验里，KL 惩罚系数对过度优化有什么作用？',
    options: ['KL 惩罚让金标准分数无限增长', 'KL 惩罚限制了策略离初始模型的距离，但在相同 KL 距离下并没有改善金标准分数与 KL 的关系曲线，作用类似早停', '没有影响', 'KL 惩罚会导致训练崩溃'],
    answer: 1,
    explanation: '论文发现加大 KL 惩罚系数使训练停在更小的 KL 处，但金标准 RM 分数关于 KL 距离的前沿基本不变，因此其效果近似于提前停止。',
    source: RMOVER },
]
