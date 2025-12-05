<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useAppConfigStore, themeColors, type ThemeColor, type DarkMode } from '@/stores/appConfig';
import { localeNames, supportedLocales, type SupportedLocale } from '@/i18n';
import { computed } from 'vue';

const { t, locale } = useI18n();
const appConfig = useAppConfigStore();

const themeColorOptions = computed(() => {
    return Object.keys(themeColors).map((color) => ({
        value: color as ThemeColor,
        title: t(`colors.${color}`),
    }));
});

const darkModeOptions = computed(() => [
    { value: 'system' as DarkMode, title: t('settings.followSystem') },
    { value: 'light' as DarkMode, title: t('settings.light') },
    { value: 'dark' as DarkMode, title: t('settings.dark') },
]);

const localeOptions = computed(() => {
    return supportedLocales.map((l) => ({
        value: l,
        title: localeNames[l],
    }));
});

function handleThemeColorChange(color: ThemeColor) {
    appConfig.setThemeColor(color);
}

function handleDarkModeChange(mode: DarkMode) {
    appConfig.setDarkMode(mode);
}

function handleLocaleChange(newLocale: SupportedLocale) {
    appConfig.setLocale(newLocale);
    locale.value = newLocale;
}
</script>

<template>
    <div class="me-view">
        <v-container class="py-4">
            <v-card elevation="2">
                <v-card-title class="text-h5">
                    <v-icon icon="mdi-account" class="mr-2" color="primary" />
                    {{ t('tabs.me') }}
                </v-card-title>
                <v-card-text>
                    <!-- Settings Section -->
                    <v-list>
                        <v-list-subheader>{{ t('settings.title') }}</v-list-subheader>

                        <!-- Language Setting -->
                        <v-list-item>
                            <v-list-item-title>{{ t('settings.language') }}</v-list-item-title>
                            <template #append>
                                <v-select
                                    :model-value="appConfig.locale"
                                    :items="localeOptions"
                                    item-title="title"
                                    item-value="value"
                                    variant="outlined"
                                    density="compact"
                                    hide-details
                                    style="max-width: 150px"
                                    @update:model-value="handleLocaleChange"
                                />
                            </template>
                        </v-list-item>

                        <!-- Theme Color Setting -->
                        <v-list-item>
                            <v-list-item-title>{{ t('settings.themeColor') }}</v-list-item-title>
                            <template #append>
                                <v-btn-toggle :model-value="appConfig.themeColor" mandatory density="compact" @update:model-value="handleThemeColorChange">
                                    <v-btn v-for="option in themeColorOptions" :key="option.value" :value="option.value" size="small">
                                        <v-icon icon="mdi-circle" :color="themeColors[option.value].main" />
                                    </v-btn>
                                </v-btn-toggle>
                            </template>
                        </v-list-item>

                        <!-- Dark Mode Setting -->
                        <v-list-item>
                            <v-list-item-title>{{ t('settings.darkMode') }}</v-list-item-title>
                            <template #append>
                                <v-select
                                    :model-value="appConfig.darkMode"
                                    :items="darkModeOptions"
                                    item-title="title"
                                    item-value="value"
                                    variant="outlined"
                                    density="compact"
                                    hide-details
                                    style="max-width: 150px"
                                    @update:model-value="handleDarkModeChange"
                                />
                            </template>
                        </v-list-item>
                    </v-list>
                </v-card-text>
            </v-card>
        </v-container>
    </div>
</template>

<style scoped>
.me-view {
    height: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}
</style>
