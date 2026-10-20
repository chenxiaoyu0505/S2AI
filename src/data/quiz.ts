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
]
