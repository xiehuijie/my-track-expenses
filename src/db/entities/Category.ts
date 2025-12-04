import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm/browser'
import type { Ledger } from './Ledger'
import type { Transaction } from './Transaction'

/**
 * Category types enumeration
 */
export enum CategoryType {
  /** Expense category */
  EXPENSE = 'expense',
  /** Income category */
  INCOME = 'income'
}

/**
 * Category entity for classifying transactions
 * Supports hierarchical categories with parent-child relationships
 */
@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 100 })
  name!: string

  @Column({ type: 'varchar', length: 10, nullable: true })
  icon!: string | null

  @Column({ type: 'varchar', length: 7, nullable: true })
  color!: string | null

  @Column({
    type: 'varchar',
    length: 10,
    default: CategoryType.EXPENSE
  })
  categoryType!: CategoryType

  @Column({ type: 'boolean', default: true })
  isActive!: boolean

  @Column({ type: 'int', default: 0 })
  sortOrder!: number

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  // Relations
  @Column({ type: 'varchar', length: 36 })
  ledgerId!: string

  @ManyToOne('Ledger', 'categories')
  @JoinColumn({ name: 'ledgerId' })
  ledger!: Promise<Ledger>

  @Column({ type: 'varchar', length: 36, nullable: true })
  parentId!: string | null

  @ManyToOne('Category', 'children')
  @JoinColumn({ name: 'parentId' })
  parent!: Promise<Category | null>

  @OneToMany('Category', 'parent')
  children!: Promise<Category[]>

  @OneToMany('Transaction', 'category')
  transactions!: Promise<Transaction[]>
}
