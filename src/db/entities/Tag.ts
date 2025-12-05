import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany } from 'typeorm/browser';
import type { Transaction } from './Transaction';

/**
 * Tag entity for labeling transactions
 * Tags provide a flexible way to mark and filter transactions
 */
@Entity('tags')
export class Tag {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 50 })
    name!: string;

    @Column({ type: 'varchar', length: 7, nullable: true })
    color!: string | null;

    @Column({ type: 'varchar', length: 10, nullable: true })
    icon!: string | null;

    @Column({ type: 'int', default: 0 })
    sortOrder!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    // Relations
    @ManyToMany('Transaction', 'tags')
    transactions!: Promise<Transaction[]>;
}
