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

## 技术栈

| 部分 | 技术 |
| --- | --- |
| 服务端 | Rust / Axum / SQLx |
| Agent | Rust（采集 / 上报 / 远程执行 / 自更新） |
| 前端 | React + Vite |
| 遥测协议 | Agent 与服务端共享的序列化 + 压缩协议 |
