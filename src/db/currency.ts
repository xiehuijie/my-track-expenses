/**
 * Currency configuration types and templates
 * 
 * Currency amounts are stored as integers in the database.
 * The conversion is done by multiplying by 10^decimalPlaces.
 * For example, CNY 136.78 is stored as 13678 (multiplied by 100).
 */

export interface CurrencyConfig {
  /** ISO 4217 currency code */
  code: string
  /** Currency symbol */
  symbol: string
  /** Currency name */
  name: string
  /** Number of decimal places (determines the multiplier: 10^decimalPlaces) */
  decimalPlaces: number
}

/**
 * Pre-defined currency templates
 */
export const currencies: Record<string, CurrencyConfig> = {
  CNY: {
    code: 'CNY',
    symbol: '¥',
    name: 'Chinese Yuan',
    decimalPlaces: 2
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    decimalPlaces: 2
  },
  KRW: {
    code: 'KRW',
    symbol: '₩',
    name: 'South Korean Won',
    decimalPlaces: 0
  }
} as const

/**
 * Get the multiplier for a currency
 * For CNY/USD (2 decimal places), multiplier is 100
 * For KRW (0 decimal places), multiplier is 1
 */
export function getCurrencyMultiplier(currencyCode: string): number {
  const currency = currencies[currencyCode]
  if (!currency) {
    throw new Error(`Unknown currency code: ${currencyCode}`)
  }
  return Math.pow(10, currency.decimalPlaces)
}

/**
 * Convert a display amount to database storage format (integer)
 * @param amount The amount as displayed (e.g., 136.78)
 * @param currencyCode The currency code (e.g., 'CNY')
 * @returns The integer value for database storage (e.g., 13678)
 */
export function toStorageAmount(amount: number, currencyCode: string): number {
  const multiplier = getCurrencyMultiplier(currencyCode)
  return Math.round(amount * multiplier)
}

/**
 * Convert a database storage amount to display format
 * @param storageAmount The integer value from database (e.g., 13678)
 * @param currencyCode The currency code (e.g., 'CNY')
 * @returns The display amount (e.g., 136.78)
 */
export function toDisplayAmount(storageAmount: number, currencyCode: string): number {
  const multiplier = getCurrencyMultiplier(currencyCode)
  return storageAmount / multiplier
}

/**
 * Format an amount for display with currency symbol
 * @param amount The display amount (e.g., 136.78)
 * @param currencyCode The currency code (e.g., 'CNY')
 * @returns Formatted string (e.g., '¥136.78')
 */
export function formatCurrency(amount: number, currencyCode: string): string {
  const currency = currencies[currencyCode]
  if (!currency) {
    throw new Error(`Unknown currency code: ${currencyCode}`)
  }
  return `${currency.symbol}${amount.toFixed(currency.decimalPlaces)}`
}

/**
 * Get list of all available currency codes
 */
export function getAvailableCurrencyCodes(): string[] {
  return Object.keys(currencies)
}

/**
 * Get currency configuration by code
 */
export function getCurrency(code: string): CurrencyConfig | undefined {
  return currencies[code]
}

/**
 * Default currency code for the application
 */
export const DEFAULT_CURRENCY = 'CNY'
