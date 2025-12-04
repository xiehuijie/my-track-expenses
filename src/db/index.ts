import initSqlJs from 'sql.js'
import wasm from 'sql.js/dist/sql-wasm.wasm?url'
import 'reflect-metadata'
import { DataSource } from 'typeorm/browser'
import { createInstance, INDEXEDDB } from 'localforage'
import { Expense, User, Ledger, Account, Category, Tag, Transaction } from './entities'
import { 
  ExpenseService, 
  UserService, 
  LedgerService, 
  AccountService, 
  CategoryService, 
  TagService, 
  TransactionService 
} from './services'

const STORAGE_KEY = '__TRACK_EXPENSES_DB__'

// Create storage instance for IndexedDB persistence
const storage = createInstance({
  driver: INDEXEDDB,
  name: 'track-expenses-database'
})

// Database initialization state
let dataSource: DataSource | null = null
let expenseService: ExpenseService | null = null
let userService: UserService | null = null
let ledgerService: LedgerService | null = null
let accountService: AccountService | null = null
let categoryService: CategoryService | null = null
let tagService: TagService | null = null
let transactionService: TransactionService | null = null
let initPromise: Promise<void> | null = null

/**
 * Initialize the database connection
 */
export async function initializeDatabase(): Promise<void> {
  if (dataSource?.isInitialized) {
    return
  }

  if (initPromise) {
    return initPromise
  }

  initPromise = (async () => {
    try {
      // Load existing database from storage
      const existingDatabase: Uint8Array | null = await storage.getItem(STORAGE_KEY)
      const database = existingDatabase ?? new Uint8Array()

      // Initialize SQL.js
      const SQLite = await initSqlJs({ locateFile: () => wasm })

      // Create TypeORM data source
      dataSource = new DataSource({
        type: 'sqljs',
        driver: SQLite,
        autoSave: true,
        autoSaveCallback: (db: Uint8Array) => {
          storage.setItem(STORAGE_KEY, db)
        },
        database,
        logging: import.meta.env.DEV ? ['query', 'schema', 'info', 'log'] : false,
        entities: [Expense, User, Ledger, Account, Category, Tag, Transaction],
        synchronize: true
      })

      await dataSource.initialize()

      // Initialize services
      expenseService = new ExpenseService(dataSource)
      userService = new UserService(dataSource)
      ledgerService = new LedgerService(dataSource)
      accountService = new AccountService(dataSource)
      categoryService = new CategoryService(dataSource)
      tagService = new TagService(dataSource)
      transactionService = new TransactionService(dataSource)
    } catch (error) {
      console.error('Database initialization failed:', error)
      initPromise = null
      throw error
    }
  })()

  return initPromise
}

/**
 * Get the expense service instance
 */
export function getExpenseService(): ExpenseService {
  if (!expenseService) {
    throw new Error('Database not initialized. Call initializeDatabase() first.')
  }
  return expenseService
}

/**
 * Get the user service instance
 */
export function getUserService(): UserService {
  if (!userService) {
    throw new Error('Database not initialized. Call initializeDatabase() first.')
  }
  return userService
}

/**
 * Get the ledger service instance
 */
export function getLedgerService(): LedgerService {
  if (!ledgerService) {
    throw new Error('Database not initialized. Call initializeDatabase() first.')
  }
  return ledgerService
}

/**
 * Get the account service instance
 */
export function getAccountService(): AccountService {
  if (!accountService) {
    throw new Error('Database not initialized. Call initializeDatabase() first.')
  }
  return accountService
}

/**
 * Get the category service instance
 */
export function getCategoryService(): CategoryService {
  if (!categoryService) {
    throw new Error('Database not initialized. Call initializeDatabase() first.')
  }
  return categoryService
}

/**
 * Get the tag service instance
 */
export function getTagService(): TagService {
  if (!tagService) {
    throw new Error('Database not initialized. Call initializeDatabase() first.')
  }
  return tagService
}

/**
 * Get the transaction service instance
 */
export function getTransactionService(): TransactionService {
  if (!transactionService) {
    throw new Error('Database not initialized. Call initializeDatabase() first.')
  }
  return transactionService
}

/**
 * Get the data source instance
 */
export function getDataSource(): DataSource {
  if (!dataSource) {
    throw new Error('Database not initialized. Call initializeDatabase() first.')
  }
  return dataSource
}

/**
 * Check if database is initialized
 */
export function isDatabaseInitialized(): boolean {
  return dataSource?.isInitialized ?? false
}

/**
 * Export database as Uint8Array for backup
 */
export async function exportDatabase(): Promise<Uint8Array | null> {
  return storage.getItem<Uint8Array>(STORAGE_KEY)
}

/**
 * Import database from Uint8Array
 */
export async function importDatabase(data: Uint8Array): Promise<void> {
  await storage.setItem(STORAGE_KEY, data)
  // Reinitialize database with new data
  dataSource = null
  expenseService = null
  userService = null
  ledgerService = null
  accountService = null
  categoryService = null
  tagService = null
  transactionService = null
  initPromise = null
  await initializeDatabase()
}

// Re-export currency utilities
export * from './currency'
