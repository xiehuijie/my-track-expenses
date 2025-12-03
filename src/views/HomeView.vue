<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useExpenseStore } from '@/stores/expense'
import { computed } from 'vue'

const router = useRouter()
const expenseStore = useExpenseStore()

const formattedTotal = computed(() => {
  return expenseStore.totalExpenses.toFixed(2)
})

const recentExpenses = computed(() => {
  return expenseStore.expenses.slice(-3).reverse()
})
</script>

<template>
  <v-container class="fill-height">
    <v-row
      justify="center"
      align="center"
    >
      <v-col
        cols="12"
        md="8"
        lg="6"
      >
        <v-card
          class="mb-6"
          elevation="4"
        >
          <v-card-title class="text-h4 text-center py-6">
            <v-icon
              icon="mdi-wallet"
              size="40"
              class="mr-3"
              color="primary"
            />
            My Track Expenses
          </v-card-title>
          <v-card-subtitle class="text-center text-body-1 pb-4">
            Your personal expense tracking app
          </v-card-subtitle>
          <v-divider />
          <v-card-text class="pa-6">
            <v-row
              justify="center"
              class="mb-4"
            >
              <v-col cols="12">
                <v-card
                  color="primary"
                  variant="tonal"
                >
                  <v-card-text class="text-center">
                    <div class="text-overline mb-1">
                      Total Expenses
                    </div>
                    <div class="text-h4 font-weight-bold">
                      ${{ formattedTotal }}
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <v-list
              v-if="recentExpenses.length > 0"
              lines="two"
              class="mb-4"
            >
              <v-list-subheader>Recent Expenses</v-list-subheader>
              <v-list-item
                v-for="expense in recentExpenses"
                :key="expense.id"
                :title="expense.description"
                :subtitle="`${expense.category} - ${expense.date}`"
              >
                <template #append>
                  <span class="text-h6 text-error">${{ expense.amount.toFixed(2) }}</span>
                </template>
              </v-list-item>
            </v-list>

            <v-alert
              v-else
              type="info"
              variant="tonal"
              class="mb-4"
            >
              No expenses recorded yet. Start tracking your spending!
            </v-alert>
          </v-card-text>

          <v-card-actions class="pa-4">
            <v-row>
              <v-col cols="6">
                <v-btn
                  color="primary"
                  variant="elevated"
                  block
                  size="large"
                  prepend-icon="mdi-plus"
                  @click="router.push('/add')"
                >
                  Add Expense
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn
                  color="secondary"
                  variant="outlined"
                  block
                  size="large"
                  prepend-icon="mdi-history"
                  @click="router.push('/history')"
                >
                  View History
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>

        <p class="text-center text-caption text-medium-emphasis">
          Built with Vue 3 + TypeScript + Capacitor
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>
