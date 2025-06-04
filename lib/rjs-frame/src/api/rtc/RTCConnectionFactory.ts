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
    switch (config.transport) {
      case 'websockets':
        return new WebSocketConnection(config, baseUrl, params);
      
      case 'sse':
        return new SSEConnection(config, baseUrl, params);
      
      case 'mqtt':
        // TODO: Implement MQTT connection
        throw new ConfigurationError('MQTT transport not yet implemented');
      
      case 'webrtc':
        // TODO: Implement WebRTC connection
        throw new ConfigurationError('WebRTC transport not yet implemented');
      
      default:
        throw new ConfigurationError(`Unsupported RTC transport: ${config.transport}`);
    }
  }
} 