/**
 * APIManager - Static API Collection Registry and Router
 * Allows global registration and routing of APICollection instances
 */

import { APICollection } from './APICollection';
import { ApiCollectionConfig } from './types';

export class APIManager {
  private static collectionRegistry: Map<string, APICollection> = new Map();
  private static defaultCollection: APICollection | null = null;

  /**
   * Register an APICollection instance by name
   */
  static register(collectionConfig: ApiCollectionConfig) {
    const collection = new APICollection(collectionConfig)
    const collectionName = collection.getName();
    if (this.collectionRegistry.has(collectionName)) {
      throw new Error(`APICollection with name '${collectionName}' is already registered.`);
    }
    this.collectionRegistry.set(collectionName, collection);
    if (this.collectionRegistry.size === 1) {
      this.defaultCollection = collection;
    }
    return collection;
  }

  /**
   * Set the default collection (required if more than one collection is registered)
   */
  static setDefaultCollection(name: string) {
    const collection = this.collectionRegistry.get(name);
    if (!collection) throw new Error(`APICollection '${name}' is not registered`);
    this.defaultCollection = collection;
  }

  /**
   * Get a collection by name (or default)
   */
  static getCollection(name?: string | null): APICollection {
    if (!name) {
      if (!this.defaultCollection) {
        throw new Error('No default APICollection set');
      }
      return this.defaultCollection;
    }
    const collection = this.collectionRegistry.get(name);
    if (!collection) throw new Error(`APICollection '${name}' is not registered`);
    return collection;
  }

  /**
   * Parse a full API name in the form 'collection:name' or just 'name'
   */
  private static parseApiName(apiName: string): { collection: APICollection, name: string } {
    const [collectionName, apiShortName] = apiName.includes(':') ? apiName.split(/:(.+)/) : [null, apiName];
    const collection = this.getCollection(collectionName);
    return { collection, name: apiShortName };
  }

  /**
   * Route query calls
   */
  static query<T = any>(apiName: string, params?: any) {
    const { collection, name } = this.parseApiName(apiName);
    return collection.query<T>(name, params);
  }
  /**
   * Route query calls
   */
  static queryItem<T = any>(apiName: string, itemId: string, params?: any) {
    const { collection, name } = this.parseApiName(apiName);
    return collection.queryItem<T>(name, itemId, params);
  }

  /**
   * Route queryMeta calls
   */
  static queryMeta<T = any>(apiName: string, params?: any) {
    const { collection, name } = this.parseApiName(apiName);
    return collection.queryMeta<T>(name, params);
  }

  /**
   * Route send calls
   */
  static send<T = any>(apiName: string, data?: any, params?: any) {
    const { collection, name } = this.parseApiName(apiName);
    return collection.send<T>(name, data, params);
  }

  /**
   * Route request calls
   */
  static request<T = any>(apiName: string, data?: any, params?: any) {
    const { collection, name } = this.parseApiName(apiName);
    return collection.request<T>(name, data, params);
  }

  /**
   * Route subscribe calls
   */
  static subscribe<T = any>(apiName: string, channel?: string, params?: any) {
    const { collection, name } = this.parseApiName(apiName);
    return collection.subscribe<T>(name, channel, params);
  }

  /**
   * Route publish calls
   */
  static publish<T = any>(apiName: string, channel?: string, params?: any) {
    const { collection, name } = this.parseApiName(apiName);
    return collection.publish<T>(name, channel, params);
  }

  /**
   * List all registered collections
   */
  static listCollections(): string[] {
    return Array.from(this.collectionRegistry.keys());
  }

  /**
   * Clear all registered collections (for testing or re-init)
   */
  static clear() {
    this.collectionRegistry.clear();
    this.defaultCollection = null;
  }
}
