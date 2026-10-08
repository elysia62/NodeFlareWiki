# 通知

在后台「通知」页面的「启用通知渠道」下拉框中勾选需要的服务。Telegram、Bark、Discord、Slack、企业微信、钉钉、飞书、ntfy、Gotify 和自定义 Webhook 可以同时开启，各自保存地址、凭证和模板。

## 通知哪些事

| 事件 | 触发条件 | 配置位置 |
| --- | --- | --- |
| 离线 | 超过离线告警延迟未收到 Agent 上报 | 通知页的离线延迟；节点编辑页可单独禁用离线通知 |
| 恢复在线 | 已记录离线状态的节点重新上报 | 跟随离线告警 |
| 流量提醒 | 达到本周期流量提醒阈值，之后每增加 5 个百分点提醒一次，最多到 100% | 通知页阈值；节点需填写流量额度、统计方式和重置日 |
| 即将到期 | 进入配置的到期提醒天数 | 通知页天数；节点需填写到期时间 |
| 资源超限 / 恢复 | CPU、内存、磁盘、上行或下行达到规则阈值，或从超限状态恢复 | 通知页的资源告警规则 |
| 测试 | 手动点击「发送测试」 | 各渠道配置区域 |

自动告警只发送到已勾选并保存的渠道。未曾上报的新节点不会产生离线告警；后端重启会给予 Agent 重连宽限期。

## 配置

1. 打开「启用通知渠道」下拉框，同时勾选需要的渠道，例如 Telegram、Bark 和 Discord。下面会展开各渠道的配置区域。
2. 填写各渠道所需信息；预填示例中的 `YOUR_KEY`、`YOUR_TOKEN`、`YOUR_DEVICE_KEY` 等必须替换。设置提醒阈值，点击页面底部「保存设置」。
3. 分别点击「测试 Telegram」「测试 Bark」等按钮，到目标会话或 App 核实消息。测试读取已保存配置，未保存的输入不参与测试。
4. 配置节点的流量额度、到期日期或资源告警规则；不关注某节点离线时，可在节点编辑页启用「关闭离线告警」。

取消勾选后保存，只停用该渠道，不删除凭证。全部取消并保存会关闭自动通知；重新勾选已配置的渠道可以沿用原配置。每种渠道当前支持一份配置。

测试请求不受自动通知开关限制。若某个渠道保存失败，页面会指出渠道名称；修正后重新保存，确认整页保存成功再离开。

| 设置 | 默认值 | 范围 |
| --- | --- | --- |
| 离线告警延迟 | 5 分钟 | 2～1440 分钟 |
| 流量提醒起始阈值 | 80% | 50～100% |
| 到期提醒 | 7 天 | 0～365 天；0 关闭到期提醒 |

## Telegram

1. 找 [@BotFather](https://t.me/BotFather) 创建机器人，取得 Bot Token。
2. 确定 Chat ID：
   - 发给自己：先给机器人发送消息，再查看 `https://api.telegram.org/bot<TOKEN>/getUpdates` 中 `chat.id` 的数字。
   - 发到群组：把机器人加入群组，发送机器人可见的命令（例如 `/start@机器人用户名`），再查看对应群组的 `chat.id`。
   - 发到公开频道：把机器人设为频道管理员，Chat ID 可以填写 `@频道用户名`。
3. 在后台填写 Bot Token、Chat ID，保存并测试。论坛话题可另外填写 Message Thread ID。

不要把含真实 Token 的 URL、截图或 API 响应发给他人。`getUpdates` 的用法和限制见 [Telegram Bot API](https://core.telegram.org/bots/api#getupdates)。

消息为纯文本，可编辑消息模板。Bot Token 与 Chat ID 保存后只显示掩码；保留掩码即可沿用已保存值。

## 自定义内容

Telegram 使用文本模板；Bark、Discord 等渠道分别使用自己的 JSON 请求体模板。每个渠道的模板供该渠道的所有告警事件共用。标题和正文由后端生成，模板决定字段排列与固定前后缀。

| 变量 | 内容 | 可用渠道 |
| --- | --- | --- |
| `{{title}}` | 告警标题 | Telegram、Webhook |
| `{{message}}` | 告警正文 | Telegram、Webhook |
| `{{server}}` | 节点名称 | Telegram、Webhook |
| `{{node}}` | 节点名称，与 `{{server}}` 等价 | Webhook |
| `{{event}}` | 事件标识：`offline`、`online`、`traffic`、`expiry`、`resource`、`resource_recovery`、`test` | Webhook |
| `{{site}}` | 站点名称 | Webhook |
| `{{time}}` | 发送时间，`YYYY-MM-DD HH:mm:ss UTC` | Telegram、Webhook |

Telegram 示例：

```text
{{title}}
节点：{{server}}
{{message}}
时间：{{time}}
```

Webhook 的编辑区提供 JSON 预览。未知变量保持原样，正文中的变量文本不会被再次替换。Webhook 保存后模板框留空表示保留原模板，不是恢复默认；要恢复示例格式，请复制下面对应渠道的示例、替换凭证后保存。Telegram 模板会回显且不能为空。

## Webhook

填写推送 URL、可选请求头和 JSON 请求体。后端使用 `POST` 发送，默认 `Content-Type: application/json`；填写同名请求头可覆盖默认值。

URL 支持 HTTP / HTTPS，推荐 HTTPS。填写最终地址：不会跟随 301、302、307 等跳转，以免改变请求方法或把认证信息发送到其他地址。

请求头一行一个，例如：

```text
Authorization: Bearer YOUR_TOKEN
```

默认请求体：

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

变量必须放在 JSON 字符串引号内。系统会转义换行、双引号和反斜杠；预览或保存时 JSON 无效会直接提示。

### 常见服务的写法

第一次勾选渠道时会填入对应格式，也可以手动配置。「自定义 Webhook」用于列表以外的服务。下面的 Key、Token、设备 Key 和主题名均需替换为自己的值。

#### Bark

URL：`https://api.day.app/push`，自建服务使用 `https://你的服务/push`。从 Bark App 复制设备 Key：

```json
{
  "device_key": "YOUR_DEVICE_KEY",
  "title": "{{title}}",
  "subtitle": "{{node}}",
  "body": "{{message}}",
  "group": "NodeFlare"
}
```

需要声音、图标等参数时，按 [Bark API](https://github.com/Finb/bark-server/blob/master/docs/API_V2.md) 在请求体里追加字段。

#### Discord

URL 填频道提供的 Webhook 地址：

```json
{"content":"{{title}}\n节点：{{node}}\n{{message}}"}
```

#### Slack

URL 填应用提供的 Incoming Webhook 地址：

```json
{"text":"{{title}}\n节点：{{node}}\n{{message}}"}
```

#### 企业微信

URL：`https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=YOUR_KEY`。

```json
{"msgtype":"text","text":{"content":"{{title}}\n节点：{{node}}\n{{message}}"}}
```

#### 钉钉

URL：`https://oapi.dingtalk.com/robot/send?access_token=YOUR_TOKEN`。机器人安全设置使用固定关键词 `NodeFlare`，并让每条消息都含该词：

```json
{"msgtype":"text","text":{"content":"NodeFlare\n{{title}}\n节点：{{node}}\n{{message}}"}}
```

#### 飞书

URL 填群自定义机器人的 Webhook 地址，关键词设置与钉钉相同：

```json
{"msg_type":"text","content":{"text":"NodeFlare\n{{title}}\n节点：{{node}}\n{{message}}"}}
```

NodeFlare 暂不生成钉钉或飞书的动态签名。若机器人要求签名认证，需调整机器人安全配置，或使用自己的签名转发服务。

#### ntfy

URL：`https://ntfy.sh` 或自建服务根地址。私有主题按服务配置添加 `Authorization: Bearer YOUR_TOKEN` 请求头：

```json
{"topic":"YOUR_TOPIC","title":"{{title}}","message":"{{message}}"}
```

更多字段见 [ntfy 发布 API](https://docs.ntfy.sh/publish/#publish-as-json)。

#### Gotify

URL：`https://你的服务/message`，请求头填写 `X-Gotify-Key: YOUR_APP_TOKEN`：

```json
{"title":"{{title}}","message":"{{message}}"}
```

Token 必须是应用 Token，见 [Gotify 推送 API](https://gotify.net/docs/pushmsg)。

Bark、企业微信、钉钉和飞书预设除了 HTTP 状态，还检查服务响应中的业务码；使用「自定义 Webhook」时只按 HTTP 状态判断。请选对应预设，并确认实际收到测试消息。

## 凭证不回读

Webhook URL、请求头、请求体可能包含密钥，保存后不回读原文，只显示配置状态。

- 每个渠道分别保存配置；留空保存会保留该渠道已保存的字段。
- 清除请求头需要点击「清除请求头」，再保存。
- 「清除 Bark」「清除 Discord」等按钮立即删除对应渠道的配置，不影响其他渠道；取消勾选并保存只暂停自动告警。
- 不同渠道的地址、请求头和模板互不借用，例如添加 Discord 不会覆盖 Bark。
- Telegram 的 Token、Chat ID 显示掩码，保持掩码不变即可保留。

数据库备份含渠道凭证，不要公开分享，见[数据库与备份](/guide/database)。

## 收不到通知

先保存，再发送测试，并到目标会话或 App 核实。常见情况：

| 提示或现象 | 检查项 |
| --- | --- |
| Telegram 401 | Bot Token 是否正确 |
| Telegram 400 / 403 | Chat ID、用户是否启动机器人、机器人是否在群组内或有频道权限 |
| Webhook 3xx | 填写跳转后的最终 URL |
| Webhook 400 / 401 / 403 | 请求体字段、认证头、URL 中的 Key 或 Token |
| Webhook 服务拒收通知 | 对应预设的业务码、机器人关键词和设备 Key |
| 请求超时或连接失败 | 后端机器是否能访问推送服务；自建域名、TLS 证书或代理是否正确 |
| 测试成功但自动告警没有消息 | 「启用通知渠道」是否勾选并保存；规则与节点配置是否正确，阈值是否已达到 |

后端需要能够访问 `api.telegram.org` 或所填 Webhook 地址。Docker 后端访问 `127.0.0.1` 指的是后端容器本身；自建推送服务在另一个容器时，应使用容器间可达地址。

查看日志：

```bash
# systemd 安装
journalctl -u nodeflare.service -n 100 --no-pager
# Docker 部署
docker logs --tail 100 nodeflare
```

失败告警进入重试队列，已成功渠道的发送结果持久保存；另一渠道失败重试不会重复发送已记录成功的渠道。远端已接收但响应超时等情况仍可能造成重发，不能保证跨服务严格只发送一次。

资源告警支持平均值与持续超限判定；未曾上报的新节点不会触发离线告警。到期和流量提醒则要先填好节点的到期时间与流量额度。

后端自身停机或无法联网时，也无法向外发送通知。需要监控面板本身时，请另外使用独立的外部可用性监测。
