import 'reflect-metadata'
import { DataSource, type DataSourceOptions } from 'typeorm/browser'
import { Capacitor } from '@capacitor/core'
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite'
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

const DATABASE_NAME = 'track_expenses'

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

// SQLite connection for native platforms
let sqliteConnection: SQLiteConnection | null = null

/**
 * Check if running on a native platform (Android/iOS)
 */
function isNativePlatform(): boolean {
  return Capacitor.isNativePlatform()
}

/**
 * Get web-specific database configuration using sql.js with IndexedDB persistence
 */
async function getWebDataSourceOptions(): Promise<DataSourceOptions> {
  // Dynamic imports for web-only dependencies
  const initSqlJs = (await import('sql.js')).default
  const wasm = (await import('sql.js/dist/sql-wasm.wasm?url')).default
  const { createInstance, INDEXEDDB } = await import('localforage')
  
  const STORAGE_KEY = '__TRACK_EXPENSES_DB__'
  
  // Create storage instance for IndexedDB persistence
  const storage = createInstance({
    driver: INDEXEDDB,
    name: 'track-expenses-database'
  })
  
  // Load existing database from storage
  const existingDatabase: Uint8Array | null = await storage.getItem(STORAGE_KEY)
  const database = existingDatabase ?? new Uint8Array()
  
  // Initialize SQL.js
  const SQLite = await initSqlJs({ locateFile: () => wasm })
  
  return {
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
  } as DataSourceOptions
}

/**
 * Get native-specific database configuration using @capacitor-community/sqlite
 */
async function getNativeDataSourceOptions(): Promise<DataSourceOptions> {
  // Create SQLite connection
  sqliteConnection = new SQLiteConnection(CapacitorSQLite)
  
  return {
    type: 'capacitor',
    driver: sqliteConnection,
    database: DATABASE_NAME,
    mode: 'no-encryption',
    version: 1,
    logging: import.meta.env.DEV ? ['query', 'schema', 'info', 'log'] : false,
    entities: [Expense, User, Ledger, Account, Category, Tag, Transaction],
    synchronize: true
  } as DataSourceOptions
}

/**
 * Initialize the database connection
 * Uses native SQLite on Android/iOS and sql.js on web
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
      const isNative = isNativePlatform()
      console.log(`Initializing database for ${isNative ? 'native' : 'web'} platform`)
      
      // Get platform-specific data source options
      const options = isNative 
        ? await getNativeDataSourceOptions()
        : await getWebDataSourceOptions()

      // Create TypeORM data source
      dataSource = new DataSource(options)

      await dataSource.initialize()
      console.log('Database initialized successfully')

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
 * Export database as JSON for backup
 * Works on both native and web platforms
 */
export async function exportDatabase(): Promise<string | null> {
  if (!dataSource?.isInitialized) {
    throw new Error('Database not initialized. Call initializeDatabase() first.')
  }

  if (isNativePlatform() && sqliteConnection) {
    // For native platforms, export using SQLite JSON export
    const db = await sqliteConnection.retrieveConnection(DATABASE_NAME, false)
    const exportResult = await db.exportToJson('full')
    return exportResult.export ? JSON.stringify(exportResult.export) : null
  } else {
    // For web, get the raw database from IndexedDB
    const { createInstance, INDEXEDDB } = await import('localforage')
    const storage = createInstance({
      driver: INDEXEDDB,
      name: 'track-expenses-database'
    })
    const data = await storage.getItem<Uint8Array>('__TRACK_EXPENSES_DB__')
    return data ? btoa(String.fromCharCode(...data)) : null
  }
}

/**
 * Import database from backup
 * Works on both native and web platforms
 */
export async function importDatabase(data: string): Promise<void> {
  if (isNativePlatform() && sqliteConnection) {
    // For native platforms, import using SQLite JSON import
    await sqliteConnection.importFromJson(data)
  } else {
    // For web, restore from base64 encoded Uint8Array
    const { createInstance, INDEXEDDB } = await import('localforage')
    const storage = createInstance({
      driver: INDEXEDDB,
      name: 'track-expenses-database'
    })
    const binaryString = atob(data)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    await storage.setItem('__TRACK_EXPENSES_DB__', bytes)
  }
  
  // Reset all services and reinitialize
  if (dataSource?.isInitialized) {
    await dataSource.destroy()
  }
  dataSource = null
  expenseService = null
  userService = null
  ledgerService = null
  accountService = null
  categoryService = null
  tagService = null
  transactionService = null
  initPromise = null
  sqliteConnection = null
  await initializeDatabase()
}

/**
 * Close database connection
 * Should be called when the app is closing
 */
export async function closeDatabase(): Promise<void> {
  if (dataSource?.isInitialized) {
    await dataSource.destroy()
  }
  
  if (sqliteConnection) {
    await sqliteConnection.closeAllConnections()
    sqliteConnection = null
  }
  
  dataSource = null
  expenseService = null
  userService = null
  ledgerService = null
  accountService = null
  categoryService = null
  tagService = null
  transactionService = null
  initPromise = null
}

// Re-export currency utilities
export * from './currency'
