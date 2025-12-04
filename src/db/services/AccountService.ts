import { BaseCRUDService } from './BaseCRUDService'
import { Account, AccountType } from '../entities'
import type { DataSource, DeepPartial } from 'typeorm/browser'

/**
 * Service for managing Account entities
 */
export class AccountService extends BaseCRUDService<Account, string> {
  readonly Entity = Account

  constructor(engine: DataSource) {
    super(engine)
  }

  key(id: string) {
    return { id }
  }

  /**
   * Find all accounts for a specific ledger
   */
  async findByLedgerId(ledgerId: string): Promise<Account[]> {
    return this.repository.find({
      where: { ledgerId, isActive: true },
      order: { sortOrder: 'ASC', name: 'ASC' }
    })
  }

  /**
   * Find accounts by type within a ledger
   */
  async findByType(ledgerId: string, accountType: AccountType): Promise<Account[]> {
    return this.repository.find({
      where: { ledgerId, accountType, isActive: true },
      order: { sortOrder: 'ASC', name: 'ASC' }
    })
  }

  /**
   * Find accounts by currency within a ledger
   */
  async findByCurrency(ledgerId: string, currency: string): Promise<Account[]> {
    return this.repository.find({
      where: { ledgerId, currency, isActive: true },
      order: { sortOrder: 'ASC', name: 'ASC' }
    })
  }

  /**
   * Find accounts included in total calculation
   */
  async findAccountsIncludedInTotal(ledgerId: string): Promise<Account[]> {
    return this.repository.find({
      where: { ledgerId, isActive: true, includeInTotal: true },
      order: { sortOrder: 'ASC', name: 'ASC' }
    })
  }

  /**
   * Create a new account
   */
  async createAccount(data: Omit<DeepPartial<Account>, 'id' | 'createdAt' | 'updatedAt'>): Promise<Account> {
    // Set currentBalance to initialBalance on creation
    if (data.initialBalance !== undefined && data.currentBalance === undefined) {
      data.currentBalance = data.initialBalance
    }
    return this.create(data)
  }

  /**
   * Update account balance
   */
  async updateBalance(id: string, newBalance: number): Promise<Account | null> {
    return this.update(id, { currentBalance: newBalance })
  }

  /**
   * Adjust account balance by amount (positive or negative)
   */
  async adjustBalance(id: string, adjustment: number): Promise<Account | null> {
    const account = await this.findById(id)
    if (!account) return null
    const newBalance = account.currentBalance + adjustment
    return this.update(id, { currentBalance: newBalance })
  }

  /**
   * Archive an account
   */
  async archiveAccount(id: string): Promise<Account | null> {
    return this.update(id, { isActive: false })
  }

  /**
   * Restore an archived account
   */
  async restoreAccount(id: string): Promise<Account | null> {
    return this.update(id, { isActive: true })
  }

  /**
   * Get total balance for all accounts in a ledger (in the same currency)
   */
  async getTotalBalance(ledgerId: string, currency: string): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('account')
      .select('SUM(account.currentBalance)', 'total')
      .where('account.ledgerId = :ledgerId', { ledgerId })
      .andWhere('account.currency = :currency', { currency })
      .andWhere('account.isActive = :isActive', { isActive: true })
      .andWhere('account.includeInTotal = :includeInTotal', { includeInTotal: true })
      .getRawOne()
    return parseInt(result?.total ?? '0', 10)
  }
}
