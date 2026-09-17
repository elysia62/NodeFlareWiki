# 安装 Agent

在管理后台「服务器」页面创建节点，执行弹窗中的安装命令。Agent 主动出站连接服务端，**无需开放入站端口**。

## Linux

```bash
curl -fsSL https://raw.githubusercontent.com/elysia62/NodeFlare/main/agent/agent.sh \
  | sudo sh -s -- -e 'https://nodeflare.example.com' -t 'Agent Token'
```

## 各平台脚本

| 平台 | 脚本 | 服务方式 |
| --- | --- | --- |
| Linux | `agent/agent.sh` | systemd / OpenRC |
| macOS（Apple Silicon） | `agent/install-macos.sh` | launchd |
| FreeBSD | `agent/install-freebsd.sh` | rc.d |
| Windows | `agent/install.ps1` | 计划任务 |

## Agent 参数

| 参数 | 说明 |
| --- | --- |
| `-e` | NodeFlare 服务地址（必填） |
| `-t` | Agent Token（必填） |
| `-i` | 初始历史保存间隔，15–3600 秒（默认 60） |
| `-m` | GitHub 下载加速前缀，如 `https://ghproxy.net`（可选） |
| `--update` | 更新 Agent，沿用已保存的地址与 Token，校验摘要，失败回滚 |
| `--status` | 查看 Agent 状态 |
| `--uninstall` | 卸载 Agent |

Windows 对应 `-Endpoint` / `-Token` / `-Interval` / `-Mirror` 与 `-Update` / `-Status` / `-Uninstall`。

::: tip
Linux 使用 systemd 时，安装脚本将 Token 写入服务单元的 `Environment=NODEFLARE_AGENT_TOKEN=...`；`--update` 从该服务配置读取地址、Token 和历史保存间隔。
:::

## 更新

Linux：

```bash
curl -fsSL https://raw.githubusercontent.com/elysia62/NodeFlare/main/agent/agent.sh \
  | sudo sh -s -- --update
```

更新沿用已保存的地址与 Token，校验摘要，失败自动回滚。Windows 对应 `-Update`；macOS / FreeBSD 在对应安装脚本后加 `--update` 即可。
