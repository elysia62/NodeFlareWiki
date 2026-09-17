# Alerts & Notifications

Alert rules are configured in the admin panel and delivered through Telegram with customizable templates.

## Resource Threshold Alerts

Set thresholds for CPU / memory / disk / outbound / inbound traffic, judged by average or by continuous breach over a configurable duration to avoid false alarms from transient spikes.

## Offline Alerts

A notification is sent when a node goes unreachable. The agent connects outbound, so if a node frequently appears offline, check its outbound access to the panel URL and verify the token — see [Install the Agent](/en/guide/agent).

## Expiry & Traffic Alerts

Nodes support a billing cycle, price, expiry date, traffic allowance with a reset day, plus a daily exchange-rate snapshot for multi-currency pricing. Alerts fire as expiry approaches or the allowance is exceeded.
