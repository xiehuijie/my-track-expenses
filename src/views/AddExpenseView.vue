<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useExpenseStore } from '@/stores/expense'

const router = useRouter()
const expenseStore = useExpenseStore()

const form = ref<InstanceType<typeof import('vuetify/components').VForm> | null>(null)
const amount = ref<number | null>(null)
const description = ref('')
const category = ref('')
const date = ref(new Date().toISOString().split('T')[0])

const categories = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Other'
]

const rules = {
  required: (v: string | number | null) => !!v || v === 0 || 'This field is required',
  positiveNumber: (v: number | null) => (v !== null && v > 0) || 'Amount must be positive'
}

const submitForm = async () => {
  if (!form.value) return
  const { valid } = await form.value.validate()
  if (valid && amount.value !== null) {
    expenseStore.addExpense({
      amount: amount.value,
      description: description.value,
      category: category.value,
      date: date.value
    })
    router.push('/')
  }
}
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
        <v-card elevation="4">
          <v-card-title class="d-flex align-center py-4 px-6">
            <v-btn
              icon="mdi-arrow-left"
              variant="text"
              @click="router.back()"
            />
            <span class="text-h5 ml-2">Add Expense</span>
          </v-card-title>

          <v-divider />

          <v-card-text class="pa-6">
            <v-form
              ref="form"
              @submit.prevent="submitForm"
            >
              <v-text-field
                v-model.number="amount"
                label="Amount"
                type="number"
                prefix="$"
                :rules="[rules.required, rules.positiveNumber]"
                variant="outlined"
                class="mb-4"
              />

              <v-text-field
                v-model="description"
                label="Description"
                :rules="[rules.required]"
                variant="outlined"
                class="mb-4"
              />

              <v-select
                v-model="category"
                :items="categories"
                label="Category"
                :rules="[rules.required]"
                variant="outlined"
                class="mb-4"
              />

              <v-text-field
                v-model="date"
                label="Date"
                type="date"
                :rules="[rules.required]"
                variant="outlined"
                class="mb-4"
              />

              <v-btn
                type="submit"
                color="primary"
                variant="elevated"
                block
                size="large"
                class="mt-4"
              >
                Save Expense
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
