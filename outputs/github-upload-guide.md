# GitHub 交付说明

这份项目现在已经是可直接上传到 GitHub 的完整仓库结构。

## 你要上传哪些内容
把整个项目目录上传到 GitHub 仓库即可，核心包括：

- `app/`
- `src/`
- `db/`
- `scripts/`
- `docs/`
- `.github/`
- `Dockerfile.prod`
- `docker-compose.prod.yml`
- `.env.example`
- `.env.production.example`
- `README.md`

## 不要上传什么
- `node_modules/`
- `.next/`
- `dist/`
- 真实 `.env`
- 本机日志文件

## 最简单的 GitHub 上传步骤
```bash
git init
git add .
git commit -m "Initial commit: korea trend insight platform"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

## 上传后你会得到什么
- 一个可继续开发的网站仓库
- GitHub Actions CI
- VPS 自动部署工作流骨架
- 本地 demo / Docker / 生产部署配置

## 后续上线文档
- `docs/deploy-github.md`
- `docs/deployment.md`
