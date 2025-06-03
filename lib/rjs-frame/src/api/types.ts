/**
 * API Manager Types and Interfaces
 * Comprehensive type definitions for the APIManager configuration system
 */

// HTTP Methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD';

// Real-time communication types
export type RTCTransport = 'mqtt' | 'websockets' | 'sse' | 'webrtc';

// URI Generator function type
export type UriGenerator = string | ((params?: Record<string, any>) => string);

// Data processor types
export type DataProcessor<TInput = any, TOutput = any> = (data: TInput) => TOutput;
export type DataValidator<T = any> = (data: any) => data is T;

/**
 * Data Schema Configuration
 * 
 * Supports two patterns:
 * 1. Static object: Use the object as-is (merged with user data)
 * 2. Function: Validates and/or processes the input data
 *    - Should throw an exception if data is invalid
 *    - Should return the processed/transformed data if valid
 *    - Can return the original data unchanged if just validating
 */
export type DataSchema<T = any> = Record<string, any> | DataProcessor<any, T>;

// Header generator type
export type HeaderGenerator = (params?: Record<string, any>) => Record<string, string>;
export type HeaderConfig = Record<string, string> | HeaderGenerator;

// Response processor type
export type ResponseProcessor<TInput = any, TOutput = any> = (response: TInput) => TOutput;

// Base configuration interface
interface BaseApiConfig {
  uri: UriGenerator;
  header?: HeaderConfig;
}

// Command configuration
export interface CommandConfig extends BaseApiConfig {
  data?: DataSchema;
  resp?: ResponseProcessor;
}

// Query configuration
export interface QueryConfig extends BaseApiConfig {
  meta?: UriGenerator;
  resp?: ResponseProcessor;
}

// Socket configuration
export interface SocketConfig extends BaseApiConfig {
  transport: RTCTransport;
}

// Request configuration
export interface RequestConfig extends BaseApiConfig {
  method: HttpMethod;
  data?: DataSchema;
  resp?: ResponseProcessor;
}

// Main API Manager configuration
export interface ApiManagerConfig {
  name: string;
  baseUrl: string;
  commands?: Record<string, CommandConfig>;
  queries?: Record<string, QueryConfig>;
  sockets?: Record<string, SocketConfig>;
  requests?: Record<string, RequestConfig>;
}

// API Response types
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

// Error types
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class ConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigurationError';
  }
}

// Real-time communication types
export type SubscriptionHandler<T = any> = (message: T) => void;
export type UnsubscribeFunction = () => void;

export interface RTCConnection {
  connect(): Promise<void>;
  disconnect(): void;
  subscribe(channel: string, handler: SubscriptionHandler): UnsubscribeFunction;
  publish(channel: string, message: any): void;
  isConnected(): boolean;
}

// Utility types
export type ApiParams = Record<string, string | number | boolean>;
export type ApiData = Record<string, any> | FormData | string | number | boolean; 