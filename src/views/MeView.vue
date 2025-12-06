<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useAppConfigStore } from '@/stores/appConfig';
import { computed, ref } from 'vue';

const { t } = useI18n();
const router = useRouter();
const appConfig = useAppConfigStore();

const primaryColor = computed(() => appConfig.primaryColor);
const isDark = computed(() => appConfig.isDark);

// Scroll tracking for app bar visibility
const scrollY = ref(0);
const showAppBar = computed(() => scrollY.value > 100);

function handleScroll(event: Event) {
    const target = event.target as HTMLElement;
    scrollY.value = target.scrollTop;
}

// Check if dev tools should be visible (only in development or debug mode)
const showDevTools = computed(() => {
    return import.meta.env.DEV || import.meta.env.VITE_DEBUG === 'true';
});

interface MenuItem {
    key: string;
    icon: string;
    titleKey: string;
    subtitleKey: string;
    route: string;
    show?: boolean;
}

interface MenuGroup {
    key: string;
    titleKey: string;
    items: MenuItem[];
}

const menuGroups = computed<MenuGroup[]>(() => [
    {
        key: 'accounting',
        titleKey: 'me.groups.accounting',
        items: [
            {
                key: 'books',
                icon: 'mdi-book-multiple',
                titleKey: 'me.books.title',
                subtitleKey: 'me.books.subtitle',
                route: '/me/books',
            },
            {
                key: 'categories',
                icon: 'mdi-shape',
                titleKey: 'me.categories.title',
                subtitleKey: 'me.categories.subtitle',
                route: '/me/categories',
            },
            {
                key: 'expense-config',
                icon: 'mdi-cog',
                titleKey: 'me.expenseConfig.title',
                subtitleKey: 'me.expenseConfig.subtitle',
                route: '/me/expense-config',
            },
            {
                key: 'tags',
                icon: 'mdi-tag-multiple',
                titleKey: 'me.tags.title',
                subtitleKey: 'me.tags.subtitle',
                route: '/me/tags',
            },
        ],
    },
    {
        key: 'advanced',
        titleKey: 'me.groups.advanced',
        items: [
            {
                key: 'recycle-bin',
                icon: 'mdi-delete',
                titleKey: 'me.recycleBin.title',
                subtitleKey: 'me.recycleBin.subtitle',
                route: '/me/recycle-bin',
            },
            {
                key: 'cloud-sync',
                icon: 'mdi-cloud-sync',
                titleKey: 'me.cloudSync.title',
                subtitleKey: 'me.cloudSync.subtitle',
                route: '/me/cloud-sync',
            },
            ...(showDevTools.value
                ? [
                      {
                          key: 'dev-tools',
                          icon: 'mdi-code-tags',
                          titleKey: 'me.devTools.title',
                          subtitleKey: 'me.devTools.subtitle',
                          route: '/me/dev-tools',
                      },
                  ]
                : []),
        ],
    },
    {
        key: 'other',
        titleKey: 'me.groups.other',
        items: [
            {
                key: 'license',
                icon: 'mdi-license',
                titleKey: 'me.license.title',
                subtitleKey: 'me.license.subtitle',
                route: '/me/license',
            },
            {
                key: 'about',
                icon: 'mdi-information',
                titleKey: 'me.about.title',
                subtitleKey: 'me.about.subtitle',
                route: '/me/about',
            },
        ],
    },
]);

function navigateTo(route: string) {
    router.push(route);
}

function goToMessages() {
    router.push('/me/messages');
}

function goToSettings() {
    router.push('/me/settings');
}
</script>

<template>
    <div
        class="me-view"
        @scroll="handleScroll"
    >
        <!-- Scroll-aware App Bar -->
        <Transition name="app-bar-slide">
            <v-app-bar
                v-if="showAppBar"
                :color="primaryColor"
                class="scroll-app-bar"
            >
                <v-app-bar-title>{{ t('me.personalCenter') }}</v-app-bar-title>
                <template #append>
                    <v-btn
                        icon="mdi-bell-outline"
                        @click="goToMessages"
                    />
                    <v-btn
                        icon="mdi-cog-outline"
                        @click="goToSettings"
                    />
                </template>
            </v-app-bar>
        </Transition>

        <!-- Header with curved bottom -->
        <div
            class="header-section"
            :style="{ backgroundColor: primaryColor }"
        >
            <!-- Top right action buttons -->
            <div class="header-actions">
                <v-btn
                    icon="mdi-bell-outline"
                    variant="text"
                    color="white"
                    size="small"
                    @click="goToMessages"
                />
                <v-btn
                    icon="mdi-cog-outline"
                    variant="text"
                    color="white"
                    size="small"
                    @click="goToSettings"
                />
            </div>

            <div class="header-content">
                <v-avatar
                    size="72"
                    color="white"
                >
                    <v-icon
                        icon="mdi-account"
                        size="48"
                        :color="primaryColor"
                    />
                </v-avatar>
                <h2 class="header-title">{{ t('tabs.me') }}</h2>
            </div>

            <!-- Curved bottom with downward arc -->
            <div class="header-curve">
                <svg
                    viewBox="0 0 100 20"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M0,0 L0,5 Q50,25 100,5 L100,0 Z"
                        :fill="primaryColor"
                    />
                </svg>
            </div>
        </div>

        <!-- Menu content area with gray background for better contrast -->
        <div
            class="content-section"
            :class="{ 'content-section--light': !isDark }"
        >
            <v-list class="menu-list">
                <template
                    v-for="(group, groupIndex) in menuGroups"
                    :key="group.key"
                >
                    <v-list-subheader>{{ t(group.titleKey) }}</v-list-subheader>
                    <v-list-item
                        v-for="item in group.items"
                        :key="item.key"
                        :prepend-icon="item.icon"
                        :title="t(item.titleKey)"
                        :subtitle="t(item.subtitleKey)"
                        @click="navigateTo(item.route)"
                    >
                        <template #append>
                            <v-icon
                                icon="mdi-chevron-right"
                                size="small"
                            />
                        </template>
                    </v-list-item>
                    <v-divider
                        v-if="groupIndex < menuGroups.length - 1"
                        class="my-2"
                    />
                </template>
            </v-list>
        </div>
    </div>
</template>

<style scoped>
.me-view {
    height: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    background-color: var(--theme-background);
}

.scroll-app-bar {
    position: fixed !important;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
}

.header-section {
    position: relative;
    padding-top: calc(env(safe-area-inset-top, 0px) + 24px);
    padding-bottom: 0;
}

.header-actions {
    position: absolute;
    top: calc(env(safe-area-inset-top, 0px) + 8px);
    right: 8px;
    display: flex;
    gap: 4px;
}

.header-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px 16px 32px;
    color: white;
}

.header-title {
    margin-top: 12px;
    font-size: 1.5rem;
    font-weight: 500;
    color: white;
}

.header-curve {
    position: relative;
    width: 100%;
    height: 24px;
    margin-top: -1px;
}

.header-curve svg {
    display: block;
    width: 100%;
    height: 100%;
}

.content-section {
    padding: 0 16px 24px;
    margin-top: -8px;
}

.content-section--light {
    background-color: var(--theme-surface-variant);
}

.menu-list {
    background-color: var(--theme-card);
    border-radius: 12px;
    overflow: hidden;
}

/* App bar slide transition */
.app-bar-slide-enter-active,
.app-bar-slide-leave-active {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.app-bar-slide-enter-from,
.app-bar-slide-leave-to {
    transform: translateY(-100%);
}
</style>
