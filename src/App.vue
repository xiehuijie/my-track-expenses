<script setup lang="ts">
import { RouterView, useRoute, useRouter } from 'vue-router';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import MainLayout from '@/layouts/MainLayout.vue';
import { useAppConfigStore } from '@/stores/appConfig';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

const route = useRoute();
const router = useRouter();
const appConfig = useAppConfigStore();

// Pages that use the main layout with tab bar
const mainLayoutRoutes = ['/', '/statistics', '/assets', '/me'];

const useMainLayout = computed(() => {
    return mainLayoutRoutes.includes(route.path);
});

const isDark = computed(() => appConfig.isDark);

// Compute the Vuetify theme name based on current theme color and dark mode
const vuetifyTheme = computed(() => {
    const themeColor = appConfig.themeColor;
    const mode = isDark.value ? 'dark' : 'light';
    return `${themeColor}-${mode}`;
});

// Track navigation direction for slide transitions
const transitionName = ref('slide-right');

watch(
    () => route.path,
    (newPath, oldPath) => {
        // Determine if we're going deeper (forward) or back (backward)
        const isGoingToSubpage = !mainLayoutRoutes.includes(newPath) && mainLayoutRoutes.includes(oldPath);
        const isGoingBackToMain = mainLayoutRoutes.includes(newPath) && !mainLayoutRoutes.includes(oldPath);

        if (isGoingToSubpage) {
            // Entering subpage: slide in from right
            transitionName.value = 'slide-right';
        } else if (isGoingBackToMain) {
            // Going back to main: slide out to right
            transitionName.value = 'slide-left';
        } else if (!mainLayoutRoutes.includes(newPath) && !mainLayoutRoutes.includes(oldPath)) {
            // Navigating between subpages
            // Check depth by counting path segments
            const newDepth = newPath.split('/').filter(Boolean).length;
            const oldDepth = oldPath.split('/').filter(Boolean).length;
            transitionName.value = newDepth >= oldDepth ? 'slide-right' : 'slide-left';
        }
    }
);

// Back button handling
let backButtonListener: (() => Promise<void>) | null = null;

const handleBackButton = async () => {
    const currentPath = route.path;

    // If we're on a main tab, exit the app
    if (mainLayoutRoutes.includes(currentPath)) {
        await App.exitApp();
    } else {
        // Otherwise, go back in history
        router.back();
    }
};

onMounted(async () => {
    if (!Capacitor.isNativePlatform()) return;

    const listener = await App.addListener('backButton', async () => {
        await handleBackButton();
    });

    backButtonListener = listener.remove;
});

onUnmounted(async () => {
    if (backButtonListener) {
        await backButtonListener();
        backButtonListener = null;
    }
});
</script>

<template>
    <v-app :theme="vuetifyTheme">
        <MainLayout v-if="useMainLayout">
            <RouterView v-slot="{ Component }">
                <transition
                    name="fade-slide"
                    mode="out-in"
                >
                    <component
                        :is="Component"
                        :key="route.path"
                    />
                </transition>
            </RouterView>
        </MainLayout>
        <RouterView
            v-else
            v-slot="{ Component }"
        >
            <transition
                :name="transitionName"
                mode="out-in"
            >
                <component
                    :is="Component"
                    :key="route.path"
                />
            </transition>
        </RouterView>
    </v-app>
</template>

<style>
/* Ensure v-app fills the container */
.v-application {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    height: 100%;
}

.v-application__wrap {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 100%;
}

/* Fade slide transition for tab switching */
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition:
        opacity 0.2s ease,
        transform 0.2s ease;
}

.fade-slide-enter-from {
    opacity: 0;
    transform: translateX(10px);
}

.fade-slide-leave-to {
    opacity: 0;
    transform: translateX(-10px);
}

/* Slide right transition - entering subpage (slide in from right) */
.slide-right-enter-active,
.slide-right-leave-active {
    transition:
        opacity 0.3s ease,
        transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-right-enter-from {
    opacity: 0;
    transform: translateX(100%);
}

.slide-right-leave-to {
    opacity: 0;
    transform: translateX(-30%);
}

/* Slide left transition - going back (slide out to right) */
.slide-left-enter-active,
.slide-left-leave-active {
    transition:
        opacity 0.3s ease,
        transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-left-enter-from {
    opacity: 0;
    transform: translateX(-30%);
}

.slide-left-leave-to {
    opacity: 0;
    transform: translateX(100%);
}
</style>
