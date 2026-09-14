# Repository Layout

The NodeFlare main repository is organized as follows:

| Directory | Contents |
| --- | --- |
| `backend/` | Server (Rust / Axum / SQLx): `src/routes` API, `src/db` data layer, `src/websocket` real-time channel, `migrations/` schema scripts |
| `agent/` | Agent source (collection / reporting / remote execution / self-update) and per-platform install scripts |
| `shared/` | Telemetry protocol shared by the agent and server (serialization + compression) |
| `frontend/` | Frontend (React + Vite): `src/components`, `src/styles` |
| `scripts/` | Build, version, and smoke-test scripts (including `smoke-test-docker.sh`) |
| `docs/` | English README and the systemd service unit |
| `docker/` | `config.example.toml` for Docker deployments (container paths and listen address) |
| `Dockerfile` | Multi-stage image build: frontend → statically linked Rust binary → Alpine runtime |

This wiki's sources live in the [NodeFlareWiki](https://github.com/elysia62/NodeFlareWiki) repository, built with VitePress. Pull requests to improve the docs are welcome.
