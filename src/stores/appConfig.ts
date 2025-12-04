import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { SupportedLocale } from '@/i18n'
import { useI18n } from 'vue-i18n'

export type ThemeColor = 'blue' | 'green' | 'yellow' | 'pink' | 'purple'
export type DarkMode = 'system' | 'light' | 'dark'

export interface ThemeColorValues {
  light: string
  dark: string
  main: string
}

export const themeColors: Record<ThemeColor, ThemeColorValues> = {
  blue: { light: '#1976D2', dark: '#90CAF9', main: '#2196F3' },
  green: { light: '#388E3C', dark: '#81C784', main: '#4CAF50' },
  yellow: { light: '#F9A825', dark: '#FFE082', main: '#FFC107' },
  pink: { light: '#C2185B', dark: '#F48FB1', main: '#E91E63' },
  purple: { light: '#7B1FA2', dark: '#CE93D8', main: '#9C27B0' }
}

const STORAGE_KEYS = {
  LOCALE: 'app-locale',
  THEME_COLOR: 'app-theme-color',
  DARK_MODE: 'app-dark-mode'
} as const

function getSystemDarkMode(): boolean {
  if (typeof window === 'undefined') {
    return false
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function getSavedLocale(): SupportedLocale {
  const saved = localStorage.getItem(STORAGE_KEYS.LOCALE)
  if (saved === 'zh-CN' || saved === 'en-US') {
    return saved
  }
  return navigator.language.startsWith('zh') ? 'zh-CN' : 'en-US'
}

function getSavedThemeColor(): ThemeColor {
  const saved = localStorage.getItem(STORAGE_KEYS.THEME_COLOR)
  if (saved && Object.keys(themeColors).includes(saved)) {
    return saved as ThemeColor
  }
  return 'blue'
}

function getSavedDarkMode(): DarkMode {
  const saved = localStorage.getItem(STORAGE_KEYS.DARK_MODE)
  if (saved === 'system' || saved === 'light' || saved === 'dark') {
    return saved
  }
  return 'system'
}

export const useAppConfigStore = defineStore('appConfig', () => {
  // State
  const locale = ref<SupportedLocale>(getSavedLocale())
  const themeColor = ref<ThemeColor>(getSavedThemeColor())
  const darkMode = ref<DarkMode>(getSavedDarkMode())
  const systemDark = ref(getSystemDarkMode())

  // Computed
  const isDark = computed(() => {
    if (darkMode.value === 'system') {
      return systemDark.value
    }
    return darkMode.value === 'dark'
  })

  const currentThemeColors = computed(() => {
    return themeColors[themeColor.value]
  })

  const primaryColor = computed(() => {
    return isDark.value ? currentThemeColors.value.dark : currentThemeColors.value.light
  })

  // Actions
  function setLocale(newLocale: SupportedLocale) {
    locale.value = newLocale
    localStorage.setItem(STORAGE_KEYS.LOCALE, newLocale)
  }

  function setThemeColor(color: ThemeColor) {
    themeColor.value = color
    localStorage.setItem(STORAGE_KEYS.THEME_COLOR, color)
    updateCSSVariables()
  }

  function setDarkMode(mode: DarkMode) {
    darkMode.value = mode
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, mode)
    updateDocumentClass()
  }

  function updateDocumentClass() {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  function updateCSSVariables() {
    const colors = currentThemeColors.value
    document.documentElement.style.setProperty('--theme-color-primary', colors.main)
    document.documentElement.style.setProperty('--theme-color-primary-light', colors.light)
    document.documentElement.style.setProperty('--theme-color-primary-dark', colors.dark)
  }

  function initTheme() {
    // Listen for system dark mode changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', (e) => {
      systemDark.value = e.matches
      if (darkMode.value === 'system') {
        updateDocumentClass()
      }
    })

    updateDocumentClass()
    updateCSSVariables()
  }

  // Watch for changes
  watch(isDark, updateDocumentClass)
  watch(themeColor, updateCSSVariables)

  return {
    // State
    locale,
    themeColor,
    darkMode,
    systemDark,
    
    // Computed
    isDark,
    currentThemeColors,
    primaryColor,
    
    // Actions
    setLocale,
    setThemeColor,
    setDarkMode,
    initTheme
  }
})

/**
 * Composable for using i18n with the app config store
 */
export function useAppLocale() {
  const store = useAppConfigStore()
  const { locale: i18nLocale } = useI18n()

  function setLocale(newLocale: SupportedLocale) {
    store.setLocale(newLocale)
    i18nLocale.value = newLocale
  }

  return {
    locale: computed(() => store.locale),
    setLocale
  }
}
