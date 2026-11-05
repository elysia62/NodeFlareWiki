# Agent 离线排障

节点离线表示面板没有及时收到有效上报，不能仅凭离线状态判断主机关机或 Agent 退出。先保留故障时的日志和时间，再决定是否重启。

## 1. 确认进程与时间

Linux systemd 安装可执行：

```bash
date -Is
systemctl show nodeflare-agent -p ActiveState -p SubState -p MainPID -p ExecMainStartTimestamp -p NRestarts
journalctl -u nodeflare-agent --since '30 minutes ago' --no-pager
```

`active/running` 只说明进程存活，不说明上传成功。日志中混有重启前的错误时，可按当前进程筛选：

```bash
nodeflare_pid="$(systemctl show nodeflare-agent -p MainPID --value)"
journalctl -u nodeflare-agent "_PID=$nodeflare_pid" --since '30 minutes ago' --no-pager
```

其他平台的日志路径见[平台支持与默认目录](/guide/platforms#日志位置)。记录面板最近上报时间、故障起止时间及是否重启；分享日志前去除 Token 等凭证。服务单元或启动参数可能包含 Token，不要直接公开完整内容。

## 2. 检查 Agent 所在机器的连接

在运行 Agent 的机器上执行，把示例域名替换为实际面板地址：

```bash
curl --noproxy '*' -I --connect-timeout 5 --max-time 15 'https://nodeflare.example.com'
```

Agent 的实时上报连接直接访问面板，以上命令也绕过 shell 的 HTTP 代理设置。安装参数 `-m` 是 GitHub 下载镜像，不会代理实时上报。请间隔几秒多次检查；另一台电脑能打开网页，或偶尔一次请求成功，都不能证明 Agent 所在机器的线路稳定。

| 现象 | 优先检查 |
| --- | --- |
| 域名解析失败 | Agent 主机的 DNS、域名拼写与解析记录 |
| TCP 连接超时 | 出口、防火墙、目标端口、入口或回程线路；不是 Token 验证阶段 |
| TLS 证书或握手失败 | 系统时间、证书链、域名与 HTTPS 入口；不要用跳过证书校验作为修复 |
| 普通 HTTPS 成功，WebSocket 失败 | [反向代理](/guide/proxy)的升级头、超时及访问控制 |

普通 HTTP 响应只证明当时的网页请求可达。直接访问 `/api/agent/ws` 而不提供 WebSocket 升级头或认证，可能返回 400、401 或 426；这不能替代真实 Agent 的握手和上传确认。

## 3. 对照日志判断阶段

| 日志或计数 | 含义与下一步 |
| --- | --- |
| `live connection failed: ...` | 建立连接失败；结合后续错误判断解析、TCP、TLS 或 WebSocket 握手问题 |
| 握手返回 401 / 403 | 核对节点 Token，以及反向代理或入口认证是否拦截 Agent |
| `backend protocol mismatch` | 核对实际运行的 Agent 与后端版本，按匹配版本更新 |
| `live ACK timed out` | 发送后未及时收到持久化确认；对照网络、后端和数据库日志，不能仅由这条日志确定原因 |
| `livePersistenceFailures` 增加 | 后端返回持久化错误，检查后端日志、数据库连接、磁盘空间和上报校验 |

Agent 大约每 5 分钟输出一条 `agent runtime stats`：

- `collections` 持续增加，说明采集仍在运行。
- `liveConnectFailures` 是这一统计窗口内的连接失败次数。
- `liveBatches` 记录已发送批次，不等于后端已经保存。
- `persistedSamplesPruned` 增加，说明收到了持久化确认并清理了已确认样本；再结合面板的最近上报时间确认恢复。
- `liveQueueDropped` 增加，说明有待上传样本因队列上限被丢弃；不要把各队列累计的计数直接当作唯一丢失样本数。

这些计数每次输出后重新累计，应比较连续几个窗口。后端日志可用 `journalctl -u nodeflare.service --since '30 minutes ago' --no-pager`，Docker 部署用 `docker logs --since 30m nodeflare`。

## 4. 重连、积压与时钟

Agent 会自动重连，连续失败后延长重试间隔，上限约一分钟并带少量抖动。重启会立即重新尝试连接，但不能据此判断故障一定在进程内；需要对照重启前后的连接与确认结果。

未确认的样本会保存在本地并在重连后尝试补传，但队列有上限：当前最多保留约 720 个逐秒样本，即约 12 分钟。长时间离线会丢弃最早的样本，因此历史数据可能留下空缺；不要删除 `pending.jsonl` 来尝试修复连接。

检查系统是否正确同步时间，Linux 可用 `timedatectl status`。采样时间明显偏离服务端时会被拒收，运行中的大幅校时也值得与故障时间对照。请依据时间戳和日志判断，不要把所有掉线归因于校时。

看板离线窗口与通知延迟的区别见[在线与离线](/guide/monitoring#在线与离线)。
