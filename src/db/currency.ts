/**
 * Currency configuration types and templates
 * 
 * Currency amounts are stored as integers in the database.
 * The conversion is done by multiplying by 10^decimalPlaces.
 * For example, CNY 136.78 is stored as 13678 (multiplied by 100).
 * 
 * Uses the `currency-codes` package for ISO 4217 data and 
 * `country-flag-icons` for flag icon support.
 */

import { code as getCurrencyData } from 'currency-codes'
import { hasFlag } from 'country-flag-icons'

export interface CurrencyConfig {
  /** ISO 4217 currency code */
  code: string
  /** Currency symbol */
  symbol: string
  /** Currency name */
  name: string
  /** Number of decimal places (determines the multiplier: 10^decimalPlaces) */
  decimalPlaces: number
  /** ISO 3166-1 alpha-2 country code for flag display */
  countryCode: string
}

/**
 * Currency symbol mapping (not provided by currency-codes package)
 */
const currencySymbols: Record<string, string> = {
  CNY: '¥',
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  KRW: '₩',
  HKD: 'HK$',
  TWD: 'NT$',
  SGD: 'S$',
  AUD: 'A$',
  CAD: 'C$',
  CHF: 'Fr',
  INR: '₹',
  RUB: '₽',
  BRL: 'R$',
  MXN: 'Mex$',
  THB: '฿',
  MYR: 'RM',
  VND: '₫',
  PHP: '₱'
}

/**
 * Primary country code for each currency (for flag display)
 * Maps ISO 4217 currency code to ISO 3166-1 alpha-2 country code
 */
const currencyToCountry: Record<string, string> = {
  CNY: 'CN',
  USD: 'US',
  EUR: 'EU',
  GBP: 'GB',
  JPY: 'JP',
  KRW: 'KR',
  HKD: 'HK',
  TWD: 'TW',
  SGD: 'SG',
  AUD: 'AU',
  CAD: 'CA',
  CHF: 'CH',
  INR: 'IN',
  RUB: 'RU',
  BRL: 'BR',
  MXN: 'MX',
  THB: 'TH',
  MYR: 'MY',
  VND: 'VN',
  PHP: 'PH'
}

/**
 * Build currency config from currency-codes library data with our symbol and country mappings
 */
function buildCurrencyConfig(currencyCode: string): CurrencyConfig | undefined {
  const data = getCurrencyData(currencyCode)
  if (!data) return undefined
  
  const symbol = currencySymbols[currencyCode]
  const countryCode = currencyToCountry[currencyCode]
  if (!symbol || !countryCode) return undefined
  
  return {
    code: data.code,
    symbol,
    name: data.currency,
    decimalPlaces: data.digits,
    countryCode
  }
}

/**
 * Pre-defined currency templates
 * Built from currency-codes library with our symbol and country mappings
 */
export const currencies: Record<string, CurrencyConfig> = Object.keys(currencySymbols)
  .reduce((acc, code) => {
    const config = buildCurrencyConfig(code)
    if (config) {
      acc[code] = config
    }
    return acc
  }, {} as Record<string, CurrencyConfig>)

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
 * Get the country code for a currency (for flag display)
 * @param currencyCode The ISO 4217 currency code
 * @returns The ISO 3166-1 alpha-2 country code, or undefined if not found
 */
export function getCurrencyCountryCode(currencyCode: string): string | undefined {
  return currencies[currencyCode]?.countryCode
}

/**
 * Check if a flag icon is available for a currency
 * @param currencyCode The ISO 4217 currency code
 * @returns true if a flag icon is available
 */
export function hasCurrencyFlag(currencyCode: string): boolean {
  const countryCode = getCurrencyCountryCode(currencyCode)
  return countryCode ? hasFlag(countryCode) : false
}

/**
 * Get the flag icon URL for a currency
 * @param currencyCode The ISO 4217 currency code
 * @param size The aspect ratio size ('3x2' or '1x1')
 * @returns The URL to the flag SVG, or undefined if not available
 */
export function getCurrencyFlagUrl(currencyCode: string, size: '3x2' | '1x1' = '3x2'): string | undefined {
  const countryCode = getCurrencyCountryCode(currencyCode)
  if (!countryCode || !hasFlag(countryCode)) {
    return undefined
  }
  return `https://purecatamphetamine.github.io/country-flag-icons/${size}/${countryCode}.svg`
}

/**
 * Default currency code for the application
 */
export const DEFAULT_CURRENCY = 'CNY'
