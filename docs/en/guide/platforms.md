# Platforms & Default Paths

## Supported Platforms

| Role | Platform | Architectures |
| --- | --- | --- |
| Server | Linux | x64 / ARM64 |
| Server | Windows | x64 |
| Server | macOS | ARM64 |
| Server | FreeBSD 13+ | x64 / ARM64 |
| Agent | Linux / Windows / macOS / FreeBSD | Same as above (macOS: Apple Silicon only) |

The install script auto-detects the service manager (systemd / OpenRC / launchd / FreeBSD rc / Windows scheduled task) and registers a boot-time service.

## Default Paths

| Platform | Program | Config & data |
| --- | --- | --- |
| Linux | `/opt/nodeflare` | `/etc/nodeflare` |
| Windows | `%ProgramFiles%\NodeFlare` | `%ProgramData%\NodeFlare\Server` |
| macOS | `/usr/local/libexec/nodeflare` | `/Library/Application Support/NodeFlare/Server` |
| FreeBSD | `/usr/local/libexec/nodeflare` | `/var/db/nodeflare/server` |

Agent (Linux): program at `/opt/nodeflare/agent`, config and state at `/etc/nodeflare/agent`. The SQLite file lives in the config directory.

## Log Locations

- Linux (systemd): `journalctl -u nodeflare -f`; agent: `journalctl -u nodeflare-agent -f`
- Linux (OpenRC): `rc-service nodeflare status`
- macOS: `/var/log/nodeflare.log`
- Windows: `Get-ScheduledTaskInfo -TaskName nodeflare`
