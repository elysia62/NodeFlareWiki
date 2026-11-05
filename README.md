# NodeFlare Wiki

**[在线文档 →](https://elysia62.github.io/NodeFlareWiki/)**

[NodeFlare](https://github.com/elysia62/NodeFlare) 的官方文档，基于 [VitePress](https://vitepress.dev) 构建，提供中文与英文两个语言版本。

## 文档目录

- [快速开始](https://elysia62.github.io/NodeFlareWiki/guide/quick-start.html)：界面预览、安装服务端 / Docker 部署 / Agent、平台支持、卸载
- [日常配置](https://elysia62.github.io/NodeFlareWiki/guide/nodes.html)：登录与安全、节点与远程执行、监控采样、流量重置、通知、数据库与备份
- [通知配置](https://elysia62.github.io/NodeFlareWiki/guide/alerts.html)：多选 Telegram / Bark / Discord 等渠道、消息模板、凭证与排错
- [开发指南](https://elysia62.github.io/NodeFlareWiki/dev/develop.html)：本地开发、仓库结构、主题开发
- [常见问题](https://elysia62.github.io/NodeFlareWiki/faq.html)
- [Agent 离线排障](https://elysia62.github.io/NodeFlareWiki/guide/troubleshooting.html)：连接超时、上传确认、自动重连与时钟检查

## 参与贡献

发现文档错误或缺漏，欢迎提 [Issue](https://github.com/elysia62/NodeFlareWiki/issues)，或修改 `docs/` 下对应页面提交 Pull Request（文档页底部有「在 GitHub 上编辑此页」入口）。

## 本地开发

```bash
bun install --frozen-lockfile
bun run docs:dev
```

使用 `package.json` 中指定的 Bun 版本。提交前运行 `bun run docs:build`，检查构建和内部页面链接；修改内容时同步维护 `docs/en/` 的英文页面。

VitePress 暂用稳定版 1.6.4；通过 `overrides` 将其开发服务器依赖固定在已修复漏洞的 Vite 6.4.5 及后续 6.x 兼容版本，避免继续使用 Vite 5。升级 VitePress 时重新检查此覆盖配置。依赖审计：`bun audit --registry https://registry.npmjs.org`。

PR 会由 CI（[deploy.yml](.github/workflows/deploy.yml)）构建检查；推送到 `main` 后自动构建并发布到 GitHub Pages。默认部署路径为 `/NodeFlareWiki/`，部署到域名根目录时使用 `BASE_PATH=/ bun run docs:build`。
