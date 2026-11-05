# Agent Troubleshooting

An offline node means the panel has not received valid reports in time. It does not by itself prove that the host shut down or the agent exited. Preserve the failure time and logs before deciding whether to restart.

## 1. Check the Process and Time

For Linux systemd installations:

```bash
date -Is
systemctl show nodeflare-agent -p ActiveState -p SubState -p MainPID -p ExecMainStartTimestamp -p NRestarts
journalctl -u nodeflare-agent --since '30 minutes ago' --no-pager
```

`active/running` establishes that the process is alive, not that reports arrive. To exclude errors from previous processes, filter by the current PID:

```bash
nodeflare_pid="$(systemctl show nodeflare-agent -p MainPID --value)"
journalctl -u nodeflare-agent "_PID=$nodeflare_pid" --since '30 minutes ago' --no-pager
```

For other platforms, see [log locations](/en/guide/platforms#log-locations). Record the panel's last report time, the outage window and any restart time. Remove tokens before sharing logs; service units or launch arguments can contain credentials.

## 2. Test from the Agent Host

Run this on the machine running the agent, replacing the example domain with the actual panel URL:

```bash
curl --noproxy '*' -I --connect-timeout 5 --max-time 15 'https://nodeflare.example.com'
```

The agent's live connection accesses the panel directly, so this command also bypasses shell HTTP proxy settings. The installer's `-m` option is a GitHub download mirror, not a live reporting proxy. Repeat the check a few seconds apart. A working page on another computer, or one successful request, does not establish a stable route from the agent host.

| Symptom | Check first |
| --- | --- |
| DNS lookup fails | Host DNS, hostname spelling and DNS records |
| TCP connection times out | Egress, firewalls, destination port, ingress or return path; token validation has not started |
| TLS certificate or handshake fails | System time, certificate chain, hostname and HTTPS endpoint; disabling certificate verification is not a fix |
| HTTPS works but WebSocket fails | Upgrade headers, timeouts and access controls in the [reverse proxy](/en/guide/proxy) |

An ordinary HTTP response only establishes reachability for that request. Accessing `/api/agent/ws` without WebSocket upgrade headers or authentication may return 400, 401 or 426; it does not replace an actual agent handshake and upload acknowledgement.

## 3. Identify the Failing Stage

| Log or counter | Meaning and next step |
| --- | --- |
| `live connection failed: ...` | Connection setup failed; use the remaining error to distinguish DNS, TCP, TLS and WebSocket handshake failures |
| Handshake returns 401 / 403 | Check the node token and any proxy or ingress authentication blocking the agent |
| `backend protocol mismatch` | Check the running backend and agent versions and update to compatible versions |
| `live ACK timed out` | A persistence acknowledgement did not arrive in time; compare network, backend and database logs before assigning a cause |
| Increasing `livePersistenceFailures` | The backend returned a persistence error; check backend logs, database connectivity, disk space and report validation |

The agent writes `agent runtime stats` roughly every five minutes:

- Increasing `collections` means collection is running.
- `liveConnectFailures` counts connection failures in that window.
- `liveBatches` counts sent batches, not confirmed database writes.
- Increasing `persistedSamplesPruned` means persistence acknowledgements arrived and confirmed samples were removed. Also check the panel's last report time to confirm recovery.
- Increasing `liveQueueDropped` means pending samples exceeded queue limits. Counts from multiple queues are not a count of unique lost samples.

Counters reset after each log entry; compare consecutive windows. Backend logs are available with `journalctl -u nodeflare.service --since '30 minutes ago' --no-pager`, or `docker logs --since 30m nodeflare` for Docker deployments.

## 4. Reconnection, Backlogs and Clocks

The agent reconnects automatically. Repeated failures increase its retry delay, capped at roughly a minute plus some jitter. Restarting immediately retries the connection, but does not establish a process fault; compare connectivity and acknowledgements before and after the restart.

Unconfirmed samples are stored locally and replayed after reconnecting, subject to queue limits. The current limit is about 720 one-second samples, or 12 minutes. Long outages discard the oldest samples and can leave gaps in history. Do not delete `pending.jsonl` to troubleshoot connectivity.

Check system clock synchronization; Linux systems can use `timedatectl status`. Reports with timestamps far from server time are rejected, and large clock corrections during operation should be compared with outage times. Use timestamps and logs rather than attributing every outage to clock synchronization.

For dashboard windows versus notification delays, see [Online and Offline Status](/en/guide/monitoring#online-and-offline-status).
