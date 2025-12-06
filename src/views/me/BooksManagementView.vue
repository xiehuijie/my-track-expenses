<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import SubPageLayout from '@/layouts/SubPageLayout.vue';

const { t } = useI18n();
</script>

<template>
    <SubPageLayout :title="t('me.books.title')">
        <v-container class="py-4">
            <v-card>
                <v-card-text class="text-center py-8">
                    <v-icon icon="mdi-book-multiple" size="64" color="primary" class="mb-4" />
                    <p class="text-h6">{{ t('common.comingSoon') }}</p>
                </v-card-text>
            </v-card>
        </v-container>
    </SubPageLayout>
</template>
