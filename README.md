# NodeFlare Wiki

[NodeFlare](https://github.com/elysia62/NodeFlare) 的文档站，基于 [VitePress](https://vitepress.dev) 构建。

文档内容主要整理自 NodeFlare 主仓库的 `README.md`，站点部署于 GitHub Pages。

## 本地开发

```bash
bun install
bun run docs:dev     # 开发服务器，默认 http://localhost:5173
```

## 构建与预览

```bash
bun run docs:build   # 构建产物输出到 docs/.vitepress/dist
bun run docs:preview # 本地预览构建产物
```

## 部署到 GitHub Pages

1. 将本仓库推送到 GitHub（默认分支 `main`）；
2. 仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**；
3. 之后每次 push 到 `main`，`.github/workflows/deploy.yml` 会自动用 bun 安装依赖、构建并发布。

`base` 路径由 CI 按仓库名自动计算（`https://<user>.github.io/<repo>/`）。如使用自定义域名，把 `docs/.vitepress/config.mts` 中 `BASE_PATH` 的默认值改为 `'/'`（或在 workflow 中固定 `BASE_PATH=/`），并在 Pages 设置中绑定域名。

## 目录结构

```
docs/
├── .vitepress/
│   └── config.mts      # 站点配置：导航、侧边栏、搜索、中文化
├── public/
│   ├── logo.svg        # 项目官方 Logo（来自 NodeFlare 前端）
│   └── images/         # 界面截图
├── index.md            # 首页（Hero + 特性卡片）
├── screenshot.md       # 界面预览
├── guide/              # 快速开始与使用指南
├── dev/                # 开发指南
└── faq.md              # 常见问题
```
