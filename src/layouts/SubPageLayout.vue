<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAppConfigStore } from '@/stores/appConfig';

interface Props {
    title: string;
    showBack?: boolean;
}

withDefaults(defineProps<Props>(), {
    showBack: true,
});

const router = useRouter();
const appConfig = useAppConfigStore();

const primaryColor = computed(() => appConfig.primaryColor);

function goBack() {
    router.back();
}
</script>

<template>
    <div class="sub-page-layout">
        <!-- Status bar area -->
        <div class="status-bar-area" :style="{ backgroundColor: primaryColor }" />

        <!-- App Bar -->
        <v-app-bar :color="primaryColor">
            <v-btn v-if="showBack" icon="mdi-arrow-left" @click="goBack" />
            <v-app-bar-title>{{ title }}</v-app-bar-title>
            <template #append>
                <slot name="actions" />
            </template>
        </v-app-bar>

        <!-- Main content area -->
        <v-main class="main-content">
            <slot />
        </v-main>

        <!-- Bottom safe area -->
        <div class="bottom-safe-area" />
    </div>
</template>

<style scoped>
.sub-page-layout {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background-color: var(--theme-background);
}

.status-bar-area {
    height: env(safe-area-inset-top, 0px);
    min-height: env(safe-area-inset-top, 0px);
    width: 100%;
}

.main-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
}

.bottom-safe-area {
    height: env(safe-area-inset-bottom, 0px);
    min-height: env(safe-area-inset-bottom, 0px);
    width: 100%;
    background-color: var(--theme-background);
}
</style>
