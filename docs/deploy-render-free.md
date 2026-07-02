# Render 免费正式站部署

## 适用场景
这条路线适合：
- 你自己先用
- 先要一个真实公网网址
- 暂时接受免费额度和空闲休眠限制
- 愿意先做动态部署，再逐步补全实时数据源

## 当前仓库已准备好的内容
- `render.yaml`
- `Dockerfile.prod`
- `.env.production.example`

这意味着：
- Render 可以直接从仓库读取部署配置
- 不配置 `DATABASE_URL` 也能启动
- 免费版默认走 `web + postgres`，不依赖独立 worker

## 免费版的重要限制
根据 Render 官方文档：
- Free web service 15 分钟无访问会休眠
- 再次访问会自动唤醒，通常约 1 分钟
- 免费 Web Service 有月度免费时长与带宽限制
- 免费 Postgres 30 天后会过期

来源：
- [Render Free Web Services](https://render.com/docs/free)

## 免费实时版推荐部署方式
如果你的目标是“最新热点自动更新”，不要再走纯 seed 演示模式。

免费版推荐部署：
- 一个 `web service`
- 一个 `PostgreSQL`

这样可以具备：
- Dashboard 自动轮询
- 数据过期时由 Web 请求自动触发刷新
- 最新时间戳落库

说明：
- Render 当前免费方案下，`Background Worker` 可能不可用。
- 所以这份仓库的免费 Blueprint 默认不再创建 worker，而是使用“请求驱动刷新”。
- 如果后续升级到付费方案，再把独立 worker / cron 恢复即可。

## 部署步骤

### 1. 上传到 GitHub
先把当前仓库推到 GitHub。

### 2. 登录 Render
打开：
- [https://dashboard.render.com/](https://dashboard.render.com/)

### 3. 新建 Blueprint
在 Render 中：
1. 点击 `New`
2. 选择 `Blueprint`
3. 连接你的 GitHub 仓库
4. 选择当前项目仓库
5. Render 会自动识别根目录的 `render.yaml`

### 4. 填环境变量
如果要实时版，至少填这几个：
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_AUTO_REFRESH_SECONDS`
- `REALTIME_STALE_AFTER_MINUTES`

建议再填这些 live 数据源变量：
- `YOUTUBE_API_KEY`
- `NAVER_CLIENT_ID`
- `NAVER_CLIENT_SECRET`
- `GOOGLE_TRENDS_RSS_URL`

可后续补充：
- `OPENAI_API_KEY`
- `INSTAGRAM_ACCESS_TOKEN`
- `INSTAGRAM_BUSINESS_ACCOUNT_ID`
- `THREADS_ACCESS_TOKEN`
- `THREADS_USER_ID`
- `X_BEARER_TOKEN`

### 5. 选择 Free
Render Blueprint 中的 `plan: free` 已经写在 `render.yaml` 里。

### 6. 部署
点击部署即可。

## 这次部署后的表现
部署成功后你会得到：
- 一个 `onrender.com` 的公网地址
- 动态可访问网站
- Dashboard 自动轮询
- 数据过期后自动触发刷新
- 首页、趋势详情页、来源链接、导出功能都可访问

## 现实限制
- Render 免费实例会休眠，所以“实时”更准确地说是“自动刷新、按访问拉起更新的动态站”，不是 24x7 常驻 worker 的企业级监控。
- 没有 `YOUTUBE_API_KEY`、`NAVER_*` 等变量时，系统会退回 snapshot 或 demo 数据，不会凭空生成韩国最新热点。
- GitHub Pages 不适合这类实时需求。
