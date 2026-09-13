# Database & Backups

NodeFlare supports both SQLite and PostgreSQL and can **migrate online** between them. Everything is managed from the **Database** page of the admin panel.

## Database Management

The Database page shows usage, reclaims space, exports / restores ZIP backups, and runs SQLite ↔ PostgreSQL migrations.

- History is kept for 30 days by default and cleaned automatically by retention days;
- Shortening the retention period or clearing history first significantly shrinks backups.

## Backup and Restore

One-click backup / restore (ZIP). A backup contains settings, nodes, history, notifications, themes, tasks, and security configuration. For safety, backup operations require TOTP or password verification.

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
- The new database is used after a service restart;
- Online migration is disabled when the server is started with the `--database` flag — see [Configuration](/en/guide/config#command-line-overrides).
