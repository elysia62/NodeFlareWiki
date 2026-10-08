# Database & Backups

NodeFlare supports SQLite and PostgreSQL and can **migrate online** between them. Everything is managed from the **Database** page of the admin panel.

## History Retention and Space

The Database page shows usage, reclaims space, exports / restores ZIP backups, and runs SQLite ↔ PostgreSQL migrations.

Set retention under **Appearance**, from 1 to 3650 days, with a default of 30. Metrics are already aggregated into one-minute buckets when written. A node's **History write interval** controls persistence batches, not the resolution of historical points. Background maintenance further summarizes older metrics and latency:

| Age | Metrics | Latency |
| --- | --- | --- |
| Most recent 2 hours and 1 minute | 1 minute | Original probe timestamps, allowing delayed-report deduplication |
| 2 hours and 1 minute–7 days | 1 minute | 1 minute |
| 7–30 days | 5 minutes | 5 minutes |
| Older than 30 days | 1 hour | 1 hour |
| Beyond retention | Automatically deleted | Automatically deleted |

Aggregation does not fabricate missing samples or add detail to less frequent probes. Long-range charts show summaries. Increasing the history write interval mainly reduces persistence frequency, not the number of minute-level rows proportionally. Maintenance runs in bounded batches, so reducing retention does not delete all expired records instantly.

Size depends on node and latency-task counts, intervals, retention, themes and other data. “30 days” alone is not a fixed capacity estimate. ZIP backup size, database files and SQLite WAL files measure different things.

**Database** shows usage and reclaimable space and offers **Reclaim space**. Deleting rows does not necessarily shrink files immediately. Reclaiming can take time and affect reads and writes; back up first and use a quiet period. Do not manually delete SQLite `-wal` or `-shm` files while the service runs.

## Backup and Restore

One-click backup / restore (ZIP). Backups contain settings, nodes, history, notifications, themes, tasks, and security configuration. Backup operations require TOTP or password verification.

1. Before updating, migrating or bulk deletion, use **Export backup**, verify your identity and keep the ZIP.
2. Export the current state before restoring. Restore replaces current application data and the theme content carried in the backup; it is not an additive import.
3. Choose **Restore backup**, select the NodeFlare-exported ZIP and complete verification. Avoid unpacking and arbitrarily repacking it.
4. Check node counts, notifications, themes and resumed agent reports afterward; sign in again if required.

Keep a copy on another machine and periodically test recovery in an isolated environment. Database backups do not replace copies of the config file, proxy certificates or system service definitions when moving hosts.

Backups include Telegram and Webhook configuration, including secrets in URLs, headers and request bodies. Write-only fields in the UI do not remove credentials from backups. Do not share backups publicly; after restoring, send a test from notification settings to verify each channel.

Exported backups omit admin sessions, temporary agent install tokens and per-channel delivery receipts. Pending notifications are included and may be redelivered after restoring. SQLite ↔ PostgreSQL online migration preserves receipts so recorded successful channels are not resent.

Limits:

| Limit | Maximum |
| --- | --- |
| Backup ZIP | 512 MiB |
| Uncompressed size | 4 GiB |
| Entries | 16384 |
| Single theme file | 32 MiB |

## Schema Upgrades

The backend automatically applies schema migrations at startup. Do not create tables manually or renumber migrations. Export a backup before updating, and do not run an arbitrary older binary against a newer database.

## Online Migration

Notes on SQLite ↔ PostgreSQL migration:

- Migration **overwrites the target database** and updates the connection string automatically;
- Agent tokens are preserved;
- It takes effect after a service restart;
- Writes pause after copying completes; restart as prompted to activate the new database and resume writes rather than leaving migration in that state;
- Online migration is unavailable when the server starts with `--database` — see [Configuration](/en/guide/config#command-line-overrides).
