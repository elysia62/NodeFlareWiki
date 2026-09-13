# Metrics & Sampling

## Sampling and Upload

- CPU, memory, and network speed are **sampled every second** and uploaded in compressed batches **every 3 seconds** by default.
- Server cards display one real sample per second; expect roughly 2–3 seconds of display delay on a healthy connection. Stale queued data is skipped after a reconnect.
- Slower metrics such as disk capacity and GPU are cached separately, and history is aggregated at each node's configured save interval.
- Increasing the real-time upload interval lowers how often cards refresh.

## Memory Accounting

The Linux memory accounting works as follows:

- Used memory = `MemTotal - MemFree - Cached - SReclaimable - Buffers + Shmem`
- Swap used excludes `SwapCached`

File caches don't count as used memory; shared memory does. The panel reports whole-machine memory, not the NodeFlare process's own usage.

## History

History is aggregated at each node's configured save interval, kept for 30 days by default, and cleaned up automatically — see [Database & Backups](/en/guide/database).
