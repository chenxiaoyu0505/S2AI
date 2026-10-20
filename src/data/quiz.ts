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
    explanation: 'BN 论文 3.1 节：推理时用总体统计量代替 mini-batch 统计量，使输出只依赖输入本身；实现上通常是训练时维护的滑动平均。这也是 train / eval 模式必须切换的原因之一。',
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
]
