# Install the Agent

Create a node on the **Servers** page of the admin panel and run the install command shown in its dialog. The agent connects to the server over an outbound connection, so **no inbound ports need to be opened**.

## Linux

```bash
curl -fsSL https://raw.githubusercontent.com/elysia62/NodeFlare/main/agent/agent.sh \
  | sudo sh -s -- -e 'https://nodeflare.example.com' -t 'Agent Token'
```

## Per-platform Scripts

| Platform | Script | Service manager |
| --- | --- | --- |
| Linux | `agent/agent.sh` | systemd / OpenRC |
| macOS (Apple Silicon) | `agent/install-macos.sh` | launchd |
| FreeBSD | `agent/install-freebsd.sh` | rc.d |
| Windows | `agent/install.ps1` | Scheduled task |

## Agent Options

| Option | Description |
| --- | --- |
| `-e` | NodeFlare server URL (required) |
| `-t` | Agent token (required) |
| `-i` | Initial history save interval, 15–3600 seconds (default 60) |
| `-m` | GitHub download mirror prefix, e.g. `https://ghproxy.net` (optional) |
| `--update` | Update the agent, reusing the saved URL and token; verifies checksums and rolls back on failure |
| `--status` | Show agent status |
| `--uninstall` | Uninstall the agent |

Windows equivalents: `-Endpoint` / `-Token` / `-Interval` / `-Mirror` and `-Update` / `-Status` / `-Uninstall`.

::: tip
On Linux with systemd, the install script writes the token directly into the service unit as `Environment=NODEFLARE_AGENT_TOKEN=...`; `--update` reads the URL, token, and history interval back from that unit.
:::

## Updating

Linux:

```bash
curl -fsSL https://raw.githubusercontent.com/elysia62/NodeFlare/main/agent/agent.sh \
  | sudo sh -s -- --update
```

The update reuses the saved URL and token, verifies checksums, and rolls back automatically on failure. Windows uses `-Update`; on macOS / FreeBSD append `--update` to the platform's install script.
