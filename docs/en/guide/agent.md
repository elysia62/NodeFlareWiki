# Install the Agent

Create a node on the **Servers** page, click its download icon, select the target system and run the generated command. The agent connects outbound, so **no inbound ports are needed**. Generate the command from the panel's HTTPS address; the administrator's `127.0.0.1` is not an address a remote agent can use.

## Linux

```bash
curl -fsSL https://raw.githubusercontent.com/elysia62/NodeFlare/main/agent/agent.sh \
  | sudo sh -s -- -e 'https://nodeflare.example.com' -t 'Agent Token' --disable-remote
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
| `--disable-remote` | Disable remote execution in the local service arguments; the backend cannot override it |
| `--update` | Update the agent, reusing the saved URL and token; verifies checksums and rolls back on failure |
| `--status` | Show agent status |
| `--uninstall` | Uninstall the agent |

Windows equivalents: `-Endpoint` / `-Token` / `-Interval` / `-Mirror` / `-DisableRemote` and `-Update` / `-Status` / `-Uninstall`.

New nodes disable remote execution by default, so their commands include the flag. An agent without the flag accepts remote tasks; see [Node Configuration](/en/guide/nodes#remote-execution). This restriction does not prevent normal monitoring reports.

::: tip
On Linux with systemd, the install script writes the token into the service unit as `Environment=NODEFLARE_AGENT_TOKEN=...`; `--update` reads the URL, token, and history interval from that unit.
:::

## Updating

Linux:

```bash
curl -fsSL https://raw.githubusercontent.com/elysia62/NodeFlare/main/agent/agent.sh \
  | sudo sh -s -- --update
```

The update reuses the saved URL and token, verifies checksums, and rolls back automatically on failure. Windows uses `-Update`; on macOS / FreeBSD, append `--update` to the platform's install script.

Updates also preserve existing remote execution permission. After an update, check the service and confirm new reports reach the panel; a successful installer exit alone does not confirm data delivery.
