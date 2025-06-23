/**
 * APICollection - Configuration-driven API Management System
 * Provides unified interface for HTTP requests, real-time communication, and API workflows
 */

import { RTCConnectionFactory } from "./rtc/RTCConnectionFactory";
import {
  ApiCollectionConfig,
  ApiCollectionInterface,
  ApiError,
  ApiParams,
  ApiPayload,
  ApiResponse,
  CommandConfig,
  ConfigurationError,
  DataProcessor,
  HeaderProcessor,
  Publisher,
  QueryConfig,
  RequestConfig,
  ResponseProcessor,
  RTCConnection,
  SocketConfig,
  SubscriptionHandler,
  SubscriptionRegister,
  UnsubscribeFunction,
} from "./types";
import { resolveUrl } from "./utils";

export class APICollection implements ApiCollectionInterface {
  private config: ApiCollectionConfig;
  private rtcConnections = new Map<string, RTCConnection>();
  private queryCache = new Map<string, ApiResponse<any>>();

  constructor(config: ApiCollectionConfig) {
    this.config = this.validateConfig(config);
  }

  get debug(): boolean {
    return this.config.debug ?? false;
  }

  private defaultResponseProcessor = (response: any) => {
    let data = response.data;
    if (data && data.data) {
      response.data = data.data;
    }
    if (data && data.meta) {
      response.meta = data.meta;
    }
    if (data && data.pagination) {
      response.pagination = data.pagination;
    }
    return response;
  };

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

    const url =
      (this.config.baseUrl || "") +
      resolveUrl(commandConfig.path, commandConfig.uri, params);
    const headers = this.resolveHeaders(commandConfig.headers, params);
    const processedData = this.resolveData(commandConfig.data, data);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: processedData ? JSON.stringify(processedData) : undefined,
      });

      const apiResponse = await this.createResponse<T>(
        response,
        commandConfig.response
      );

      return apiResponse;
    } catch (error) {
      throw new ApiError(
        `Command '${commandName}' failed: ${error}`,
        undefined,
        error
      );
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

    const url =
      (this.config.baseUrl || "") +
      resolveUrl(queryConfig.path, queryConfig.uri, params);
    const headers = this.resolveHeaders(queryConfig.headers, params);
    const cache = params?.cache ?? false;
    const cacheKey = cache && this.generateMetadataCacheKey(url, headers);

    if (cacheKey) {
      if (this.queryCache.has(cacheKey)) {
        const cached = this.queryCache.get(cacheKey)!;
        this.log(`📋 Using cached data for query '${queryName}'`);
        return cached;
      }
    }

    try {
      const response = await fetch(url, { method: "GET", headers });
      const apiResponse = await this.createResponse<T>(
        response,
        queryConfig.response
      );
      if (cacheKey) {
        this.queryCache.set(cacheKey, {
          ...apiResponse,
          cache: true,
          timestamp: Date.now(),
        });
      }
      return apiResponse;
    } catch (error) {
      throw new ApiError(
        `Query '${queryName}' failed: ${error}`,
        undefined,
        error
      );
    }
  }

  async queryItem<T = any>(
    queryName: string,
    itemId: string,
    params?: ApiParams
  ): Promise<ApiResponse<T>> {
    const queryConfig = this.getQueryConfig(queryName);
    const pathParams = { _id: itemId, ...(params?.path || {}) };
    const itemPath = this.resolveQueryItemPath(queryConfig);
    const url =
      (this.config.baseUrl || "") +
      resolveUrl(itemPath, queryConfig.uri, {
        path: pathParams,
        ...params,
      });
    const headers = this.resolveHeaders(queryConfig.headers, params);
    const cache = params?.cache ?? false;
    const cacheKey = cache && this.generateMetadataCacheKey(url, headers);

    if (cacheKey) {
      if (this.queryCache.has(cacheKey)) {
        const cached = this.queryCache.get(cacheKey)!;
        this.log(`📋 Using cached metadata for query '${queryName}'`);
        return cached;
      }
    }

    try {
      const response = await fetch(url, { method: "GET", headers });
      const responseProcessor =
        queryConfig.itemResponse || queryConfig.response;
      const apiResponse = await this.createResponse<T>(
        response,
        responseProcessor
      );
      if (cacheKey) {
        this.queryCache.set(cacheKey, {
          ...apiResponse,
          cache: true,
          timestamp: Date.now(),
        });
      }
      return apiResponse;
    } catch (error) {
      throw new ApiError(
        `Query '${queryName}' failed: ${error}`,
        undefined,
        error
      );
    }
  }

  resolveQueryMetaPath(queryConfig: QueryConfig): string {
    return queryConfig.meta || "/_meta/" + queryConfig.path;
  }

  resolveQueryItemPath(queryConfig: QueryConfig): string {
    return queryConfig.item || queryConfig.path + "/{_id}";
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

    const metaPath = this.resolveQueryMetaPath(queryConfig);
    const uri =
      (this.config.baseUrl || "") +
      resolveUrl(metaPath, queryConfig.uri, params);
    const headers = this.resolveHeaders(queryConfig.headers, params);
    const useCache = params?.cache ?? true; // for queryMeta, cache is true by default
    const cacheKey = useCache && this.generateMetadataCacheKey(uri, headers);
    if (cacheKey) {
      if (this.queryCache.has(cacheKey)) {
        return this.queryCache.get(cacheKey)!;
        this.log(`📋 Using cached metadata for query '${queryName}'`);
      }
    }

    try {
      const response = await fetch(uri, { method: "GET", headers });
      const apiResponse = await this.createResponse<T>(
        response,
        queryConfig.response
      );

      if (cacheKey) {
        // Cache the metadata
        this.queryCache.set(cacheKey, {
          ...apiResponse,
          cache: true,
          timestamp: Date.now(),
        });
      }

      this.log(`📋 Cached metadata for query '${queryName}'`);

      return apiResponse;
    } catch (error) {
      throw new ApiError(
        `Query metadata '${queryName}' failed: ${error}`,
        undefined,
        error
      );
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
  ): SubscriptionRegister<T> {
    return (handler: SubscriptionHandler): UnsubscribeFunction => {
      const connection = this.getRTCConnection(socketName, params);
      const channelName = channel || "default";

      // Ensure connection is established
      if (!connection.isConnected()) {
        connection.connect().catch((error) => {
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
  ): Publisher<T> {
    return (message: T): void => {
      const connection = this.getRTCConnection(socketName, params);
      const channelName = channel || "default";

      if (!connection.isConnected()) {
        throw new ApiError(`Socket '${socketName}' is not connected`);
      }

      return connection.publish(channelName, message);
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

    const url =
      (this.config.baseUrl || "") +
      resolveUrl(requestConfig.path, requestConfig.uri, params);
    const headers = this.resolveHeaders(requestConfig.headers, params);
    const processedData = this.resolveData(requestConfig.data, data);

    const method = requestConfig.method || "GET";
    const hasBody = ["POST", "PUT", "PATCH"].includes(method);

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          ...(hasBody && processedData
            ? { "Content-Type": "application/json" }
            : {}),
          ...headers,
        },
        body:
          hasBody && processedData ? JSON.stringify(processedData) : undefined,
      });

      return await this.createResponse<T>(response, requestConfig.response);
    } catch (error) {
      throw new ApiError(
        `Request '${requestName}' failed: ${error}`,
        undefined,
        error
      );
    }
  }

  // ===== UTILITY METHODS =====

  /**
   * Get the base URL for this API manager
   */
  getBaseUrl(): string {
    return this.config.baseUrl || "";
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
    this.queryCache.clear();
    this.log(`🗑️ Metadata cache cleared`);
  }

  /**
   * Get metadata cache statistics
   */
  getMetadataCacheStats(): { size: number; entries: string[] } {
    return {
      size: this.queryCache.size,
      entries: Array.from(this.queryCache.keys()),
    };
  }

  // ===== PRIVATE HELPER METHODS =====

  private validateConfig(config: ApiCollectionConfig): ApiCollectionConfig {
    if (!config.name) {
      throw new ConfigurationError("API Manager name is required");
    }

    if (config.dynamic) {
      config.queries = config.queries || ({} as Record<string, QueryConfig>);
      config.commands =
        config.commands || ({} as Record<string, CommandConfig>);
      config.sockets = config.sockets || ({} as Record<string, SocketConfig>);
      config.requests =
        config.requests || ({} as Record<string, RequestConfig>);
    }

    // Validate that at least one operation type is configured
    const hasOperations =
      config.commands || config.queries || config.sockets || config.requests;

    if (!hasOperations) {
      throw new ConfigurationError(
        "At least one operation type (commands, queries, sockets, requests) must be configured"
      );
    }
    return config;
  }

  private getCommandConfig(commandName: string): CommandConfig {
    if (!this.config.commands) {
      throw new ConfigurationError(
        `Command '${commandName}' not found in configuration`
      );
    }

    let config = this.config.commands[commandName];

    if (typeof config === "string") {
      config = { path: config } as CommandConfig;
      this.config.commands[commandName] = config;
    }

    if (!config) {
      if (!this.config.dynamic) {
        throw new ConfigurationError(
          `Command '${commandName}' not found in configuration`
        );
      }
      config = this.generateDynamicConfig(
        commandName,
        "command"
      ) as CommandConfig;
      this.config.commands[commandName] = config;
    }

    return config;
  }

  private generateDynamicConfig(
    configName: string,
    configType: "query" | "command" | "socket" | "request"
  ): QueryConfig | CommandConfig | SocketConfig | RequestConfig {
    let path: string = configName;
    switch (configType) {
      case "query":
        path = `/${this.getName()}.${configName}/`;
        return {
          path: path,
          meta: `/_meta/${path}/`,
          item: `${path}/{_id}`,
        } as QueryConfig;
      case "command":
        path = `/${this.getName()}:${configName}/{resource}/{_id}`;
        return { path: path } as CommandConfig;
      case "socket":
        path = `/${this.getName()}:${configName}/`;
        return { path: path, transport: "websockets" } as SocketConfig;
      case "request":
        path = `/${this.getName()}:${configName}`;
        return { path: path, method: "GET" } as RequestConfig;
      default:
        throw new ConfigurationError(`Invalid config type: ${configType}`);
    }
  }

  private getQueryConfig(queryName: string): QueryConfig {
    if (!this.config.queries) {
      throw new ConfigurationError(
        `Query '${queryName}' not found in configuration: ${this.config.name}`
      );
    }

    let config = this.config.queries[queryName];

    if (typeof config === "string") {
      config = { path: config } as QueryConfig;
      this.config.queries[queryName] = config;
    }

    if (!config) {
      if (!this.config.dynamic) {
        throw new ConfigurationError(
          `Query '${queryName}' not found in configuration`
        );
      }
      config = this.generateDynamicConfig(queryName, "query");
      this.config.queries[queryName] = config;
    }

    return config;
  }

  private getSocketConfig(socketName: string): SocketConfig {
    if (!this.config.sockets) {
      throw new ConfigurationError(
        `Socket '${socketName}' not found in configuration`
      );
    }

    let config: SocketConfig | string = this.config.sockets[socketName];

    if (typeof config === "string") {
      config = { path: config, transport: "websockets" } as SocketConfig;
      this.config.sockets[socketName] = config;
    }

    if (!config) {
      if (!this.config.dynamic) {
        throw new ConfigurationError(
          `Socket '${socketName}' not found in configuration`
        );
      }
      config = this.generateDynamicConfig(socketName, "socket") as SocketConfig;
      this.config.sockets[socketName] = config;
    }

    return config;
  }

  private getRequestConfig(requestName: string): RequestConfig {
    if (!this.config.requests) {
      throw new ConfigurationError(
        `Request '${requestName}' not found in configuration`
      );
    }
    let config = this.config.requests[requestName];

    if (typeof config === "string") {
      config = { path: config, method: "GET" } as RequestConfig;
      this.config.requests[requestName] = config;
    }

    if (!config) {
      if (!this.config.dynamic) {
        throw new ConfigurationError(
          `Request '${requestName}' not found in configuration`
        );
      }
      config = this.generateDynamicConfig(
        requestName,
        "request"
      ) as RequestConfig;
      this.config.requests[requestName] = config;
    }

    return config;
  }

  private resolveHeaders(
    headerProcessor?: HeaderProcessor,
    params?: ApiParams
  ): Record<string, string> {
    let headers = {};

    if (typeof this.config.processHeaders === "function") {
      headers = this.config.processHeaders(params, headers);
    }

    if (typeof headerProcessor === "function") {
      headers = headerProcessor(params, headers);
    }

    if (params?.headers) {
      headers = { ...headers, ...params.headers };
    }

    return headers;
  }

  private resolveData(
    dataProcessor?: DataProcessor,
    userData?: ApiPayload
  ): any {
    let data = userData;

    if (typeof this.config.processData === "function") {
      data = this.config.processData(userData);
    }

    if (typeof dataProcessor === "function") {
      data = dataProcessor(data);
    }

    return data;
  }

  private async createResponse<T>(
    response: Response,
    responseProcessor?: ResponseProcessor
  ): Promise<ApiResponse<T>> {
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
      timestamp: Date.now(),
    };

    if (typeof this.config.processResponse === "function") {
      apiResponse = this.config.processResponse(apiResponse);
    } else {
      apiResponse = this.defaultResponseProcessor(apiResponse);
    }

    if (typeof responseProcessor === "function") {
      apiResponse = responseProcessor(apiResponse);
    }

    return apiResponse;
  }

  private getRTCConnection(
    socketName: string,
    params?: ApiParams
  ): RTCConnection {
    if (!this.rtcConnections.has(socketName)) {
      const socketConfig = this.getSocketConfig(socketName);
      const connection = RTCConnectionFactory.create(
        socketConfig,
        this.config.baseUrl || "",
        params
      );
      this.rtcConnections.set(socketName, connection);
    }

    return this.rtcConnections.get(socketName)!;
  }

  /**
   * Generate a cache key for metadata based on query name and parameters
   * @param queryName Name of the query
   * @param params Parameters for URI generation
   */
  private generateMetadataCacheKey(
    uri: string,
    headers?: Record<string, string>
  ): string {
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
