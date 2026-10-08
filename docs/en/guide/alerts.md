# Notifications

Choose services from **Enabled notification channels** on the admin **Notifications** page. Telegram, Bark, Discord, Slack, WeCom, DingTalk, Feishu, ntfy, Gotify and Custom Webhook can run together, with separate credentials, endpoints and templates.

## What Gets Notified

| Event | Trigger | Configuration |
| --- | --- | --- |
| Offline | No agent report for the configured offline delay | Offline delay on the Notifications page; each node can disable offline notifications |
| Back online | A node recorded as offline reports again | Follows offline alerts |
| Traffic | Usage reaches the cycle threshold, then every additional 5 percentage points up to 100% | Alert threshold plus the node's allowance, accounting mode and reset day |
| Nearing expiry | The node enters its expiry reminder window | Reminder days plus the node's expiry date |
| Resource breach / recovery | CPU, memory, disk, outbound or inbound readings trigger a rule, or recover | Resource alert rules |
| Test | **Send test** is clicked | Each channel's configuration section |

Automatic alerts go to channels that are selected and saved. New nodes that have never reported do not trigger offline alerts, and a backend restart allows agents time to reconnect.

## Configuration

1. Open **Enabled notification channels** and select the services you need, such as Telegram, Bark and Discord. Their configuration sections appear below.
2. Fill in each service's fields and replace example values such as `YOUR_KEY`, `YOUR_TOKEN` and `YOUR_DEVICE_KEY`. Adjust alert thresholds, then click **Save settings** at the bottom.
3. Click **Test Telegram**, **Test Bark**, and the other channel tests. Verify delivery in the destination chat or app. Tests use saved settings, not unsaved input.
4. Configure node traffic allowances, expiry dates or resource rules. Enable **Disable offline alerts** in a node's editor if those notifications are unwanted.

Deselecting a channel and saving disables delivery without deleting its credentials. Deselect all channels and save to turn off automatic notifications; reselecting a configured channel reuses its settings. Each service currently supports one configuration.

Test requests are independent of automatic notification switches. If a channel fails to save, the error identifies it; correct the fields, retry and confirm the entire form saved before leaving.

| Setting | Default | Range |
| --- | --- | --- |
| Offline alert delay | 5 minutes | 2–1440 minutes |
| Initial traffic threshold | 80% | 50–100% |
| Expiry reminder | 7 days | 0–365 days; 0 disables expiry reminders |

## Telegram

1. Create a bot with [@BotFather](https://t.me/BotFather) and obtain its Bot Token.
2. Determine the Chat ID:
   - For yourself, message the bot first, then find `chat.id` in `https://api.telegram.org/bot<TOKEN>/getUpdates`.
   - For a group, add the bot and send a command it can receive, such as `/start@BotUsername`, then find the group's `chat.id`.
   - For a public channel, make the bot an administrator; Chat ID may be `@ChannelUsername`.
3. Enter Bot Token and Chat ID, save and test. Optionally enter a Message Thread ID for a forum topic.

Do not share URLs, screenshots or API responses containing real tokens. See the [Telegram Bot API](https://core.telegram.org/bots/api#getupdates) for polling restrictions.

Messages are plain text and the template is editable. Saved Bot Tokens and Chat IDs are masked; keeping the masks unchanged retains stored credentials.

## Custom Content

Telegram uses a text template; Bark, Discord and the other Webhook channels each have their own JSON body template. A channel's template applies to all its alert events. The backend creates the title and message; templates arrange fields and add fixed text.

| Variable | Value | Channels |
| --- | --- | --- |
| `{{title}}` | Alert title | Telegram, Webhook |
| `{{message}}` | Alert message | Telegram, Webhook |
| `{{server}}` | Node name | Telegram, Webhook |
| `{{node}}` | Node name; alias of `{{server}}` | Webhook |
| `{{event}}` | `offline`, `online`, `traffic`, `expiry`, `resource`, `resource_recovery` or `test` | Webhook |
| `{{site}}` | Site name | Webhook |
| `{{time}}` | Send time in `YYYY-MM-DD HH:mm:ss UTC` format | Telegram, Webhook |

Telegram example:

```text
{{title}}
Node: {{server}}
{{message}}
Time: {{time}}
```

Webhook includes a live JSON preview. Unknown placeholders stay unchanged and placeholder-like text inside a message is not expanded again. An empty saved Webhook template field retains its value rather than resetting it. To restore an example, copy the matching body below, replace credentials and save. Telegram templates are returned for editing and cannot be empty.

## Webhook

Enter the push URL, optional headers and JSON body. Requests use `POST` with `Content-Type: application/json` by default. An explicit Content-Type header overrides the default.

URLs must use HTTP or HTTPS; HTTPS is recommended. Enter the final URL: redirects such as 301, 302 and 307 are not followed, protecting the request method and credentials.

Write one header per line:

```text
Authorization: Bearer YOUR_TOKEN
```

Default body:

```json
{
  "event": "{{event}}",
  "node": "{{node}}",
  "title": "{{title}}",
  "message": "{{message}}",
  "site": "{{site}}",
  "time": "{{time}}"
}
```

Place variables inside JSON string quotes. Newlines, quotes and backslashes are escaped. Invalid JSON is reported in the preview or rejected when saving.

### Common Service Examples

Selecting a new channel prefills its format; manual configuration also works. Use **Custom Webhook** for services not listed. Replace all example keys, tokens, device keys and topic names.

#### Bark

URL: `https://api.day.app/push`, or `https://your-service/push` for a self-hosted server. Copy the device key from the Bark app:

```json
{
  "device_key": "YOUR_DEVICE_KEY",
  "title": "{{title}}",
  "subtitle": "{{node}}",
  "body": "{{message}}",
  "group": "NodeFlare"
}
```

For sound, icon and other fields, see the [Bark API](https://github.com/Finb/bark-server/blob/master/docs/API_V2.md).

#### Discord

Use the channel's Webhook URL:

```json
{"content":"{{title}}\nNode: {{node}}\n{{message}}"}
```

#### Slack

Use the app's Incoming Webhook URL:

```json
{"text":"{{title}}\nNode: {{node}}\n{{message}}"}
```

#### WeCom

URL: `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=YOUR_KEY`.

```json
{"msgtype":"text","text":{"content":"{{title}}\nNode: {{node}}\n{{message}}"}}
```

#### DingTalk

URL: `https://oapi.dingtalk.com/robot/send?access_token=YOUR_TOKEN`. Set the bot's keyword to `NodeFlare` and include it in every message:

```json
{"msgtype":"text","text":{"content":"NodeFlare\n{{title}}\nNode: {{node}}\n{{message}}"}}
```

#### Feishu

Use the group custom bot's Webhook URL, with the same keyword approach as DingTalk:

```json
{"msg_type":"text","content":{"text":"NodeFlare\n{{title}}\nNode: {{node}}\n{{message}}"}}
```

Dynamic DingTalk and Feishu signatures are not generated. Bots requiring signature verification need adjusted security settings or your own signing relay.

#### ntfy

URL: `https://ntfy.sh` or the root URL of a self-hosted service. For private topics, add `Authorization: Bearer YOUR_TOKEN` as required:

```json
{"topic":"YOUR_TOPIC","title":"{{title}}","message":"{{message}}"}
```

More fields are described in the [ntfy publishing API](https://docs.ntfy.sh/publish/#publish-as-json).

#### Gotify

URL: `https://your-service/message`. Set header `X-Gotify-Key: YOUR_APP_TOKEN`:

```json
{"title":"{{title}}","message":"{{message}}"}
```

Use an application token; see the [Gotify push API](https://gotify.net/docs/pushmsg).

Bark, WeCom, DingTalk and Feishu presets check service response codes in addition to HTTP status. **Custom Webhook** checks HTTP status only. Select the matching preset and verify actual delivery of the test message.

## Write-Only Credentials

Webhook URLs, headers and bodies can contain secrets. Saved plaintext values are never returned; only configuration status is shown.

- Each channel stores its own configuration; empty fields retain that channel's existing values.
- Removing headers requires **Clear headers on save**, then saving.
- **Clear Bark**, **Clear Discord**, and similar buttons immediately delete only that channel's configuration. Deselecting a channel and saving only pauses automatic alerts.
- Credentials are not shared between channels; adding Discord does not replace Bark.
- Telegram tokens and Chat IDs are masked; leave the masks unchanged to retain them.

Database backups contain channel credentials. Do not share them publicly; see [Database & Backups](/en/guide/database).

## Missing Notifications

Save first, send a test, and check the destination. Common problems:

| Message or symptom | Check |
| --- | --- |
| Telegram 401 | Bot Token |
| Telegram 400 / 403 | Chat ID, whether the user started the bot, group membership and channel permissions |
| Webhook 3xx | Use the final destination URL |
| Webhook 400 / 401 / 403 | Body fields, authentication headers, URL keys and tokens |
| Webhook service rejects delivery | Preset response code, bot keyword and device key |
| Timeout or connection error | Backend access to the push service, DNS, TLS certificate and proxy |
| Test arrives but alerts do not | Selected and saved notification channels, rules, node settings and trigger thresholds |

The backend must reach `api.telegram.org` or the Webhook URL. For a Docker backend, `127.0.0.1` refers to that container, not another push-service container; use an address reachable between containers.

Check logs:

```bash
# systemd installation
journalctl -u nodeflare.service -n 100 --no-pager
# Docker deployment
docker logs --tail 100 nodeflare
```

Failed alerts are queued for retry and successful channel receipts are persisted. Retrying another failed channel does not resend a recorded success. A timeout after remote acceptance can still cause duplicates, so strict cross-service exactly-once delivery is not guaranteed.

Resource rules support average or continuous-breach evaluation. New nodes that have never reported do not trigger offline alerts. Traffic and expiry reminders require each node's allowance and expiry date to be configured.

The backend cannot send notifications while it is down or without outbound connectivity. Use an independent external availability monitor if you need to monitor the panel itself.
