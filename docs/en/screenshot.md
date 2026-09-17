<script setup>
import { withBase } from 'vitepress'
</script>

# Screenshots

NodeFlare consists of a public dashboard and an admin panel, both available in Chinese / English. The site name, announcement, logo, background image, and visible sections are configurable in the admin panel.

## Public Dashboard

The visitor-facing status dashboard; cards refresh every second. Click the image to open the <a :href="withBase('/demo/')" target="_self">live demo</a> and try node details, history charts, and the theme toggle without deploying anything.

<DemoPreview
  src="/images/frontend.png"
  alt="Public dashboard"
  href="/demo/"
  badge="Live Demo"
/>

::: tip
The live demo runs on simulated data — get familiar with the UI before setting up your own panel.
:::

## Admin Panel

Nodes, alerts, themes, and databases are all managed from the admin panel. You can also open the <a :href="withBase('/demo/admin.html#/admin/login')" target="_self">admin demo</a> (username and password: `admin`).

![Admin panel](/images/backend.png)
