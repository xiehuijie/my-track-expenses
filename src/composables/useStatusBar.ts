import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { getStatusBarStyle, isLightBackground } from '@/themes';

/**
 * Composable for managing the status bar appearance
 * Handles adaptive status bar style based on background color
 * 
 * Note on Capacitor Status Bar Style naming:
 * - Style.Dark = light content (white text/icons) for use on dark backgrounds
 * - Style.Light = dark content (black text/icons) for use on light backgrounds
 * This is counter-intuitive but follows the "content color" naming convention
 */
export function useStatusBar() {
  const isNativePlatform = Capacitor.isNativePlatform();

  /**
   * Set the status bar style based on background color
   * Uses light content (white text) for dark backgrounds
   * Uses dark content (black text) for light backgrounds
   * 
   * Note: Theme 'light' style means light content (white icons), which maps to Style.Dark
   * This is because Capacitor's Style enum refers to content color, not background color
   */
  async function setStatusBarStyle(backgroundColor: string) {
    if (!isNativePlatform) return;
    
    try {
      const style = getStatusBarStyle(backgroundColor);
      // 'light' theme style = light content (white icons) = Capacitor Style.Dark
      // 'dark' theme style = dark content (black icons) = Capacitor Style.Light
      await StatusBar.setStyle({
        style: style === 'light' ? Style.Dark : Style.Light
      });
    } catch {
      // Silently fail if status bar not supported
    }
  }

  /**
   * Set status bar to show light content (white text/icons)
   * Use for dark backgrounds
   * 
   * Note: Uses Capacitor's Style.Dark which shows light/white content
   */
  async function setLightContent() {
    if (!isNativePlatform) return;
    
    try {
      await StatusBar.setStyle({ style: Style.Dark });
    } catch {
      // Silently fail if status bar not supported
    }
  }

  /**
   * Set status bar to show dark content (black text/icons)
   * Use for light backgrounds
   * 
   * Note: Uses Capacitor's Style.Light which shows dark/black content
   */
  async function setDarkContent() {
    if (!isNativePlatform) return;
    
    try {
      await StatusBar.setStyle({ style: Style.Light });
    } catch {
      // Silently fail if status bar not supported
    }
  }

  /**
   * Set the status bar background color
   */
  async function setBackgroundColor(color: string) {
    if (!isNativePlatform) return;
    
    try {
      await StatusBar.setBackgroundColor({ color });
    } catch {
      // Silently fail if not supported (iOS doesn't support this)
    }
  }

  /**
   * Update status bar to match the current theme
   * Automatically determines the appropriate style based on app background color
   * 
   * @param _isDark - Whether dark mode is active (unused, kept for API compatibility)
   * @param appBackgroundColor - The app's background color (used for transparent status bar)
   */
  async function updateForTheme(_isDark: boolean, appBackgroundColor: string) {
    if (!isNativePlatform) return;

    try {
      // Since the status bar is transparent, the icons appear over the app's background
      // We need to set the icon style based on the app's background color
      const shouldUseDarkIcons = isLightBackground(appBackgroundColor);
      
      if (shouldUseDarkIcons) {
        await setDarkContent();
      } else {
        await setLightContent();
      }
      
      // Set the background color (used on Android)
      await setBackgroundColor(appBackgroundColor);
    } catch {
      // Silently fail if status bar not supported
    }
  }

  /**
   * Show the status bar
   */
  async function show() {
    if (!isNativePlatform) return;
    
    try {
      await StatusBar.show();
    } catch {
      // Silently fail if status bar not supported
    }
  }

  /**
   * Hide the status bar
   */
  async function hide() {
    if (!isNativePlatform) return;
    
    try {
      await StatusBar.hide();
    } catch {
      // Silently fail if status bar not supported
    }
  }

  return {
    setStatusBarStyle,
    setLightContent,
    setDarkContent,
    setBackgroundColor,
    updateForTheme,
    show,
    hide
  };
}
