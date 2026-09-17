# FAQ

## The service fails to start

Check the logs first ([locations here](/en/guide/platforms#log-locations)); usually the port is taken or the database connection string is wrong.

## Which port does the panel use?

Check `bind_addr` in the config file — default `127.0.0.1:2206`. See [Configuration](/en/guide/config).

## Does the agent need an inbound port?

No. The agent connects to the server outbound — see [Install the Agent](/en/guide/agent).

## The agent shows offline

- Make sure the agent can reach the panel URL outbound: `curl -I https://your-panel-address`;
- Verify the agent token;
- Reporting and latency depend on clock accuracy; a large clock skew causes problems.

## The public dashboard shows no nodes

Make sure the node isn't marked **hidden** and that **public dashboard** is enabled in the site settings.

## How do I expose the panel to the internet?

Script installs listen on `127.0.0.1` by default; Docker containers need `0.0.0.0:2206` inside the container. For external access, use an HTTPS reverse proxy and add the proxy to `trusted_proxies` — see [Reverse Proxy](/en/guide/proxy).

## Docker: how do I check logs, upgrade, or uninstall?

Logs: `docker logs -f nodeflare`; upgrade: `docker compose pull && docker compose up -d` (or `docker pull` plus recreating the container); uninstall: `docker compose down` / `docker rm -f nodeflare`. Config and data stay in the host mount directory (`/etc/nodeflare` in the examples); keep that directory when updating — see [Docker Deployment](/en/guide/docker).

## The Docker container exits immediately

Check `docker logs nodeflare` first. Common causes: a missing `config.toml`, or container user `10001:10001` being unable to read and write the directory and config file. Follow [Docker Deployment](/en/guide/docker#prepare-the-config) to prepare the config and permissions, replacing the path with your actual mount directory.

## Backup export reports "over the limit"

Shorten the history retention period or clear history first, then export again — see [Database & Backups](/en/guide/database).

## Memory usage looks high

On Linux, file caches don't count as used memory while shared memory does; the panel reports whole-machine memory, not the NodeFlare process. See [Metrics & Sampling](/en/guide/monitoring).

## How do I uninstall?

Run the install script with `--uninstall` (keep data) or `--uninstall --purge` (delete data); the agent accepts `--uninstall`. Details in [Uninstall](/en/guide/uninstall). For Docker, see [Docker Deployment](/en/guide/docker).

## Why does remote execution require TOTP?

Remote execution is high-risk and requires TOTP two-factor authentication. A single command runs for at most 10 minutes and keeps running after you leave the page.
