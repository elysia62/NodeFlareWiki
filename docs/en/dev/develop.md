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

Run the combined checks before submitting:

```bash
bun run check
```

This covers frontend types, tests and builds, shell syntax, Rust formatting, Clippy, unit tests and dependency audits. Rust audits require `cargo-audit`; PostgreSQL-specific tests require `NODEFLARE_TEST_POSTGRES_URL`. The script reports skips when these are unavailable. Use a dedicated test database, never a production database.

Individual commands are also available:

```bash
bun test --cwd frontend
cargo test --locked --manifest-path shared/Cargo.toml
cargo test --locked --manifest-path backend/Cargo.toml
cargo test --locked --manifest-path agent/Cargo.toml
bun run build
```

## Browser and Agent Runtime Tests

`e2e/` uses Playwright with `/usr/bin/chromium` by default. Chinese screenshot baselines also need CJK fonts. Start the frontend development server, then run:

```bash
bun run test:e2e:types
bun run test:e2e
```

Live reporting cases require a running backend and agent and skip when unavailable. See `e2e/README.md` in the main repository for setup, screenshot baselines and test groups.

Agent runtime tests create temporary local servers and isolated state directories to check replay after reconnecting, remote task results and recovery from stalled handshakes:

```bash
CARGO_TARGET_DIR=target/agent cargo build --locked --manifest-path agent/Cargo.toml
MONITOR_AGENT_BINARY=target/agent/debug/nodeflare-agent node scripts/agent-runtime-test.mjs
```

## Smoke Test

Start the panel first, then:

```bash
MONITOR_ADMIN_USERNAME=admin MONITOR_ADMIN_PASSWORD='your password' bun run test:smoke
```

## Building the Image

```bash
nodeflare_version="$(sh scripts/resolve-version.sh)"
docker build --build-arg NODEFLARE_VERSION="$nodeflare_version" -t nodeflare:local .
```

The root `Dockerfile` builds the frontend assets and a statically linked (musl) Rust backend. The runtime uses the latest stable `alpine:latest` image and runs as non-root user `10001:10001`. The commands above resolve the version with `scripts/resolve-version.sh` and pass it to both frontend and backend as a build argument. After building, verify startup and frontend assets with the same version:

```bash
NODEFLARE_VERSION="$nodeflare_version" sh scripts/smoke-test-docker.sh nodeflare:local
```

GitHub Actions publishes images only when a `vX.Y.Z` tag is pushed; after the amd64 / arm64 builds and checks pass, it publishes to `gxmandppx/nodeflare`. Image version tags omit the `v` prefix and update `latest` at the same time.

For image usage see [Docker Deployment](/en/guide/docker).

## Tech Stack

| Part | Technology |
| --- | --- |
| Server | Rust / Axum / SQLx |
| Agent | Rust (collection / reporting / remote execution / self-update) |
| Frontend | React + Vite |
| Telemetry protocol | Shared agent–server protocol (serialization + compression) |
