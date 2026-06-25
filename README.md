# 韩国流行词与趋势洞察平台

一个面向内容、产品、市场团队的韩国本土趋势洞察 Web 平台。当前 MVP 采用“双层路线”：
- 公开趋势站点做 `发现层`
- 人工补证据做 `解释层`

## 功能范围
- 中文默认界面，保留韩语原词与罗马音。
- Top 50 今日趋势、上升最快趋势、分类榜单、商业化潜力榜单。
- 趋势详情页：释义、使用语境、风险等级、公开趋势信号、人工证据、热度曲线。
- 管理后台：审核、数据源配置、人工证据录入。
- 合法数据源抽象：已提供 YouTube Data API 接口与授权型平台占位接入。
- PostgreSQL 持久化、cron worker 定时任务、Docker Compose 本地运行。

## 零申请可运行路线
- 公开趋势站点：`TikTok Creative Center`、`Google Trends`、`Naver DataLab`、`YouTube Charts/Explore`
- 人工补证据：研究员手工录入链接、截图摘要、评论摘录、分析师备注
- 深度授权采集：Instagram / Threads / X / Naver Open API 作为后续增强层

## 技术栈
- 前端与 API：Next.js 15 + TypeScript + Tailwind CSS
- 数据库：PostgreSQL
- 定时任务：Node cron worker
- LLM：OpenAI 可选，用于聚类、释义和风险判断
- 部署开发：Docker Compose

## 快速开始

### 1. 配置环境变量
```bash
cp .env.example .env
```

### 2. 使用 Docker Compose
```bash
docker compose up --build
```

启动后访问：
- Dashboard: [http://localhost:3000](http://localhost:3000)
- 管理后台: [http://localhost:3000/admin](http://localhost:3000/admin)
- 证据后台: [http://localhost:3000/admin/evidence](http://localhost:3000/admin/evidence)

### 3. 本地 Node 开发
```bash
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

### 4. 手动触发采集
```bash
curl -X POST http://localhost:3000/api/ingestion/run
```

### 5. 测试数据源连通性
```bash
npm run test:sources
npm run test:sources -- youtube
npm run test:sources -- instagram_authorized
npm run test:sources -- threads_authorized
npm run test:sources -- x_api
npm run test:sources -- naver
```

### 6. 导入公开趋势信号
```bash
npm run import:signals
```

或者在后台打开：
- [http://localhost:3000/admin/sources](http://localhost:3000/admin/sources)
- 点击“`一键导入公开信号`”

## 合法数据接入说明
- Instagram 仅支持官方 API、授权商业或创作者账号。
- Threads 仅支持官方 API 和授权账号内容，不做未授权广场抓取。
- X 仅支持官方 X API，按开发者套餐和条款调用。
- Naver 通过官方 Open API 接入 Blog/Search 结果。
- YouTube 通过官方 YouTube Data API 获取。
- TikTok 当前仅保留合法授权扩展位。
- 代码中不包含违反平台条款的 scraping 方案。

## 当前平台接入状态
- `公开趋势发现层`：TikTok Creative Center、Google Trends、Naver DataLab、YouTube Charts 作为信号源先行。
- `YouTube`：已实现官方搜索型采集。
- `Instagram`：已实现授权账号媒体列表适配器，需要 `INSTAGRAM_ACCESS_TOKEN` 和 `INSTAGRAM_BUSINESS_ACCOUNT_ID`。
- `Threads`：已实现授权账号帖子读取适配器，需要 `THREADS_ACCESS_TOKEN` 和 `THREADS_USER_ID`。
- `X`：已实现官方 recent search 适配器，需要 `X_BEARER_TOKEN`。
- `Naver`：已实现 Blog Search 适配器，需要 `NAVER_CLIENT_ID` 和 `NAVER_CLIENT_SECRET`。
- `TikTok`：当前仅保留合法授权接口位。

## 目录
```text
app/                 Next.js 页面与 API Routes
src/components/      UI 组件
src/lib/             数据访问、评分、聚类、数据源适配器
db/                  SQL schema 与种子数据
scripts/             迁移与 worker 脚本
docs/                PRD 与架构文档
```

## 关键接口
- `GET /api/dashboard`
- `GET /api/sources`
- `GET /api/sources/test`
- `POST /api/ingestion/run?kind=public_signals`
- `POST /api/admin/evidence`
- `GET /api/trends`
- `GET /api/trends/[slug]`
- `POST /api/admin/review`
- `GET /api/export`
- `POST /api/ingestion/run`

## 说明
- `docs/prd.md` 包含 PRD、schema 设计、系统架构文字图、API 设计、目录结构与 MVP 计划。
- 首次启动会根据 `SEED_ON_BOOT` 自动写入种子数据，便于直接查看 UI。
- 首批韩语趋势关键词种子统一定义在 [src/lib/keywords/kr-seeds.ts](/Users/gawin/Documents/Codex/2026-06-24/sites-plugin-sites-openai-bundled/src/lib/keywords/kr-seeds.ts)。
