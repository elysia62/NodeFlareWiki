# Docker Deployment

NodeFlare ships an official image, `gxmandppx/nodeflare` ([Docker Hub](https://hub.docker.com/r/gxmandppx/nodeflare)), which runs on x64 and ARM64 servers alike. Configuration and data live in `/etc/nodeflare` inside the container — mount a host directory (referred to as `./data` below) to persist them.

## First Deployment

### 1. Prepare the Config

The container reads `/etc/nodeflare/config.toml` on startup, so create that file first — without it the container won't start:

```bash
mkdir -p data
curl -fsSL https://raw.githubusercontent.com/elysia62/NodeFlare/main/docker/config.example.toml -o data/config.toml
```

Edit `data/config.toml` and at least set the admin account:

```toml
admin_username = "admin"
# 8-128 characters; only needed for the initial database setup,
# then removed automatically
admin_password = "your-strong-password"
```

Leave the rest as-is. Note that `bind_addr = "0.0.0.0:2206"` is the listen address inside the container — **do not change it to `127.0.0.1`**, or the published port won't be reachable.

::: tip
The image runs as UID `10001`. If the mounted directory belongs to another user, run this before starting:

```bash
sudo chown -R 10001:10001 data
```

Otherwise the container cannot write the database or config file. On SELinux distributions such as Fedora / RHEL, append `:Z` to the mount path (e.g. `-v "$PWD/data:/etc/nodeflare:Z"`) if you hit permission errors.
:::

### 2. Start the Container

Docker:

```bash
docker run -d --name nodeflare \
  --restart unless-stopped \
  -p 2206:2206 \
  -v "$PWD/data:/etc/nodeflare" \
  gxmandppx/nodeflare:latest
```

Docker Compose (save the following as `compose.yaml` next to `data/`):

```yaml
services:
  nodeflare:
    image: gxmandppx/nodeflare:latest
    container_name: nodeflare
    restart: unless-stopped
    ports:
      - "2206:2206"
    volumes:
      - ./data:/etc/nodeflare
```

```bash
docker compose up -d
```

### 3. Open the Panel

Browse to `http://your-server-ip:2206/admin/login` and sign in with the admin account from the config file.

Create a node on the **Servers** page and run the install command shown in its dialog to install the agent — see [Install the Agent](/en/guide/agent).

::: warning
The panel does not serve HTTPS, so credentials would travel in clear text. To expose it externally, publish the port on loopback only (change `-p 2206:2206` to `-p 127.0.0.1:2206:2206`) and put an HTTPS reverse proxy in front — see [Reverse Proxy](/en/guide/proxy).
:::

## Updating

```bash
docker compose pull && docker compose up -d
```

With `docker run`, pull the new image and recreate the container:

```bash
docker pull gxmandppx/nodeflare:latest
docker rm -f nodeflare
# re-run the docker run command from the first deployment
```

Config, database, themes, and backups under `data/` are preserved. As with the install script, export a backup from the **Database** page before upgrading — see [Database & Backups](/en/guide/database).

`latest` is used by default; to pin a version, replace it with a concrete one such as `gxmandppx/nodeflare:1.0.0`.

## Logs and Uninstall

```bash
docker logs -f nodeflare                                # live logs
docker compose down                                     # stop and remove the container
docker rm -f nodeflare                                  # for docker run
docker run --rm gxmandppx/nodeflare:latest --version    # image version
```

Uninstalling leaves `data/` on the host; delete it manually when you no longer need it:

```bash
rm -rf data
```

::: warning
`data/` contains the SQLite database, themes, and backups. Export a backup from the **Database** page before deleting it — see [Database & Backups](/en/guide/database).
:::
