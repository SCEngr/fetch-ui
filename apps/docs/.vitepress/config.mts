import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Fetch UI',
  description: 'Remote UI Component Loader',
  base: '/fetch-ui/',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }]
  ],
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: 'Guide', link: '/guide/getting-started' }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/SCEngr/fetch-ui' }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright 2024-present SCEngr'
    }
  }
})
