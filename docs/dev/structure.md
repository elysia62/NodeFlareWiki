# 仓库结构

NodeFlare 主仓库的目录结构如下：

| 目录 | 内容 |
| --- | --- |
| `backend/` | 服务端（Rust / Axum / SQLx）：`src/routes` 接口、`src/db` 数据层、`src/websocket` 实时通道、`migrations/` 建表脚本 |
| `agent/` | Agent 源码（采集 / 上报 / 远程执行 / 自更新）与各平台安装脚本 |
| `shared/` | Agent 与服务端共用的遥测协议（序列化 + 压缩） |
| `frontend/` | 前端（React + Vite）：`src/components` 组件、`src/styles` 样式 |
| `scripts/` | 构建、版本解析与冒烟测试脚本（含 `smoke-test-docker.sh`） |
| `docs/` | 英文 README 与 systemd 服务单元 |
| `docker/` | Docker 部署用的 `config.example.toml`（容器内路径与监听地址不同） |
| `Dockerfile` | 多阶段镜像构建：前端 → 静态链接的 Rust 二进制 → Alpine 运行时 |

本 Wiki 的源码位于 [NodeFlareWiki](https://github.com/elysia62/NodeFlareWiki) 仓库，基于 VitePress 构建，欢迎通过 Pull Request 补充文档。
