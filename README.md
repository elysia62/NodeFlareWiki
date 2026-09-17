# NodeFlare Wiki

**[在线文档 →](https://elysia62.github.io/NodeFlareWiki/)**

[NodeFlare](https://github.com/elysia62/NodeFlare) 的官方文档，基于 [VitePress](https://vitepress.dev) 构建，提供中文与英文两个语言版本。

## 文档目录

- [快速开始](https://elysia62.github.io/NodeFlareWiki/guide/quick-start.html)：界面预览、安装服务端 / Docker 部署 / Agent、平台支持、卸载
- [使用指南](https://elysia62.github.io/NodeFlareWiki/guide/config.html)：配置、监控口径、告警、主题、数据库与备份、反向代理
- [开发指南](https://elysia62.github.io/NodeFlareWiki/dev/develop.html)：本地开发、仓库结构
- [常见问题](https://elysia62.github.io/NodeFlareWiki/faq.html)

## 参与贡献

发现文档错误或缺漏，欢迎提 [Issue](https://github.com/elysia62/NodeFlareWiki/issues)，或修改 `docs/` 下对应页面提交 Pull Request（文档页底部有「在 GitHub 上编辑此页」入口）。

## 本地开发

```bash
bun install
bun run docs:dev
```

`demo-src/` 是公开看板与管理面板的演示源码（NodeFlare 前端 + 模拟数据），推送到 `main` 后由 CI 自动构建并挂载到 `/demo/` 路径。

推送到 `main` 分支后由 CI（[deploy.yml](.github/workflows/deploy.yml)）自动构建并发布到 GitHub Pages。
