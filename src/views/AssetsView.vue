<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="assets-view">
    <v-container class="py-4">
      <v-card elevation="2">
        <v-card-title class="text-h5">
          <v-icon
            icon="mdi-wallet"
            class="mr-2"
            color="primary"
          />
          {{ t('tabs.assets') }}
        </v-card-title>
        <v-card-text>
          <v-alert
            type="info"
            variant="tonal"
          >
            {{ t('common.comingSoon') }}
          </v-alert>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<style scoped>
.assets-view {
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
</style>
