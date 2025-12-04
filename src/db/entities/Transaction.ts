import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinColumn, JoinTable } from 'typeorm/browser'
import type { User } from './User'
import type { Ledger } from './Ledger'
import type { Account } from './Account'
import type { Category } from './Category'
import type { Tag } from './Tag'

/**
 * Transaction types enumeration
 */
export enum TransactionType {
  /** Regular expense */
  EXPENSE = 'expense',
  /** Regular income */
  INCOME = 'income',
  /** Transfer between accounts (including currency exchange) */
  TRANSFER = 'transfer',
  /** Refund (reversal of a previous transaction) */
  REFUND = 'refund',
  /** Reimbursement (expense paid back) */
  REIMBURSEMENT = 'reimbursement'
}

/**
 * Transaction status enumeration
 */
export enum TransactionStatus {
  /** Transaction is pending/scheduled */
  PENDING = 'pending',
  /** Transaction is completed */
  COMPLETED = 'completed',
  /** Transaction is voided/cancelled */
  VOIDED = 'voided'
}

/**
 * Transaction entity for recording financial transactions
 * Supports various transaction types: expense, income, transfer, refund, reimbursement
 */
@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({
    type: 'varchar',
    length: 20,
    default: TransactionType.EXPENSE
  })
  transactionType!: TransactionType

  @Column({
    type: 'varchar',
    length: 20,
    default: TransactionStatus.COMPLETED
  })
  status!: TransactionStatus

  /**
   * Primary amount of the transaction
   * Stored as integer (multiply by currency multiplier)
   * For EXPENSE: the expense amount
   * For INCOME: the income amount
   * For TRANSFER: the amount being transferred out
   */
  @Column({ type: 'integer' })
  amount!: number

  /**
   * Currency of the primary amount
   */
  @Column({ type: 'varchar', length: 3 })
  currency!: string

  /**
   * For TRANSFER transactions with currency exchange:
   * The amount received in the target account
   * Stored as integer (multiply by currency multiplier)
   */
  @Column({ type: 'integer', nullable: true })
  targetAmount!: number | null

  /**
   * Currency of the target amount (for currency exchange)
   */
  @Column({ type: 'varchar', length: 3, nullable: true })
  targetCurrency!: string | null

  /**
   * Discount/coupon amount (for expenses)
   * Stored as integer (multiply by currency multiplier)
   */
  @Column({ type: 'integer', default: 0 })
  discountAmount!: number

  /**
   * Service fee/handling fee
   * Stored as integer (multiply by currency multiplier)
   */
  @Column({ type: 'integer', default: 0 })
  feeAmount!: number

  @Column({ type: 'varchar', length: 500, nullable: true })
  description!: string | null

  @Column({ type: 'text', nullable: true })
  notes!: string | null

  /**
   * Date of the transaction (YYYY-MM-DD)
   */
  @Column({ type: 'date' })
  transactionDate!: string

  /**
   * Time of the transaction (HH:MM:SS), optional
   */
  @Column({ type: 'varchar', length: 8, nullable: true })
  transactionTime!: string | null

  /**
   * Whether this transaction is marked/starred
   */
  @Column({ type: 'boolean', default: false })
  isMarked!: boolean

  /**
   * Whether this transaction needs review
   */
  @Column({ type: 'boolean', default: false })
  needsReview!: boolean

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  // Relations
  @Column({ type: 'varchar', length: 36 })
  ledgerId!: string

  @ManyToOne('Ledger', 'transactions')
  @JoinColumn({ name: 'ledgerId' })
  ledger!: Promise<Ledger>

  @Column({ type: 'varchar', length: 36 })
  creatorId!: string

  @ManyToOne('User', 'transactions')
  @JoinColumn({ name: 'creatorId' })
  creator!: Promise<User>

  /**
   * Source account (for EXPENSE and TRANSFER)
   */
  @Column({ type: 'varchar', length: 36, nullable: true })
  fromAccountId!: string | null

  @ManyToOne('Account', 'outgoingTransactions')
  @JoinColumn({ name: 'fromAccountId' })
  fromAccount!: Promise<Account | null>

  /**
   * Target account (for INCOME and TRANSFER)
   */
  @Column({ type: 'varchar', length: 36, nullable: true })
  toAccountId!: string | null

  @ManyToOne('Account', 'incomingTransactions')
  @JoinColumn({ name: 'toAccountId' })
  toAccount!: Promise<Account | null>

  /**
   * Category for this transaction
   */
  @Column({ type: 'varchar', length: 36, nullable: true })
  categoryId!: string | null

  @ManyToOne('Category', 'transactions')
  @JoinColumn({ name: 'categoryId' })
  category!: Promise<Category | null>

  /**
   * Reference to original transaction (for REFUND and REIMBURSEMENT)
   */
  @Column({ type: 'varchar', length: 36, nullable: true })
  originalTransactionId!: string | null

  @ManyToOne('Transaction', 'relatedTransactions')
  @JoinColumn({ name: 'originalTransactionId' })
  originalTransaction!: Promise<Transaction | null>

  @ManyToMany('Tag', 'transactions')
  @JoinTable({
    name: 'transaction_tags',
    joinColumn: { name: 'transactionId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tagId', referencedColumnName: 'id' }
  })
  tags!: Promise<Tag[]>
}
