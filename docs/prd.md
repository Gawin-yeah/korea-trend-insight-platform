# 韩国流行词与趋势洞察平台 PRD

## 1. 产品目标

### 1.1 产品定位
构建一个面向内容、产品、品牌营销团队的韩国本土趋势洞察平台，持续发现韩国用户真实在使用和传播的韩语流行词、梗、视觉风格和内容主题，避免把中文或英语社区的二次传播误判为韩国本地趋势。

### 1.2 核心问题
- 海外团队难以及时识别韩国本地语境中的新词、梗、视觉玩法和情绪表达。
- 单纯热搜或翻译工具无法解释韩语流行词背后的使用场景、情绪色彩和商业价值。
- 市场团队需要可信来源、可追溯证据和品牌安全判断，而不是黑箱热词榜。

### 1.4 当前 MVP 路线
- 发现层：优先使用公开趋势站点发现韩国正在升温的话题。
- 证据层：由研究员手工补充原始链接、评论摘录、截图说明和分析备注。
- 深采层：后续再用官方 API 接入授权账号或开放接口。

### 1.3 用户角色
- 内容运营：寻找选题、标题、素材和本地化表达。
- 产品团队：寻找可做成功能、模板、滤镜、AI 效果的趋势。
- 市场与品牌：识别韩国年轻用户内容偏好、爆发题材和商业合作方向。
- 研究分析师：进行来源核验、人工复审与导出分析。

## 2. 垂直板块与分类

枚举 `category`：
- `beauty`
- `photography`
- `retouching`
- `ai_play`
- `fashion`
- `other`

重点板块：
- `beauty`：妆容趋势、护肤词、热门成分、产品昵称、K-beauty 热点。
- `photography`：自拍、情侣照、人生四格、构图、姿势、滤镜风格。
- `retouching`：修图模板、滤镜名、肤色补正、脸型修饰、教程玩法。
- `ai_play`：AI 头像、AI 写真、AI 滤镜、AI 换装、生成式挑战。
- `fashion`：通勤、约会、校园穿搭、单品昵称、韩国品牌热词。

## 3. 核心功能

### 3.1 趋势采集
- 按小时和按天采集关键词、hashtag、标题、评论、caption。
- 仅接入合法 API 或可授权数据源。
- 每条记录必须保留 `source_url`、`source_platform`、`collected_at`、原文、互动量、作者地区与语言信号、置信度。
- 当平台没有低门槛官方 API 时，可先记录公开趋势站点信号，并由人工补证据。

### 3.2 韩国本土真实性过滤
- 韩语占比。
- 韩国地区信号。
- 韩国账号或频道信号。
- 韩国时间段活跃度。
- 韩文本土表达特征。
- 排除中文或英文圈二次传播。

### 3.3 趋势评分
`score = 增速 + 互动量 + 跨平台出现次数 + 韩国本土置信度 + 新鲜度 - 噪音/广告惩罚`

补充维度：
- 是否适合产品化。
- 是否适合做滤镜、模板、AI 效果。
- 是否适合社媒传播。
- 是否与韩国年轻女性用户相关。
- 是否能转化为美图类产品功能。

### 3.4 自动聚类
- 合并同义词、变体、hashtags、缩写与梗图文案。
- 通过 LLM 和规则混合生成 cluster。
- 支持人工修正误聚类。

### 3.5 趋势详情页
- 韩语原词。
- 罗马音。
- 中文与英文解释。
- 使用场景、情绪与语气。
- 受众群体。
- 来源平台与示例句。
- 近期热度曲线。
- 风险等级：冒犯、低俗、政治、性暗示、品牌安全。

### 3.6 Dashboard
- 今日韩国热词 Top 50。
- 上升最快趋势。
- 公开趋势站点发现层。
- 证据完整度分布。
- 五大重点板块趋势榜。
- 各板块上升最快趋势。
- 各板块可商业化潜力排序。
- 平台分布。
- 生命周期：新出现、爆发、稳定、衰退。

### 3.7 管理后台
- 人工确认和驳回趋势。
- 编辑解释。
- 标记误判。
- 手工补充证据。
- 导出 CSV、JSON、API。

## 4. 数据源策略

### 4.1 已实现或优先接入
- YouTube Data API：支持 `regionCode=KR`、韩语查询词、短视频与分类维度。
- Instagram：仅支持官方 API、授权商业或创作者账号、合作账号。
- Threads：仅支持官方 API 和授权账号内容；重点看韩国创作者/品牌的文本梗、回复语气、二创话题。
- X：通过官方 API 获取韩语检索结果、实时文本讨论与公共互动指标。
- Naver Blog/Search：通过官方 Open API 获取博客搜索结果，作为韩国本土长文本与搜索意图信号。
- Google Trends KR：作为趋势对照信号。
- 手工导入和种子数据：用于 MVP 演示与回归测试。

### 4.2 预留扩展
- Naver Cafe、Search 更多官方接口或授权数据。
- Daum。
- TikTok 授权数据。
- Kakao 公开趋势信号。
- 韩国论坛与社区的合法数据合作接入。

### 4.3 不做的事情
- 不做违反 Instagram、TikTok、X 等平台条款的抓取。
- 不做无法追溯来源的聚合。
- 不隐藏置信度和判定依据。

## 5. 数据库 Schema 概览

### 5.1 核心实体
- `trend_clusters`：聚合后的趋势词与业务属性。
- `trend_mentions`：采集到的原始条目。
- `trend_cluster_mentions`：原始条目与聚类关系。
- `trend_daily_metrics`：按日聚合的走势与分数。
- `trend_reviews`：人工审核记录。
- `ingestion_runs`：采集任务运行日志。

### 5.2 关键字段
- `trend_clusters.primary_category`
- `trend_clusters.secondary_categories`
- `trend_clusters.related_products`
- `trend_clusters.related_brands`
- `trend_clusters.visual_style_tags`
- `trend_clusters.target_audience`
- `trend_clusters.commercial_potential_score`

## 6. 系统架构图文字版

1. 采集层：YouTube API、Instagram 授权 API、未来可接入 Naver/TikTok/X/Threads/Google Trends KR。
2. 标准化层：统一抽取 `source_url`、平台、原文、互动量、作者信号、采集时间。
3. 韩国本土过滤层：基于语言、地区、时段、账号属性和表达风格计算 `authenticity_score`。
4. 聚类与解释层：规则归并 + LLM 解释 + 风险判断 + 产品化评分。
5. 存储层：PostgreSQL 保存 cluster、mention、每日指标、审核记录。
6. 服务层：Next.js API Routes 提供 dashboard、trend detail、admin review、export、manual ingestion。
7. 展示层：中文 UI + 保留韩语原文，支持分类榜单、详情页、管理后台。
8. 定时任务层：cron worker 按小时拉取、清洗、聚类并回写数据库。

## 7. API 设计

### 7.1 公共接口
- `GET /api/dashboard`
  - 返回 Top 50、各分类榜单、平台分布、上升最快趋势、生命周期分布。
- `GET /api/trends?category=beauty&lifecycle=emerging&limit=20`
  - 支持筛选、分页和排序。
- `GET /api/trends/:slug`
  - 返回趋势详情、示例来源、历史曲线、品牌安全信息。
- `GET /api/export?format=json`
  - 导出 JSON 或 CSV。

### 7.2 后台接口
- `POST /api/admin/review`
  - 审核趋势，支持 `approved/rejected/needs_review`。
- `POST /api/ingestion/run`
  - 手动触发一次合法源采集。
- `GET /api/sources`
  - 返回平台接入状态、合规边界、所需环境变量和当前配置完成度。

## 10. 平台接入矩阵

| 平台 | 接入方式 | 当前状态 | 可采字段 | 限制 |
| --- | --- | --- | --- | --- |
| YouTube | 官方 Data API | 已实现 | 标题、描述、频道、公开视频元数据 | 评论和更深指标需后续扩展 |
| Instagram | Graph API + 授权账号 | 已实现适配器 | caption、permalink、likes、comments、账号信号 | 不支持未授权全网搜索 |
| Threads | 官方 API + 授权账号 | 已实现适配器 | text、permalink、reply/repost 等指标 | 不支持未授权全网搜索 |
| X | 官方 X API | 已实现适配器 | post 文本、recent search、public metrics | 受套餐、速率和成本影响 |
| Naver | Open API | 已实现 Blog Search | 标题、摘要、链接、日期 | 非社交互动指标有限 |
| TikTok | 官方/合作授权 | 预留 | 待授权后定义 | 不做违规抓取 |

## 8. 文件目录结构

```text
app/
  api/
  admin/
  trends/[slug]/
src/
  components/
  lib/
    pipeline/
    repositories/
    sources/
  types/
db/
scripts/
docs/
public/
```

## 9. MVP 实现计划

### Phase 1
- 搭建 Next.js + Tailwind + PostgreSQL + Docker Compose。
- 建立 schema、种子数据、基础 dashboard 和趋势详情页。
- 提供合法数据源抽象层与 YouTube 官方 API 接口。

### Phase 2
- 增加人工审核后台与导出接口。
- 增加真实性过滤与趋势评分可解释字段。
- 增加按分类的商业化潜力榜单。
- 增加数据源配置页、连接测试脚本与平台凭证状态可视化。
- 增加公开趋势信号 importer，与人工证据层形成双层闭环。

### Phase 3
- 接入更多授权数据源。
- 引入 LLM 聚类、释义、示例句生成与品牌安全判断。
- 增加告警、订阅与外部 API。
