import { BaseCRUDService } from './BaseCRUDService';
import { Category, CategoryType } from '../entities';
import type { DataSource, DeepPartial } from 'typeorm/browser';

/**
 * Service for managing Category entities
 */
export class CategoryService extends BaseCRUDService<Category, string> {
    readonly Entity = Category;

    constructor(engine: DataSource) {
        super(engine);
    }

    key(id: string) {
        return { id };
    }

    /**
     * Find all categories for a specific ledger
     */
    async findByLedgerId(ledgerId: string): Promise<Category[]> {
        return this.repository.find({
            where: { ledgerId, isActive: true },
            order: { sortOrder: 'ASC', name: 'ASC' },
        });
    }

    /**
     * Find categories by type within a ledger
     */
    async findByType(ledgerId: string, categoryType: CategoryType): Promise<Category[]> {
        return this.repository.find({
            where: { ledgerId, categoryType, isActive: true },
            order: { sortOrder: 'ASC', name: 'ASC' },
        });
    }

    /**
     * Find root categories (no parent) within a ledger
     */
    async findRootCategories(ledgerId: string, categoryType?: CategoryType): Promise<Category[]> {
        const where: Record<string, unknown> = {
            ledgerId,
            parentId: null,
            isActive: true,
        };
        if (categoryType) {
            where.categoryType = categoryType;
        }
        return this.repository.find({
            where,
            order: { sortOrder: 'ASC', name: 'ASC' },
        });
    }

    /**
     * Find child categories of a parent
     */
    async findChildren(parentId: string): Promise<Category[]> {
        return this.repository.find({
            where: { parentId, isActive: true },
            order: { sortOrder: 'ASC', name: 'ASC' },
        });
    }

    /**
     * Create a new category
     */
    async createCategory(data: Omit<DeepPartial<Category>, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
        return this.create(data);
    }

    /**
     * Update category sort order
     */
    async updateSortOrder(id: string, sortOrder: number): Promise<Category | null> {
        return this.update(id, { sortOrder });
    }

    /**
     * Move category to a different parent
     */
    async moveToParent(id: string, parentId: string | null): Promise<Category | null> {
        return this.update(id, { parentId });
    }

    /**
     * Archive a category
     */
    async archiveCategory(id: string): Promise<Category | null> {
        return this.update(id, { isActive: false });
    }

    /**
     * Restore an archived category
     */
    async restoreCategory(id: string): Promise<Category | null> {
        return this.update(id, { isActive: true });
    }
}
