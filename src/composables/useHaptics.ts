import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'
import { Capacitor } from '@capacitor/core'

/**
 * Composable for haptic feedback support across different platforms
 * Provides tactile feedback for user interactions (tab switching, button clicks, etc.)
 */
export function useHaptics() {
  const isNativePlatform = Capacitor.isNativePlatform()

  /**
   * Light impact - for subtle feedback like tab switches
   */
  async function lightImpact() {
    if (!isNativePlatform) return
    try {
      await Haptics.impact({ style: ImpactStyle.Light })
    } catch {
      // Silently fail if haptics not supported
    }
  }

  /**
   * Medium impact - for button clicks and selections
   */
  async function mediumImpact() {
    if (!isNativePlatform) return
    try {
      await Haptics.impact({ style: ImpactStyle.Medium })
    } catch {
      // Silently fail if haptics not supported
    }
  }

  /**
   * Heavy impact - for significant actions
   */
  async function heavyImpact() {
    if (!isNativePlatform) return
    try {
      await Haptics.impact({ style: ImpactStyle.Heavy })
    } catch {
      // Silently fail if haptics not supported
    }
  }

  /**
   * Selection feedback - for picker/selection changes
   */
  async function selectionChanged() {
    if (!isNativePlatform) return
    try {
      await Haptics.selectionChanged()
    } catch {
      // Silently fail if haptics not supported
    }
  }

  /**
   * Notification feedback - for success/warning/error states
   */
  async function notification(type: 'success' | 'warning' | 'error' = 'success') {
    if (!isNativePlatform) return
    try {
      const notificationType = {
        success: NotificationType.Success,
        warning: NotificationType.Warning,
        error: NotificationType.Error
      }[type]
      await Haptics.notification({ type: notificationType })
    } catch {
      // Silently fail if haptics not supported
    }
  }

  /**
   * Vibrate for a specific duration (fallback for older devices)
   */
  async function vibrate(duration: number = 100) {
    if (!isNativePlatform) return
    try {
      await Haptics.vibrate({ duration })
    } catch {
      // Silently fail if haptics not supported
    }
  }

  return {
    lightImpact,
    mediumImpact,
    heavyImpact,
    selectionChanged,
    notification,
    vibrate
  }
}
