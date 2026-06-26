# GitHub 上线方案

## 先说结论
这套项目不能直接部署到 `GitHub Pages`。

原因：
- 它是一个带服务端能力的 Next.js / Vinext 应用，不只是静态页面。
- 项目里有 API 路由、PostgreSQL 和 worker。
- GitHub Pages 官方定位是静态站点托管，不提供这种服务端运行时。

所以更合适的路线是：

1. `GitHub + VPS + Docker Compose`
2. `GitHub + Railway`
3. `GitHub + Render`

如果你要我给一个最稳、最可控、最适合团队长期访问的方案，我推荐：

`GitHub + VPS + Docker Compose + Caddy`

## 方案 A：GitHub + VPS

### 仓库里已经准备好的文件
- `Dockerfile.prod`
- `docker-compose.prod.yml`
- `deploy/Caddyfile`
- `.env.production.example`

### 适合你们的原因
- 不依赖 GPT / Sites
- 域名、服务器、数据库都由你们自己控制
- 团队成员只要打开域名就能访问
- 后续接入真实 API、PostgreSQL、worker 都比较顺

### 部署步骤
1. 把项目推到 GitHub 仓库
2. 准备一台 Linux VPS
3. VPS 安装 Docker 与 Docker Compose
4. 域名解析到这台 VPS
5. 在服务器上把 `.env.production.example` 复制成 `.env.production`
6. 填好 `APP_DOMAIN`、`POSTGRES_PASSWORD`、`DATABASE_URL` 等参数
7. 执行：

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

## 方案 B：GitHub + Railway

适合：
- 不想自己管服务器
- 想更快上线
- 接受把 Web 和数据库放在托管平台

建议方式：
- GitHub 连接 Railway
- 使用仓库根目录的 `Dockerfile` 或 `Dockerfile.prod`
- PostgreSQL 用 Railway 托管数据库

注意：
- 如果你走 Railway，建议把当前生产 Dockerfile 改名为根目录默认 `Dockerfile`，或者在 Railway 配置自定义 Dockerfile 路径。

## 方案 C：GitHub + Render

适合：
- 想要托管数据库
- 想用更图形化的控制台
- 需要团队成员一起管理环境

建议方式：
- GitHub 连接 Render
- Web Service 使用 Docker 部署
- PostgreSQL 用 Render Postgres

## 我建议你现在怎么选

### 如果你要最快可交付
选 `GitHub + Railway`

### 如果你要长期稳定、可控、适合团队内部正式使用
选 `GitHub + VPS + Docker Compose + Caddy`

## 还差什么
我现在已经把代码侧准备好了，但真正上线还差你的外部资源：

1. GitHub 仓库
2. 服务器或云平台账号
3. 域名
4. 生产环境变量

## 如果你下一步要我继续
我可以继续帮你做这两种中的任意一种：

1. 帮你把仓库整理成最适合 `GitHub + Railway` 的版本
2. 帮你把 `GitHub + VPS` 的生产配置再补完整，包括更细的服务器初始化文档
