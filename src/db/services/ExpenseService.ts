import { BaseCRUDService } from './BaseCRUDService'
import { Expense } from '../entities'
import type { DeepPartial, DataSource } from 'typeorm/browser'

/**
 * Service for managing Expense entities
 */
export class ExpenseService extends BaseCRUDService<Expense, string> {
  readonly Entity = Expense

  constructor(engine: DataSource) {
    super(engine)
  }

  key(id: string) {
    return { id }
  }

  /**
   * Find expenses by category
   */
  async findByCategory(category: string): Promise<Expense[]> {
    return this.repository.find({
      where: { category },
      order: { date: 'DESC' }
    })
  }

  /**
   * Find expenses within a date range
   */
  async findByDateRange(startDate: string, endDate: string): Promise<Expense[]> {
    return this.repository
      .createQueryBuilder('expense')
      .where('expense.date >= :startDate', { startDate })
      .andWhere('expense.date <= :endDate', { endDate })
      .orderBy('expense.date', 'DESC')
      .getMany()
  }

  /**
   * Get total expense amount
   */
  async getTotalAmount(): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('expense')
      .select('SUM(expense.amount)', 'total')
      .getRawOne()
    return parseFloat(result?.total ?? '0')
  }

  /**
   * Create a new expense record
   */
  async createExpense(data: Omit<DeepPartial<Expense>, 'id' | 'createdAt' | 'updatedAt'>): Promise<Expense> {
    return this.create(data)
  }

  /**
   * Get recent expenses with limit
   */
  async getRecentExpenses(limit: number = 10): Promise<Expense[]> {
    return this.repository.find({
      order: { date: 'DESC' },
      take: limit
    })
  }
}
