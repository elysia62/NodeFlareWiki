# Traffic Accounting

Configure allowance, accounting mode, reset day, reset timezone and interfaces in the node editor. NodeFlare's measurements are monitoring data, not your provider's billing authority. Match the provider's published period, direction and units.

## Allowance and Direction

Set the allowance to `0` for unlimited traffic. Inputs accept units such as `100 G`; bare numbers are interpreted as GB.

| Accounting mode | Value compared with the allowance |
| --- | --- |
| Up + down | Upload + download |
| Larger of the two | The larger direction |
| Smaller of the two | The smaller direction |
| Upload only | Data sent by the node |
| Download only | Data received by the node |

Traffic alerts use the same accounting mode. Configure thresholds under [Notifications](/en/guide/alerts). Live network speed is a rate, not the amount consumed during the billing period.

## Reset Time

Each node has a **Traffic reset day** and **Traffic reset timezone**, defaulting to `UTC`. This is independent of the browser, backend OS and agent OS timezones.

- Choose day 1–31; a new cycle starts at midnight in the selected timezone.
- If a month lacks that day, its last day is used: day 31 becomes February 28 in a non-leap year.
- Region zones such as `America/Los_Angeles` follow daylight-saving rules. A fixed UTC offset is not a year-round substitute.
- Accounting switches on the next valid agent report; no midnight scheduled command is needed on the machine.

For example, day 1 in `UTC` corresponds to 08:00 on day 1 in Beijing, while `Asia/Shanghai` resets at 00:00 Beijing time. Choose the provider's timezone rather than assuming it matches your location.

::: warning
Changing the reset day or timezone establishes a fresh cycle baseline on the next valid report and clears manual correction offsets from the previous period. A normal rollover to a new billing period also clears old corrections. Record existing usage before changing the rules, wait for the new rules to take effect, then correct the new period if needed.
:::

## Interfaces and Corrections

Leave **Network interface** empty for the agent's automatic selection. Comma-separated names, `*` wildcards and `!` exclusions are supported, for example `eth*,!eth1`. On gateways or multi-interface forwarding hosts, explicitly select the interfaces matching your intended accounting.

Use **Current upload traffic** and **Current download traffic** to correct usage in the current billing period. These offsets are added to the period's accumulated counters and do not carry over to later periods. Recheck usage after changing interfaces as well.

The backend maintains cycle usage from cumulative agent counters, not by adding speeds shown in history charts. Aggregation and retention settings therefore do not control resets. Interface changes, reboots and the initial baseline may differ from the provider's accounting; initial registration does not fetch this month's usage from your provider.
