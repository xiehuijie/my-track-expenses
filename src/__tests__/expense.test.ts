import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useExpenseStore } from '../stores/expense'

// Mock the database module
vi.mock('@/db', () => ({
  isDatabaseInitialized: vi.fn(() => true),
  getExpenseService: vi.fn(() => mockExpenseService)
}))

// Mock expense service
const mockExpenses: Array<{
  id: string
  amount: number
  description: string
  category: string
  date: string
  createdAt: Date
  updatedAt: Date
}> = []

const mockExpenseService = {
  findAll: vi.fn(async () => [...mockExpenses]),
  createExpense: vi.fn(async (data: { amount: number, description: string, category: string, date: string }) => {
    const newExpense = {
      id: crypto.randomUUID(),
      amount: data.amount,
      description: data.description,
      category: data.category,
      date: data.date,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    mockExpenses.push(newExpense)
    return newExpense
  }),
  delete: vi.fn(async (id: string) => {
    const index = mockExpenses.findIndex(e => e.id === id)
    if (index > -1) {
      mockExpenses.splice(index, 1)
    }
    return true
  }),
  getRecentExpenses: vi.fn(async (limit: number) => {
    return mockExpenses.slice(-limit).reverse()
  }),
  getTotalAmount: vi.fn(async () => {
    return mockExpenses.reduce((sum, e) => sum + e.amount, 0)
  })
}

describe('Expense Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    // Clear mock expenses
    mockExpenses.length = 0
    // Clear all mocks
    vi.clearAllMocks()
  })

  it('should start with empty expenses', () => {
    const store = useExpenseStore()
    expect(store.expenses).toEqual([])
    expect(store.totalExpenses).toBe(0)
  })

  it('should add an expense', async () => {
    const store = useExpenseStore()
    await store.addExpense({
      amount: 25.50,
      description: 'Lunch',
      category: 'Food & Dining',
      date: '2024-01-15'
    })

    expect(store.expenses.length).toBe(1)
    expect(store.expenses[0].amount).toBe(25.50)
    expect(store.expenses[0].description).toBe('Lunch')
  })

  it('should calculate total expenses', async () => {
    const store = useExpenseStore()
    await store.addExpense({
      amount: 10,
      description: 'Coffee',
      category: 'Food & Dining',
      date: '2024-01-15'
    })
    await store.addExpense({
      amount: 20,
      description: 'Bus ticket',
      category: 'Transportation',
      date: '2024-01-15'
    })

    expect(store.totalExpenses).toBe(30)
  })

  it('should remove an expense', async () => {
    const store = useExpenseStore()
    await store.addExpense({
      amount: 15,
      description: 'Snack',
      category: 'Food & Dining',
      date: '2024-01-15'
    })

    const expenseId = store.expenses[0].id
    await store.removeExpense(expenseId)

    expect(store.expenses.length).toBe(0)
    expect(store.totalExpenses).toBe(0)
  })

  it('should load expenses from database', async () => {
    // Pre-populate mock database
    mockExpenses.push({
      id: '123',
      amount: 50,
      description: 'Pre-existing expense',
      category: 'Other',
      date: '2024-01-10',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const store = useExpenseStore()
    await store.loadExpenses()

    expect(store.expenses.length).toBe(1)
    expect(store.expenses[0].description).toBe('Pre-existing expense')
    expect(store.isInitialized).toBe(true)
  })
})
