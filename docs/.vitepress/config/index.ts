import { defineConfig } from 'vitepress';
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons';

import { en } from './locales/en';
import { ru } from './locales/ru';

export default defineConfig({
  srcDir: 'src',
  outDir: 'dist',
  base: '/bindbox/',

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },

    config(md) {
      md.use(groupIconMdPlugin);
    },
  },
  vite: {
    plugins: [groupIconVitePlugin()],
  },

  title: 'BindBox',

  lastUpdated: true,
  cleanUrls: true,

  rewrites: {
    'en/:rest*': ':rest*',
  },

  themeConfig: {
    search: {
      provider: 'local',
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/stenin-nikita/bindbox' }],
  },

  locales: {
    root: { label: 'English', ...en },
    ru: { label: 'Русский', ...ru },
  },
});
