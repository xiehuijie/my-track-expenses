<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="statistics-view">
    <v-container class="py-4">
      <v-card elevation="2">
        <v-card-title class="text-h5">
          <v-icon
            icon="mdi-chart-pie"
            class="mr-2"
            color="primary"
          />
          {{ t('tabs.statistics') }}
        </v-card-title>
        <v-card-text>
          <v-alert
            type="info"
            variant="tonal"
          >
            统计功能即将上线
          </v-alert>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<style scoped>
.statistics-view {
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
</style>
