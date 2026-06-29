# GitHub Pages 发布说明

## 适用场景
- 需要一个免费公网网址
- 先给自己或团队看 demo
- 页面以只读方式展示趋势、详情、来源链接和导出文件
- 暂时不依赖数据库和第三方平台凭证

## 这次发布包含什么
- Dashboard
- 每条趋势详情页
- 原始链接清单
- JSON / CSV 导出文件
- 管理后台只读演示页

## 关键约束
- 这是静态正式站，不会在线写入数据库
- `公开趋势信号导入` 和 `人工补证据` 在公网版会显示为只读
- 热点外链会跳到公开趋势页、搜索页或官方页面，不做违规抓取

## 本地重新生成 GitHub Pages 包
先生成导出文件：

```bash
NEXT_PUBLIC_STATIC_SITE=true npm run build:static-exports
```

再构建带仓库前缀的生产包：

```bash
NEXT_PUBLIC_BASE_PATH=/korea-trend-insight-platform NEXT_PUBLIC_STATIC_SITE=true npm run build
```

启动生产服务验证：

```bash
NEXT_PUBLIC_BASE_PATH=/korea-trend-insight-platform NEXT_PUBLIC_STATIC_SITE=true npm run start -- --port 3014 --host localhost
```

最后抓取为 GitHub Pages 静态目录：

```bash
STATIC_SITE_ORIGIN=http://localhost:3014 node --import tsx scripts/build-github-pages-site.ts
```

生成结果在：

```bash
work/github-pages-root
```

## 发布到 GitHub Pages
推荐把 `work/github-pages-root` 的内容发布到仓库的 `gh-pages` 分支根目录。

仓库设置里：
1. 打开 `Settings`
2. 进入 `Pages`
3. Source 选择 `Deploy from a branch`
4. 分支选择 `gh-pages`
5. Folder 选择 `/ (root)`

最终网址通常是：

```text
https://Gawin-yeah.github.io/korea-trend-insight-platform/
```

## 如果以后要升级成动态正式站
再切回 Render / Railway / 自己的服务器部署，并补这些能力：
- PostgreSQL
- 定时任务
- YouTube API Key
- Naver API
- Instagram / Threads / X 官方凭证
