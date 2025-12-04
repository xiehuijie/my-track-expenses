import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm/browser'
import type { User } from './User'
import type { Account } from './Account'
import type { Transaction } from './Transaction'
import type { Category } from './Category'

/**
 * Ledger entity for organizing transactions into different books
 * Each ledger can have its own set of accounts, categories, and transactions
 */
@Entity('ledgers')
export class Ledger {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 100 })
  name!: string

  @Column({ type: 'varchar', length: 500, nullable: true })
  description!: string | null

  @Column({ type: 'varchar', length: 10, nullable: true })
  icon!: string | null

  @Column({ type: 'varchar', length: 3 })
  defaultCurrency!: string

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
  ownerId!: string

  @ManyToOne('User', 'ledgers')
  @JoinColumn({ name: 'ownerId' })
  owner!: Promise<User>

  @OneToMany('Account', 'ledger')
  accounts!: Promise<Account[]>

  @OneToMany('Transaction', 'ledger')
  transactions!: Promise<Transaction[]>

  @OneToMany('Category', 'ledger')
  categories!: Promise<Category[]>
}
