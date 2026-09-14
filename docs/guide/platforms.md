# 平台支持与默认目录

## 平台支持

| 角色 | 平台 | 架构 |
| --- | --- | --- |
| 服务端 | Linux | x64 / ARM64 |
| 服务端 | Windows | x64 |
| 服务端 | macOS | ARM64 |
| 服务端 | FreeBSD 13+ | x64 / ARM64 |
| 服务端 | Docker | 与宿主机架构一致（x64 / ARM64） |
| Agent | Linux / Windows / macOS / FreeBSD | 同上（macOS 仅 Apple Silicon） |

安装脚本会自动检测系统服务管理器（systemd / OpenRC / launchd / FreeBSD rc / Windows 计划任务）并注册为开机自启；Docker 部署通过 `restart unless-stopped` 实现，见 [Docker 部署](/guide/docker)。

## 默认目录

| 平台 | 程序 | 配置与数据 |
| --- | --- | --- |
| Linux | `/opt/nodeflare` | `/etc/nodeflare` |
| Windows | `%ProgramFiles%\NodeFlare` | `%ProgramData%\NodeFlare\Server` |
| macOS | `/usr/local/libexec/nodeflare` | `/Library/Application Support/NodeFlare/Server` |
| FreeBSD | `/usr/local/libexec/nodeflare` | `/var/db/nodeflare/server` |
| Docker | 镜像内已包含 | 容器内 `/etc/nodeflare`，本文示例挂载宿主机的同名目录 |

Agent（Linux）：程序位于 `/opt/nodeflare/agent`，配置与状态位于 `/etc/nodeflare/agent`。SQLite 文件位于配置目录下。

按本文 Docker 示例部署时，宿主机与容器内的配置文件路径均为 `/etc/nodeflare/config.toml`，目录及配置文件需允许容器用户 `10001:10001` 读写，见 [Docker 部署](/guide/docker#准备配置)。

## 日志位置

- Linux（systemd）：`journalctl -u nodeflare -f`；Agent 为 `journalctl -u nodeflare-agent -f`
- Linux（OpenRC）：`rc-service nodeflare status`
- macOS：`/var/log/nodeflare.log`
- Windows：`Get-ScheduledTaskInfo -TaskName nodeflare`
- Docker：`docker logs -f nodeflare`
