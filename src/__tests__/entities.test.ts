import { describe, it, expect } from 'vitest'
import { 
  AccountType, 
  CategoryType, 
  TransactionType, 
  TransactionStatus 
} from '../db/entities'

describe('Entity Enums', () => {
  describe('AccountType', () => {
    it('should have all account types defined', () => {
      expect(AccountType.BALANCE).toBe('balance')
      expect(AccountType.CREDIT_CARD).toBe('credit_card')
      expect(AccountType.INVESTMENT).toBe('investment')
      expect(AccountType.LOAN_OUT).toBe('loan_out')
      expect(AccountType.LOAN_IN).toBe('loan_in')
      expect(AccountType.OTHER).toBe('other')
    })
  })

  describe('CategoryType', () => {
    it('should have expense and income types defined', () => {
      expect(CategoryType.EXPENSE).toBe('expense')
      expect(CategoryType.INCOME).toBe('income')
    })
  })

  describe('TransactionType', () => {
    it('should have all transaction types defined', () => {
      expect(TransactionType.EXPENSE).toBe('expense')
      expect(TransactionType.INCOME).toBe('income')
      expect(TransactionType.TRANSFER).toBe('transfer')
      expect(TransactionType.REFUND).toBe('refund')
      expect(TransactionType.REIMBURSEMENT).toBe('reimbursement')
    })
  })

  describe('TransactionStatus', () => {
    it('should have all transaction statuses defined', () => {
      expect(TransactionStatus.PENDING).toBe('pending')
      expect(TransactionStatus.COMPLETED).toBe('completed')
      expect(TransactionStatus.VOIDED).toBe('voided')
    })
  })
})
