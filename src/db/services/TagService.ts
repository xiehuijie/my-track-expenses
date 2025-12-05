import { BaseCRUDService } from './BaseCRUDService';
import { Tag } from '../entities';
import type { DataSource, DeepPartial } from 'typeorm/browser';

/**
 * Service for managing Tag entities
 */
export class TagService extends BaseCRUDService<Tag, string> {
    readonly Entity = Tag;

    constructor(engine: DataSource) {
        super(engine);
    }

    key(id: string) {
        return { id };
    }

    /**
     * Find all tags ordered by sort order
     */
    async findAllOrdered(): Promise<Tag[]> {
        return this.repository.find({
            order: { sortOrder: 'ASC', name: 'ASC' },
        });
    }

    /**
     * Find tag by name
     */
    async findByName(name: string): Promise<Tag | null> {
        return this.repository.findOne({
            where: { name },
        });
    }

    /**
     * Create a new tag
     */
    async createTag(data: Omit<DeepPartial<Tag>, 'id' | 'createdAt' | 'updatedAt'>): Promise<Tag> {
        return this.create(data);
    }

    /**
     * Update tag sort order
     */
    async updateSortOrder(id: string, sortOrder: number): Promise<Tag | null> {
        return this.update(id, { sortOrder });
    }

    /**
     * Find or create a tag by name
     */
    async findOrCreate(name: string, color?: string): Promise<Tag> {
        const existing = await this.findByName(name);
        if (existing) {
            return existing;
        }
        return this.createTag({ name, color });
    }
}
