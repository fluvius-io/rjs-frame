/**
 * Real-time Communication Connection Factory
 * Creates appropriate RTC connections based on configuration
 */

import { ApiParams, ConfigurationError, RTCConnection, SocketConfig } from '../types';
import { SSEConnection } from './SSEConnection';
import { WebSocketConnection } from './WebSocketConnection';

export class RTCConnectionFactory {
  /**
   * Create an RTC connection based on the socket configuration
   */
  static create(
    config: SocketConfig,
    baseUrl: string,
    params?: ApiParams
  ): RTCConnection {
    switch (config.type) {
      case 'websocket':
        return new WebSocketConnection(config, baseUrl, params);
      
      case 'sse':
        return new SSEConnection(config, baseUrl, params);
      
      case 'rtc':
        throw new ConfigurationError('WebRTC support not yet implemented');
      
      default:
        throw new ConfigurationError(`Unsupported RTC transport: ${config.type}`);
    }
  }
} 