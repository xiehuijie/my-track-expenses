import { BaseCRUDService } from './BaseCRUDService';
import { User } from '../entities';
import type { DataSource, DeepPartial } from 'typeorm/browser';

/**
 * Service for managing User entities
 */
export class UserService extends BaseCRUDService<User, string> {
    readonly Entity = User;

    constructor(engine: DataSource) {
        super(engine);
    }

    key(id: string) {
        return { id };
    }

    /**
     * Find user by email
     */
    async findByEmail(email: string): Promise<User | null> {
        return this.repository.findOne({
            where: { email },
        });
    }

    /**
     * Find all active users
     */
    async findActiveUsers(): Promise<User[]> {
        return this.repository.find({
            where: { isActive: true },
            order: { name: 'ASC' },
        });
    }

    /**
     * Create a new user
     */
    async createUser(data: Omit<DeepPartial<User>, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
        return this.create(data);
    }

    /**
     * Deactivate a user
     */
    async deactivateUser(id: string): Promise<User | null> {
        return this.update(id, { isActive: false });
    }

    /**
     * Activate a user
     */
    async activateUser(id: string): Promise<User | null> {
        return this.update(id, { isActive: true });
    }
}
