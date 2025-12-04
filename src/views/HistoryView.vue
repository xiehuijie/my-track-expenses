<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useExpenseStore } from '@/stores/expense'
import { computed, onMounted } from 'vue'

const router = useRouter()
const expenseStore = useExpenseStore()

const sortedExpenses = computed(() => {
  return [...expenseStore.expenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
})

const formattedTotal = computed(() => {
  return expenseStore.totalExpenses.toFixed(2)
})

const deleteExpense = async (id: string) => {
  await expenseStore.removeExpense(id)
}

// Load expenses from database when component is mounted
onMounted(async () => {
  await expenseStore.loadExpenses()
})
</script>

<template>
  <v-container class="fill-height">
    <v-row justify="center">
      <v-col
        cols="12"
        md="8"
        lg="6"
      >
        <v-card elevation="4">
          <v-card-title class="d-flex align-center py-4 px-6">
            <v-btn
              icon="mdi-arrow-left"
              variant="text"
              @click="router.back()"
            />
            <span class="text-h5 ml-2">Expense History</span>
          </v-card-title>

          <v-divider />

          <v-card-text class="pa-4">
            <v-card
              color="primary"
              variant="tonal"
              class="mb-4"
            >
              <v-card-text class="text-center">
                <div class="text-overline">
                  Total Expenses
                </div>
                <div class="text-h4 font-weight-bold">
                  ${{ formattedTotal }}
                </div>
              </v-card-text>
            </v-card>

            <v-list
              v-if="sortedExpenses.length > 0"
              lines="two"
            >
              <v-list-item
                v-for="expense in sortedExpenses"
                :key="expense.id"
                :title="expense.description"
                :subtitle="`${expense.category} - ${expense.date}`"
              >
                <template #prepend>
                  <v-avatar
                    color="primary"
                    variant="tonal"
                  >
                    <v-icon icon="mdi-cash" />
                  </v-avatar>
                </template>
                <template #append>
                  <div class="d-flex align-center">
                    <span class="text-h6 text-error mr-2">${{ expense.amount.toFixed(2) }}</span>
                    <v-btn
                      icon="mdi-delete"
                      variant="text"
                      color="error"
                      size="small"
                      @click="deleteExpense(expense.id)"
                    />
                  </div>
                </template>
              </v-list-item>
            </v-list>

            <v-alert
              v-else
              type="info"
              variant="tonal"
            >
              No expenses recorded yet.
            </v-alert>
          </v-card-text>
        </v-card>

        <v-btn
          color="primary"
          variant="elevated"
          block
          size="large"
          prepend-icon="mdi-plus"
          class="mt-4"
          @click="router.push('/add')"
        >
          Add New Expense
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
