---
layout: home

hero:
  name: NodeFlare
  text: Lightweight self-hosted server monitoring
  tagline:
    View server status in a web UI. A lightweight agent reports outbound, so no inbound ports are needed.
    Live metrics, TCP/ICMP latency probing, multi-channel Telegram / Bark / Discord notifications, remote execution, TOTP two-factor
    authentication, theme customization, and SQLite / PostgreSQL support.
  actions:
    - theme: brand
      text: Get Started
      link: /en/guide/quick-start
    - theme: alt
      text: Docker Deployment
      link: /en/guide/docker
    - theme: alt
      text: Live Demo
      link: https://dash.elysiaya.xyz
      target: _blank
    - theme: alt
      text: FAQ
      link: /en/faq
    - theme: alt
      text: GitHub Repository
      link: https://github.com/elysia62/NodeFlare

features:
  - icon: ⚡
    title: Lightweight & Efficient
    details: CPU, memory, and network speed are sampled every second and uploaded in compressed batches every 3 seconds; slower metrics such as disks and GPU are cached separately.
  - icon: 📡
    title: Latency Probing
    details: TCP and ICMP probing tasks assigned per node, with per-carrier (China Telecom / Unicom / Mobile) display.
  - icon: 🔔
    title: Alerts & Notifications
    details: Resource, offline, expiry and traffic alerts with multi-select Telegram, Bark, Discord and other channels, each with separate credentials and templates.
  - icon: 🎨
    title: Theme Store
    details: Bilingual public dashboard with built-in themes, one-click install from GitHub repositories, and local ZIP upload.
  - icon: 🔐
    title: Secure by Default
    details: TOTP two-factor authentication, Cloudflare Turnstile, login rate limiting, and session management. The server listens on 127.0.0.1 by default.
  - icon: 💾
    title: Data Ownership
    details: SQLite and PostgreSQL with online migration, one-click backup and restore, tiered history aggregation and automatic retention cleanup.
  - icon: 🐳
    title: Container Ready
    details: Official images run on x64 and ARM64. Deploy with one docker run or a Compose file; config and data persist on the host.
---
