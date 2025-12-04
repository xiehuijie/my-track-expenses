import type { ObjectLiteral, EntityTarget, DataSource, FindOptionsWhere, Repository, DeepPartial } from 'typeorm/browser'

/**
 * Base CRUD service class providing common database operations
 */
export abstract class BaseCRUDService<Entity extends ObjectLiteral, PK> {
  protected engine: DataSource
  abstract readonly Entity: EntityTarget<Entity>

  constructor(engine: DataSource) {
    this.engine = engine
  }

  /**
   * Construct a where clause from primary key
   */
  abstract key(primaryKey: PK): FindOptionsWhere<Entity>

  /**
   * Get the repository for this entity
   */
  get repository(): Repository<Entity> {
    return this.engine.getRepository(this.Entity)
  }

  /**
   * Find one entity by primary key
   */
  async findById(primaryKey: PK): Promise<Entity | null> {
    return this.repository.findOne({ where: this.key(primaryKey) })
  }

  /**
   * Find all entities
   */
  async findAll(): Promise<Entity[]> {
    return this.repository.find()
  }

  /**
   * Check if entity exists by primary key
   */
  async exists(primaryKey: PK): Promise<boolean> {
    return (await this.findById(primaryKey)) !== null
  }

  /**
   * Create a new entity
   */
  async create(data: DeepPartial<Entity>): Promise<Entity> {
    const entity = this.repository.create(data)
    return this.repository.save(entity)
  }

  /**
   * Update an existing entity
   */
  async update(primaryKey: PK, data: DeepPartial<Entity>): Promise<Entity | null> {
    await this.repository.update(this.key(primaryKey), data as never)
    return this.findById(primaryKey)
  }

  /**
   * Delete an entity by primary key
   */
  async delete(primaryKey: PK): Promise<boolean> {
    const result = await this.repository.delete(this.key(primaryKey))
    return (result.affected ?? 0) > 0
  }
}
