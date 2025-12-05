import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm/browser';
import type { Ledger } from './Ledger';
import type { Transaction } from './Transaction';

/**
 * Account types enumeration
 */
export enum AccountType {
    /** Regular balance account (cash, bank account, etc.) */
    BALANCE = 'balance',
    /** Credit card account */
    CREDIT_CARD = 'credit_card',
    /** Investment/financial account */
    INVESTMENT = 'investment',
    /** Borrowed money (money owed to you) */
    LOAN_OUT = 'loan_out',
    /** Lent money (money you owe) */
    LOAN_IN = 'loan_in',
    /** Other account types */
    OTHER = 'other',
}

/**
 * Account entity for tracking financial accounts
 * Each account belongs to a ledger and has a specific currency
 */
@Entity('accounts')
export class Account {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 100 })
    name!: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    description!: string | null;

    @Column({ type: 'varchar', length: 10, nullable: true })
    icon!: string | null;

    @Column({
        type: 'varchar',
        length: 20,
        default: AccountType.BALANCE,
    })
    accountType!: AccountType;

    @Column({ type: 'varchar', length: 3 })
    currency!: string;

    /**
     * Initial balance when the account was created
     * Stored as integer (multiply by currency multiplier)
     */
    @Column({ type: 'integer', default: 0 })
    initialBalance!: number;

    /**
     * Current balance of the account
     * Stored as integer (multiply by currency multiplier)
     * This is a cached/computed value based on transactions
     */
    @Column({ type: 'integer', default: 0 })
    currentBalance!: number;

    /**
     * Credit limit for credit card accounts
     * Stored as integer (multiply by currency multiplier)
     */
    @Column({ type: 'integer', nullable: true })
    creditLimit!: number | null;

    /**
     * Billing day for credit card accounts (1-31)
     */
    @Column({ type: 'integer', nullable: true })
    billingDay!: number | null;

    @Column({ type: 'boolean', default: true })
    isActive!: boolean;

    @Column({ type: 'boolean', default: true })
    includeInTotal!: boolean;

    @Column({ type: 'int', default: 0 })
    sortOrder!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    // Relations
    @Column({ type: 'varchar', length: 36 })
    ledgerId!: string;

    @ManyToOne('Ledger', 'accounts')
    @JoinColumn({ name: 'ledgerId' })
    ledger!: Promise<Ledger>;

    @OneToMany('Transaction', 'fromAccount')
    outgoingTransactions!: Promise<Transaction[]>;

    @OneToMany('Transaction', 'toAccount')
    incomingTransactions!: Promise<Transaction[]>;
}
