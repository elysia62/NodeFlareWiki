# Configuration

The config file lives in the platform's [default path](/en/guide/platforms#default-paths). A complete annotated example is available in the repository: [`backend/config.example.toml`](https://github.com/elysia62/NodeFlare/blob/main/backend/config.example.toml).

## Options

| Option | Description |
| --- | --- |
| `database_url` | `sqlite://nodeflare.db` or a PostgreSQL connection string such as `postgres://user:password@127.0.0.1:5432/nodeflare?sslmode=disable` |
| `bind_addr` | Listen address, default `127.0.0.1:2206` |
| `admin_username` | Admin username |
| `admin_password` | Admin password (8–128 characters); only needed for the initial database setup and cleared automatically afterwards |
| `trusted_proxies` | Trusted reverse-proxy IPs / CIDRs; only `X-Forwarded-For` from these ranges is trusted — see [Reverse Proxy](/en/guide/proxy) |
| `turnstile_site_key` / `turnstile_secret_key` | Cloudflare Turnstile keys; leave empty to disable. Can protect the admin login and the public dashboard independently |
| `session_ttl_hours` | Session lifetime (1–2160 hours), default 168 |
| `frontend_dir` / `admin_frontend_dir` | Frontend static asset directories; relative paths resolve against the config file's directory |
| `theme_dir` | Directory where theme ZIPs are extracted, `themes` inside the config directory by default — see [Theme Development](/en/guide/themes) |

::: tip
In Docker the config file is simply `config.toml` in the mounted directory; keep `bind_addr` at `0.0.0.0:2206` — see [Docker Deployment](/en/guide/docker#prepare-the-config).
:::

## Command-line Overrides

Command-line flags temporarily override the config file:

```bash
nodeflare --config <path> --bind <address> --database <url>
```

::: warning
Online migration is disabled when the server is started with `--database`.
:::

## Full Example

The complete `config.example.toml` (for a production install the config lives at `/etc/nodeflare/config.toml`; paths per platform are listed under [default paths](/en/guide/platforms#default-paths); Docker deployments use [`docker/config.example.toml`](https://github.com/elysia62/NodeFlare/blob/main/docker/config.example.toml)):

```toml
# Database connection URL
# SQLite: sqlite:///path/to/database.db or sqlite://nodeflare.db
# PostgreSQL: postgres://user:password@127.0.0.1:5432/nodeflare?sslmode=disable
database_url = "sqlite://nodeflare.db"

# Server listen address
bind_addr = "127.0.0.1:2206"

# Only X-Forwarded-For from these reverse-proxy ranges is trusted
trusted_proxies = ["127.0.0.1/32", "::1/128"]

# Admin username
admin_username = "admin"

# Admin password (8-128 characters; only needed for the initial
# database setup and cleared automatically afterwards)
admin_password = "CHANGE_ME_WITH_A_STRONG_PASSWORD"

# Cloudflare Turnstile site key (public), leave empty to disable
turnstile_site_key = ""

# Cloudflare Turnstile secret key
turnstile_secret_key = ""

# Paths resolve against the config file's directory
frontend_dir = "../frontend/dist"
admin_frontend_dir = "../frontend/admin-dist"

# Directory where downloaded or uploaded theme ZIPs are extracted
theme_dir = "themes"

# Admin session lifetime (hours, 1-2160)
session_ttl_hours = 168
```
