# 开发环境

NodeFlare 服务端与 Agent 使用 Rust，前端使用 React + Vite，包管理使用 [bun](https://bun.sh)。

## 克隆与启动

```bash
git clone https://github.com/elysia62/NodeFlare.git
cd NodeFlare
bun install --frozen-lockfile
cp backend/config.example.toml backend/config.toml
./dev.sh
```

- `dev.sh`：构建前端并以 `cargo run` 启动后端；
- `start.sh`：构建 release 版本，优先使用 `/etc/nodeflare/config.toml`，也可用 `NODEFLARE_CONFIG` 指定。

## 测试与构建

提交前可先运行统一检查：

```bash
bun run check
```

它涵盖前端类型、测试与构建、Shell 语法、Rust 格式、Clippy、单元测试及依赖审计。Rust 审计需要安装 `cargo-audit`；PostgreSQL 专项测试需要 `NODEFLARE_TEST_POSTGRES_URL`，未满足条件时脚本会明确提示跳过。请使用专用测试数据库，不要连接生产库。

按需单独执行：

```bash
bun test --cwd frontend
cargo test --locked --manifest-path shared/Cargo.toml
cargo test --locked --manifest-path backend/Cargo.toml
cargo test --locked --manifest-path agent/Cargo.toml
bun run build
```

## 浏览器与 Agent 运行测试

`e2e/` 使用 Playwright，默认调用 `/usr/bin/chromium`，中文截图还需要 CJK 字体。先启动前端开发服务器，再执行：

```bash
bun run test:e2e:types
bun run test:e2e
```

真实上报用例需要可用后端与 Agent，条件不足会跳过；环境、截图基线和分组说明见主仓库 `e2e/README.md`。

Agent 的运行测试会创建临时本地服务和独立状态目录，检查重连补传、远程任务结果与握手超时恢复：

```bash
CARGO_TARGET_DIR=target/agent cargo build --locked --manifest-path agent/Cargo.toml
MONITOR_AGENT_BINARY=target/agent/debug/nodeflare-agent node scripts/agent-runtime-test.mjs
```

## 冒烟测试

需先启动面板：

```bash
MONITOR_ADMIN_USERNAME=admin MONITOR_ADMIN_PASSWORD='你的密码' bun run test:smoke
```

## 构建镜像

```bash
nodeflare_version="$(sh scripts/resolve-version.sh)"
docker build --build-arg NODEFLARE_VERSION="$nodeflare_version" -t nodeflare:local .
```

仓库根目录的 `Dockerfile` 构建前端资源，并打包静态链接（musl）的 Rust 后端；运行时使用最新稳定版 `alpine:latest`，以非 root 用户 `10001:10001` 运行。上述命令通过 `scripts/resolve-version.sh` 解析版本号，并作为构建参数传给前后端。构建后用同一版本号验证启动与前端资源：

```bash
NODEFLARE_VERSION="$nodeflare_version" sh scripts/smoke-test-docker.sh nodeflare:local
```

GitHub Actions 仅在推送 `vX.Y.Z` 格式的版本标签时发布镜像；amd64 / arm64 构建与检查通过后推送到 `gxmandppx/nodeflare`。镜像版本标签不带 `v`，并同步更新 `latest`。

镜像的使用方式见 [Docker 部署](/guide/docker)。

## 技术栈

| 部分 | 技术 |
| --- | --- |
| 服务端 | Rust / Axum / SQLx |
| Agent | Rust（采集 / 上报 / 远程执行 / 自更新） |
| 前端 | React + Vite |
| 遥测协议 | Agent 与服务端共享的序列化 + 压缩协议 |
