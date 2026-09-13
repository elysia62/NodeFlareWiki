---
layout: home

hero:
  name: NodeFlare
  text: Lightweight self-hosted server monitoring
  tagline:
    View server status in a web UI while a lightweight agent collects and pushes telemetry. Live metrics,
    TCP/ICMP latency probing, Telegram alerts, remote execution, TOTP two-factor authentication, theme
    customization, and SQLite / PostgreSQL support.
  actions:
    - theme: brand
      text: Get Started
      link: /en/guide/quick-start
    - theme: alt
      text: Live Demo
      link: /demo/
    - theme: alt
      text: FAQ
      link: /en/faq
    - theme: alt
      text: GitHub Repository
      link: https://github.com/elysia62/NodeFlare

features:
  - icon: ⚡
    title: Lightweight & Efficient
    details: CPU, memory, and network speed are sampled every second and uploaded in compressed batches every 3 seconds by default; slower metrics such as disks, GPU, and connection counts are cached separately.
  - icon: 📡
    title: Latency Probing
    details: TCP and ICMP probing tasks assigned per node, with per-carrier (China Telecom / Mobile / Unicom) display.
  - icon: 🔔
    title: Alerts & Notifications
    details: CPU / memory / disk / bandwidth thresholds, offline, expiry, and traffic alerts delivered through Telegram with customizable message templates.
  - icon: 🎨
    title: Theme Store
    details: Bilingual public dashboard with built-in themes, one-click install from GitHub repositories, and local ZIP upload.
  - icon: 🔐
    title: Secure by Default
    details: TOTP two-factor authentication, Cloudflare Turnstile, login rate limiting, and session management. The server listens on 127.0.0.1 by default.
  - icon: 💾
    title: Data Ownership
    details: SQLite and PostgreSQL with online migration between them, one-click backup and restore, and automatic history cleanup by retention days.
---
