# Docker Deployment

The official `gxmandppx/nodeflare` image ([Docker Hub](https://hub.docker.com/r/gxmandppx/nodeflare)) supports amd64 / arm64. This Linux example mounts `/etc/nodeflare` at the same path inside the container to persist config and data.

## First Deployment

### Prepare the Config

For the first deployment, create `/etc/nodeflare` on the host and download the example config as `config.toml`. The container reads this file at startup:

```bash
sudo mkdir -p /etc/nodeflare
sudo curl -fsSL https://raw.githubusercontent.com/elysia62/NodeFlare/main/docker/config.example.toml -o /etc/nodeflare/config.toml
```

Edit `/etc/nodeflare/config.toml` and at least set the admin account:

```toml
admin_username = "admin"
# 8-128 characters; only needed for the initial database setup,
# then removed automatically
admin_password = "your-strong-password"
```

Leave the rest as-is. `bind_addr = "0.0.0.0:2206"` is the listen address inside the container — **do not change it to `127.0.0.1`**, or the published port won't be reachable.

::: tip Directory permissions
After editing, set the directory and configuration file ownership to the container user, `10001:10001`:

```bash
sudo chown -R 10001:10001 /etc/nodeflare
```

Bind mounts retain host permissions, so using `/etc/nodeflare` still requires this step. Both the directory and the config file must be writable so the server can save the database, clear the bootstrap password, and update the database connection string.

On SELinux distributions (Fedora / RHEL and similar), append `:Z` to the mount path if you hit permission errors, e.g. `-v /etc/nodeflare:/etc/nodeflare:Z`. The same suffix works for Compose mounts.
:::

### Start the Container

Docker:

```bash
docker run -d --name nodeflare \
  --restart unless-stopped \
  -p 2206:2206 \
  -v /etc/nodeflare:/etc/nodeflare \
  gxmandppx/nodeflare:latest
```

Docker Compose (create `compose.yaml` in your working directory with the following content):

```yaml
services:
  nodeflare:
    image: gxmandppx/nodeflare:latest
    container_name: nodeflare
    restart: unless-stopped
    ports:
      - "2206:2206"
    volumes:
      - /etc/nodeflare:/etc/nodeflare
```

Run this from the directory containing `compose.yaml`:

```bash
docker compose up -d
```

### Open the Panel

Open `http://your-server-ip:2206/admin/login` and sign in with the admin account from the config file.

Create a node on the **Servers** page and run the command shown in its dialog to install the agent — see [Install the Agent](/en/guide/agent).

::: warning
The panel does not serve HTTPS, so credentials would travel in clear text. To expose it externally, publish the port on loopback only (change `-p 2206:2206` to `-p 127.0.0.1:2206:2206`) and put an HTTPS reverse proxy in front — see [Reverse Proxy](/en/guide/proxy).
:::

## Updating

Before upgrading, export a ZIP backup from the **Database** page and save it locally — see [Database & Backups](/en/guide/database). Recreate the container with its original mount directory; if an existing deployment uses `./data` or another directory, keep that path rather than migrating to `/etc/nodeflare`.

Docker Compose (run from the directory containing the original `compose.yaml`):

```bash
docker compose pull && docker compose up -d
```

With `docker run`, pull the new image and recreate the container:

```bash
docker pull gxmandppx/nodeflare:latest
docker stop nodeflare
docker rm nodeflare
# re-run docker run with the original ports, mount directory, and other options
```

The config, default SQLite database, and themes in the host mount directory are preserved; keep using the existing `config.toml` when updating. ZIP backups exported from the panel are downloaded by the browser and are not saved in this directory.

The examples use the `latest` tag. To pin a version, replace it with a version tag published on Docker Hub (no `v` prefix); when upgrading, change the tag first, then pull and recreate the container.

## Logs and Uninstall

```bash
docker logs -f nodeflare
```

If you need a backup, export it from the **Database** page while the container is running and save it locally — see [Database & Backups](/en/guide/database). Then stop and remove the container with the command matching your deployment:

```bash
docker compose down       # Compose deployment
docker rm -f nodeflare    # docker run deployment
```

Uninstalling leaves `/etc/nodeflare` on the host; use your actual path if you mounted a different directory.

::: warning
This directory holds config, the default SQLite database, and themes, and may also contain `agent/` if an agent runs on the same host. Before deleting it, confirm your backup is saved and none of the files are still needed.
:::

Once confirmed, delete the data directory manually:

```bash
sudo rm -rf /etc/nodeflare
```
