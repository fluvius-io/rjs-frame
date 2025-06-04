/**
 * APICollection - Configuration-driven API Management System
 * Provides unified interface for HTTP requests, real-time communication, and API workflows
 */

import { RTCConnectionFactory } from './rtc/RTCConnectionFactory';
import {
  ApiCollectionConfig,
  ApiError,
  ApiParams,
  ApiPayload,
  ApiResponse,
  CommandConfig,
  ConfigurationError,
  DataProcessor,
  HeaderProcessor,
  QueryConfig,
  RequestConfig,
  ResponseProcessor,
  RTCConnection,
  SocketConfig,
  SubscriptionHandler,
  UnsubscribeFunction,
  UriGenerator
} from './types';

export class APICollection {
  private config: any;
  private rtcConnections = new Map<string, RTCConnection>();
  private metadataCache = new Map<string, { data: any; timestamp: number }>();
  private debug: boolean;

  constructor(config: any) {
    this.config = this.validateConfig(config);
    this.debug = config.debug ?? false;
  }

  // ===== COMMAND METHODS (POST requests) =====

  /**
   * Send a command to the server
   * @param commandName Name of the command from configuration
   * @param data Data to send with the command
   * @param params Additional parameters for URI generation
   */
  async send<T = any>(
    commandName: string, 
    data?: ApiPayload, 
    params?: ApiParams
  ): Promise<ApiResponse<T>> {
    const commandConfig = this.getCommandConfig(commandName);
    
    const uri = this.resolveUri(commandConfig.uri, params);
    const headers = this.resolveHeaders(commandConfig.headers, params);
    const processedData = this.resolveData(commandConfig.data, data);

    try {
      const response = await fetch(uri, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: processedData ? JSON.stringify(processedData) : undefined
      });

      const apiResponse = await this.createResponse<T>(response, commandConfig.response);
      
      return apiResponse;
    } catch (error) {
      throw new ApiError(`Command '${commandName}' failed: ${error}`, undefined, error);
    }
  }

  // ===== QUERY METHODS (GET requests with metadata) =====

  /**
   * Query data from the server
   * @param queryName Name of the query from configuration
   * @param params Parameters for URI generation and query parameters
   */
  async query<T = any>(
    queryName: string, 
    params?: ApiParams
  ): Promise<ApiResponse<T>> {
    const queryConfig = this.getQueryConfig(queryName);
    
    const uri = this.resolveUri(queryConfig.uri, params);
    const headers = this.resolveHeaders(queryConfig.headers, params);

    try {
      const response = await fetch(uri, {method: 'GET', headers});
      return await this.createResponse<T>(response, queryConfig.response);
    } catch (error) {
      throw new ApiError(`Query '${queryName}' failed: ${error}`, undefined, error);
    }
  }

  /**
   * Get metadata for a query
   * @param queryName Name of the query from configuration
   * @param params Parameters for URI generation
   */
  async getQueryMetadata<T = any>(
    queryName: string, 
    params?: ApiParams
  ): Promise<ApiResponse<T>> {
    const queryConfig = this.getQueryConfig(queryName);
    
    if (!queryConfig.meta) {
      throw new ConfigurationError(`Query '${queryName}' has no metadata configuration`);
    }

    const uri = this.resolveUri(queryConfig.meta, params);
    const headers = this.resolveHeaders(queryConfig.headers, params);

    try {
      const response = await fetch(uri, {method: 'GET', headers});
      return await this.createResponse<T>(response, queryConfig.response);
    } catch (error) {
      throw new ApiError(`Query metadata '${queryName}' failed: ${error}`, undefined, error);
    }
  }

  /**
   * Get metadata for a query with caching
   * Metadata is cached until the end of the session to improve performance
   * @param queryName Name of the query from configuration
   * @param params Parameters for URI generation
   */
  async queryMeta<T = any>(
    queryName: string, 
    params?: ApiParams
  ): Promise<ApiResponse<T>> {
    // Create cache key based on query name and parameters
    // Check if metadata is already cached

    // If not cached, fetch the metadata
    const queryConfig = this.getQueryConfig(queryName);
    
    if (!queryConfig.meta) {
      throw new ConfigurationError(`Query '${queryName}' has no metadata configuration`);
    }

    const uri = this.resolveUri(queryConfig.meta, params);
    const headers = this.resolveHeaders(queryConfig.headers, params);
    const cacheKey = this.generateMetadataCacheKey(uri, headers);

    if (this.metadataCache.has(cacheKey)) {
      const cached = this.metadataCache.get(cacheKey)!;
      this.log(`📋 Using cached metadata for query '${queryName}'`);
      
      return {
        data: cached.data,
        status: 200,
        statusText: 'OK (Cached)',
        headers: new Headers(),
      };
    }

    try {
      const response = await fetch(uri, {method: 'GET', headers});
      const apiResponse = await this.createResponse<T>(response, queryConfig.response);
      
      // Cache the metadata
      this.metadataCache.set(cacheKey, {
        data: apiResponse.data,
        timestamp: Date.now()
      });
      
      this.log(`📋 Cached metadata for query '${queryName}'`);
      
      return apiResponse;
    } catch (error) {
      throw new ApiError(`Query metadata '${queryName}' failed: ${error}`, undefined, error);
    }
  }

  // ===== REAL-TIME COMMUNICATION METHODS =====

  /**
   * Subscribe to a real-time communication channel
   * @param socketName Name of the socket from configuration
   * @param channel Channel to subscribe to
   * @param params Parameters for connection
   */
  subscribe<T = any>(
    socketName: string, 
    channel?: string, 
    params?: ApiParams
  ) {
    return (handler: SubscriptionHandler): UnsubscribeFunction => {
      const connection = this.getRTCConnection(socketName, params);
      const channelName = channel || 'default';
      
      // Ensure connection is established
      if (!connection.isConnected()) {
        connection.connect().catch(error => {
          console.error(`Failed to connect to socket '${socketName}':`, error);
        });
      }

      return connection.subscribe(channelName, handler);
    };
  }

  /**
   * Publish a message to a real-time communication channel
   * @param socketName Name of the socket from configuration
   * @param channel Channel to publish to
   * @param params Parameters for connection
   */
  publish<T = any>(
    socketName: string, 
    channel?: string, 
    params?: ApiParams
  ) {
    return (message: T): void => {
      const connection = this.getRTCConnection(socketName, params);
      const channelName = channel || 'default';
      
      if (!connection.isConnected()) {
        throw new ApiError(`Socket '${socketName}' is not connected`);
      }

      connection.publish(channelName, message);
    };
  }

  // ===== GENERAL REQUEST METHODS =====

  /**
   * Make a general HTTP request
   * @param requestName Name of the request from configuration
   * @param data Data to send with the request
   * @param params Additional parameters for URI generation
   */
  async request<T = any>(
    requestName: string, 
    data?: ApiPayload, 
    params?: ApiParams
  ): Promise<ApiResponse<T>> {
    const requestConfig = this.getRequestConfig(requestName);
    
    const uri = this.resolveUri(requestConfig.uri, params);
    const headers = this.resolveHeaders(requestConfig.headers, params);
    const processedData = this.resolveData(requestConfig.data, data);

    const method = requestConfig.method || 'GET';
    const hasBody = ['POST', 'PUT', 'PATCH'].includes(method);

    try {
      const response = await fetch(uri, {
        method: method,
        headers: {
          ...(hasBody && processedData ? { 'Content-Type': 'application/json' } : {}),
          ...headers
        },
        body: hasBody && processedData ? JSON.stringify(processedData) : undefined
      });

      return await this.createResponse<T>(response, requestConfig.response);
    } catch (error) {
      throw new ApiError(`Request '${requestName}' failed: ${error}`, undefined, error);
    }
  }

  // ===== UTILITY METHODS =====

  /**
   * Get the base URL for this API manager
   */
  getBaseUrl(): string {
    return this.config.baseUrl || '';
  }

  /**
   * Get the name of this API manager
   */
  getName(): string {
    return this.config.name;
  }

  /**
   * Disconnect all real-time connections
   */
  disconnectAll(): void {
    this.rtcConnections.forEach((connection, name) => {
      this.log(`🔌 Disconnecting ${name}`);
      connection.disconnect();
    });
    this.rtcConnections.clear();
  }

  /**
   * Clear all cached metadata
   */
  clearMetadataCache(): void {
    this.metadataCache.clear();
    this.log(`🗑️ Metadata cache cleared`);
  }

  /**
   * Get metadata cache statistics
   */
  getMetadataCacheStats(): { size: number; entries: string[] } {
    return {
      size: this.metadataCache.size,
      entries: Array.from(this.metadataCache.keys())
    };
  }

  // ===== PRIVATE HELPER METHODS =====

  private validateConfig(config: any): any {
    if (!config.name) {
      throw new ConfigurationError('API Manager name is required');
    }
    
    // Validate that at least one operation type is configured
    const hasOperations = config.commands || config.queries || config.sockets || config.requests;
    if (!hasOperations) {
      throw new ConfigurationError('At least one operation type (commands, queries, sockets, requests) must be configured');
    }
    return config;
  }

  private getCommandConfig(commandName: string): CommandConfig {
    if (!this.config.commands || !this.config.commands[commandName]) {
      throw new ConfigurationError(`Command '${commandName}' not found in configuration`);
    }
    return this.config.commands[commandName];
  }

  private getQueryConfig(queryName: string): QueryConfig {
    if (!this.config.queries || !this.config.queries[queryName]) {
      throw new ConfigurationError(`Query '${queryName}' not found in configuration`);
    }
    return this.config.queries[queryName];
  }

  private getSocketConfig(socketName: string): SocketConfig {
    if (!this.config.sockets || !this.config.sockets[socketName]) {
      throw new ConfigurationError(`Socket '${socketName}' not found in configuration`);
    }
    return this.config.sockets[socketName];
  }

  private getRequestConfig(requestName: string): RequestConfig {
    if (!this.config.requests || !this.config.requests[requestName]) {
      throw new ConfigurationError(`Request '${requestName}' not found in configuration`);
    }
    return this.config.requests[requestName];
  }

  private resolveUri(
    uri: UriGenerator,
    params?: ApiParams
  ): string {
    let url: string;

    if (typeof uri === 'function') {
        url = uri(params)
    } else {
        url = uri
    }

    if (url.includes('?')) {
        throw new ConfigurationError(`URI '${url}' contains a query string. Use ApiParams.search parameter instead.`);
    }

    if (params?.search) {
        let urlParams = new URLSearchParams(params.search);
        url = url + '?' + urlParams.toString();
    }

    let pathParams = params?.path || {};
    url = url.replace(/{(\w+)}/g, (match, key) => {
      if (pathParams[key]) {
        return pathParams[key];
      } else {
        throw new ConfigurationError(`Path parameter '${match}' not provided`);
      }
    });

    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url
    }

    return (this.config.baseUrl || '') + url
  }

  private resolveHeaders(
    headerProcessor?: HeaderProcessor,
    params?: ApiParams
  ): Record<string, string> {
    let headers = {};

    if (typeof this.config.processHeaders === 'function') {
      headers = this.config.processHeaders(params, headers);
    }

    if (typeof headerProcessor === 'function') {
      headers = headerProcessor(params, headers);
    }

    if (params?.headers) {
      headers = {...headers, ...params.headers};
    }

    return headers;
  }

  private resolveData(
    dataProcessor?: DataProcessor,
    userData?: ApiPayload
  ): any {
    let data = userData;

    if (typeof this.config.processData === 'function') {
      data = this.config.processData(userData);
    }

    if (typeof dataProcessor === 'function') {
      data = dataProcessor(data);
    }

    return data;
  }

  private async createResponse<T>(response: Response, responseProcessor?: ResponseProcessor): Promise<ApiResponse<T>> {
    if (!response.ok) {
      const errorText = await response.text();
      throw new ApiError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorText
      );
    }

    let apiResponse: ApiResponse<T> = {
      data: await response.json(),
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    }

    if (typeof this.config.processResponse === 'function') {
      apiResponse = this.config.processResponse(apiResponse);
    }

    if (typeof responseProcessor === 'function') {
      apiResponse = responseProcessor(apiResponse)
    }

    return apiResponse;
  }

  private getRTCConnection(socketName: string, params?: ApiParams): RTCConnection {
    if (!this.rtcConnections.has(socketName)) {
      const socketConfig = this.getSocketConfig(socketName);
      const connection = RTCConnectionFactory.create(socketConfig, this.config.baseUrl || '', params);
      this.rtcConnections.set(socketName, connection);
    }

    return this.rtcConnections.get(socketName)!;
  }

  /**
   * Generate a cache key for metadata based on query name and parameters
   * @param queryName Name of the query
   * @param params Parameters for URI generation
   */
  private generateMetadataCacheKey(uri: string, headers?: Record<string, string>): string {
    if (!headers || Object.keys(headers).length === 0) {
      return uri;
    }
    
    // Sort parameters to ensure consistent cache keys
    const sortedHeaders = Object.keys(headers)
      .sort()
      .reduce((sorted, key) => {
        sorted[key] = headers[key];
        return sorted;
      }, {} as Record<string, string>);
    
    return `${uri}:${JSON.stringify(sortedHeaders)}`;
  }

  /**
   * Log debug messages only when debug mode is enabled
   * @param message The message to log
   * @param optionalParams Additional parameters to log
   */
  private log(message: string, ...optionalParams: any[]): void {
    if (this.debug) {
      console.log(message, ...optionalParams);
    }
  }
}

/**
 * APIManager - Static API Collection Registry and Router
 * Allows global registration and routing of APICollection instances
 */
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
