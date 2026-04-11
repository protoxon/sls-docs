import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import ComposeDownloads from './components/ComposeDownloads.vue'
import SoftwareRepoList from './components/SoftwareRepoList.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('ComposeDownloads', ComposeDownloads)
    app.component('SoftwareRepoList', SoftwareRepoList)
  },
} satisfies Theme
