# Database & Backups

NodeFlare supports SQLite and PostgreSQL and can **migrate online** between them. Everything is managed from the **Database** page of the admin panel.

## Database Management

The Database page shows usage, reclaims space, exports / restores ZIP backups, and runs SQLite ↔ PostgreSQL migrations.

- History is kept for 30 days by default and cleaned up automatically;
- Shortening the retention period or clearing history shrinks backups significantly.

## Backup and Restore

One-click backup / restore (ZIP). Backups contain settings, nodes, history, notifications, themes, tasks, and security configuration. Backup operations require TOTP or password verification.

Limits:

| Limit | Maximum |
| --- | --- |
| Backup ZIP | 512 MiB |
| Uncompressed size | 4 GiB |
| Entries | 16384 |
| Single theme file | 32 MiB |

## Online Migration

Notes on SQLite ↔ PostgreSQL migration:

- Migration **overwrites the target database** and updates the connection string automatically;
- Agent tokens are preserved;
- It takes effect after a service restart;
- Online migration is unavailable when the server starts with `--database` — see [Configuration](/en/guide/config#command-line-overrides).
