# 配置

配置文件位于[默认目录](/guide/platforms#默认目录)，完整示例见仓库中的 [`backend/config.example.toml`](https://github.com/elysia62/NodeFlare/blob/main/backend/config.example.toml)。

## 配置项

| 配置项 | 说明 |
| --- | --- |
| `database_url` | `sqlite://nodeflare.db` 或 PostgreSQL 连接串，如 `postgres://user:password@127.0.0.1:5432/nodeflare?sslmode=disable` |
| `bind_addr` | 监听地址，默认 `127.0.0.1:2206` |
| `admin_username` | 管理员用户名 |
| `admin_password` | 管理员密码（8–128 字符），仅首次初始化数据库需要，成功后自动清空 |
| `trusted_proxies` | 可信反向代理 IP / CIDR 列表；只有来自这些网段的 `X-Forwarded-For` 才会被信任，详见[反向代理](/guide/proxy) |
| `turnstile_site_key` / `turnstile_secret_key` | Cloudflare Turnstile 密钥，留空则禁用；可分别保护管理员登录与公开看板 |
| `session_ttl_hours` | 会话有效期（1–2160 小时），默认 168 |
| `frontend_dir` / `admin_frontend_dir` | 前端静态资源目录，相对路径按配置文件所在目录解析 |
| `theme_dir` | 主题解压目录，默认配置目录下的 `themes`，详见[主题定制](/guide/themes) |

## 命令行参数

启动时可用命令行临时覆盖配置：

```bash
nodeflare --config <路径> --bind <地址> --database <URL>
```

::: warning
使用 `--database` 启动时，后台的在线迁移功能会被禁用。
:::
