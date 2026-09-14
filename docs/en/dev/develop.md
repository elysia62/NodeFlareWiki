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

## Building the Image

```bash
docker build -t nodeflare:local .
```

The `Dockerfile` at the repository root builds the frontend assets first, then packs the statically linked Rust binary into an Alpine runtime (running as non-root UID `10001`). The version is resolved by `scripts/resolve-version.sh` and can be overridden with `--build-arg NODEFLARE_VERSION=1.2.3`. After building, verify startup and frontend assets with:

```bash
NODEFLARE_VERSION=1.0.0 sh scripts/smoke-test-docker.sh nodeflare:local
```

For image usage see [Docker Deployment](/en/guide/docker).

## Tech Stack

| Part | Technology |
| --- | --- |
| Server | Rust / Axum / SQLx |
| Agent | Rust (collection / reporting / remote execution / self-update) |
| Frontend | React + Vite |
| Telemetry protocol | Shared agent–server protocol (serialization + compression) |
