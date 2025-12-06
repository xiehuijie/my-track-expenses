<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAppConfigStore } from '@/stores/appConfig';

/**
 * Action item for the app bar
 */
export interface ActionItem {
    /** Unique key for the action */
    key: string;
    /** MDI icon name (e.g., 'mdi-plus') */
    icon: string;
    /** Displayed text (for overflow menu) */
    label: string;
    /** Click handler */
    onClick: () => void;
    /** Whether the action is disabled */
    disabled?: boolean;
}

interface Props {
    /** Page title displayed in the app bar */
    title: string;
    /** Whether to show the back button */
    showBack?: boolean;
    /** Action items for the app bar (max 2 visible, rest in overflow menu) */
    actions?: ActionItem[];
}

const props = withDefaults(defineProps<Props>(), {
    showBack: true,
    actions: () => [],
});

const router = useRouter();
const appConfig = useAppConfigStore();

const primaryColor = computed(() => appConfig.primaryColor);

// Maximum number of visible actions before overflow
const MAX_VISIBLE_ACTIONS = 2;

// Split actions into visible and overflow
const visibleActions = computed(() => {
    if (!props.actions || props.actions.length === 0) return [];
    if (props.actions.length <= MAX_VISIBLE_ACTIONS) return props.actions;
    // If more than MAX_VISIBLE_ACTIONS, show MAX_VISIBLE_ACTIONS - 1 visible + overflow menu
    return props.actions.slice(0, MAX_VISIBLE_ACTIONS - 1);
});

const overflowActions = computed(() => {
    if (!props.actions || props.actions.length <= MAX_VISIBLE_ACTIONS) return [];
    return props.actions.slice(MAX_VISIBLE_ACTIONS - 1);
});

const hasOverflow = computed(() => overflowActions.value.length > 0);

// Overflow menu state
const showOverflowMenu = ref(false);

function goBack() {
    router.back();
}

function handleActionClick(action: ActionItem) {
    if (!action.disabled) {
        action.onClick();
    }
}

function handleOverflowActionClick(action: ActionItem) {
    showOverflowMenu.value = false;
    if (!action.disabled) {
        action.onClick();
    }
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
                <!-- Visible action buttons -->
                <v-btn
                    v-for="action in visibleActions"
                    :key="action.key"
                    :icon="action.icon"
                    :disabled="action.disabled"
                    :aria-label="action.label"
                    @click="handleActionClick(action)"
                />
                <!-- Overflow menu -->
                <v-menu v-if="hasOverflow" v-model="showOverflowMenu" location="bottom end">
                    <template #activator="{ props: menuProps }">
                        <v-btn icon="mdi-dots-vertical" v-bind="menuProps" aria-label="More actions" />
                    </template>
                    <v-list>
                        <v-list-item
                            v-for="action in overflowActions"
                            :key="action.key"
                            :disabled="action.disabled"
                            @click="handleOverflowActionClick(action)"
                        >
                            <template #prepend>
                                <v-icon :icon="action.icon" />
                            </template>
                            <v-list-item-title>{{ action.label }}</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
                <!-- Slot for custom actions (backward compatibility) -->
                <slot name="actions" />
            </template>
        </v-app-bar>

        <!-- Main content area with smooth scrolling -->
        <v-main class="main-content">
            <div class="scroll-container">
                <slot />
            </div>
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
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.scroll-container {
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
