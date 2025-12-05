/**
 * Theme type definitions
 */

export interface ThemeColorSet {
    base: string;
    lighten5: string;
    lighten4: string;
    lighten3: string;
    lighten2: string;
    lighten1: string;
    darken1: string;
    darken2: string;
    darken3: string;
    darken4: string;
    accent1: string;
    accent2: string;
    accent3: string;
    accent4: string;
}

export interface ThemePalette {
    primary: ThemeColorSet;
    secondary: ThemeColorSet;
    success: ThemeColorSet;
    warning: ThemeColorSet;
    error: ThemeColorSet;
    info: ThemeColorSet;
}

export interface ThemeSurfaceColors {
    background: string;
    surface: string;
    surfaceVariant: string;
    card: string;
    dialog: string;
    overlay: string;
}

export interface ThemeTextColors {
    primary: string;
    secondary: string;
    disabled: string;
    hint: string;
    onPrimary: string;
    onSecondary: string;
    onBackground: string;
    onSurface: string;
    onError: string;
}

export interface ThemeBorderColors {
    default: string;
    light: string;
    dark: string;
}

export interface ThemeModeColors {
    surfaces: ThemeSurfaceColors;
    text: ThemeTextColors;
    borders: ThemeBorderColors;
    statusBar: {
        background: string;
        style: 'light' | 'dark'; // light = white text, dark = black text
    };
}

export interface Theme {
    id: string;
    name: string;
    displayName: {
        en: string;
        zh: string;
    };
    palette: ThemePalette;
    light: ThemeModeColors;
    dark: ThemeModeColors;
}
