/**
 * API Module Exports
 * Provides all API-related classes, types, and utilities
 */

// Main API class
export { APICollection, APIManager } from './APIManager';

// Types and interfaces
export type {
    ApiCollectionConfig, ApiParams, ApiPayload,
    ApiResponse, CommandConfig, DataProcessor, HeaderProcessor,
    HttpMethod, QueryConfig, RequestConfig, ResponseProcessor,
    RTCConnection, RTCTransport, SocketConfig, SubscriptionHandler, UnsubscribeFunction, UriGenerator
} from './types';

// Error classes
export {
    ApiError, ConfigurationError
} from './types';

// Real-time communication
export { RTCConnectionFactory } from './rtc/RTCConnectionFactory';
export { SSEConnection } from './rtc/SSEConnection';
export { WebSocketConnection } from './rtc/WebSocketConnection';

// Examples and demos
export { ApiCollectionExamples } from './examples/ApiManagerExample';
