/**
 * API Manager Types and Interfaces
 * Comprehensive type definitions for the APIManager configuration system
 */

// HTTP Methods
export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "OPTIONS"
  | "HEAD";

// Real-time communication types
export type RTCTransport = "mqtt" | "websockets" | "sse" | "webrtc";

// URI Generator function type
export type UriGenerator = string | ((params?: Record<string, any>) => string);

// Data processor types
export type DataProcessor<TInput = any, TOutput = any> = (
  data: TInput
) => TOutput;

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

// Header generator type
export type HeaderProcessor = (
  params?: Record<string, any>,
  headers?: Record<string, string>
) => Record<string, string>;

// Response processor type
export type ResponseProcessor<TInput = any, TOutput = any> = (
  response: TInput
) => TOutput;

// Base configuration interface
interface BaseApiConfig {
  uri: UriGenerator;
  headers?: HeaderProcessor;
}

// Command configuration
export interface CommandConfig extends BaseApiConfig {
  data?: DataProcessor;
  response?: ResponseProcessor;
}

// Query configuration
export interface QueryConfig extends BaseApiConfig {
  meta?: UriGenerator;
  item?: UriGenerator;
  response?: ResponseProcessor;
  itemResponse?: ResponseProcessor;
}

// Socket configuration
export interface SocketConfig extends BaseApiConfig {
  transport: RTCTransport;
}

// Request configuration
export interface RequestConfig extends BaseApiConfig {
  method: HttpMethod;
  data?: DataProcessor;
  response?: ResponseProcessor;
}

// Main API Manager configuration
export interface ApiCollectionConfig {
  name: string;
  baseUrl: string;
  debug?: boolean;
  commands?: Record<string, CommandConfig>;
  queries?: Record<string, QueryConfig>;
  sockets?: Record<string, SocketConfig>;
  requests?: Record<string, RequestConfig>;
  processHeaders?: HeaderProcessor;
  processData?: DataProcessor;
  processResponse?: ResponseProcessor;
}

// API Response types
export interface ApiResponse<T = any> {
  data: T;
  meta?: Record<string, any>;
  status: number;
  statusText: string;
  headers: Headers;
  timestamp: number;
  cache?: boolean;
}

// Error types
export class ApiError extends Error {
  constructor(message: string, public status?: number, public response?: any) {
    super(message);
    this.name = "ApiError";
  }
}

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class ConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigurationError";
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
export type ApiParams = {
  cache?: boolean;
  search?: Record<string, string>; // url search parameters
  headers?: Record<string, string>; // headers to be added to the request
  path?: Record<string, string>; // path parameters to be used by the uri generator
};

export type ApiPayload = Record<string, any> | FormData | string;
