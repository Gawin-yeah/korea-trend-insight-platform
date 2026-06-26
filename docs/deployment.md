# 部署文档

## 1. 目标
本项目支持两种本地运行方式：

1. `Demo 模式`
   不依赖 PostgreSQL，不需要申请任何平台凭证，直接使用内置 seed 数据预览页面、详情页和后台。
2. `完整模式`
   使用 PostgreSQL 持久化趋势、证据和导入结果，适合联调 API、管理后台和 worker。

## 2. 前置要求
- Node.js 20+
- npm 10+
- Docker Desktop 4+（如果用 Docker 运行）

## 3. Demo 模式

### 3.1 Docker 方式
```bash
cp .env.demo.example .env.demo
docker compose -f docker-compose.demo.yml up --build
```

访问地址：
- `http://localhost:3000`
- `http://localhost:3000/admin`
- `http://localhost:3000/admin/sources`
- `http://localhost:3000/admin/evidence`

如果本机 `3000` 已被占用，可以改成：

```bash
npm run dev -- --port 3001
```

### 3.2 本机 Node 方式
如果你只是想快速看界面，直接运行：

```bash
npm install
npm run dev
```

说明：
- 当 `DATABASE_URL` 为空或未设置时，应用会自动进入 demo 模式。
- 首页、分类榜单、趋势详情页、数据源后台都会读取内置种子数据。
- `公开趋势信号导入` 按钮在 demo 模式下会返回模拟导入结果，不会写入数据库。
- `人工补证据` 提交在 demo 模式下不会持久化。

## 4. 完整模式

### 4.1 环境变量
```bash
cp .env.example .env
```

如果你使用本机 Postgres，请把 `.env` 中的 `DATABASE_URL` 设置为：

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/ktrend
```

### 4.2 Docker Compose 完整栈
```bash
docker compose up --build
```

该命令会启动：
- `db`：PostgreSQL 16
- `app`：Web 应用
- `worker`：定时任务 worker

容器行为：
- `app` 启动前自动执行 `npm run db:migrate`
- 当 `SEED_ON_BOOT=true` 时自动执行 `npm run db:seed`
- `worker` 启动前同样会自动迁移数据库

### 4.3 本机 Node + 本机 Postgres
```bash
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

另开一个终端运行 worker：

```bash
npm run worker
```

## 5. 可选平台凭证
以下都不是 demo 必需项：

- `YOUTUBE_API_KEY`
- `INSTAGRAM_ACCESS_TOKEN`
- `INSTAGRAM_BUSINESS_ACCOUNT_ID`
- `THREADS_ACCESS_TOKEN`
- `THREADS_USER_ID`
- `X_BEARER_TOKEN`
- `NAVER_CLIENT_ID`
- `NAVER_CLIENT_SECRET`
- `OPENAI_API_KEY`

说明：
- 不配置这些凭证时，站点仍可通过公开趋势快照和 seed 数据完成演示。
- 只有在你需要真实 API 接入时才需要逐项补齐。

## 6. 常用命令
```bash
npm run dev
npm run build
npm run db:migrate
npm run db:seed
npm run worker
npm run test:sources
npm run import:signals
```

## 7. 联调建议

### 先看页面
先用 demo 模式确认：
- 首页 dashboard 是否正常加载
- 趋势详情页是否正常打开
- 管理后台是否能展示 seed 数据

### 再开数据库
确认 UI 没问题后，再切到完整模式验证：
- 迁移是否成功
- seed 是否成功
- 证据提交是否能落库
- `POST /api/ingestion/run?kind=public_signals` 是否能落库

## 8. 上线前检查清单
- `npm run build` 通过
- PostgreSQL 已连通
- `.env` 中生产凭证已配置
- 平台接入均使用官方 API 或授权数据源
- 趋势记录包含 `source_url`、`source_platform`、采集时间、原文和置信度
- 管理后台能人工审核趋势与补证据
