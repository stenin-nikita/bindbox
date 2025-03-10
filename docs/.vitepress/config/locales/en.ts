import { defineConfig } from 'vitepress';

export const en = defineConfig({
  lang: 'en-US',
  description: 'The dependency injection container',

  themeConfig: {
    nav: [
      {
        text: 'Guide',
        link: '/guide/getting-started',
        activeMatch: '/guide/',
      },
    ],

    sidebar: {
      '/': {
        base: '/',
        items: [
          {
            text: 'Introduction',
            base: '/introdution/',
            collapsed: false,
            items: [
              { text: 'What is BindBox?', link: 'what-is-bindbox' },
              { text: 'Motivation', link: 'motivation' },
            ],
          },
          {
            text: 'Basic',
            base: '/guide/',
            collapsed: false,
            items: [{ text: 'Getting Started', link: 'getting-started' }],
          },
          {
            text: 'Contribute',
            base: '/contribute/',
            collapsed: false,
            items: [
              { text: 'Discussions', link: 'discussions' },
              { text: 'Contributing Guide', link: 'guide' },
              { text: 'Changelog', link: 'changelog' },
            ],
          },
        ],
      },
    },

    editLink: {
      pattern: 'https://github.com/stenin-nikita/bindbox/edit/main/docs/src/:path',
      text: 'Suggest changes',
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025-present Nikita Stenin',
    },
  },
});
