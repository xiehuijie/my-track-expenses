<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const router = useRouter();

function goBack() {
  router.back();
}
</script>

<template>
  <div class="page-container">
    <v-app-bar>
      <v-btn
        icon="mdi-arrow-left"
        @click="goBack"
      />
      <v-app-bar-title>{{ t('me.tags.title') }}</v-app-bar-title>
    </v-app-bar>
    <v-main>
      <v-container class="py-4">
        <v-card>
          <v-card-text class="text-center py-8">
            <v-icon
              icon="mdi-tag-multiple"
              size="64"
              color="primary"
              class="mb-4"
            />
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
</style>
