import { describe, it, expect } from 'vitest';
import {
    currencies,
    getCurrencyMultiplier,
    toStorageAmount,
    toDisplayAmount,
    formatCurrency,
    getAvailableCurrencyCodes,
    getCurrency,
    getCurrencyCountryCode,
    hasCurrencyFlag,
    getCurrencyFlagUrl,
    DEFAULT_CURRENCY,
} from '../db/currency';

describe('Currency Configuration', () => {
    describe('currencies', () => {
        it('should have CNY, USD, and KRW defined', () => {
            expect(currencies.CNY).toBeDefined();
            expect(currencies.USD).toBeDefined();
            expect(currencies.KRW).toBeDefined();
        });

        it('should have correct CNY configuration', () => {
            expect(currencies.CNY.code).toBe('CNY');
            expect(currencies.CNY.symbol).toBe('¥');
            expect(currencies.CNY.name).toBe('Yuan Renminbi'); // From currency-codes library
            expect(currencies.CNY.decimalPlaces).toBe(2);
            expect(currencies.CNY.countryCode).toBe('CN');
        });

        it('should have correct USD configuration', () => {
            expect(currencies.USD.code).toBe('USD');
            expect(currencies.USD.symbol).toBe('$');
            expect(currencies.USD.name).toBe('US Dollar');
            expect(currencies.USD.decimalPlaces).toBe(2);
            expect(currencies.USD.countryCode).toBe('US');
        });

        it('should have correct KRW configuration', () => {
            expect(currencies.KRW.code).toBe('KRW');
            expect(currencies.KRW.symbol).toBe('₩');
            expect(currencies.KRW.name).toBe('Won'); // From currency-codes library
            expect(currencies.KRW.decimalPlaces).toBe(0);
            expect(currencies.KRW.countryCode).toBe('KR');
        });

        it('should have expanded currency support', () => {
            // Test additional currencies from the expanded list
            expect(currencies.EUR).toBeDefined();
            expect(currencies.EUR.countryCode).toBe('EU');
            expect(currencies.GBP).toBeDefined();
            expect(currencies.GBP.countryCode).toBe('GB');
            expect(currencies.JPY).toBeDefined();
            expect(currencies.JPY.countryCode).toBe('JP');
        });
    });

    describe('getCurrencyMultiplier', () => {
        it('should return 100 for CNY (2 decimal places)', () => {
            expect(getCurrencyMultiplier('CNY')).toBe(100);
        });

        it('should return 100 for USD (2 decimal places)', () => {
            expect(getCurrencyMultiplier('USD')).toBe(100);
        });

        it('should return 1 for KRW (0 decimal places)', () => {
            expect(getCurrencyMultiplier('KRW')).toBe(1);
        });

        it('should throw for unknown currency', () => {
            expect(() => getCurrencyMultiplier('UNKNOWN')).toThrow('Unknown currency code: UNKNOWN');
        });
    });

    describe('toStorageAmount', () => {
        it('should convert CNY 136.78 to 13678', () => {
            expect(toStorageAmount(136.78, 'CNY')).toBe(13678);
        });

        it('should convert USD 99.99 to 9999', () => {
            expect(toStorageAmount(99.99, 'USD')).toBe(9999);
        });

        it('should keep KRW 1000 as 1000', () => {
            expect(toStorageAmount(1000, 'KRW')).toBe(1000);
        });

        it('should round correctly for small fractions', () => {
            expect(toStorageAmount(10.005, 'CNY')).toBe(1001);
            expect(toStorageAmount(10.004, 'CNY')).toBe(1000);
        });
    });

    describe('toDisplayAmount', () => {
        it('should convert 13678 to CNY 136.78', () => {
            expect(toDisplayAmount(13678, 'CNY')).toBe(136.78);
        });

        it('should convert 9999 to USD 99.99', () => {
            expect(toDisplayAmount(9999, 'USD')).toBe(99.99);
        });

        it('should keep KRW 1000 as 1000', () => {
            expect(toDisplayAmount(1000, 'KRW')).toBe(1000);
        });
    });

    describe('formatCurrency', () => {
        it('should format CNY amount correctly', () => {
            expect(formatCurrency(136.78, 'CNY')).toBe('¥136.78');
        });

        it('should format USD amount correctly', () => {
            expect(formatCurrency(99.99, 'USD')).toBe('$99.99');
        });

        it('should format KRW amount correctly (no decimal)', () => {
            expect(formatCurrency(1000, 'KRW')).toBe('₩1000');
        });

        it('should throw for unknown currency', () => {
            expect(() => formatCurrency(100, 'UNKNOWN')).toThrow('Unknown currency code: UNKNOWN');
        });
    });

    describe('getAvailableCurrencyCodes', () => {
        it('should return all currency codes', () => {
            const codes = getAvailableCurrencyCodes();
            expect(codes).toContain('CNY');
            expect(codes).toContain('USD');
            expect(codes).toContain('KRW');
            expect(codes).toContain('EUR');
            expect(codes).toContain('GBP');
            expect(codes).toContain('JPY');
            // Now have 20 currencies with country flag mappings
            expect(codes.length).toBeGreaterThanOrEqual(20);
        });
    });

    describe('getCurrency', () => {
        it('should return currency config for valid code', () => {
            const cny = getCurrency('CNY');
            expect(cny).toBeDefined();
            expect(cny?.code).toBe('CNY');
        });

        it('should return undefined for invalid code', () => {
            expect(getCurrency('UNKNOWN')).toBeUndefined();
        });
    });

    describe('getCurrencyCountryCode', () => {
        it('should return country code for CNY', () => {
            expect(getCurrencyCountryCode('CNY')).toBe('CN');
        });

        it('should return country code for USD', () => {
            expect(getCurrencyCountryCode('USD')).toBe('US');
        });

        it('should return country code for EUR', () => {
            expect(getCurrencyCountryCode('EUR')).toBe('EU');
        });

        it('should return undefined for unknown currency', () => {
            expect(getCurrencyCountryCode('UNKNOWN')).toBeUndefined();
        });
    });

    describe('hasCurrencyFlag', () => {
        it('should return true for CNY (China)', () => {
            expect(hasCurrencyFlag('CNY')).toBe(true);
        });

        it('should return true for USD (US)', () => {
            expect(hasCurrencyFlag('USD')).toBe(true);
        });

        it('should return true for EUR (EU)', () => {
            expect(hasCurrencyFlag('EUR')).toBe(true);
        });

        it('should return false for unknown currency', () => {
            expect(hasCurrencyFlag('UNKNOWN')).toBe(false);
        });
    });

    describe('getCurrencyFlagUrl', () => {
        it('should return flag URL for CNY', () => {
            const url = getCurrencyFlagUrl('CNY');
            expect(url).toBe('https://purecatamphetamine.github.io/country-flag-icons/3x2/CN.svg');
        });

        it('should return flag URL for USD with 1x1 size', () => {
            const url = getCurrencyFlagUrl('USD', '1x1');
            expect(url).toBe('https://purecatamphetamine.github.io/country-flag-icons/1x1/US.svg');
        });

        it('should return undefined for unknown currency', () => {
            expect(getCurrencyFlagUrl('UNKNOWN')).toBeUndefined();
        });
    });

    describe('DEFAULT_CURRENCY', () => {
        it('should be CNY', () => {
            expect(DEFAULT_CURRENCY).toBe('CNY');
        });
    });
});
