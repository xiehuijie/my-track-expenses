<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { computed, watch, ref } from 'vue'
import { useAppConfigStore } from '@/stores/appConfig'
import { useHaptics } from '@/composables/useHaptics'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const appConfig = useAppConfigStore()
const { lightImpact } = useHaptics()

interface TabItem {
  key: string
  path: string
  icon: string
  labelKey: string
}

const tabs: TabItem[] = [
  { key: 'details', path: '/', icon: 'mdi-format-list-bulleted', labelKey: 'tabs.details' },
  { key: 'statistics', path: '/statistics', icon: 'mdi-chart-pie', labelKey: 'tabs.statistics' },
  { key: 'assets', path: '/assets', icon: 'mdi-wallet', labelKey: 'tabs.assets' },
  { key: 'me', path: '/me', icon: 'mdi-account', labelKey: 'tabs.me' }
]

// Map route path to tab index for v-bottom-navigation
const pathToIndex: Record<string, number> = {
  '/': 0,
  '/statistics': 1,
  '/assets': 2,
  '/me': 3
}

const currentTabIndex = computed(() => {
  return pathToIndex[route.path] ?? 0
})

// Local state for v-model binding
const selectedTab = ref(currentTabIndex.value)

// Sync selectedTab when route changes externally
watch(currentTabIndex, (newIndex) => {
  selectedTab.value = newIndex
})

function onTabChange(index: number) {
  const tab = tabs[index]
  if (tab && tab.path !== route.path) {
    lightImpact()
    router.push(tab.path)
  }
}

const primaryColor = computed(() => appConfig.primaryColor)
</script>

<template>
  <v-bottom-navigation
    v-model="selectedTab"
    mode="shift"
    grow
    mandatory
    :color="primaryColor"
    @update:model-value="onTabChange"
  >
    <v-btn
      v-for="tab in tabs"
      :key="tab.key"
      :value="pathToIndex[tab.path]"
    >
      <v-icon :icon="tab.icon" />
      <span>{{ t(tab.labelKey) }}</span>
    </v-btn>
  </v-bottom-navigation>
</template>

<style scoped>
/* Add bottom safe area padding */
:deep(.v-bottom-navigation) {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
</style>
