import { generateUuid } from '../utils/uuid.utils';

/**
 * Base repository interface defining common CRUD operations
 * @template T - Entity type
 */
export interface IBaseRepository<T> {
  /**
   * Find all entities
   * @returns Promise with array of entities
   */
  findAll(): Promise<T[]>;

  /**
   * Find an entity by ID
   * @param id - Entity ID
   * @returns Promise with entity or null if not found
   */
  findById(id: string): Promise<T | null>;

  /**
   * Create a new entity
   * @param entity - Entity data to create
   * @returns Promise with created entity
   */
  create(entity: Omit<T, 'id'>): Promise<T>;

  /**
   * Update an existing entity
   * @param id - Entity ID
   * @param entity - Partial entity data to update
   * @returns Promise with updated entity or null if not found
   */
  update(id: string, entity: Partial<Omit<T, 'id'>>): Promise<T | null>;

  /**
   * Delete an entity by ID
   * @param id - Entity ID
   * @returns Promise with boolean indicating if entity was deleted
   */
  delete(id: string): Promise<boolean>;

  /**
   * Check if an entity exists by ID
   * @param id - Entity ID
   * @returns Promise with boolean indicating if entity exists
   */
  exists(id: string): Promise<boolean>;
}

/**
 * Abstract base repository implementation for in-memory storage
 * @template T - Entity type that must have an 'id' property
 */
export abstract class BaseInMemoryRepository<T extends { id: string }> implements IBaseRepository<T> {
  protected readonly storage: Map<string, T> = new Map();

  async findAll(): Promise<T[]> {
    return Array.from(this.storage.values());
  }

  async findById(id: string): Promise<T | null> {
    return this.storage.get(id) || null;
  }

  async create(entity: Omit<T, 'id'>): Promise<T> {
    const id = this.generateId();
    const newEntity = { ...entity, id } as T;
    this.storage.set(id, newEntity);
    return newEntity;
  }

  async update(id: string, entity: Partial<Omit<T, 'id'>>): Promise<T | null> {
    const existing = this.storage.get(id);
    if (!existing) {
      return null;
    }
    const updated = { ...existing, ...entity };
    this.storage.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.storage.delete(id);
  }

  async exists(id: string): Promise<boolean> {
    return this.storage.has(id);
  }

  /**
   * Generate a unique ID for new entities
   * Uses UUID v4 by default, can be overridden by subclasses if different ID generation is needed
   * @returns Unique ID string
   */
  protected generateId(): string {
    return generateUuid();
  }

  /**
   * Clear all data from storage (useful for testing)
   */
  clear(): void {
    this.storage.clear();
  }
}
