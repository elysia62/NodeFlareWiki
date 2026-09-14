# Platforms & Default Paths

## Supported Platforms

| Role | Platform | Architectures |
| --- | --- | --- |
| Server | Linux | x64 / ARM64 |
| Server | Windows | x64 |
| Server | macOS | ARM64 |
| Server | FreeBSD 13+ | x64 / ARM64 |
| Server | Docker | Matches the host architecture (x64 / ARM64) |
| Agent | Linux / Windows / macOS / FreeBSD | Same as above (macOS: Apple Silicon only) |

The install script auto-detects the service manager (systemd / OpenRC / launchd / FreeBSD rc / Windows scheduled task) and registers a boot-time service; Docker deployments start on boot via `restart unless-stopped` — see [Docker Deployment](/en/guide/docker).

## Default Paths

| Platform | Program | Config & data |
| --- | --- | --- |
| Linux | `/opt/nodeflare` | `/etc/nodeflare` |
| Windows | `%ProgramFiles%\NodeFlare` | `%ProgramData%\NodeFlare\Server` |
| macOS | `/usr/local/libexec/nodeflare` | `/Library/Application Support/NodeFlare/Server` |
| FreeBSD | `/usr/local/libexec/nodeflare` | `/var/db/nodeflare/server` |
| Docker | Bundled in the image | `/etc/nodeflare` in the container, mounted from the same host path in these examples |

Agent (Linux): program at `/opt/nodeflare/agent`, config and state at `/etc/nodeflare/agent`. The SQLite file lives in the config directory.

In these Docker examples, the config file is `/etc/nodeflare/config.toml` on both the host and the container. The directory and config file must be readable and writable by container user `10001:10001` — see [Docker Deployment](/en/guide/docker#prepare-the-config).

## Log Locations

- Linux (systemd): `journalctl -u nodeflare -f`; agent: `journalctl -u nodeflare-agent -f`
- Linux (OpenRC): `rc-service nodeflare status`
- macOS: `/var/log/nodeflare.log`
- Windows: `Get-ScheduledTaskInfo -TaskName nodeflare`
- Docker: `docker logs -f nodeflare`
