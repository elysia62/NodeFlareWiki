# Theme Development

A public-dashboard theme is a **pure static ZIP package**: an `index.html` entry plus arbitrary static assets that fetch node data from the panel's public API. This page describes the package layout and the data interface.

## Package Layout

```text
theme.zip
├── index.html        # required, entry page
├── theme.json        # optional, settings form declaration
└── assets/
    └── app.css       # other static assets, organized as needed
```

- `index.html` must sit at the root of the ZIP; if every file lives inside a single top-level directory (e.g. `ocean/index.html`), that directory is used as the root automatically.
- Reference assets with absolute paths like `"/assets/xxx` (or `'/assets/xxx`) in `index.html`; the server rewrites the prefix to the actual theme path (`/__theme-active/…`, or `/__theme-preview/…` while previewing), so themes don't need to know deployment details.

Size and count limits:

| Limit | Maximum |
| --- | --- |
| Theme ZIP | 32 MiB |
| Archive entries | 4096 |
| `index.html` | 4 MiB (non-empty, UTF-8) |
| Single asset file | 16 MiB |
| Total extracted size | 128 MiB |

Other constraints: symlinks and special files are rejected; `__MACOSX` directories and `.DS_Store` files are ignored.

## theme.json Settings Form

`theme.json` is optional and generates a **settings form** for the theme in the admin panel. The values the admin fills in are delivered through `config.theme_options` in the [Bootstrap API](#get-apibootstrap) (a key–value map; unset keys fall back to defaults).

```json
{
  "schema": 1,
  "version": "1.0.0",
  "settings": [
    { "key": "accent_color", "label": "Accent color", "type": "color", "default": "#54d6ab" },
    { "key": "show_footer", "label": "Show footer", "type": "toggle", "default": true },
    {
      "key": "layout", "label": "Card layout", "type": "select", "default": "grid",
      "options": [
        { "label": "Grid", "value": "grid" },
        { "label": "List", "value": "list" }
      ]
    }
  ]
}
```

Top-level fields:

| Field | Required | Description |
| --- | --- | --- |
| `schema` | yes | Always `1` |
| `version` | no | Theme version, shown in the admin theme list |
| `settings` | no | Array of settings, at most 40 items |

Each setting:

| Field | Required | Description |
| --- | --- | --- |
| `key` | yes | Value key, ≤ 64 characters, letters / digits / `_` / `-` only, unique |
| `label` | yes | Form label, ≤ 80 characters |
| `type` | yes | `text` / `textarea` / `url` / `color` / `select` / `toggle` / `number` |
| `default` | no | Default value |
| `placeholder` | no | Input placeholder text |
| `options` | required for `select` | Options array, e.g. `[{"label": "Grid", "value": "grid"}]` |

## Data API

All endpoints are relative to the panel root. When the public dashboard is disabled or the human-verification challenge hasn't been passed, `bootstrap` still returns but `access` is not `ok` and `servers` is empty; the other data endpoints answer 401 / 403 respectively.

### GET /api/bootstrap

The dashboard's main endpoint, returning site config, the node list, and exchange rates:

```json
{
  "access": "ok",
  "config": { "…": "see table below" },
  "servers": [ { "…": "see table below" } ],
  "exchange_rates": { "base": "CNY", "rates": { "USD": 7.1 } }
}
```

`config` (public site configuration, selected fields):

| Field | Description |
| --- | --- |
| `site_name` / `site_description` / `site_announcement` | Site name, description, announcement |
| `logo_url` / `background_url` | Logo and background image |
| `locale` | UI language (`zh-CN` / `en`) |
| `public_dashboard` | Whether the public dashboard is enabled |
| `offline_threshold_seconds` | Seconds after which a node is considered offline (used with `servers[].timestamp`) |
| `history_retention_days` | History retention in days |
| `theme_options` | This theme's settings (key–value map declared in `theme.json`) |
| `show_search` / `show_groups` / `show_stats` / `show_assets` / `show_traffic` / `show_speed` / `show_price` / `show_expiry` / `show_latency` / `show_uptime` | Admin "visible sections" switches; themes should honor them |
| `turnstile_site_key` / `turnstile_enabled` / `turnstile_login_enabled` / `totp_login_enabled` | Verification state |

`servers[]` is the public projection of a node (private fields such as `hidden`, IPs, network interface, and reporting intervals are stripped). Commonly used fields:

| Field | Description |
| --- | --- |
| `id` / `name` | Node ID and name; `id` is used by the history endpoints |
| `region` / `group_name` / `tags` | Region, group, tags |
| `timestamp` | Last report timestamp (seconds); combine with `offline_threshold_seconds` to determine liveness |
| `cpu` / `cpu_cores` / `cpu_model` | CPU usage and info |
| `load1` / `load5` / `load15` | Load averages |
| `mem_used` / `mem_total` / `swap_used` / `swap_total` | Memory and swap (bytes) |
| `disk_used` / `disk_total` / `disks[]` | Disk usage and per-disk list |
| `net_in` / `net_out` / `net_rx_total` / `net_tx_total` | Live network speed and lifetime totals |
| `uptime` / `processes` / `tcp_connections` / `udp_connections` | Uptime and connection counts |
| `os` / `kernel` / `arch` / `virtualization` / `gpu_model` / `gpu_usage` / `agent_version` | System information |
| `price` / `currency` / `billing_cycle` / `expires_at` / `traffic_limit` / `traffic_limit_type` / `auto_renewal` | Billing and traffic allowance |

### GET /api/history/:id

Historical metrics; the `hours` query parameter selects the range (default 24): `{"points": [...]}`. Each point carries `timestamp`, `cpu` (with `cpu_min` / `cpu_max`), `load1/5/15`, `mem_used` (with peak), `swap_*`, `disk_*`, `net_in` / `net_out`, `net_rx_total` / `net_tx_total`, `processes`, `tcp_connections`, `udp_connections`, `gpu_usage`, `disk_read_bps` / `disk_write_bps`, and more.

### GET /api/latency/:id

Probing history; `hours` selects the range (default 24): `{"tasks": [...], "points": [...]}` where `tasks` lists the node's probing tasks and `points` aggregates by task and carrier line.

### GET /api/exchange-rates

The daily exchange-rate snapshot, used for multi-currency price conversion.

### GET /api/ws

A WebSocket channel pushing compressed real-time report frames (the same telemetry protocol the agent uses); text `ping` / `pong` frames serve as heartbeat. Themes that don't need live refresh can simply poll `bootstrap`, or refer to the built-in theme for a decoding implementation.

## Install and Preview

The theme store offers three sources: built-in themes, GitHub repositories (reads the ZIP from the latest release), and local ZIP upload. After installing, you can **preview** before **activating**; preview and active each get their own URL so the live dashboard is never affected.

Themes are extracted into the directory configured by `theme_dir` (`themes` inside the config directory by default) — see [Configuration](/en/guide/config#options).

::: tip
The built-in theme `builtin-nodeflare-glass` lives in the main repository under `frontend/` (a React implementation) and is the most complete example of using the data API.
:::
