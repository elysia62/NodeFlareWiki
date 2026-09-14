---
layout: home

hero:
  name: NodeFlare
  text: 轻量级的自托管服务器监控面板
  tagline:
    通过 Web 界面查看服务器状态，由轻量 Agent 采集数据并主动上报。实时监控、TCP/ICMP 延迟拨测、Telegram
    告警、远程执行、TOTP 两步验证、主题定制，支持 SQLite / PostgreSQL。
  actions:
    - theme: brand
      text: 立刻开始
      link: /guide/quick-start
    - theme: alt
      text: Docker 部署
      link: /guide/docker
    - theme: alt
      text: 在线演示
      link: /demo/
    - theme: alt
      text: 常见问题
      link: /faq
    - theme: alt
      text: GitHub 仓库
      link: https://github.com/elysia62/NodeFlare

features:
  - icon: ⚡
    title: 轻量高效
    details: CPU、内存、网速每秒采样，默认每 3 秒压缩批量上传；磁盘、GPU、连接数等慢指标单独缓存。
  - icon: 📡
    title: 延迟拨测
    details: TCP 与 ICMP 拨测任务按节点分配，支持电信 / 移动 / 联通分线展示。
  - icon: 🔔
    title: 告警通知
    details: CPU / 内存 / 磁盘 / 上下行阈值、离线、到期、流量告警，Telegram 推送，消息模板可自定义。
  - icon: 🎨
    title: 主题定制
    details: 公开看板双语显示，主题商店支持内置主题、仓库主题一键安装与本地 ZIP 上传。
  - icon: 🔐
    title: 安全可控
    details: TOTP 两步验证、Cloudflare Turnstile 人机验证、登录限速与会话管理；服务端默认只监听 127.0.0.1。
  - icon: 💾
    title: 数据自持
    details: SQLite 与 PostgreSQL 双支持，两者之间可在线迁移；一键备份恢复，历史数据按保留天数自动清理。
  - icon: 🐳
    title: 容器部署
    details: 官方镜像支持 x64 与 ARM64 服务器，一条 docker run 或一份 Compose 文件即可起面板，配置与数据挂载到宿主机持久保存。
---
