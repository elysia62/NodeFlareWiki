# 卸载

## 卸载服务端

::: tip
Docker 部署通过 `docker compose down` / `docker rm -f nodeflare` 删除容器；宿主机挂载目录（示例为 `/etc/nodeflare`）会保留，数据清理见 [Docker 部署](/guide/docker#日志与卸载)。
:::

保留配置与数据（仅停止并移除系统服务）。

Linux / macOS：

```bash
curl -fsSL https://raw.githubusercontent.com/elysia62/NodeFlare/main/install.sh | sudo sh -s -- --uninstall
```

FreeBSD：

```sh
fetch -qo - https://raw.githubusercontent.com/elysia62/NodeFlare/main/install.sh | sudo sh -s -- --uninstall
```

卸载并删除配置与数据：在命令后追加 `--purge`：

```bash
curl -fsSL https://raw.githubusercontent.com/elysia62/NodeFlare/main/install.sh | sudo sh -s -- --uninstall --purge
```

Windows PowerShell（管理员）：

```powershell
Invoke-WebRequest -UseBasicParsing https://raw.githubusercontent.com/elysia62/NodeFlare/main/install.ps1 -OutFile "$env:TEMP\nodeflare-install.ps1"
Unblock-File "$env:TEMP\nodeflare-install.ps1"

& "$env:TEMP\nodeflare-install.ps1" -Uninstall          # 保留配置与数据
& "$env:TEMP\nodeflare-install.ps1" -Uninstall -Purge   # 删除配置与数据
```

::: warning
`--purge` / `-Purge` 会删除配置目录下的全部数据，包括 SQLite 数据库、主题与备份。需保留数据时，请先在后台「数据库」页面导出备份，见[数据库与备份](/guide/database)。
:::

卸载时会自动移除注册的系统服务（systemd / OpenRC / launchd / FreeBSD rc / Windows 计划任务）。各平台的程序与数据目录见[平台支持与默认目录](/guide/platforms#默认目录)。

## 卸载 Agent

Linux：

```bash
curl -fsSL https://raw.githubusercontent.com/elysia62/NodeFlare/main/agent/agent.sh \
  | sudo sh -s -- --uninstall
```

Windows PowerShell（管理员）：

```powershell
Invoke-WebRequest -UseBasicParsing https://raw.githubusercontent.com/elysia62/NodeFlare/main/agent/install.ps1 -OutFile "$env:TEMP\nodeflare-agent-install.ps1"
Unblock-File "$env:TEMP\nodeflare-agent-install.ps1"
& "$env:TEMP\nodeflare-agent-install.ps1" -Uninstall
```

卸载后节点不再上报，可在管理后台「服务器」页面删除对应节点。Agent 的程序与状态目录见[平台支持与默认目录](/guide/platforms#默认目录)。
