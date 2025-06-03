/**
 * RJS Frame API Module
 * Comprehensive API management system with TypeScript configuration
 */

// Main API Manager class
export { APIManager } from './APIManager';

// Type definitions
export type {
    ApiData,
    // Configuration types
    ApiManagerConfig, ApiParams,
    // API types
    ApiResponse, CommandConfig, DataProcessor, DataSchema, DataValidator, HeaderConfig, HeaderGenerator,
    // Utility types
    HttpMethod, QueryConfig, RequestConfig, ResponseProcessor,
    // Real-time communication types
    RTCConnection, RTCTransport, SocketConfig, SubscriptionHandler,
    UnsubscribeFunction, UriGenerator
} from './types';

// Error classes
export {
    ApiError, ConfigurationError, ValidationError
} from './types';

// Real-time communication
export { RTCConnectionFactory } from './rtc/RTCConnectionFactory';
export { SSEConnection } from './rtc/SSEConnection';
export { WebSocketConnection } from './rtc/WebSocketConnection';

// Examples (for documentation and testing)
export { ApiManagerExamples } from './examples/ApiManagerExample';
