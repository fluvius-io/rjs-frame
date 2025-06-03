/**
 * API Manager - Comprehensive API Management System
 * Handles commands, queries, real-time communication, and general HTTP requests
 */

import { RTCConnectionFactory } from './rtc/RTCConnectionFactory';
import {
    ApiData,
    ApiError,
    ApiManagerConfig,
    ApiParams,
    ApiResponse,
    CommandConfig,
    ConfigurationError,
    DataSchema,
    HeaderConfig,
    QueryConfig,
    RequestConfig,
    ResponseProcessor,
    RTCConnection,
    SocketConfig,
    SubscriptionHandler,
    UnsubscribeFunction,
    UriGenerator,
    ValidationError
} from './types';

export class APIManager {
  private config: ApiManagerConfig;
  private rtcConnections = new Map<string, RTCConnection>();

  constructor(config: ApiManagerConfig) {
    this.config = this.validateConfig(config);
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
    data?: ApiData, 
    params?: ApiParams
  ): Promise<ApiResponse<T>> {
    const commandConfig = this.getCommandConfig(commandName);
    
    const uri = this.resolveUri(commandConfig.uri, params);
    const headers = this.resolveHeaders(commandConfig.header, params);
    const processedData = this.processData(commandConfig.data, data);

    try {
      const response = await fetch(uri, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: processedData ? JSON.stringify(processedData) : undefined
      });

      const apiResponse = await this.createApiResponse<T>(response, commandConfig.resp);
      
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
    const headers = this.resolveHeaders(queryConfig.header, params);

    try {
      const response = await fetch(uri, {method: 'GET', headers});
      return await this.createApiResponse<T>(response, queryConfig.resp);
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
    const headers = this.resolveHeaders(queryConfig.header, params);

    try {
      const response = await fetch(uri, {method: 'GET', headers});

      return await this.createApiResponse<T>(response, queryConfig.resp);
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
    return (handler: SubscriptionHandler<T>): UnsubscribeFunction => {
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
    data?: ApiData, 
    params?: ApiParams
  ): Promise<ApiResponse<T>> {
    const requestConfig = this.getRequestConfig(requestName);
    
    const uri = this.resolveUri(requestConfig.uri, params);
    const headers = this.resolveHeaders(requestConfig.header, params);
    const processedData = this.processData(requestConfig.data, data);

    const requiresBody = ['POST', 'PUT', 'PATCH'].includes(requestConfig.method);

    try {
      const response = await fetch(uri, {
        method: requestConfig.method,
        headers: {
          ...(requiresBody && processedData ? { 'Content-Type': 'application/json' } : {}),
          ...headers
        },
        body: requiresBody && processedData ? JSON.stringify(processedData) : undefined
      });

      const apiResponse = await this.createApiResponse<T>(response, requestConfig.resp);
      
      return apiResponse;
    } catch (error) {
      throw new ApiError(`Request '${requestName}' failed: ${error}`, undefined, error);
    }
  }

  // ===== UTILITY METHODS =====

  /**
   * Get the base URL for this API manager
   */
  getBaseUrl(): string {
    return this.config.baseUrl;
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
      console.log(`🔌 Disconnecting ${name}`);
      connection.disconnect();
    });
    this.rtcConnections.clear();
  }

  // ===== PRIVATE HELPER METHODS =====

  private validateConfig(config: ApiManagerConfig): ApiManagerConfig {
    if (!config.name) {
      throw new ConfigurationError('API Manager name is required');
    }
    if (!config.baseUrl) {
      throw new ConfigurationError('API Manager baseUrl is required');
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

    if (typeof uri !== 'string') {
        url = uri(params)
    } else {
        url = uri
    }

    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url
    }

    return this.config.baseUrl + url
  }

  private resolveHeaders(
    headerConfig?: HeaderConfig,
    params?: ApiParams
  ): Record<string, string> {
    if (!headerConfig) {
      return {};
    }

    if (typeof headerConfig === 'function') {
      return headerConfig(params);
    }

    return headerConfig;
  }

  private processData(
    dataConfig?: DataSchema,
    userData?: ApiData
  ): any {
    if (!dataConfig) {
      return userData;
    }

    // If dataConfig is a mapping (plain object), use it as is
    if (typeof dataConfig === 'object' && !Array.isArray(dataConfig) && typeof dataConfig !== 'function') {
      return dataConfig;
    }

    // If dataConfig is a function, run it with user data
    // Function should throw exception if data is invalid, otherwise return processed data
    if (typeof dataConfig === 'function') {
      if (userData === undefined) {
        throw new ValidationError('Data is required for this operation');
      }
      
      // Function handles validation by throwing exceptions and returns processed data
      return dataConfig(userData);
    }

    return userData;
  }

  private async createApiResponse<T>(response: Response, processor?: ResponseProcessor<T>): Promise<ApiResponse<T>> {
    if (!response.ok) {
      const errorText = await response.text();
      throw new ApiError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorText
      );
    }

    let data = await response.json();

    if (processor) {
      data = processor(data)
    }

    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    };
  }

  private getRTCConnection(socketName: string, params?: ApiParams): RTCConnection {
    if (!this.rtcConnections.has(socketName)) {
      const socketConfig = this.getSocketConfig(socketName);
      const connection = RTCConnectionFactory.create(socketConfig, this.config.baseUrl, params);
      this.rtcConnections.set(socketName, connection);
    }

    return this.rtcConnections.get(socketName)!;
  }
} 