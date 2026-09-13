# 安装服务端

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

首次安装会询问以下信息：

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

## 更新

重新运行安装脚本即可，配置数据保留。安装与更新都会校验 Release 摘要，失败时自动回滚到上一版本。
