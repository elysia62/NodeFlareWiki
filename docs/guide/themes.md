# 主题开发

公开看板主题是一个**纯静态 ZIP 包**：一个 `index.html` 入口加上任意静态资源，通过面板的公开数据接口获取节点数据并渲染。本页描述主题包的结构约束与数据接口。

## 主题包结构

```text
theme.zip
├── index.html        # 必需，入口页面
├── theme.json        # 可选，设置表单声明
└── assets/
    └── app.css       # 其他静态资源，按需组织
```

- `index.html` 必须位于 ZIP 根目录；全部文件都在同一顶层目录内时（如 `ocean/index.html`），安装时会自动以该目录为根。
- 在 `index.html` 中用 `"/assets/xxx`（或 `'/assets/xxx`）绝对路径引用资源；服务端会自动把前缀重写到实际主题路径（`/__theme-active/…`，预览时为 `/__theme-preview/…`），无需关心部署细节。

大小与数量限制：

| 限制项 | 上限 |
| --- | --- |
| 主题 ZIP | 32 MiB |
| 压缩包条目数 | 4096 |
| `index.html` | 4 MiB（非空、UTF-8） |
| 单个资源文件 | 16 MiB |
| 解压后总量 | 128 MiB |

其他约束：不允许符号链接等特殊文件；`__MACOSX` 目录与 `.DS_Store` 会被忽略。

## theme.json 设置表单

`theme.json` 可选，用于在管理后台生成主题的**设置表单**；管理员填写的值经 [Bootstrap 接口](#get-apibootstrap) 的 `config.theme_options` 下发（键值对，未设置时为默认值）。

```json
{
  "schema": 1,
  "version": "1.0.0",
  "settings": [
    { "key": "accent_color", "label": "强调色", "type": "color", "default": "#54d6ab" },
    { "key": "show_footer", "label": "显示页脚", "type": "toggle", "default": true },
    {
      "key": "layout", "label": "卡片布局", "type": "select", "default": "grid",
      "options": [
        { "label": "网格", "value": "grid" },
        { "label": "列表", "value": "list" }
      ]
    }
  ]
}
```

字段说明：

| 字段 | 必需 | 说明 |
| --- | --- | --- |
| `schema` | 是 | 固定为 `1` |
| `version` | 否 | 主题版本号，显示在后台主题列表 |
| `settings` | 否 | 设置项数组，最多 40 项 |

每个设置项：

| 字段 | 必需 | 说明 |
| --- | --- | --- |
| `key` | 是 | 值的键名，≤ 64 字符，仅限字母 / 数字 / `_` / `-`，不可重复 |
| `label` | 是 | 表单标签，≤ 80 字符 |
| `type` | 是 | `text` / `textarea` / `url` / `color` / `select` / `toggle` / `number` |
| `default` | 否 | 默认值 |
| `placeholder` | 否 | 输入框占位文本 |
| `options` | `select` 必需 | 选项数组，形如 `[{"label": "网格", "value": "grid"}]` |

## 数据接口

所有接口相对面板根路径。公开看板关闭或人机验证未通过时，`bootstrap` 正常返回，但 `access` 不是 `ok` 且 `servers` 为空数组；其余数据接口分别返回 401 / 403。

### GET /api/bootstrap

看板的主接口，返回站点配置、节点列表与汇率：

```json
{
  "access": "ok",
  "config": { "…": "见下表" },
  "servers": [ { "…": "见下表" } ],
  "exchange_rates": { "base": "CNY", "rates": { "USD": 7.1 } }
}
```

`config`（站点公开配置，节选）：

| 字段 | 说明 |
| --- | --- |
| `site_name` / `site_description` / `site_announcement` | 站点名称、描述、公告 |
| `logo_url` / `background_url` | Logo 与背景图 |
| `locale` | 界面语言（`zh-CN` / `en`） |
| `public_dashboard` | 是否开启公开仪表盘 |
| `offline_threshold_seconds` | 判定离线的阈值秒数（配合 `servers[].timestamp`） |
| `history_retention_days` | 历史数据保留天数 |
| `theme_options` | 本主题的设置值（`theme.json` 声明的键值对） |
| `show_search` / `show_groups` / `show_stats` / `show_assets` / `show_traffic` / `show_speed` / `show_price` / `show_expiry` / `show_latency` / `show_uptime` | 后台「显示项」开关，主题应尊重这些开关 |
| `turnstile_site_key` / `turnstile_enabled` / `turnstile_login_enabled` / `totp_login_enabled` | 验证相关状态 |

`servers[]` 为节点的公开投影（`hidden`、IP、网卡、上报间隔等私有字段已剔除），常用字段：

| 字段 | 说明 |
| --- | --- |
| `id` / `name` | 节点 ID 与名称，`id` 用于查询历史接口 |
| `region` / `group_name` / `tags` | 地区、分组、标签 |
| `timestamp` | 最近一次上报时间戳（秒），配合 `offline_threshold_seconds` 判断在线 |
| `cpu` / `cpu_cores` / `cpu_model` | CPU 使用率与信息 |
| `load1` / `load5` / `load15` | 负载 |
| `mem_used` / `mem_total` / `swap_used` / `swap_total` | 内存与 Swap（字节） |
| `disk_used` / `disk_total` / `disks[]` | 磁盘用量与磁盘列表 |
| `net_in` / `net_out` / `net_rx_total` / `net_tx_total` | 实时网速与累计流量 |
| `uptime` / `processes` / `tcp_connections` / `udp_connections` | 运行时长与连接数 |
| `os` / `kernel` / `arch` / `virtualization` / `gpu_model` / `gpu_usage` / `agent_version` | 系统信息 |
| `price` / `currency` / `billing_cycle` / `expires_at` / `traffic_limit` / `traffic_limit_type` / `auto_renewal` | 计费与额度信息 |

### GET /api/history/:id

历史监控数据，`hours` 查询参数指定范围（默认 24）：`{"points": [...]}`。每个点包含 `timestamp`、`cpu`（含 `cpu_min` / `cpu_max`）、`load1/5/15`、`mem_used`（含峰值）、`swap_*`、`disk_*`、`net_in` / `net_out`、`net_rx_total` / `net_tx_total`、`processes`、`tcp_connections`、`udp_connections`、`gpu_usage`、`disk_read_bps` / `disk_write_bps` 等字段。

### GET /api/latency/:id

拨测历史，`hours` 查询参数指定范围（默认 24）：`{"tasks": [...], "points": [...]}`，`tasks` 为该节点的拨测任务，`points` 按任务与线路聚合。

### GET /api/exchange-rates

每日汇率快照，用于多币种价格折算。

### GET /api/ws

WebSocket 实时通道，推送压缩后的实时上报帧（与 Agent 遥测同协议），文本帧 `ping` / `pong` 为心跳。不需要实时刷新的主题可以只轮询 `bootstrap`，或参考内置主题的解析实现。

## 安装与预览

主题商店支持三种来源：内置主题、GitHub 仓库（读取 latest Release 中的 ZIP）、本地上传 ZIP。安装后可先**预览**再**激活**；预览与激活使用独立地址，互不影响线上看板。

主题解压目录由 `theme_dir` 配置（默认配置目录下的 `themes`），见[配置](/guide/config#配置项)。

::: tip
内置主题 `builtin-nodeflare-glass` 的源码位于主仓库 `frontend/` 目录（React 实现），是最完整的数据接口使用示例。
:::
