# Uninstall

## Uninstall the Server

::: tip
For Docker deployments (`docker compose down` / `docker rm -f` and the `data/` directory) see [Docker Deployment](/en/guide/docker#logs-and-uninstall).
:::

Keep config and data (stops and removes the service only).

Linux / macOS:

```bash
curl -fsSL https://raw.githubusercontent.com/elysia62/NodeFlare/main/install.sh | sudo sh -s -- --uninstall
```

FreeBSD:

```sh
fetch -qo - https://raw.githubusercontent.com/elysia62/NodeFlare/main/install.sh | sudo sh -s -- --uninstall
```

To delete config and data as well, append `--purge`:

```bash
curl -fsSL https://raw.githubusercontent.com/elysia62/NodeFlare/main/install.sh | sudo sh -s -- --uninstall --purge
```

Windows PowerShell (Administrator):

```powershell
Invoke-WebRequest -UseBasicParsing https://raw.githubusercontent.com/elysia62/NodeFlare/main/install.ps1 -OutFile "$env:TEMP\nodeflare-install.ps1"
Unblock-File "$env:TEMP\nodeflare-install.ps1"

& "$env:TEMP\nodeflare-install.ps1" -Uninstall          # keep config and data
& "$env:TEMP\nodeflare-install.ps1" -Uninstall -Purge   # delete config and data
```

::: warning
`--purge` / `-Purge` deletes everything under the config directory, including the SQLite database, themes, and backups. To keep your data, export a backup from the **Database** page first — see [Database & Backups](/en/guide/database).
:::

Uninstalling also removes the registered service (systemd / OpenRC / launchd / FreeBSD rc / Windows scheduled task). Program and data paths per platform are listed in [Platforms & Paths](/en/guide/platforms#default-paths).

## Uninstall the Agent

The agent install scripts on every platform accept `--uninstall` (`-Uninstall` on Windows). Linux for example:

```bash
curl -fsSL https://raw.githubusercontent.com/elysia62/NodeFlare/main/agent/agent.sh \
  | sudo sh -s -- --uninstall
```

Windows PowerShell (Administrator):

```powershell
Invoke-WebRequest -UseBasicParsing https://raw.githubusercontent.com/elysia62/NodeFlare/main/agent/install.ps1 -OutFile "$env:TEMP\nodeflare-agent-install.ps1"
Unblock-File "$env:TEMP\nodeflare-agent-install.ps1"
& "$env:TEMP\nodeflare-agent-install.ps1" -Uninstall
```

Afterwards the node stops reporting and can be deleted from the **Servers** page of the admin panel. Agent program and state paths are listed in [Platforms & Paths](/en/guide/platforms#default-paths).
