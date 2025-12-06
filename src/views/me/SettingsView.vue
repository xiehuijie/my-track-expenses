<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useAppConfigStore, themeColors, type ThemeColor, type DarkMode } from '@/stores/appConfig';
import { localeNames, supportedLocales, type SupportedLocale } from '@/i18n';
import { computed } from 'vue';

const { t, locale } = useI18n();
const router = useRouter();
const appConfig = useAppConfigStore();

const primaryColor = computed(() => appConfig.primaryColor);

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

function goBack() {
    router.back();
}
</script>

<template>
    <div class="page-container">
        <div class="status-bar-area" :style="{ backgroundColor: primaryColor }" />
        <v-app-bar :color="primaryColor">
            <v-btn icon="mdi-arrow-left" @click="goBack" />
            <v-app-bar-title>{{ t('settings.title') }}</v-app-bar-title>
        </v-app-bar>
        <v-main>
            <v-container class="py-4">
                <v-list>
                    <!-- Language Setting -->
                    <v-list-item>
                        <template #prepend>
                            <v-icon icon="mdi-translate" />
                        </template>
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
                        <template #prepend>
                            <v-icon icon="mdi-palette" />
                        </template>
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
                        <template #prepend>
                            <v-icon icon="mdi-brightness-6" />
                        </template>
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
            </v-container>
        </v-main>
    </div>
</template>

<style scoped>
.page-container {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.status-bar-area {
    height: env(safe-area-inset-top, 0px);
    min-height: env(safe-area-inset-top, 0px);
    width: 100%;
}
</style>
