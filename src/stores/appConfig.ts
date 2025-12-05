import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import type { SupportedLocale } from '@/i18n';
import { useI18n } from 'vue-i18n';
import { themes, getTheme, applyThemeCSSVariables, type ThemeId, type Theme } from '@/themes';
import { useStatusBar } from '@/composables/useStatusBar';

export type ThemeColor = ThemeId;
export type DarkMode = 'system' | 'light' | 'dark';

// Legacy interface for backwards compatibility
export interface ThemeColorValues {
    light: string;
    dark: string;
    main: string;
}

// Legacy themeColors map for backwards compatibility
export const themeColors: Record<ThemeColor, ThemeColorValues> = {
    blue: { light: '#1976D2', dark: '#90CAF9', main: '#2196F3' },
    green: { light: '#388E3C', dark: '#81C784', main: '#4CAF50' },
    yellow: { light: '#F9A825', dark: '#FFE082', main: '#FFC107' },
    pink: { light: '#C2185B', dark: '#F48FB1', main: '#E91E63' },
    purple: { light: '#7B1FA2', dark: '#CE93D8', main: '#9C27B0' },
};

const STORAGE_KEYS = {
    LOCALE: 'app-locale',
    THEME_COLOR: 'app-theme-color',
    DARK_MODE: 'app-dark-mode',
} as const;

function getSystemDarkMode(): boolean {
    if (typeof window === 'undefined') {
        return false;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function getSavedLocale(): SupportedLocale {
    const saved = localStorage.getItem(STORAGE_KEYS.LOCALE);
    if (saved === 'zh-CN' || saved === 'en-US') {
        return saved;
    }
    return navigator.language.startsWith('zh') ? 'zh-CN' : 'en-US';
}

function getSavedThemeColor(): ThemeColor {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME_COLOR);
    if (saved && Object.keys(themes).includes(saved)) {
        return saved as ThemeColor;
    }
    return 'blue';
}

function getSavedDarkMode(): DarkMode {
    const saved = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
    if (saved === 'system' || saved === 'light' || saved === 'dark') {
        return saved;
    }
    return 'system';
}

export const useAppConfigStore = defineStore('appConfig', () => {
    // State
    const locale = ref<SupportedLocale>(getSavedLocale());
    const themeColor = ref<ThemeColor>(getSavedThemeColor());
    const darkMode = ref<DarkMode>(getSavedDarkMode());
    const systemDark = ref(getSystemDarkMode());

    // Computed
    const isDark = computed(() => {
        if (darkMode.value === 'system') {
            return systemDark.value;
        }
        return darkMode.value === 'dark';
    });

    const currentTheme = computed((): Theme => {
        return getTheme(themeColor.value);
    });

    // Legacy computed for backwards compatibility
    const currentThemeColors = computed(() => {
        return themeColors[themeColor.value];
    });

    const primaryColor = computed(() => {
        return isDark.value ? currentThemeColors.value.dark : currentThemeColors.value.light;
    });

    // Status bar helper
    const statusBar = useStatusBar();

    // Actions
    function setLocale(newLocale: SupportedLocale) {
        locale.value = newLocale;
        localStorage.setItem(STORAGE_KEYS.LOCALE, newLocale);
    }

    function setThemeColor(color: ThemeColor) {
        themeColor.value = color;
        localStorage.setItem(STORAGE_KEYS.THEME_COLOR, color);
        applyTheme();
    }

    function setDarkMode(mode: DarkMode) {
        darkMode.value = mode;
        localStorage.setItem(STORAGE_KEYS.DARK_MODE, mode);
        applyTheme();
    }

    function updateDocumentClass() {
        if (isDark.value) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }

    function applyTheme() {
        const theme = currentTheme.value;
        const dark = isDark.value;

        // Update document class for dark/light mode
        updateDocumentClass();

        // Apply CSS variables
        applyThemeCSSVariables(theme, dark);

        // Update status bar - use the app's background color since status bar is transparent
        const modeColors = dark ? theme.dark : theme.light;
        statusBar.updateForTheme(dark, modeColors.surfaces.background);
    }

    function initTheme() {
        // Listen for system dark mode changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
            systemDark.value = e.matches;
            if (darkMode.value === 'system') {
                applyTheme();
            }
        });

        // Apply theme on initialization
        applyTheme();
    }

    // Watch for changes
    watch(isDark, applyTheme);
    watch(themeColor, applyTheme);

    return {
        // State
        locale,
        themeColor,
        darkMode,
        systemDark,

        // Computed
        isDark,
        currentTheme,
        currentThemeColors,
        primaryColor,

        // Actions
        setLocale,
        setThemeColor,
        setDarkMode,
        initTheme,
        applyTheme,
    };
});

/**
 * Composable for using i18n with the app config store
 */
export function useAppLocale() {
    const store = useAppConfigStore();
    const { locale: i18nLocale } = useI18n();

    function setLocale(newLocale: SupportedLocale) {
        store.setLocale(newLocale);
        i18nLocale.value = newLocale;
    }

    return {
        locale: computed(() => store.locale),
        setLocale,
    };
}
