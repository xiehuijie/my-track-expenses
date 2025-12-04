import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getExpenseService, isDatabaseInitialized } from '@/db'

export interface Expense {
  id: string
  amount: number
  description: string
  category: string
  date: string
}

export const useExpenseStore = defineStore('expense', () => {
  const expenses = ref<Expense[]>([])
  const isLoading = ref(false)
  const isInitialized = ref(false)

  const totalExpenses = computed(() => {
    return expenses.value.reduce((sum, expense) => sum + expense.amount, 0)
  })

  /**
   * Load expenses from SQLite database
   */
  const loadExpenses = async () => {
    if (!isDatabaseInitialized()) {
      console.warn('Database not initialized yet, skipping load')
      return
    }

    try {
      isLoading.value = true
      const expenseService = getExpenseService()
      const dbExpenses = await expenseService.findAll()
      
      // Map database entities to store interface
      expenses.value = dbExpenses.map(e => ({
        id: e.id,
        amount: Number(e.amount),
        description: e.description,
        category: e.category,
        date: e.date
      }))
      isInitialized.value = true
    } catch (error) {
      console.error('Failed to load expenses from database:', error)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Add an expense and persist to SQLite database
   */
  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    if (!isDatabaseInitialized()) {
      console.error('Database not initialized, cannot add expense')
      return
    }

    try {
      isLoading.value = true
      const expenseService = getExpenseService()
      const newExpense = await expenseService.createExpense({
        amount: expense.amount,
        description: expense.description,
        category: expense.category,
        date: expense.date
      })
      
      expenses.value.push({
        id: newExpense.id,
        amount: Number(newExpense.amount),
        description: newExpense.description,
        category: newExpense.category,
        date: newExpense.date
      })
    } catch (error) {
      console.error('Failed to add expense:', error)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Remove an expense from SQLite database
   */
  const removeExpense = async (id: string) => {
    if (!isDatabaseInitialized()) {
      console.error('Database not initialized, cannot remove expense')
      return
    }

    try {
      isLoading.value = true
      const expenseService = getExpenseService()
      await expenseService.delete(id)
      expenses.value = expenses.value.filter(expense => expense.id !== id)
    } catch (error) {
      console.error('Failed to remove expense:', error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    expenses,
    totalExpenses,
    isLoading,
    isInitialized,
    addExpense,
    removeExpense,
    loadExpenses
  }
})
