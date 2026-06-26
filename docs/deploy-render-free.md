# Render 免费正式站部署

## 适用场景
这条路线适合：
- 你自己先用
- 先要一个真实公网网址
- 暂时接受免费额度和空闲休眠限制
- 先不上真实数据库，直接使用内置 seed 数据

## 当前仓库已准备好的内容
- `render.yaml`
- `Dockerfile.prod`
- `.env.production.example`

这意味着：
- Render 可以直接从仓库读取部署配置
- 不配置 `DATABASE_URL` 也能启动
- 网站会以“正式网站 + seed 数据”模式运行

## 免费版的重要限制
根据 Render 官方文档：
- Free web service 15 分钟无访问会休眠
- 再次访问会自动唤醒，通常约 1 分钟
- 免费 Web Service 有月度免费时长与带宽限制
- 免费 Postgres 30 天后会过期

来源：
- [Render Free Web Services](https://render.com/docs/free)

## 推荐部署方式
先只部署一个 `web service`，不要挂数据库。

这样优点是：
- 成本最低
- 成功率最高
- 你能先拿到一个真实网址
- 后面如果要接真实数据，再单独补 `DATABASE_URL`

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
首次部署时建议只填这几个：
- `NEXT_PUBLIC_APP_URL`

可先留空这些：
- `DATABASE_URL`
- `YOUTUBE_API_KEY`
- `NAVER_CLIENT_ID`
- `NAVER_CLIENT_SECRET`
- `OPENAI_API_KEY`

### 5. 选择 Free
Render Blueprint 中的 `plan: free` 已经写在 `render.yaml` 里。

### 6. 部署
点击部署即可。

## 这次部署后的表现
部署成功后你会得到：
- 一个 `onrender.com` 的公网地址
- 真实可访问网站
- 首页、趋势详情页、来源链接、导出功能都可访问

但当前版本：
- 不会持久化人工补证据
- 不会跑真实数据库写入
- 更像“正式公网演示站”

## 什么时候再加数据库
当你需要：
- 人工证据持久化
- 趋势审核持久化
- 定时导入真实数据

再补：
- `DATABASE_URL`
- 一个长期可用的 Postgres

## 为什么我现在推荐这个版本
因为这条路径最接近你要的：
- 是正式网站
- 真能上线
- 免费可跑
- 操作最少
