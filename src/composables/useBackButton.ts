import { App } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'
import { useRouter, useRoute } from 'vue-router'
import { onMounted, onUnmounted } from 'vue'

// Routes that are considered as main tabs (part of index page)
const MAIN_TAB_ROUTES = ['/', '/statistics', '/assets', '/me']

/**
 * Composable for handling Android back button behavior
 * - For non-main pages: navigate back to previous page
 * - For main tab pages: exit the app
 */
export function useBackButton() {
  const router = useRouter()
  const route = useRoute()
  let backButtonListener: (() => Promise<void>) | null = null

  const isMainTabRoute = (path: string): boolean => {
    return MAIN_TAB_ROUTES.includes(path)
  }

  const handleBackButton = async () => {
    const currentPath = route.path

    // If we're on a main tab, exit the app
    if (isMainTabRoute(currentPath)) {
      await App.exitApp()
    } else {
      // Otherwise, go back in history
      router.back()
    }
  }

  const setupBackButtonHandler = async () => {
    if (!Capacitor.isNativePlatform()) return

    // Remove any existing listener
    if (backButtonListener) {
      await backButtonListener()
    }

    // Add new listener
    const listener = await App.addListener('backButton', async () => {
      await handleBackButton()
    })

    backButtonListener = listener.remove
  }

  const cleanupBackButtonHandler = async () => {
    if (backButtonListener) {
      await backButtonListener()
      backButtonListener = null
    }
  }

  return {
    setupBackButtonHandler,
    cleanupBackButtonHandler,
    handleBackButton,
    isMainTabRoute
  }
}

/**
 * Composable that automatically sets up and cleans up the back button handler
 * Use this in App.vue or MainLayout.vue
 */
export function useAutoBackButton() {
  const { setupBackButtonHandler, cleanupBackButtonHandler } = useBackButton()

  onMounted(() => {
    setupBackButtonHandler()
  })

  onUnmounted(() => {
    cleanupBackButtonHandler()
  })
}
