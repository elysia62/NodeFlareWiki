# Install the Server

The install script downloads the latest release automatically and registers a system service (systemd / OpenRC / launchd / FreeBSD rc / Windows scheduled task).

## One-line Install

Linux / macOS:

```bash
curl -fsSL https://raw.githubusercontent.com/elysia62/NodeFlare/main/install.sh | sudo sh
```

FreeBSD:

```sh
fetch -qo - https://raw.githubusercontent.com/elysia62/NodeFlare/main/install.sh | sudo sh
```

Windows PowerShell (Administrator):

```powershell
Invoke-WebRequest -UseBasicParsing https://raw.githubusercontent.com/elysia62/NodeFlare/main/install.ps1 -OutFile "$env:TEMP\nodeflare-install.ps1"
Unblock-File "$env:TEMP\nodeflare-install.ps1"
& "$env:TEMP\nodeflare-install.ps1"
```

## First-time Initialization

The first install asks for:

- Admin username and password (8–128 characters)
- Listen port (default `2206`)
- Database URL (SQLite by default)

The server listens on `127.0.0.1:2206` by default; access it locally at `http://127.0.0.1:2206/admin/login`. For external access, put it behind an HTTPS reverse proxy — see [Reverse Proxy](/en/guide/proxy).

::: tip
The admin password is only needed for the initial database setup and is removed from the config file automatically afterwards.
:::

## Install Script Options

| Command | Description |
| --- | --- |
| `sudo sh install.sh` | Interactive menu |
| `sudo sh install.sh --install` | Install or update |
| `sudo sh install.sh --status` | Show service status |
| `sudo sh install.sh --restart` | Restart the service |
| `sudo sh install.sh --uninstall` | Uninstall, keeping config and data |
| `sudo sh install.sh --uninstall --purge` | Uninstall and delete config and data |

Windows equivalents are `-Install` / `-Status` / `-Restart` / `-Uninstall [-Purge]`. See [Uninstall](/en/guide/uninstall) for the uninstall workflow.

The commands above run a script already downloaded to disk; you can also pipe it directly, for example to check the service status:

```bash
curl -fsSL https://raw.githubusercontent.com/elysia62/NodeFlare/main/install.sh | sudo sh -s -- --status
```

## Updating

Re-run the install script to update. Config and data are preserved, downloads are verified by checksum, and a failed update automatically rolls back to the previous version.
