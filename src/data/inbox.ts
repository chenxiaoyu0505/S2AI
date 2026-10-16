// 项目收集箱（inbox）—— 暂存区：「看到好项目 / 新理论但暂时没空学，先收录、看解析、按需下潜」
// 更新方式：直接把项目网址发给学习树的 Agent（见 AGENTS.md 任务手册 5），
// 由 Agent 解析后追加条目；也可按下方格式手动添加。
// 两类暂存：kind=leaf（新叶子，默认）/ kind=twig（新枝节：论文、理论、方法）。
// 归类不下的 twig 写 cat: '野生枝节'——已进树但树还没长出对应位置，长出后移入理论地图。

export type InboxLevel = '观望' | '跟练' | '深入'

export type InboxKind = 'leaf' | 'twig'

export interface InboxItem {
  name: string
  url: string
  /** 暂存类型：leaf = 新叶子（项目）；twig = 新枝节（论文 / 理论 / 方法），等待长出或挂回理论地图 */
  kind?: InboxKind
  /** 收录日期 YYYY-MM */
  added: string
  /** 归属：分类 · 理论模块，如 'Agent 开发 · 04-M2'；
   *  kind=twig 且归类不下时写 '野生枝节'——已进树但树还没长出对应位置，长出后移入理论地图 */
  cat: string
  /** 一句话解析：它是什么 */
  intro: string
  /** 为什么收录：解决什么痛点 / 与现有内容什么关系 */
  why: string
  /** 小白下潜路径：从哪开始、到什么程度为止 */
  dive: string
  /** 建议投入：观望=只看解析 / 跟练=跑 demo / 深入=读源码 */
  level: InboxLevel
  /** 概念提炼（可选）：本项目涉及、理论地图中还没有的新概念——理论线增补建议 */
  concept?: string
  /** 毕业年月 YYYY-MM（可选）：已学完结转为学习卡片，本条目退化为卡片的跳转目标 */
  graduated?: string
}

export const INBOX: InboxItem[] = [
  {
    name: 'LightRAG', url: 'https://github.com/HKUDS/LightRAG', added: '2026-10',
    cat: 'RAG / 知识库 · 04-M4.6',
    intro: 'HKUDS 出品的轻量 GraphRAG 实现：同样走「知识图谱 + RAG」路线——从语料抽取实体关系建图，检索时向量召回与图遍历结合，代码量比微软 GraphRAG 小一个量级。',
    why: '「高级 RAG（GraphRAG）」学习点（04-M4.6）已有理论索引，但缺一个能本地跑通的轻量实现：LightRAG 适合先建立「图怎么帮检索」的直觉，再对照 GraphRAG 看重量级的取舍。',
    dive: 'README quickstart → 跑通默认示例 → 只读 indexing 模块，搞清实体关系怎么建图。',
    level: '跟练',
  },
  {
    name: 'MinerU', url: 'https://github.com/opendatalab/MinerU', added: '2026-10',
    cat: 'RAG / 知识库 · 04-M4.2',
    intro: 'OpenDataLab 的开源文档解析工具：PDF / 公式 / 表格 → 结构化 Markdown。',
    why: '「PDF / Markdown / 网页解析与清洗」是清单第一项实操，MinerU 已是社区解析标配，先收录备用。',
    dive: 'pip 安装 → 解析一份自己的 PDF → 对比解析前后的 chunk 质量差异。',
    level: '跟练',
  },
  {
    name: 'OpenRLHF', url: 'https://github.com/OpenRLHF/OpenRLHF', added: '2026-10',
    cat: 'LLM 后训练 · 05-M7',
    intro: '目前最活跃的开源 RLHF 框架：vLLM 推理 + DeepSpeed 训练混搭架构。',
    why: '「RL 工程与训练框架」（05-M7）的点名项目，「小规模 GRPO」实操的主流工程载体，其推理-训练协同调度架构值得精读。',
    dive: '跑通 README demo 训练 → 读 trainer 的 rollout 调度代码 → 对比 TRL 的实现差异。',
    level: '深入',
  },
  {
    name: 'LLaMA-Factory', url: 'https://github.com/hiyouga/LLaMA-Factory', added: '2026-10',
    cat: 'LLM 后训练 · 02-M7.2',
    intro: 'YAML 配置式微调框架：一份配置跑通 SFT / LoRA / DPO / GRPO。',
    why: '「主流训练框架」（02-M7.2）的点名项目，「LoRA / QLoRA SFT」的最快落地路径，先跑通它再回头理解手写 Trainer 的差异。',
    dive: '装环境 → 用示例配置微调一个 Qwen 小模型 → 对比 Hugging Face Trainer 的写法。',
    level: '跟练',
  },
  {
    name: 'SGLang', url: 'https://github.com/sgl-project/sglang', added: '2026-10',
    cat: '基础工具 · 03-M2.2',
    intro: '新一代大模型推理框架，与 vLLM 正面竞争，以 RadixAttention 路由缓存著称。',
    why: '「SGLang / TensorRT-LLM / TGI 对比」（03-M2.2）的点名项目：跟踪推理框架演进的对照样本，RadixAttention 的前缀树 KV 复用对应 03-M2.3 / 03-M2.6 的概念。',
    dive: '读官方博客理解 RadixAttention → 有余力再本地压测对比 vLLM。',
    level: '观望',
  },
  {
    name: 'GraphRAG', url: 'https://github.com/microsoft/graphrag', added: '2026-10',
    cat: 'RAG / 知识库 · 04-M4.6',
    intro: '微软索引式 RAG 代表作：「知识图谱 + RAG」的重量级实现——离线从语料构建实体关系图谱，再做社区摘要与图查询，检索与摘要都由图结构增强。',
    why: '「高级 RAG」（04-M4.6）学习点的出处项目：理解索引式 GraphRAG 的设计概念（实体抽取 → 建图 → 社区检测 → 图增强检索），并与 LightRAG 的轻量在线方案对比取舍。',
    dive: '读官方文档概念页建立直觉 → 小数据集试建索引，跑不通不硬磕。',
    level: '观望',
  },
  {
    kind: 'twig',
    name: 'Test-Time Compute（推理时扩展）',
    url: 'https://arxiv.org/abs/2408.03314', added: '2026-10',
    cat: '野生枝节',
    intro: '推理时算力扩展：让模型在回答前「多想一会」（长思维链 / 自验证 / 搜索），用推理换准确率，与训练时 scaling 互补。',
    why: '树里还没有对应枝干：o1 / R1 带火的推理范式涉及预算分配、过程奖励等概念，02/05 篇章均未覆盖——先作野生枝节收着，理论地图长出对应枝节后移入。',
    dive: '读论文建立「多少推理预算换多少准确率」的直觉 → 对照 02-M4 采样与 05-M4 RL 后训练，想清楚它该挂在哪根枝干。',
    level: '观望',
  },
]
