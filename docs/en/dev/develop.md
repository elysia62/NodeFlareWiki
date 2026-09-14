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
nodeflare_version="$(sh scripts/resolve-version.sh)"
docker build --build-arg NODEFLARE_VERSION="$nodeflare_version" -t nodeflare:local .
```

The root `Dockerfile` builds the frontend assets and a Rust backend statically linked with musl. The runtime uses the latest stable `alpine:latest` image and runs as non-root user `10001:10001`. The commands above resolve the version with `scripts/resolve-version.sh` and pass it to both frontend and backend as a build argument. After building, use the same version to verify startup and frontend assets:

```bash
NODEFLARE_VERSION="$nodeflare_version" sh scripts/smoke-test-docker.sh nodeflare:local
```

GitHub Actions publishes images only when a version tag in the form `vX.Y.Z` is pushed. After the amd64 / arm64 builds and checks pass, it publishes to `gxmandppx/nodeflare`. Image version tags omit the `v` prefix, and `latest` is updated at the same time.

For image usage see [Docker Deployment](/en/guide/docker).

## Tech Stack

| Part | Technology |
| --- | --- |
| Server | Rust / Axum / SQLx |
| Agent | Rust (collection / reporting / remote execution / self-update) |
| Frontend | React + Vite |
| Telemetry protocol | Shared agent–server protocol (serialization + compression) |
