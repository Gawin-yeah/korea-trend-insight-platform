# 韩国流行词与趋势洞察平台 本地部署说明

## 最快方式
如果你现在只是要先测页面，直接在项目根目录运行：

```bash
npm install
npm run dev
```

然后打开：
- `http://localhost:3000`
- `http://localhost:3000/admin`
- `http://localhost:3000/admin/sources`
- `http://localhost:3000/admin/evidence`

这个模式不需要数据库，会自动使用内置演示数据。

如果 `3000` 已被占用，就改用：

```bash
npm run dev -- --port 3001
```

## Docker Demo 方式
```bash
cp .env.demo.example .env.demo
docker compose -f docker-compose.demo.yml up --build
```

## 完整模式
如果你要测试 PostgreSQL 持久化，再执行：

```bash
cp .env.example .env
docker compose up --build
```

或本机运行：

```bash
npm run db:migrate
npm run db:seed
npm run dev
```

详细版本请看仓库内：
- `docs/deployment.md`
