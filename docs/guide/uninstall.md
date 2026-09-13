# 卸载

## 卸载服务端

保留配置与数据（仅停止并移除服务）：

```bash
sudo sh install.sh --uninstall
```

卸载并删除配置与数据：

```bash
sudo sh install.sh --uninstall --purge
```

Windows PowerShell（管理员）：

```powershell
& "$env:TEMP\nodeflare-install.ps1" -Uninstall          # 保留配置与数据
& "$env:TEMP\nodeflare-install.ps1" -Uninstall -Purge   # 删除配置与数据
```

::: warning
`--purge` / `-Purge` 会删除配置目录下的全部数据，包括 SQLite 数据库、主题与备份。如需保留数据，请先在后台「数据库」页面导出备份，见[数据库与备份](/guide/database)。
:::

卸载时会自动移除注册的系统服务（systemd / OpenRC / launchd / FreeBSD rc / Windows 计划任务）。各平台的程序与数据目录见[平台支持与默认目录](/guide/platforms#默认目录)。

## 卸载 Agent

各平台 Agent 安装脚本均支持 `--uninstall` 参数（Windows 为 `-Uninstall`）。以 Linux 为例：

```bash
curl -fsSL https://raw.githubusercontent.com/elysia62/NodeFlare/main/agent/agent.sh \
  | sudo sh -s -- --uninstall
```

Windows PowerShell（管理员）：

```powershell
& .\install.ps1 -Uninstall
```

卸载后节点不再上报，可在管理后台「服务器」页面删除对应节点。Agent 的程序与状态目录见[平台支持与默认目录](/guide/platforms#默认目录)。
