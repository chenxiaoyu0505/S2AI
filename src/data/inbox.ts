// 项目收集箱（inbox）—— 「看到好项目但暂时没空学，先收录、看解析、按需下潜」
// 更新方式：直接把项目网址发给学习树的 Agent（见 AGENTS.md 任务手册 5），
// 由 Agent 解析后追加条目；也可按下方格式手动添加。
// 收录协议包含固定步骤「概念提炼」：若项目涉及理论地图里还没有的新概念，
// 写入 concept 字段，作为理论线增补建议（公共树由站长确认入库）。

export type InboxLevel = '观望' | '跟练' | '深入'

export interface InboxItem {
  name: string
  url: string
  /** 收录日期 YYYY-MM */
  added: string
  /** 归属：项目清单分类 · 理论模块，如 'Agent 开发 · 04-M2' */
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
}

export const INBOX: InboxItem[] = [
  {
    name: 'LightRAG', url: 'https://github.com/HKUDS/LightRAG', added: '2026-10',
    cat: 'RAG / 知识库 · 04-M4.6',
    intro: 'HKUDS 出品的轻量 GraphRAG 实现：用图结构组织检索，代码量比微软 GraphRAG 小一个量级。',
    why: '清单里已有「高级 RAG（GraphRAG）」学习点但缺一个能本地跑通的轻量实现，适合先建立直觉。',
    dive: 'README quickstart → 跑通默认示例 → 只读 indexing 模块，搞清实体关系怎么建图。',
    level: '跟练',
    concept: '图索引 RAG',
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
    cat: 'LLM 后训练 · 05-M3',
    intro: '目前最活跃的开源 RLHF 框架：vLLM 推理 + DeepSpeed 训练混搭架构。',
    why: '清单有「小规模 GRPO」实操项，OpenRLHF 是它的主流工程载体，架构值得精读。',
    dive: '跑通 README demo 训练 → 读 trainer 的 rollout 调度代码 → 对比 TRL 的实现差异。',
    level: '深入',
    concept: '推理-训练协同调度',
  },
  {
    name: 'LLaMA-Factory', url: 'https://github.com/hiyouga/LLaMA-Factory', added: '2026-10',
    cat: 'LLM 后训练 · 02-M5',
    intro: 'YAML 配置式微调框架：一份配置跑通 SFT / LoRA / DPO / GRPO。',
    why: '「LoRA / QLoRA SFT」的最快落地路径，先跑通它再回头理解手写 Trainer 的差异。',
    dive: '装环境 → 用示例配置微调一个 Qwen 小模型 → 对比 Hugging Face Trainer 的写法。',
    level: '跟练',
  },
  {
    name: 'SGLang', url: 'https://github.com/sgl-project/sglang', added: '2026-10',
    cat: '基础工具 · 03-M2.2',
    intro: '新一代大模型推理框架，与 vLLM 正面竞争，以 RadixAttention 路由缓存著称。',
    why: '「vLLM 与 PagedAttention」之外的第二选择，跟踪推理框架演进的对照样本。',
    dive: '读官方博客理解 RadixAttention → 有余力再本地压测对比 vLLM。',
    level: '观望',
    concept: 'RadixAttention（前缀树 KV 复用）',
  },
  {
    name: 'GraphRAG', url: 'https://github.com/microsoft/graphrag', added: '2026-10',
    cat: 'RAG / 知识库 · 04-M4.6',
    intro: '微软索引式 RAG 代表作：从语料构建实体关系图谱，用图辅助检索与摘要。',
    why: '「高级 RAG」学习点的出处项目，理解它和 LightRAG 的取舍（重 vs 轻）。',
    dive: '读官方文档概念页建立直觉 → 小数据集试建索引，跑不通不硬磕。',
    level: '观望',
  },
]
