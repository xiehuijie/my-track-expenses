import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm/browser';
import type { Ledger } from './Ledger';
import type { Transaction } from './Transaction';

/**
 * User entity for multi-user accounting
 */
@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 100 })
    name!: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    email!: string | null;

    @Column({ type: 'varchar', length: 500, nullable: true })
    avatar!: string | null;

    @Column({ type: 'boolean', default: true })
    isActive!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    // Relations (defined with lazy loading to avoid circular dependency issues)
    @OneToMany('Ledger', 'owner')
    ledgers!: Promise<Ledger[]>;

    @OneToMany('Transaction', 'creator')
    transactions!: Promise<Transaction[]>;
}
