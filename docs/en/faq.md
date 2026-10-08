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

## HTTP 426, or the homepage works but live updates do not

Check [WebSocket proxying](/en/guide/proxy), especially `proxy_http_version 1.1`, `Upgrade` and `Connection`. A working homepage proves ordinary HTTP connectivity, not a successful WebSocket handshake. Then check logs and the backend and agent versions actually running; HTTP 426 alone does not establish a protocol-version mismatch.

## The public dashboard shows no nodes

Make sure the node isn't marked **hidden** and that **public dashboard** is enabled in the site settings.

## How do I expose the panel to the internet?

Script installs listen on `127.0.0.1` by default; Docker containers need `0.0.0.0:2206` inside the container. For external access, use an HTTPS reverse proxy and add the proxy to `trusted_proxies` — see [Reverse Proxy](/en/guide/proxy).

## Docker: how do I check logs, upgrade, or uninstall?

Logs: `docker logs -f nodeflare`; upgrade: `docker compose pull && docker compose up -d` (or `docker pull` plus recreating the container); uninstall: `docker compose down` / `docker rm -f nodeflare`. Config and data stay in the host mount directory (`/etc/nodeflare` in the examples); keep that directory when updating — see [Docker Deployment](/en/guide/docker).

## The Docker container exits immediately

Check `docker logs nodeflare` first. Common causes: a missing `config.toml`, or container user `10001:10001` being unable to read and write the directory and config file. Follow [Docker Deployment](/en/guide/docker#prepare-the-config) to prepare the config and permissions, replacing the path with your actual mount directory.

## Backup export reports "over the limit"

Preserve any data you can back up, then consider a shorter retention period and wait for cleanup before exporting again. Increasing retention later cannot restore deleted history. See [Database & Backups](/en/guide/database).

## Memory usage looks high

On Linux, file caches don't count as used memory while shared memory does; the panel reports whole-machine memory, not the NodeFlare process. See [Metrics & Sampling](/en/guide/monitoring).

## Webhook inputs are empty after saving

This is expected. Each channel's URL, headers and body may contain secrets, so only configuration status is returned. Empty inputs keep stored values and tests use saved settings. Clearing headers needs an explicit action and save; **Clear Bark** or similar deletes that channel, while deselecting and saving only disables it. See [Notifications](/en/guide/alerts).

## Can Telegram, Bark and Discord run together?

Yes. Select all three under **Notifications → Enabled notification channels**, fill in their separate settings and click **Save settings**. Each service has one independent configuration; a single Webhook preset selector no longer switches between and replaces services.

## Tests succeed, but automatic alerts never arrive

Manual tests are independent of automatic notification switches. Check that the channel is selected and saved, then check rules, node selection and thresholds. A new node that has never reported does not trigger offline alerts. Webhook does not follow redirects, and a custom service returning HTTP 2xx may not have completed the actual push. See [Missing Notifications](/en/guide/alerts#missing-notifications).

## How do cards update every second with three-second uploads?

The agent samples every second and uploads several samples together every three seconds by default. The frontend displays actual samples once per second. Upload, playback and history persistence are different intervals; see [Metrics & Sampling](/en/guide/monitoring). Reloading the detail page loads aggregated history, not the temporary per-second samples previously held in the browser.

## When does traffic reset? Must I change the OS timezone?

No OS change is needed. Each node has its own **Traffic reset timezone**, defaulting to UTC. The new cycle starts at midnight on its reset day and is processed by a later report. Changing reset day or timezone creates a new baseline; see [Traffic Accounting](/en/guide/traffic).

## Why did reducing retention not immediately shrink the database file?

Cleanup and aggregation run in batches. A database can retain reusable empty pages, and SQLite may have WAL files. Let maintenance run, check usage and reclaimable space, then use **Reclaim space** during a quiet period if needed. Do not manually delete WAL files; see [Database & Backups](/en/guide/database).

## How do I uninstall?

Run the install script with `--uninstall` (keep data) or `--uninstall --purge` (delete data); the agent accepts `--uninstall`. Details in [Uninstall](/en/guide/uninstall). For Docker, see [Docker Deployment](/en/guide/docker).

## Why does remote execution require TOTP?

Remote execution is high-risk and requires TOTP two-factor authentication. A single command runs for at most 10 minutes and keeps running after you leave the page.

## Why is execution still blocked after selecting “Allow remote execution”?

The checkbox changes future install commands, not a running agent's local `--disable-remote` flag. Save, reopen the download dialog, and run the new command on the machine; alternatively remove the flag from the local service and restart it. Backend TOTP is still required. See [Remote Execution](/en/guide/nodes#remote-execution).
