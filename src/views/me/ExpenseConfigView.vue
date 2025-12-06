<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useAppConfigStore } from '@/stores/appConfig';
import { computed } from 'vue';

const { t } = useI18n();
const router = useRouter();
const appConfig = useAppConfigStore();

const primaryColor = computed(() => appConfig.primaryColor);

function goBack() {
    router.back();
}
</script>

<template>
    <div class="page-container">
        <div class="status-bar-area" :style="{ backgroundColor: primaryColor }" />
        <v-app-bar :color="primaryColor">
            <v-btn icon="mdi-arrow-left" @click="goBack" />
            <v-app-bar-title>{{ t('me.expenseConfig.title') }}</v-app-bar-title>
        </v-app-bar>
        <v-main>
            <v-container class="py-4">
                <v-card>
                    <v-card-text class="text-center py-8">
                        <v-icon icon="mdi-cog" size="64" color="primary" class="mb-4" />
                        <p class="text-h6">{{ t('common.comingSoon') }}</p>
                    </v-card-text>
                </v-card>
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
