import { defineConfig } from 'vitepress'
import type { DefaultTheme } from 'vitepress/theme'

export default defineConfig({
  base: '/sls-docs/',
  title: 'SLS',
  description: 'SLS is an open-source system for automating the deployment, scaling, and management of containerized game servers.',

  appearance: 'force-dark',

  head: [
    ['link', { rel: 'icon', href: '/logo.png', type: 'image/png' }],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=JetBrains+Mono:wght@400;500&display=swap',
      },
    ],
    ['meta', { name: 'theme-color', content: '#0c1222' }],
  ],

  themeConfig: {
    logo: '/logo.png',

    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'Guide',
        items: [
          { text: 'Introduction', link: '/guide/introduction' },
          { text: 'Getting started', link: '/guide/getting-started' },
          { text: 'Installing Protocube', link: '/guide/installing-protocube' },
          { text: 'Installing the daemon', link: '/guide/installing-daemon' },
          {
            text: 'Blueprints',
            items: [
              { text: 'Introduction', link: '/guide/blueprints/introduction' },
              { text: 'Creating blueprints', link: '/guide/blueprints/creating-blueprints' },
              { text: 'Mixins', link: '/guide/blueprints/mixins' },
              {
                text: 'Examples',
                items: [
                  { text: 'Overview', link: '/guide/blueprints/examples/' },
                  { text: 'Block Hunt', link: '/guide/blueprints/examples/block-hunt' },
                  { text: 'vSLS', link: '/guide/blueprints/examples/vsls' },
                  { text: 'Adding plugins', link: '/guide/blueprints/examples/adding-plugins' },
                  { text: 'Volumes', link: '/guide/blueprints/examples/volumes' },
                  { text: 'Config patches', link: '/guide/blueprints/examples/config-patches' },
                  { text: 'Enable Nether', link: '/guide/blueprints/examples/enable-nether' },
                ],
              },
            ],
          },
          {
            text: 'Software configurations',
            items: [
              { text: 'Introduction', link: '/guide/software-configurations/introduction' },
              { text: 'Configuring software', link: '/guide/software-configurations/configuring-software' },
              {
                text: 'Examples',
                items: [
                  { text: 'Paper', link: '/guide/software-configurations/examples/paper' },
                ],
              },
            ],
          },
          {
            text: 'vSLS',
            items: [
              { text: 'Overview', link: '/guide/vsls/' },
              { text: 'Installation', link: '/guide/vsls/installation' },
              { text: 'Configuring', link: '/guide/vsls/configuring' },
              { text: 'Commands', link: '/guide/vsls/commands' },
            ],
          },
          {
            text: 'Troubleshooting',
            items: [
              { text: 'Overview', link: '/guide/troubleshooting/' },
              { text: 'Docker issues', link: '/guide/troubleshooting/docker-issues' },
              { text: 'Server connection issues', link: '/guide/troubleshooting/server-connection-issues' },
              { text: 'API or connectivity', link: '/guide/troubleshooting/api-or-connectivity' },
            ],
          },
        ],
      },
      {
        text: 'Reference',
        items: [
          { text: 'Overview', link: '/reference/overview' },
          { text: 'Configuration', link: '/reference/configuration' },
          { text: 'Plugin API', link: '/reference/plugin-api' },
          { text: 'CLI', link: '/reference/cli' },
          {
            text: 'SLS API',
            items: [
              { text: 'Overview', link: '/reference/api/' },
              { text: 'Core endpoints', link: '/reference/api/core' },
              { text: 'Event streams', link: '/reference/api/events' },
              { text: 'Server management', link: '/reference/api/server-management' },
              { text: 'Browser pages', link: '/reference/api/browser' },
            ],
          },
        ],
      },
      { text: 'Contributing', link: '/contributing' },
    ] as DefaultTheme.NavItem[],

    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          collapsed: true,
          items: [
            { text: 'Introduction', link: '/guide/introduction' },
            { text: 'Getting started', link: '/guide/getting-started' },
            { text: 'Installing Protocube', link: '/guide/installing-protocube' },
            { text: 'Installing the daemon', link: '/guide/installing-daemon' },
          ],
        },
        {
          text: 'Blueprints',
          collapsed: true,
          items: [
            { text: 'Introduction', link: '/guide/blueprints/introduction' },
            { text: 'Creating blueprints', link: '/guide/blueprints/creating-blueprints' },
            { text: 'Mixins', link: '/guide/blueprints/mixins' },
            {
              text: 'Examples',
              collapsed: true,
              items: [
                { text: 'Overview', link: '/guide/blueprints/examples/' },
                { text: 'Block Hunt', link: '/guide/blueprints/examples/block-hunt' },
                { text: 'vSLS', link: '/guide/blueprints/examples/vsls' },
                { text: 'Adding plugins', link: '/guide/blueprints/examples/adding-plugins' },
                { text: 'Volumes', link: '/guide/blueprints/examples/volumes' },
                { text: 'Config patches', link: '/guide/blueprints/examples/config-patches' },
                { text: 'Enable Nether', link: '/guide/blueprints/examples/enable-nether' },
              ],
            },
          ],
        },
        {
          text: 'Software configurations',
          collapsed: true,
          items: [
            { text: 'Introduction', link: '/guide/software-configurations/introduction' },
            { text: 'Configuring software', link: '/guide/software-configurations/configuring-software' },
            {
              text: 'Examples',
              collapsed: true,
              items: [
                { text: 'Paper', link: '/guide/software-configurations/examples/paper' },
              ],
            },
          ],
        },
        {
          text: 'vSLS',
          collapsed: true,
          items: [
            { text: 'Overview', link: '/guide/vsls/' },
            { text: 'Installation', link: '/guide/vsls/installation' },
            { text: 'Configuring', link: '/guide/vsls/configuring' },
            { text: 'Commands', link: '/guide/vsls/commands' },
          ],
        },
        {
          text: 'Troubleshooting',
          collapsed: true,
          items: [
            { text: 'Overview', link: '/guide/troubleshooting/' },
            { text: 'Docker issues', link: '/guide/troubleshooting/docker-issues' },
            { text: 'Server connection issues', link: '/guide/troubleshooting/server-connection-issues' },
            { text: 'API or connectivity', link: '/guide/troubleshooting/api-or-connectivity' },
          ],
        },
      ],
      '/reference/': [
        {
          text: 'Reference',
          collapsed: true,
          items: [
            { text: 'Overview', link: '/reference/overview' },
            { text: 'Configuration', link: '/reference/configuration' },
            { text: 'Plugin API', link: '/reference/plugin-api' },
            { text: 'CLI', link: '/reference/cli' },
          ],
        },
        {
          text: 'SLS API',
          collapsed: true,
          items: [
            { text: 'Overview', link: '/reference/api/' },
            { text: 'Core endpoints', link: '/reference/api/core' },
            { text: 'Event streams', link: '/reference/api/events' },
            { text: 'Server management', link: '/reference/api/server-management' },
            { text: 'Browser pages', link: '/reference/api/browser' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/jessefaler/SLS' },
      { icon: 'discord', link: 'https://discord.gg/BrH8GtyGSh' },
    ],

    search: {
      provider: 'local',
    },

    outline: {
      level: [2, 3],
    },
  },
})
