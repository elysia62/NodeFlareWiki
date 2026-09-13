import { defineConfig } from 'vitepress'

// GitHub Pages 项目站点部署在 https://<user>.github.io/<repo>/，
// CI 会按仓库名注入 BASE_PATH；自定义域名部署时改为 '/' 即可。
const base = (process.env.BASE_PATH ?? '/NodeFlareWiki/').replace(/\/+$/, '') + '/'

export default defineConfig({
  lang: 'zh-CN',
  title: 'NodeFlare',
  description:
    '轻量级的自托管服务器监控面板：实时监控、TCP/ICMP 延迟拨测、Telegram 告警、远程执行、主题定制，支持 SQLite / PostgreSQL。',
  base,
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}logo.svg` }],
    ['meta', { name: 'theme-color', content: '#11191f' }]
  ],
  lastUpdated: true,
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'NodeFlare Wiki',

    sidebar: [
      {
        text: '快速开始',
        items: [
          { text: '界面预览', link: '/screenshot' },
          { text: '安装服务端', link: '/guide/quick-start' },
          { text: '安装 Agent', link: '/guide/agent' },
          { text: '平台支持与默认目录', link: '/guide/platforms' },
          { text: '卸载', link: '/guide/uninstall' }
        ]
      },
      {
        text: '使用指南',
        items: [
          { text: '配置', link: '/guide/config' },
          { text: '监控口径与采样', link: '/guide/monitoring' },
          { text: '告警与通知', link: '/guide/alerts' },
          { text: '主题定制', link: '/guide/themes' },
          { text: '数据库与备份', link: '/guide/database' },
          { text: '反向代理', link: '/guide/proxy' }
        ]
      },
      {
        text: '开发指南',
        items: [
          { text: '开发环境', link: '/dev/develop' },
          { text: '仓库结构', link: '/dev/structure' }
        ]
      },
      {
        text: '常见问题',
        items: [{ text: 'FAQ', link: '/faq' }]
      }
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/elysia62/NodeFlare' }],

    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
          modal: {
            noResultsText: '没有找到结果',
            resetButtonTitle: '清除查询条件',
            footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' }
          }
        }
      }
    },

    outline: { level: 'deep', label: '本页目录' },
    lastUpdated: { text: '最后更新于' },
    docFooter: { prev: '上一页', next: '下一页' },
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '回到顶部',
    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    editLink: {
      pattern: 'https://github.com/elysia62/NodeFlareWiki/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页'
    },

    footer: {
      message: '基于 MIT 许可发布',
      copyright: 'Copyright © 2026 NodeFlare Contributors'
    }
  }
})
