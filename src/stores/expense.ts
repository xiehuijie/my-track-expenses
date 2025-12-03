import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Expense {
  id: string
  amount: number
  description: string
  category: string
  date: string
}

export const useExpenseStore = defineStore('expense', () => {
  const expenses = ref<Expense[]>([])

  const totalExpenses = computed(() => {
    return expenses.value.reduce((sum, expense) => sum + expense.amount, 0)
  })

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString()
    }
    expenses.value.push(newExpense)
    saveToLocalStorage()
  }

  const removeExpense = (id: string) => {
    expenses.value = expenses.value.filter(expense => expense.id !== id)
    saveToLocalStorage()
  }

  const saveToLocalStorage = () => {
    localStorage.setItem('expenses', JSON.stringify(expenses.value))
  }

  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem('expenses')
    if (saved) {
      expenses.value = JSON.parse(saved)
    }
  }

  // Load on initialization
  loadFromLocalStorage()

  return {
    expenses,
    totalExpenses,
    addExpense,
    removeExpense,
    loadFromLocalStorage
  }
})
