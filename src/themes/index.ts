/**
 * Theme System
 *
 * This module exports all available themes and utilities for managing themes.
 */

export * from './types';
export { blueTheme } from './blue';
export { greenTheme } from './green';
export { yellowTheme } from './yellow';
export { pinkTheme } from './pink';
export { purpleTheme } from './purple';

import type { Theme, ThemeModeColors } from './types';
import { blueTheme } from './blue';
import { greenTheme } from './green';
import { yellowTheme } from './yellow';
import { pinkTheme } from './pink';
import { purpleTheme } from './purple';

/**
 * All available themes
 */
export const themes: Record<string, Theme> = {
    blue: blueTheme,
    green: greenTheme,
    yellow: yellowTheme,
    pink: pinkTheme,
    purple: purpleTheme,
};

/**
 * Theme IDs
 */
export type ThemeId = keyof typeof themes;

/**
 * Get a theme by ID
 */
export function getTheme(id: ThemeId): Theme {
    return themes[id] ?? blueTheme;
}

/**
 * Get the mode-specific colors for a theme
 */
export function getThemeModeColors(theme: Theme, isDark: boolean): ThemeModeColors {
    return isDark ? theme.dark : theme.light;
}

/**
 * Apply theme CSS variables to the document
 */
export function applyThemeCSSVariables(theme: Theme, isDark: boolean): void {
    const root = document.documentElement;
    const modeColors = getThemeModeColors(theme, isDark);
    const palette = theme.palette;

    // Primary color palette
    root.style.setProperty('--theme-primary', palette.primary.base);
    root.style.setProperty('--theme-primary-lighten-5', palette.primary.lighten5);
    root.style.setProperty('--theme-primary-lighten-4', palette.primary.lighten4);
    root.style.setProperty('--theme-primary-lighten-3', palette.primary.lighten3);
    root.style.setProperty('--theme-primary-lighten-2', palette.primary.lighten2);
    root.style.setProperty('--theme-primary-lighten-1', palette.primary.lighten1);
    root.style.setProperty('--theme-primary-darken-1', palette.primary.darken1);
    root.style.setProperty('--theme-primary-darken-2', palette.primary.darken2);
    root.style.setProperty('--theme-primary-darken-3', palette.primary.darken3);
    root.style.setProperty('--theme-primary-darken-4', palette.primary.darken4);
    root.style.setProperty('--theme-primary-accent-1', palette.primary.accent1);
    root.style.setProperty('--theme-primary-accent-2', palette.primary.accent2);
    root.style.setProperty('--theme-primary-accent-3', palette.primary.accent3);
    root.style.setProperty('--theme-primary-accent-4', palette.primary.accent4);

    // Secondary color palette
    root.style.setProperty('--theme-secondary', palette.secondary.base);
    root.style.setProperty('--theme-secondary-darken-2', palette.secondary.darken2);

    // Semantic colors
    root.style.setProperty('--theme-success', palette.success.base);
    root.style.setProperty('--theme-warning', palette.warning.base);
    root.style.setProperty('--theme-error', palette.error.base);
    root.style.setProperty('--theme-info', palette.info.base);

    // Surface colors
    root.style.setProperty('--theme-background', modeColors.surfaces.background);
    root.style.setProperty('--theme-surface', modeColors.surfaces.surface);
    root.style.setProperty('--theme-surface-variant', modeColors.surfaces.surfaceVariant);
    root.style.setProperty('--theme-card', modeColors.surfaces.card);
    root.style.setProperty('--theme-dialog', modeColors.surfaces.dialog);
    root.style.setProperty('--theme-overlay', modeColors.surfaces.overlay);

    // Text colors
    root.style.setProperty('--theme-text-primary', modeColors.text.primary);
    root.style.setProperty('--theme-text-secondary', modeColors.text.secondary);
    root.style.setProperty('--theme-text-disabled', modeColors.text.disabled);
    root.style.setProperty('--theme-text-hint', modeColors.text.hint);
    root.style.setProperty('--theme-text-on-primary', modeColors.text.onPrimary);
    root.style.setProperty('--theme-text-on-secondary', modeColors.text.onSecondary);
    root.style.setProperty('--theme-text-on-background', modeColors.text.onBackground);
    root.style.setProperty('--theme-text-on-surface', modeColors.text.onSurface);
    root.style.setProperty('--theme-text-on-error', modeColors.text.onError);

    // Border colors
    root.style.setProperty('--theme-border', modeColors.borders.default);
    root.style.setProperty('--theme-border-light', modeColors.borders.light);
    root.style.setProperty('--theme-border-dark', modeColors.borders.dark);

    // Status bar
    root.style.setProperty('--theme-status-bar-bg', modeColors.statusBar.background);
    root.style.setProperty('--theme-status-bar-style', modeColors.statusBar.style);

    // Legacy variables for compatibility
    root.style.setProperty('--theme-color-primary', palette.primary.base);
    root.style.setProperty('--theme-color-primary-light', isDark ? palette.primary.lighten3 : palette.primary.darken2);
    root.style.setProperty('--theme-color-primary-dark', isDark ? palette.primary.lighten3 : palette.primary.darken2);
}

/**
 * Calculate relative luminance of a color
 * Based on WCAG 2.0 formula
 */
export function getRelativeLuminance(hex: string): number {
    // Remove # if present
    const cleanHex = hex.replace('#', '');

    // Parse RGB values
    const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
    const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
    const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

    // Apply gamma correction
    const R = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    const G = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    const B = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/**
 * Determine if a background color is light or dark
 * Returns true if the background is light (should use dark text)
 */
export function isLightBackground(hex: string): boolean {
    return getRelativeLuminance(hex) > 0.5;
}

/**
 * Get the appropriate status bar style for a background color
 */
export function getStatusBarStyle(backgroundColor: string): 'light' | 'dark' {
    return isLightBackground(backgroundColor) ? 'dark' : 'light';
}
