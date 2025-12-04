<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import { useAppConfigStore } from '@/stores/appConfig'

const route = useRoute()
const appConfig = useAppConfigStore()

// Pages that use the main layout with tab bar
const mainLayoutRoutes = ['/', '/statistics', '/assets', '/me']

const useMainLayout = computed(() => {
  return mainLayoutRoutes.includes(route.path)
})

const isDark = computed(() => appConfig.isDark)
</script>

<template>
  <v-app :theme="isDark ? 'dark' : 'light'">
    <MainLayout v-if="useMainLayout">
      <RouterView />
    </MainLayout>
    <RouterView v-else />
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
</style>
