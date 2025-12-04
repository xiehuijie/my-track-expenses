import 'reflect-metadata'
import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import i18n from './i18n'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

import './style.css'
import { useAppConfigStore } from './stores/appConfig'
import { themes } from './themes'
import { initializeDatabase } from './db'

// Create Vuetify themes from our theme system
const vuetifyThemes: Record<string, object> = {}
Object.entries(themes).forEach(([id, theme]) => {
  // Light theme variant
  vuetifyThemes[`${id}-light`] = {
    dark: false,
    colors: {
      background: theme.light.surfaces.background,
      surface: theme.light.surfaces.surface,
      'surface-variant': theme.light.surfaces.surfaceVariant,
      primary: theme.palette.primary.base,
      'primary-darken-1': theme.palette.primary.darken1,
      secondary: theme.palette.secondary.base,
      'secondary-darken-1': theme.palette.secondary.darken1,
      success: theme.palette.success.base,
      warning: theme.palette.warning.base,
      error: theme.palette.error.base,
      info: theme.palette.info.base,
    }
  }
  // Dark theme variant
  vuetifyThemes[`${id}-dark`] = {
    dark: true,
    colors: {
      background: theme.dark.surfaces.background,
      surface: theme.dark.surfaces.surface,
      'surface-variant': theme.dark.surfaces.surfaceVariant,
      primary: theme.palette.primary.lighten3,
      'primary-darken-1': theme.palette.primary.base,
      secondary: theme.palette.secondary.base,
      'secondary-darken-1': theme.palette.secondary.darken1,
      success: theme.palette.success.base,
      warning: theme.palette.warning.base,
      error: theme.palette.error.base,
      info: theme.palette.info.base,
    }
  }
})

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'blue-dark',
    themes: vuetifyThemes
  },
  icons: {
    defaultSet: 'mdi'
  }
})

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(vuetify)
app.use(i18n)

// Initialize theme after pinia is available
const appConfig = useAppConfigStore()
appConfig.initTheme()

// Initialize database and then mount the app
initializeDatabase()
  .then(() => {
    console.log('Database initialized successfully')
    app.mount('#app')
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error)
    // Mount app anyway to show error state or allow fallback
    app.mount('#app')
  })
