<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfigStore } from '@/stores/appConfig'
import TabBar from '@/components/TabBar.vue'

const appConfig = useAppConfigStore()
const isDark = computed(() => appConfig.isDark)
</script>

<template>
  <div 
    class="main-layout"
    :class="{ 'dark': isDark }"
  >
    <!-- Status bar area -->
    <div class="status-bar" />
    
    <!-- Main content area -->
    <div class="content-area">
      <slot />
    </div>
    
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
  background-color: #f5f5f5;
}

.main-layout.dark {
  background-color: #121212;
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
</style>
