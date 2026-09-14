# FAQ

## The service fails to start. What now?

Check the logs first ([locations here](/en/guide/platforms#log-locations)); the usual culprits are an occupied port or a bad database connection string.

## Not sure which port the panel uses?

Check `bind_addr` in the config file — default `127.0.0.1:2206`. See [Configuration](/en/guide/config).

## Does the agent need an inbound port?

No. The agent connects to the server over an outbound connection — see [Install the Agent](/en/guide/agent).

## The agent shows offline

- Make sure the agent can reach the panel URL outbound: `curl -I https://your-panel-address`;
- Verify the agent token is correct;
- Reporting and latency depend on clock accuracy; a large system clock skew will cause problems.

## The public dashboard shows no nodes

Make sure the node isn't marked **hidden** and that **public dashboard** is enabled in the site settings.

## How do I expose the panel to the internet?

The server listens on `127.0.0.1` by default. Put it behind an HTTPS reverse proxy and add the proxy to `trusted_proxies` — see [Reverse Proxy](/en/guide/proxy). In Docker the container sees the Docker gateway as the peer IP; see [Trusted Proxies](/en/guide/proxy#trusted-proxies).

## How do I read logs or upgrade a Docker deployment?

Use `docker logs -f nodeflare` for logs and `docker compose pull && docker compose up -d` (or `docker pull` plus recreating the container) to upgrade. Data stays in the mounted `./data` — see [Docker Deployment](/en/guide/docker#updating).

## The Docker container exits immediately after starting

Most likely the mounted directory has no `config.toml`, or it isn't owned by UID `10001` so it can't be written. Prepare the config as described in [Docker Deployment](/en/guide/docker#1-prepare-the-config) and run `sudo chown -R 10001:10001 data`.

## Backup export reports "over the limit"?

Shorten the history retention period or clear history first, then export again — see [Database & Backups](/en/guide/database).

## Memory usage looks high

On Linux, file caches don't count as used memory while shared memory does; the panel reports whole-machine memory, not the NodeFlare process itself. See [Metrics & Sampling](/en/guide/monitoring).

## How do I uninstall?

Run the install script with `--uninstall` (keep data) or `--uninstall --purge` (delete data); the agent accepts `--uninstall`. Details in [Uninstall](/en/guide/uninstall). For Docker, use `docker compose down` or `docker rm -f nodeflare` — see [Docker Deployment](/en/guide/docker#logs-and-uninstall).

## Why does remote execution require TOTP?

Remote execution is a high-risk operation and requires TOTP two-factor authentication to be enabled. A single command runs for at most 10 minutes and keeps running after you leave the page.
