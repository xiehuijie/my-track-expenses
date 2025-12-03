import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useExpenseStore } from '../stores/expense'

describe('Expense Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('should start with empty expenses', () => {
    const store = useExpenseStore()
    expect(store.expenses).toEqual([])
    expect(store.totalExpenses).toBe(0)
  })

  it('should add an expense', () => {
    const store = useExpenseStore()
    store.addExpense({
      amount: 25.50,
      description: 'Lunch',
      category: 'Food & Dining',
      date: '2024-01-15'
    })

    expect(store.expenses.length).toBe(1)
    expect(store.expenses[0].amount).toBe(25.50)
    expect(store.expenses[0].description).toBe('Lunch')
  })

  it('should calculate total expenses', () => {
    const store = useExpenseStore()
    store.addExpense({
      amount: 10,
      description: 'Coffee',
      category: 'Food & Dining',
      date: '2024-01-15'
    })
    store.addExpense({
      amount: 20,
      description: 'Bus ticket',
      category: 'Transportation',
      date: '2024-01-15'
    })

    expect(store.totalExpenses).toBe(30)
  })

  it('should remove an expense', () => {
    const store = useExpenseStore()
    store.addExpense({
      amount: 15,
      description: 'Snack',
      category: 'Food & Dining',
      date: '2024-01-15'
    })

    const expenseId = store.expenses[0].id
    store.removeExpense(expenseId)

    expect(store.expenses.length).toBe(0)
    expect(store.totalExpenses).toBe(0)
  })
})
