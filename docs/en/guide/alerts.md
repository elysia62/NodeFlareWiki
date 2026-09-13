# Alerts & Notifications

All alert rules are configured in the admin panel and delivered through Telegram with a customizable message template.

## Resource Threshold Alerts

Set thresholds for CPU / memory / disk / outbound / inbound traffic, judged either by average or by continuous breach over a configurable duration, so transient spikes don't cause false alarms.

## Offline Alerts

A notification is pushed when a node goes unreachable. Since the agent connects outbound, a node that frequently appears offline should be checked for outbound access to the panel URL and a valid token — see [Install the Agent](/en/guide/agent).

## Expiry & Traffic Alerts

Nodes can carry a billing cycle, price, expiry date, traffic allowance with a reset day (plus a daily exchange-rate snapshot for multi-currency pricing). Alerts fire as expiry approaches or the traffic allowance is exceeded.
