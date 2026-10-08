# Node Configuration

Use **Servers** in the admin panel to manage nodes, installation commands and display order. Create a node, then use its download button to obtain the command described in [Install the Agent](/en/guide/agent). Give each machine its own node and token; do not reuse one installation command across machines.

## Display and Billing

| Setting | Purpose |
| --- | --- |
| Name, region code, group and tags | Organize the public dashboard |
| Hide server | Hide a node from the public dashboard while keeping it in admin; independent of price |
| Price, currency and billing cycle | Price is the cost per billing cycle, with a minimum of 0; 0 means free |
| Expiry date and auto-renew | Extend the recorded expiry by the billing cycle; this does not pay the provider and does not apply to one-time billing |
| Disable offline alerts | Disable this node's offline alerts only; other reminders use their own conditions |

Drag a row's handle to change display order. IP addresses appear in the admin server list, not the public dashboard; tokens are not public either.

## Sampling and Traffic

- **History write interval** defaults to 60 seconds and accepts 15–3600 seconds.
- **Live upload interval** defaults to 3 seconds and accepts 3–60 seconds; sampling remains once per second.
- Allowances, interfaces, reset day and timezone are covered in [Traffic Accounting](/en/guide/traffic).
- See [Metrics & Sampling](/en/guide/monitoring) for live cards, charts and retained history.

## Remote Execution

**Allow remote execution** is unchecked for new nodes. It controls whether newly generated install commands include `--disable-remote`; it does not remotely change an installed agent's permission.

| Local agent startup arguments | Effective permission |
| --- | --- |
| Include `--disable-remote` | The agent rejects remote execution; the backend cannot lift the restriction |
| Omit `--disable-remote` | The agent accepts remote tasks; the admin still needs enabled TOTP and a valid code |

To enable it:

1. Edit the node, select **Allow remote execution**, and save.
2. Open its download dialog and copy the newly generated command.
3. Run it on the monitored machine to reinstall / reconfigure the agent service.

Alternatively, edit the local service arguments, remove `--disable-remote`, and restart the agent. Run `systemctl daemon-reload` first after editing a systemd unit. To disable execution on an installed agent, rerun an install command containing the flag, or add it locally and restart.

Linux / macOS / FreeBSD scripts use `--disable-remote`; the Windows installer uses `-DisableRemote`, with the same underlying agent flag. Manual updates preserve the current local permission.

::: warning
Saving the checkbox alone does not change a running agent's permission. Commands run with the agent process's system privileges, often administrator privileges for script installations. Leaving the admin page does not cancel a running command; a command can run for at most 10 minutes.
:::

## Deleting Nodes

Export a [database backup](/en/guide/database) first. Deleting a node also removes its associated monitoring data and cannot be directly undone. It does not uninstall the agent on that machine; run the [uninstall command](/en/guide/uninstall) separately.
