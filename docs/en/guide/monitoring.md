# Metrics & Sampling

## Sampling and Upload

- CPU, memory, and network speed are **sampled every second** and uploaded in compressed batches **every 3 seconds** by default.
- Cards display one real sample per second; expect roughly 2–3 seconds of delay on a healthy connection. Stale queued data is skipped after reconnecting.
- Slower metrics such as disk capacity and GPU are cached separately. Metric history is aggregated into minute-level buckets when written.
- Upload cadence and display cadence differ: a three-second batch contains per-second samples, which cards still play once per second. No new metric values are fabricated before a batch arrives.

## Memory Accounting

Linux memory accounting:

- Used memory = `MemTotal - MemFree - Cached - SReclaimable - Buffers + Shmem`
- Swap used excludes `SwapCached`

File caches don't count as used memory; shared memory does. The panel reports whole-machine memory, not the NodeFlare process.

## History

**History write interval** and **Live upload interval** control persistence and transport separately, defaulting to 60 and 3 seconds. They do not turn the cards' per-second samples into once-per-minute updates. Metric history uses one-minute buckets; the write interval determines when batches are committed, not the duration represented by each historical point.

The detail page's **Live** load view initially loads one hour of history, then appends per-second live samples. Historical points are aggregates, not a complete per-second recording. New live sections are denser; actual connection gaps remain blank rather than being filled with invented values.

The in-browser live window retains up to one hour. Reloading the page loads database history again, so previously accumulated second-by-second curves may become sparser. That is aggregated history being reloaded, not lost database records.

History defaults to 30 days, with tiered aggregation and expiration. See [History Retention and Space](/en/guide/database#history-retention-and-space). Increasing retention cannot restore samples already aggregated or deleted.

## Latency Probing

Create tasks under **Latency** in admin. Choose TCP or ICMP, a target, an interval and the nodes that run the task. TCP requires a target port; ICMP also depends on local permissions and whether the network allows echo requests.

When per-carrier latency display is enabled, the frontend orders slots as China Telecom, China Unicom and China Mobile. Empty slots remain placeholders instead of stretching one or two available results across all three. Check that a task is enabled and assigned to the node before investigating unreachable targets or permissions.
