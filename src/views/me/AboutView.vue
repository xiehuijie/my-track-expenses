<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import SubPageLayout from '@/layouts/SubPageLayout.vue';

const { t } = useI18n();

// Get app version and build time from import.meta.env
const appVersion = import.meta.env.VITE_APP_VERSION || '1.0.0';
const buildTime = import.meta.env.VITE_BUILD_TIME || new Date().toISOString();
</script>

<template>
    <SubPageLayout :title="t('me.about.title')">
        <v-container class="py-4">
            <v-card class="text-center">
                <v-card-text class="py-8">
                    <v-icon icon="mdi-wallet" size="80" color="primary" class="mb-4" />
                    <h2 class="text-h5 mb-2">{{ t('app.name') }}</h2>
                    <p class="text-body-2 text-medium-emphasis mb-4">{{ t('me.about.version') }}: {{ appVersion }}</p>
                    <p class="text-body-2 text-medium-emphasis">{{ t('me.about.buildTime') }}: {{ buildTime }}</p>
                </v-card-text>
            </v-card>
        </v-container>
    </SubPageLayout>
</template>
