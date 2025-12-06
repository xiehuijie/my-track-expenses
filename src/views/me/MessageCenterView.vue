<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ref, onMounted } from 'vue';
import SubPageLayout from '@/layouts/SubPageLayout.vue';

const { t } = useI18n();

// Mock message data
interface Message {
    id: number;
    title: string;
    content: string;
    time: string;
    read: boolean;
    type: 'system' | 'reminder' | 'promotion';
}

// Configuration constants
const PAGE_SIZE = 20;
const MAX_MESSAGES = 100;
// Distance in pixels from the bottom of the scroll container before triggering the next page load
const SCROLL_LOAD_THRESHOLD = 100;

const messages = ref<Message[]>([]);
const loading = ref(false);
const hasMore = ref(true);
const page = ref(1);

// Generate mock messages
function generateMockMessages(pageNum: number): Message[] {
    const types: ('system' | 'reminder' | 'promotion')[] = ['system', 'reminder', 'promotion'];
    const mockMessages: Message[] = [];

    for (let i = 0; i < PAGE_SIZE; i++) {
        const id = (pageNum - 1) * PAGE_SIZE + i + 1;
        const type = types[id % 3];
        const daysAgo = Math.floor(id / 3);
        // Use explicit date calculation to avoid potential issues with date mutation
        const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

        let title = '';
        let content = '';

        switch (type) {
            case 'system':
                title = t('messages.mock.systemTitle', { version: `1.${id % 10}.0` });
                content = t('messages.mock.systemContent');
                break;
            case 'reminder':
                title = t('messages.mock.reminderTitle');
                content = t('messages.mock.reminderContent', { days: (id % 7) + 1 });
                break;
            case 'promotion':
                title = t('messages.mock.promotionTitle');
                content = t('messages.mock.promotionContent');
                break;
        }

        mockMessages.push({
            id,
            title,
            content,
            time: formatTime(date),
            read: id % 4 !== 0,
            type,
        });
    }

    return mockMessages;
}

function formatTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
        return t('messages.time.today');
    } else if (days === 1) {
        return t('messages.time.yesterday');
    } else if (days < 7) {
        return t('messages.time.daysAgo', { days });
    } else {
        return date.toLocaleDateString();
    }
}

function getMessageIcon(type: string): string {
    switch (type) {
        case 'system':
            return 'mdi-information-outline';
        case 'reminder':
            return 'mdi-bell-outline';
        case 'promotion':
            return 'mdi-gift-outline';
        default:
            return 'mdi-email-outline';
    }
}

function getMessageColor(type: string): string {
    switch (type) {
        case 'system':
            return 'primary';
        case 'reminder':
            return 'warning';
        case 'promotion':
            return 'success';
        default:
            return 'grey';
    }
}

async function loadMore() {
    if (loading.value || !hasMore.value) return;

    loading.value = true;

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newMessages = generateMockMessages(page.value);

    messages.value.push(...newMessages);
    page.value++;
    loading.value = false;

    // Limit messages for demo
    if (messages.value.length >= MAX_MESSAGES) {
        hasMore.value = false;
    }
}

function markAsRead(message: Message) {
    message.read = true;
}

// Throttle scroll handler to improve performance on lower-end devices
let scrollThrottleTimer: ReturnType<typeof setTimeout> | null = null;
const SCROLL_THROTTLE_MS = 100;

function handleScroll(event: Event) {
    if (scrollThrottleTimer) return;

    scrollThrottleTimer = setTimeout(() => {
        scrollThrottleTimer = null;
        const target = event.target as HTMLElement;
        const scrollHeight = target.scrollHeight;
        const scrollTop = target.scrollTop;
        const clientHeight = target.clientHeight;

        // Load more when scrolled near bottom
        if (scrollHeight - scrollTop - clientHeight < SCROLL_LOAD_THRESHOLD) {
            loadMore();
        }
    }, SCROLL_THROTTLE_MS);
}

onMounted(() => {
    loadMore();
});
</script>

<template>
    <SubPageLayout :title="t('messages.title')">
        <div class="message-center" @scroll="handleScroll">
            <!-- Empty state -->
            <div v-if="messages.length === 0 && !loading" class="empty-state">
                <v-icon icon="mdi-email-outline" size="64" color="grey" />
                <p class="text-grey mt-4">{{ t('messages.empty') }}</p>
            </div>

            <!-- Message list -->
            <v-list v-else class="message-list">
                <v-list-item
                    v-for="message in messages"
                    :key="message.id"
                    :class="{ 'message-unread': !message.read }"
                    role="button"
                    tabindex="0"
                    :aria-label="`${message.title}${!message.read ? ' - ' + t('messages.unread') : ''}`"
                    @click="markAsRead(message)"
                    @keydown.enter="markAsRead(message)"
                    @keydown.space.prevent="markAsRead(message)"
                >
                    <template #prepend>
                        <v-avatar :color="getMessageColor(message.type)" size="40">
                            <v-icon :icon="getMessageIcon(message.type)" color="white" size="20" />
                        </v-avatar>
                    </template>

                    <v-list-item-title :class="{ 'font-weight-bold': !message.read }">
                        {{ message.title }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="message-content">
                        {{ message.content }}
                    </v-list-item-subtitle>

                    <template #append>
                        <div class="message-meta">
                            <span class="message-time">{{ message.time }}</span>
                            <v-badge v-if="!message.read" dot color="error" inline />
                        </div>
                    </template>
                </v-list-item>
            </v-list>

            <!-- Loading indicator -->
            <div v-if="loading" class="loading-indicator">
                <v-progress-circular indeterminate color="primary" size="32" />
            </div>

            <!-- No more messages -->
            <div v-if="!hasMore && messages.length > 0" class="no-more">
                <span class="text-grey">{{ t('messages.noMore') }}</span>
            </div>
        </div>
    </SubPageLayout>
</template>

<style scoped>
.message-center {
    height: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 48px;
}

.message-list {
    background: transparent;
}

.message-unread {
    background-color: var(--theme-primary-lighten-5);
}

.message-content {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.message-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
}

.message-time {
    font-size: 12px;
    color: var(--theme-text-secondary);
}

.loading-indicator {
    display: flex;
    justify-content: center;
    padding: 16px;
}

.no-more {
    display: flex;
    justify-content: center;
    padding: 16px;
    font-size: 14px;
}
</style>
