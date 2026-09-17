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

## First-time Setup

The installer asks for:

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

These commands assume the script is already on disk; to pipe it directly, append flags after `sh -s --`, for example to check the service status:

```bash
curl -fsSL https://raw.githubusercontent.com/elysia62/NodeFlare/main/install.sh | sudo sh -s -- --status
```

## Docker Deployment

The official `gxmandppx/nodeflare` image supports amd64 / arm64. This Linux deployment example stores configuration and local data in `/etc/nodeflare` on the host:

```bash
sudo mkdir -p /etc/nodeflare
sudo curl -fsSL https://raw.githubusercontent.com/elysia62/NodeFlare/main/docker/config.example.toml -o /etc/nodeflare/config.toml
# Edit /etc/nodeflare/config.toml and set the administrator username and password
sudo chown -R 10001:10001 /etc/nodeflare

docker run -d --name nodeflare \
  --restart unless-stopped \
  -p 2206:2206 \
  -v /etc/nodeflare:/etc/nodeflare \
  gxmandppx/nodeflare:latest
```

Then open `http://your-server-ip:2206/admin/login`; nodes and agents are configured exactly as with a script install. For external access, use an HTTPS reverse proxy — see [Reverse Proxy](/en/guide/proxy). See [Docker Deployment](/en/guide/docker) for Compose, updates, and uninstall.

## Updating

Re-run the install script to update; config and data are preserved. Installs and updates verify the release checksum and roll back automatically on failure.
