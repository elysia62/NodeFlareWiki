<script setup>
import { withBase } from 'vitepress'
</script>

# 界面预览

NodeFlare 由公开看板与管理后台两部分组成，均支持简体中文 / English 双语，站点名称、公告、Logo、背景图与显示项均可在后台配置。

## 公开看板

面向访客的节点状态看板，卡片每秒刷新。点击下图可直接打开<a :href="withBase('/demo/')" target="_self">在线演示</a>，无需部署即可体验节点详情、历史图表与主题切换。

<DemoPreview
  src="/images/frontend.png"
  alt="公开看板"
  href="/demo/"
  badge="在线演示"
/>

::: tip
在线演示使用模拟数据，可先熟悉界面，再部署配置自己的面板。
:::

## 管理后台

节点、告警、主题、数据库等均在管理后台完成配置。

![管理后台](/images/backend.png)
