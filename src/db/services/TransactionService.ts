import { BaseCRUDService } from './BaseCRUDService'
import { Transaction, TransactionType, TransactionStatus } from '../entities'
import type { DataSource, DeepPartial } from 'typeorm/browser'

export interface TransactionFilters {
  ledgerId?: string
  creatorId?: string
  fromAccountId?: string
  toAccountId?: string
  categoryId?: string
  transactionType?: TransactionType
  status?: TransactionStatus
  startDate?: string
  endDate?: string
  isMarked?: boolean
  needsReview?: boolean
}

/**
 * Service for managing Transaction entities
 */
export class TransactionService extends BaseCRUDService<Transaction, string> {
  readonly Entity = Transaction

  constructor(engine: DataSource) {
    super(engine)
  }

  key(id: string) {
    return { id }
  }

  /**
   * Find all transactions for a specific ledger
   */
  async findByLedgerId(ledgerId: string): Promise<Transaction[]> {
    return this.repository.find({
      where: { ledgerId },
      order: { transactionDate: 'DESC', createdAt: 'DESC' }
    })
  }

  /**
   * Find transactions by type within a ledger
   */
  async findByType(ledgerId: string, transactionType: TransactionType): Promise<Transaction[]> {
    return this.repository.find({
      where: { ledgerId, transactionType },
      order: { transactionDate: 'DESC', createdAt: 'DESC' }
    })
  }

  /**
   * Find transactions by account (either as source or target)
   */
  async findByAccountId(accountId: string): Promise<Transaction[]> {
    return this.repository
      .createQueryBuilder('transaction')
      .where('transaction.fromAccountId = :accountId', { accountId })
      .orWhere('transaction.toAccountId = :accountId', { accountId })
      .orderBy('transaction.transactionDate', 'DESC')
      .addOrderBy('transaction.createdAt', 'DESC')
      .getMany()
  }

  /**
   * Find transactions by category
   */
  async findByCategoryId(categoryId: string): Promise<Transaction[]> {
    return this.repository.find({
      where: { categoryId },
      order: { transactionDate: 'DESC', createdAt: 'DESC' }
    })
  }

  /**
   * Find transactions within a date range
   */
  async findByDateRange(ledgerId: string, startDate: string, endDate: string): Promise<Transaction[]> {
    return this.repository
      .createQueryBuilder('transaction')
      .where('transaction.ledgerId = :ledgerId', { ledgerId })
      .andWhere('transaction.transactionDate >= :startDate', { startDate })
      .andWhere('transaction.transactionDate <= :endDate', { endDate })
      .orderBy('transaction.transactionDate', 'DESC')
      .addOrderBy('transaction.createdAt', 'DESC')
      .getMany()
  }

  /**
   * Find transactions with flexible filters
   */
  async findWithFilters(filters: TransactionFilters): Promise<Transaction[]> {
    const qb = this.repository.createQueryBuilder('transaction')

    if (filters.ledgerId) {
      qb.andWhere('transaction.ledgerId = :ledgerId', { ledgerId: filters.ledgerId })
    }
    if (filters.creatorId) {
      qb.andWhere('transaction.creatorId = :creatorId', { creatorId: filters.creatorId })
    }
    if (filters.fromAccountId) {
      qb.andWhere('transaction.fromAccountId = :fromAccountId', { fromAccountId: filters.fromAccountId })
    }
    if (filters.toAccountId) {
      qb.andWhere('transaction.toAccountId = :toAccountId', { toAccountId: filters.toAccountId })
    }
    if (filters.categoryId) {
      qb.andWhere('transaction.categoryId = :categoryId', { categoryId: filters.categoryId })
    }
    if (filters.transactionType) {
      qb.andWhere('transaction.transactionType = :transactionType', { transactionType: filters.transactionType })
    }
    if (filters.status) {
      qb.andWhere('transaction.status = :status', { status: filters.status })
    }
    if (filters.startDate) {
      qb.andWhere('transaction.transactionDate >= :startDate', { startDate: filters.startDate })
    }
    if (filters.endDate) {
      qb.andWhere('transaction.transactionDate <= :endDate', { endDate: filters.endDate })
    }
    if (filters.isMarked !== undefined) {
      qb.andWhere('transaction.isMarked = :isMarked', { isMarked: filters.isMarked })
    }
    if (filters.needsReview !== undefined) {
      qb.andWhere('transaction.needsReview = :needsReview', { needsReview: filters.needsReview })
    }

    return qb
      .orderBy('transaction.transactionDate', 'DESC')
      .addOrderBy('transaction.createdAt', 'DESC')
      .getMany()
  }

  /**
   * Find marked transactions
   */
  async findMarked(ledgerId: string): Promise<Transaction[]> {
    return this.repository.find({
      where: { ledgerId, isMarked: true },
      order: { transactionDate: 'DESC', createdAt: 'DESC' }
    })
  }

  /**
   * Find transactions needing review
   */
  async findNeedingReview(ledgerId: string): Promise<Transaction[]> {
    return this.repository.find({
      where: { ledgerId, needsReview: true },
      order: { transactionDate: 'DESC', createdAt: 'DESC' }
    })
  }

  /**
   * Find transactions with tags loaded
   */
  async findByIdWithTags(id: string): Promise<Transaction | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['tags']
    })
  }

  /**
   * Create a new transaction
   */
  async createTransaction(data: Omit<DeepPartial<Transaction>, 'id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> {
    return this.create(data)
  }

  /**
   * Get recent transactions with limit
   */
  async getRecentTransactions(ledgerId: string, limit: number = 10): Promise<Transaction[]> {
    return this.repository.find({
      where: { ledgerId },
      order: { transactionDate: 'DESC', createdAt: 'DESC' },
      take: limit
    })
  }

  /**
   * Toggle marked status
   */
  async toggleMarked(id: string): Promise<Transaction | null> {
    const transaction = await this.findById(id)
    if (!transaction) return null
    return this.update(id, { isMarked: !transaction.isMarked })
  }

  /**
   * Toggle needs review status
   */
  async toggleNeedsReview(id: string): Promise<Transaction | null> {
    const transaction = await this.findById(id)
    if (!transaction) return null
    return this.update(id, { needsReview: !transaction.needsReview })
  }

  /**
   * Void a transaction
   */
  async voidTransaction(id: string): Promise<Transaction | null> {
    return this.update(id, { status: TransactionStatus.VOIDED })
  }

  /**
   * Get total amount by type for a ledger within a date range
   */
  async getTotalByType(
    ledgerId: string,
    transactionType: TransactionType,
    currency: string,
    startDate?: string,
    endDate?: string
  ): Promise<number> {
    const qb = this.repository
      .createQueryBuilder('transaction')
      .select('SUM(transaction.amount)', 'total')
      .where('transaction.ledgerId = :ledgerId', { ledgerId })
      .andWhere('transaction.transactionType = :transactionType', { transactionType })
      .andWhere('transaction.currency = :currency', { currency })
      .andWhere('transaction.status = :status', { status: TransactionStatus.COMPLETED })

    if (startDate) {
      qb.andWhere('transaction.transactionDate >= :startDate', { startDate })
    }
    if (endDate) {
      qb.andWhere('transaction.transactionDate <= :endDate', { endDate })
    }

    const result = await qb.getRawOne()
    return parseInt(result?.total ?? '0', 10)
  }
}
