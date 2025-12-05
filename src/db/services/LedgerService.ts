import { BaseCRUDService } from './BaseCRUDService';
import { Ledger } from '../entities';
import type { DataSource, DeepPartial } from 'typeorm/browser';

/**
 * Service for managing Ledger entities
 */
export class LedgerService extends BaseCRUDService<Ledger, string> {
    readonly Entity = Ledger;

    constructor(engine: DataSource) {
        super(engine);
    }

    key(id: string) {
        return { id };
    }

    /**
     * Find all ledgers for a specific user
     */
    async findByOwnerId(ownerId: string): Promise<Ledger[]> {
        return this.repository.find({
            where: { ownerId, isActive: true },
            order: { sortOrder: 'ASC', name: 'ASC' },
        });
    }

    /**
     * Find all active ledgers
     */
    async findActiveLedgers(): Promise<Ledger[]> {
        return this.repository.find({
            where: { isActive: true },
            order: { sortOrder: 'ASC', name: 'ASC' },
        });
    }

    /**
     * Create a new ledger
     */
    async createLedger(data: Omit<DeepPartial<Ledger>, 'id' | 'createdAt' | 'updatedAt'>): Promise<Ledger> {
        return this.create(data);
    }

    /**
     * Update ledger sort order
     */
    async updateSortOrder(id: string, sortOrder: number): Promise<Ledger | null> {
        return this.update(id, { sortOrder });
    }

    /**
     * Archive a ledger (set isActive to false)
     */
    async archiveLedger(id: string): Promise<Ledger | null> {
        return this.update(id, { isActive: false });
    }

    /**
     * Restore an archived ledger
     */
    async restoreLedger(id: string): Promise<Ledger | null> {
        return this.update(id, { isActive: true });
    }
}
