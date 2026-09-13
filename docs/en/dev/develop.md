# Development Setup

The NodeFlare server and agent are written in Rust, the frontend uses React + Vite, and [bun](https://bun.sh) manages packages.

## Clone and Run

```bash
git clone https://github.com/elysia62/NodeFlare.git
cd NodeFlare
bun install --frozen-lockfile
cp backend/config.example.toml backend/config.toml
./dev.sh
```

- `dev.sh` builds the frontend and starts the backend with `cargo run`;
- `start.sh` builds a release binary, preferring `/etc/nodeflare/config.toml`, or the file pointed to by `NODEFLARE_CONFIG`.

## Tests and Build

```bash
bun test --cwd frontend
cargo test --locked --manifest-path backend/Cargo.toml
cargo test --locked --manifest-path agent/Cargo.toml
bun run build
```

## Smoke Test

Start the panel first, then:

```bash
MONITOR_ADMIN_USERNAME=admin MONITOR_ADMIN_PASSWORD='your password' bun run test:smoke
```

## Tech Stack

| Part | Technology |
| --- | --- |
| Server | Rust / Axum / SQLx |
| Agent | Rust (collection / reporting / remote execution / self-update) |
| Frontend | React + Vite |
| Telemetry protocol | Shared agent–server protocol (serialization + compression) |
