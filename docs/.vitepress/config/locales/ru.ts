import { defineConfig } from 'vitepress';

export const ru = defineConfig({
  lang: 'ru-RU',
  description: 'Контейнер для внедрения зависимостей',

  themeConfig: {
    nav: [
      {
        text: 'Руководство',
        link: '/ru/guide/getting-started',
        activeMatch: '/ru/guide/',
      },
    ],

    sidebar: {
      '/ru/': {
        base: '/ru/',
        items: [
          {
            text: 'Введение',
            base: '/ru/introdution/',
            collapsed: false,
            items: [
              { text: 'Что такое BindBox?', link: 'what-is-bindbox' },
              { text: 'Мотивация', link: 'motivation' },
            ],
          },
          {
            text: 'Основы',
            base: '/ru/guide/',
            collapsed: false,
            items: [{ text: 'Быстрый старт', link: 'getting-started' }],
          },
          {
            text: 'Участие и развитие',
            base: '/ru/contribute/',
            collapsed: false,
            items: [
              { text: 'Обсуждения', link: 'discussions' },
              { text: 'Руководство по вкладу', link: 'guide' },
              { text: 'Журнал изменений', link: 'changelog' },
            ],
          },
        ],
      },
    },

    editLink: {
      pattern: 'https://github.com/stenin-nikita/bindbox/edit/main/docs/src/:path',
      text: 'Предложить изменения к этой странице',
    },

    footer: {
      message: 'Опубликовано под лицензией MIT.',
      copyright: '© 2025 – настоящее время, Никита Стенин',
    },

    lastUpdated: {
      text: 'Обновлено',
    },

    outline: { label: 'Содержание страницы' },

    docFooter: {
      prev: 'Предыдущая страница',
      next: 'Следующая страница',
    },

    darkModeSwitchLabel: 'Оформление',
    lightModeSwitchTitle: 'Переключить на светлую тему',
    darkModeSwitchTitle: 'Переключить на тёмную тему',
    sidebarMenuLabel: 'Меню',
    returnToTopLabel: 'Вернуться к началу',
    langMenuLabel: 'Изменить язык',
  },
});
