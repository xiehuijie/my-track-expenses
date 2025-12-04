import initSqlJs from 'sql.js'
import wasm from 'sql.js/dist/sql-wasm.wasm?url'
import 'reflect-metadata'
import { DataSource } from 'typeorm/browser'
import { createInstance, INDEXEDDB } from 'localforage'
import { Expense } from './entities'
import { ExpenseService } from './services'

const STORAGE_KEY = '__TRACK_EXPENSES_DB__'

// Create storage instance for IndexedDB persistence
const storage = createInstance({
  driver: INDEXEDDB,
  name: 'track-expenses-database'
})

// Database initialization state
let dataSource: DataSource | null = null
let expenseService: ExpenseService | null = null
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
        entities: [Expense],
        synchronize: true
      })

      await dataSource.initialize()

      // Initialize services
      expenseService = new ExpenseService(dataSource)
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
  initPromise = null
  await initializeDatabase()
}
