# 安装服务端

第一次部署按以下顺序操作：安装服务端 → 配置 HTTPS 反向代理 → 登录后台 → 创建节点并安装 Agent → 配置通知与备份。服务端与被监控节点可以在不同机器上。

安装脚本自动下载最新 Release 并注册系统服务（systemd / OpenRC / launchd / FreeBSD rc / Windows 计划任务）。

## 一键安装

Linux / macOS：

```bash
curl -fsSL https://raw.githubusercontent.com/elysia62/NodeFlare/main/install.sh | sudo sh
```

FreeBSD：

```sh
fetch -qo - https://raw.githubusercontent.com/elysia62/NodeFlare/main/install.sh | sudo sh
```

Windows PowerShell（管理员）：

```powershell
Invoke-WebRequest -UseBasicParsing https://raw.githubusercontent.com/elysia62/NodeFlare/main/install.ps1 -OutFile "$env:TEMP\nodeflare-install.ps1"
Unblock-File "$env:TEMP\nodeflare-install.ps1"
& "$env:TEMP\nodeflare-install.ps1"
```

## 首次初始化

安装会询问：

- 管理员用户名与密码（8–128 字符）
- 监听端口（默认 `2206`）
- 数据库地址（默认 SQLite）

服务端默认监听 `127.0.0.1:2206`，本机访问 `http://127.0.0.1:2206/admin/login`；对外使用需经 HTTPS 反向代理，见[反向代理](/guide/proxy)。

::: tip
管理员密码仅首次初始化数据库时需要，初始化完成后会自动从配置文件中清除。
:::

## 安装脚本参数

| 命令 | 说明 |
| --- | --- |
| `sudo sh install.sh` | 交互菜单 |
| `sudo sh install.sh --install` | 安装或更新 |
| `sudo sh install.sh --status` | 查看服务状态 |
| `sudo sh install.sh --restart` | 重启服务 |
| `sudo sh install.sh --uninstall` | 卸载，保留配置和数据 |
| `sudo sh install.sh --uninstall --purge` | 卸载并删除配置与数据 |

Windows 对应参数为 `-Install` / `-Status` / `-Restart` / `-Uninstall [-Purge]`，卸载流程详见[卸载](/guide/uninstall)。

上表以脚本已下载到本地为前提；用管道执行时把参数追加到 `sh -s --` 之后，例如查看服务状态：

```bash
curl -fsSL https://raw.githubusercontent.com/elysia62/NodeFlare/main/install.sh | sudo sh -s -- --status
```

## Docker 部署

官方镜像 `gxmandppx/nodeflare` 支持 amd64 / arm64。示例将配置和本地数据保存在宿主机的 `/etc/nodeflare`：

```bash
sudo mkdir -p /etc/nodeflare
sudo curl -fsSL https://raw.githubusercontent.com/elysia62/NodeFlare/main/docker/config.example.toml -o /etc/nodeflare/config.toml
# 编辑 /etc/nodeflare/config.toml，填好管理员账号密码
sudo chown -R 10001:10001 /etc/nodeflare

docker run -d --name nodeflare \
  --restart unless-stopped \
  -p 2206:2206 \
  -v /etc/nodeflare:/etc/nodeflare \
  gxmandppx/nodeflare:latest
```

随后访问 `http://服务器IP:2206/admin/login`，节点与 Agent 的配置与脚本安装一致。对外使用需经 HTTPS 反向代理，见[反向代理](/guide/proxy)；Compose 示例、更新与卸载见 [Docker 部署](/guide/docker)。

## 更新

重新运行安装脚本即可，配置与数据保留。安装与更新都会校验 Release 摘要，失败时自动回滚。

## 接下来做什么

1. 通过[反向代理](/guide/proxy)后的地址访问 `/admin/login`，使用安装时的账号登录。
2. 在[登录与安全](/guide/security)检查账号、启用 TOTP，并按需保护登录页和公开看板。
3. 在「监控节点」创建节点，使用下载按钮取得[Agent 安装命令](/guide/agent)，到被监控的机器上执行。
4. 确认节点已有实时数值，再配置[流量周期](/guide/traffic)和[通知渠道](/guide/alerts)，逐一发送测试。
5. 从后台「数据库」[导出备份](/guide/database)，保存到面板所在机器之外的位置。

遇到离线或连接错误时，先看[常见问题](/faq)和服务日志。能打开首页不代表 WebSocket 代理配置正确。
