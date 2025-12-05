<script setup lang="ts">
/**
 * NoStyleLayout - A minimal layout without any styling
 * Used for special cases or when other layouts don't fit
 */
</script>

<template>
  <div class="no-style-layout">
    <slot />
  </div>
</template>

<style scoped>
.no-style-layout {
  width: 100%;
  height: 100%;
}
</style>
