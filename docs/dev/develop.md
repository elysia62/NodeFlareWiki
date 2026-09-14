# 开发环境

NodeFlare 的服务端与 Agent 使用 Rust，前端使用 React + Vite，包管理使用 [bun](https://bun.sh)。

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

```bash
bun test --cwd frontend
cargo test --locked --manifest-path backend/Cargo.toml
cargo test --locked --manifest-path agent/Cargo.toml
bun run build
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

仓库根目录的 `Dockerfile` 构建前端资源和使用 musl 静态链接的 Rust 后端，运行时使用最新稳定版 `alpine:latest`，以非 root 用户 `10001:10001` 运行。上述命令通过 `scripts/resolve-version.sh` 解析版本号，再作为构建参数传给前后端。构建后使用同一版本号验证启动与前端资源：

```bash
NODEFLARE_VERSION="$nodeflare_version" sh scripts/smoke-test-docker.sh nodeflare:local
```

GitHub Actions 仅在推送 `vX.Y.Z` 格式的版本标签时发布镜像；amd64 / arm64 构建及验证成功后，推送到 `gxmandppx/nodeflare`。镜像版本标签不带 `v`，并同时更新 `latest`。

镜像的使用方式见 [Docker 部署](/guide/docker)。

## 技术栈

| 部分 | 技术 |
| --- | --- |
| 服务端 | Rust / Axum / SQLx |
| Agent | Rust（采集 / 上报 / 远程执行 / 自更新） |
| 前端 | React + Vite |
| 遥测协议 | Agent 与服务端共享的序列化 + 压缩协议 |
