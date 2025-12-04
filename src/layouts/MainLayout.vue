<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppConfigStore } from '@/stores/appConfig'
import { useHaptics } from '@/composables/useHaptics'
import TabBar from '@/components/TabBar.vue'

const route = useRoute()
const router = useRouter()
const appConfig = useAppConfigStore()
const { mediumImpact } = useHaptics()

const primaryColor = computed(() => appConfig.primaryColor)

// Show FAB only on the Details tab (home page)
const showFab = computed(() => route.path === '/')

function goToAddExpense() {
  mediumImpact()
  router.push('/add')
}
</script>

<template>
  <div class="main-layout">
    <!-- Status bar area -->
    <div class="status-bar" />
    
    <!-- Main content area -->
    <div class="content-area">
      <slot />
    </div>
    
    <!-- FAB for adding expense - only visible on Details tab -->
    <v-fab
      icon="mdi-plus"
      :color="primaryColor"
      location="bottom end"
      size="large"
      app
      appear
      class="add-expense-fab"
      :class="{ 'fab-hidden': !showFab }"
      @click="goToAddExpense"
    />
    
    <!-- Tab bar -->
    <TabBar />
  </div>
</template>

<style scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: var(--theme-background);
}

.status-bar {
  height: env(safe-area-inset-top, 0px);
  min-height: env(safe-area-inset-top, 0px);
  width: 100%;
  background-color: transparent;
}

.content-area {
  flex: 1;
  overflow: hidden;
  position: relative;
}

/* FAB positioning and animations */
.add-expense-fab {
  position: fixed !important;
  bottom: calc(80px + env(safe-area-inset-bottom, 0px)) !important;
  right: 16px !important;
  z-index: 100;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
              opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fab-hidden {
  transform: scale(0) rotate(45deg) !important;
  opacity: 0 !important;
  pointer-events: none;
}
</style>
