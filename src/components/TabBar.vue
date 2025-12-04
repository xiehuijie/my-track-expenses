<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { useAppConfigStore } from '@/stores/appConfig'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const appConfig = useAppConfigStore()

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

const leftTabs = computed(() => tabs.slice(0, 2))
const rightTabs = computed(() => tabs.slice(2))

const currentTab = computed(() => {
  return tabs.find(tab => tab.path === route.path)?.key || 'details'
})

function navigateTo(path: string) {
  router.push(path)
}

function goToAddExpense() {
  router.push('/add')
}

const primaryColor = computed(() => appConfig.primaryColor)
const isDark = computed(() => appConfig.isDark)
</script>

<template>
  <div 
    class="tab-bar-container"
    :class="{ 'dark': isDark }"
  >
    <!-- Arc background for add button -->
    <div class="arc-background" />
    
    <!-- Add button in center -->
    <button
      class="add-button"
      :style="{ backgroundColor: primaryColor }"
      @click="goToAddExpense"
    >
      <v-icon 
        icon="mdi-plus" 
        size="28"
        :color="isDark ? '#1e1e1e' : '#ffffff'"
      />
    </button>
    
    <!-- Tab bar -->
    <div class="tab-bar">
      <!-- Left tabs -->
      <div class="tab-group left-tabs">
        <button
          v-for="tab in leftTabs"
          :key="tab.key"
          class="tab-item"
          :class="{ 'active': currentTab === tab.key }"
          @click="navigateTo(tab.path)"
        >
          <v-icon 
            :icon="tab.icon" 
            :color="currentTab === tab.key ? primaryColor : (isDark ? '#9e9e9e' : '#757575')"
            size="24"
          />
          <span 
            class="tab-label"
            :style="{ color: currentTab === tab.key ? primaryColor : (isDark ? '#9e9e9e' : '#757575') }"
          >
            {{ t(tab.labelKey) }}
          </span>
        </button>
      </div>

      <!-- Spacer for add button -->
      <div class="add-button-spacer" />

      <!-- Right tabs -->
      <div class="tab-group right-tabs">
        <button
          v-for="tab in rightTabs"
          :key="tab.key"
          class="tab-item"
          :class="{ 'active': currentTab === tab.key }"
          @click="navigateTo(tab.path)"
        >
          <v-icon 
            :icon="tab.icon" 
            :color="currentTab === tab.key ? primaryColor : (isDark ? '#9e9e9e' : '#757575')"
            size="24"
          />
          <span 
            class="tab-label"
            :style="{ color: currentTab === tab.key ? primaryColor : (isDark ? '#9e9e9e' : '#757575') }"
          >
            {{ t(tab.labelKey) }}
          </span>
        </button>
      </div>
    </div>

    <!-- Bottom safe area -->
    <div class="bottom-safe-area" />
  </div>
</template>

<style scoped>
.tab-bar-container {
  position: relative;
  width: 100%;
  background-color: #ffffff;
}

.tab-bar-container.dark {
  background-color: #1e1e1e;
}

.arc-background {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 76px;
  height: 38px;
  background-color: inherit;
  border-radius: 50px 50px 0 0;
  z-index: 1;
}

.add-button {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.add-button:active {
  transform: translate(-50%, -50%) scale(0.95);
}

.tab-bar {
  display: flex;
  align-items: center;
  height: 56px;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}

.tab-bar-container.dark .tab-bar {
  border-top-color: rgba(255, 255, 255, 0.12);
}

.tab-group {
  display: flex;
  flex: 1;
}

.left-tabs {
  justify-content: flex-end;
  padding-right: 16px;
}

.right-tabs {
  justify-content: flex-start;
  padding-left: 16px;
}

.add-button-spacer {
  width: 76px;
  flex-shrink: 0;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4px 16px;
  background: none;
  border: none;
  cursor: pointer;
  min-width: 64px;
}

.tab-label {
  font-size: 12px;
  margin-top: 2px;
  font-weight: 500;
}

.bottom-safe-area {
  height: env(safe-area-inset-bottom, 0px);
  background-color: inherit;
}
</style>
