import { createI18n } from 'vue-i18n'
import zhCN from '@/locales/zh-CN.json'
import enUS from '@/locales/en-US.json'

export type SupportedLocale = 'zh-CN' | 'en-US'

export const supportedLocales: SupportedLocale[] = ['zh-CN', 'en-US']

export const localeNames: Record<SupportedLocale, string> = {
  'zh-CN': '简体中文',
  'en-US': 'English'
}

/**
 * Get the browser's preferred locale
 */
function getBrowserLocale(): SupportedLocale {
  const browserLang = navigator.language
  
  if (browserLang.startsWith('zh')) {
    return 'zh-CN'
  }
  
  return 'en-US'
}

/**
 * Get the saved locale from localStorage or use browser default
 */
function getDefaultLocale(): SupportedLocale {
  const saved = localStorage.getItem('app-locale')
  if (saved && supportedLocales.includes(saved as SupportedLocale)) {
    return saved as SupportedLocale
  }
  return getBrowserLocale()
}

const i18n = createI18n({
  legacy: false,
  locale: getDefaultLocale(),
  fallbackLocale: 'en-US',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS
  }
})

export default i18n
