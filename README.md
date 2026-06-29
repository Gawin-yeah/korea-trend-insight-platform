# 韩国流行词与趋势洞察平台

一个面向内容、产品、市场团队的韩国本土趋势洞察 Web 平台。当前 MVP 采用“双层路线”：
- 公开趋势站点做 `发现层`
- 人工补证据做 `解释层`

## 功能范围
- 中文默认界面，保留韩语原词与罗马音。
- 首页卡片、趋势详情页、后台列表同时展示中文与英文解释。
- Top 50 今日趋势、上升最快趋势、分类榜单、商业化潜力榜单。
- 趋势详情页：释义、使用语境、风险等级、公开趋势信号、人工证据、热度曲线。
- 管理后台：审核、数据源配置、人工证据录入。
- 合法数据源抽象：已提供 YouTube Data API 接口与授权型平台占位接入。
- PostgreSQL 持久化、cron worker 定时任务、Docker Compose 本地运行。

## 零申请可运行路线
- 公开趋势站点：`TikTok Creative Center`、`Google Trends`、`Naver DataLab`、`YouTube Charts/Explore`
- 人工补证据：研究员手工录入链接、截图摘要、评论摘录、分析师备注
- 深度授权采集：Instagram / Threads / X / Naver Open API 作为后续增强层

## GitHub Pages 正式站说明
- GitHub Pages 版本是免费公网静态站，适合演示、分享和团队查看。
- 它不会自动刷新韩国最新热点，页面内容固定为上次构建时的种子数据或导出结果。
- 如果要看接近实时的最新热点，需要切回动态部署路线，接入数据库、定时任务和官方 API。

## 技术栈
- 前端与 API：Next.js 16 + TypeScript + Tailwind CSS
- 数据库：PostgreSQL
- 定时任务：Node cron worker
- LLM：OpenAI 可选，用于聚类、释义和风险判断
- 部署开发：Docker Compose

## 快速开始

### 1. 本地 Demo 模式
不需要 PostgreSQL，也不需要任何平台凭证，直接用内置种子数据预览整站。

```bash
cp .env.demo.example .env.demo
docker compose -f docker-compose.demo.yml up --build
```

或者直接用本机 Node：

```bash
npm install
npm run dev
```

启动后访问：
- Dashboard: [http://localhost:3000](http://localhost:3000)
- 管理后台: [http://localhost:3000/admin](http://localhost:3000/admin)
- 数据源后台: [http://localhost:3000/admin/sources](http://localhost:3000/admin/sources)
- 证据后台: [http://localhost:3000/admin/evidence](http://localhost:3000/admin/evidence)

如果 `3000` 端口已被占用，可以改用：

```bash
npm run dev -- --port 3001
```

### 2. 完整本地模式
需要 PostgreSQL，适合验证迁移、seed、人工补证据持久化与定时任务。

### 2.1 配置环境变量
```bash
cp .env.example .env
```

把 `DATABASE_URL` 改成你本机 Postgres，或直接使用下面的 Docker Compose 完整栈。

### 2.2 使用 Docker Compose
```bash
docker compose up --build
```

启动后访问：
- Dashboard: [http://localhost:3000](http://localhost:3000)
- 管理后台: [http://localhost:3000/admin](http://localhost:3000/admin)
- 证据后台: [http://localhost:3000/admin/evidence](http://localhost:3000/admin/evidence)

### 2.3 本地 Node 开发
```bash
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

### 3. 手动触发采集
```bash
curl -X POST http://localhost:3000/api/ingestion/run
```

### 4. 测试数据源连通性
```bash
npm run test:sources
npm run test:sources -- youtube
npm run test:sources -- instagram_authorized
npm run test:sources -- threads_authorized
npm run test:sources -- x_api
npm run test:sources -- naver
```

### 5. 导入公开趋势信号
```bash
npm run import:signals
```

或者在后台打开：
- [http://localhost:3000/admin/sources](http://localhost:3000/admin/sources)
- 点击“`一键导入公开信号`”

如果当前没有配置 PostgreSQL，按钮会进入“预览导入模式”，返回各公开信号导入器的模拟导入数量，但不会落库。

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
- `docs/deployment.md` 包含本地 Demo、完整 Docker 栈、环境变量和上线前检查清单。
- `docs/deploy-github.md` 提供不依赖 GPT/Sites 的 GitHub 上线方案，包含 VPS / Railway / Render 三条路线。
- `docs/deploy-github-pages.md` 提供 GitHub Pages 静态正式站的重新构建与发布步骤。
- `docs/deploy-render-free.md` 提供单人可用、低成本的 Render 免费正式站部署方案。
- 首次启动会根据 `SEED_ON_BOOT` 自动写入种子数据，便于直接查看 UI。
- 首批韩语趋势关键词种子统一定义在 [src/lib/keywords/kr-seeds.ts](/Users/gawin/Documents/Codex/2026-06-24/sites-plugin-sites-openai-bundled/src/lib/keywords/kr-seeds.ts)。
