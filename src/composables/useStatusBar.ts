import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { getStatusBarStyle, isLightBackground } from '@/themes';

/**
 * Composable for managing the status bar appearance
 * Handles adaptive status bar style based on background color
 */
export function useStatusBar() {
  const isNativePlatform = Capacitor.isNativePlatform();

  /**
   * Set the status bar style based on background color
   * Uses light content (white text) for dark backgrounds
   * Uses dark content (black text) for light backgrounds
   */
  async function setStatusBarStyle(backgroundColor: string) {
    if (!isNativePlatform) return;
    
    try {
      const style = getStatusBarStyle(backgroundColor);
      await StatusBar.setStyle({
        style: style === 'light' ? Style.Dark : Style.Light
      });
    } catch {
      // Silently fail if status bar not supported
    }
  }

  /**
   * Set status bar to light style (white text/icons)
   * Use for dark backgrounds
   */
  async function setLightStyle() {
    if (!isNativePlatform) return;
    
    try {
      await StatusBar.setStyle({ style: Style.Dark });
    } catch {
      // Silently fail if status bar not supported
    }
  }

  /**
   * Set status bar to dark style (black text/icons)
   * Use for light backgrounds
   */
  async function setDarkStyle() {
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
   * Automatically determines the appropriate style based on background color
   */
  async function updateForTheme(isDark: boolean, primaryColor: string) {
    if (!isNativePlatform) return;

    try {
      if (isDark) {
        // Dark mode: use the dark background color with light status bar icons
        await setLightStyle();
        await setBackgroundColor('#121212');
      } else {
        // Light mode: use the primary color as background
        // Determine if the primary color is light or dark
        const shouldUseDarkText = isLightBackground(primaryColor);
        if (shouldUseDarkText) {
          await setDarkStyle();
        } else {
          await setLightStyle();
        }
        await setBackgroundColor(primaryColor);
      }
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
    setLightStyle,
    setDarkStyle,
    setBackgroundColor,
    updateForTheme,
    show,
    hide
  };
}
