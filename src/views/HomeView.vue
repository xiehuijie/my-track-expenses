<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useExpenseStore } from '@/stores/expense'
import { useI18n } from 'vue-i18n'
import { computed, onMounted } from 'vue'

const router = useRouter()
const expenseStore = useExpenseStore()
const { t } = useI18n()

const formattedTotal = computed(() => {
  return expenseStore.totalExpenses.toFixed(2)
})

const recentExpenses = computed(() => {
  return expenseStore.expenses.slice(-5).reverse()
})

// Load expenses from database when component is mounted
onMounted(async () => {
  await expenseStore.loadExpenses()
})
</script>

<template>
  <div class="home-view">
    <v-container class="py-4">
      <!-- Total Expenses Card -->
      <v-card
        color="primary"
        variant="elevated"
        class="mb-4"
      >
        <v-card-text class="text-center py-6">
          <div class="text-overline text-white opacity-80">
            {{ t('home.totalExpenses') }}
          </div>
          <div class="text-h3 font-weight-bold text-white">
            ¥{{ formattedTotal }}
          </div>
        </v-card-text>
      </v-card>

      <!-- Recent Expenses Section -->
      <v-card elevation="2">
        <v-card-title class="d-flex align-center">
          <v-icon
            icon="mdi-history"
            class="mr-2"
            color="primary"
          />
          {{ t('home.recentExpenses') }}
        </v-card-title>
        <v-card-text class="pa-0">
          <v-list
            v-if="recentExpenses.length > 0"
            lines="two"
          >
            <v-list-item
              v-for="expense in recentExpenses"
              :key="expense.id"
              :title="expense.description"
              :subtitle="`${expense.category} - ${expense.date}`"
            >
              <template #prepend>
                <v-avatar
                  color="primary"
                  variant="tonal"
                  size="40"
                >
                  <v-icon
                    icon="mdi-cash"
                    size="20"
                  />
                </v-avatar>
              </template>
              <template #append>
                <span class="text-h6 text-error">¥{{ expense.amount.toFixed(2) }}</span>
              </template>
            </v-list-item>
          </v-list>

          <v-alert
            v-else
            type="info"
            variant="tonal"
            class="ma-4"
          >
            {{ t('home.noExpenses') }}
          </v-alert>
        </v-card-text>
        
        <v-card-actions
          v-if="recentExpenses.length > 0"
          class="pa-4"
        >
          <v-btn
            color="primary"
            variant="text"
            block
            @click="router.push('/history')"
          >
            {{ t('home.viewHistory') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </div>
</template>

<style scoped>
.home-view {
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
</style>
