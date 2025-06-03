/**
 * WebSocket Connection Implementation
 * Handles WebSocket-based real-time communication
 */

import { ApiParams, RTCConnection, SocketConfig, SubscriptionHandler, UnsubscribeFunction } from '../types';

export class WebSocketConnection implements RTCConnection {
  private ws: WebSocket | null = null;
  private subscriptions = new Map<string, Set<SubscriptionHandler>>();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor(
    private config: SocketConfig,
    private baseUrl: string,
    private params?: ApiParams
  ) {}

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const uri = this.resolveUri();
        const headers = this.resolveHeaders();
        
        // Convert HTTP/HTTPS URLs to WS/WSS
        const wsUrl = uri.replace(/^https?:/, uri.startsWith('https:') ? 'wss:' : 'ws:');
        
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log(`🔌 WebSocket connected: ${wsUrl}`);
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(event);
        };

        this.ws.onclose = () => {
          console.log('🔌 WebSocket disconnected');
          this.handleReconnect();
        };

        this.ws.onerror = (error) => {
          console.error('🔌 WebSocket error:', error);
          reject(error);
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.subscriptions.clear();
  }

  subscribe(channel: string, handler: SubscriptionHandler): UnsubscribeFunction {
    if (!this.subscriptions.has(channel)) {
      this.subscriptions.set(channel, new Set());
    }
    
    this.subscriptions.get(channel)!.add(handler);

    // Send subscription message if connected
    if (this.isConnected()) {
      this.sendSubscriptionMessage(channel, 'subscribe');
    }

    return () => {
      const handlers = this.subscriptions.get(channel);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.subscriptions.delete(channel);
          if (this.isConnected()) {
            this.sendSubscriptionMessage(channel, 'unsubscribe');
          }
        }
      }
    };
  }

  publish(channel: string, message: any): void {
    if (!this.isConnected()) {
      throw new Error('WebSocket not connected');
    }

    const payload = {
      type: 'publish',
      channel,
      message
    };

    this.ws!.send(JSON.stringify(payload));
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  private resolveUri(): string {
    if (typeof this.config.uri === 'string') {
      return this.baseUrl + this.config.uri;
    }
    return this.config.uri(this.config, this.params);
  }

  private resolveHeaders(): Record<string, string> {
    if (!this.config.header) {
      return {};
    }

    if (typeof this.config.header === 'function') {
      return this.config.header(this.params);
    }

    return this.config.header;
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data);
      const { channel, message } = data;

      if (channel && this.subscriptions.has(channel)) {
        const handlers = this.subscriptions.get(channel)!;
        handlers.forEach(handler => {
          try {
            handler(message);
          } catch (error) {
            console.error(`🔌 Error in subscription handler for channel ${channel}:`, error);
          }
        });
      }
    } catch (error) {
      console.error('🔌 Error parsing WebSocket message:', error);
    }
  }

  private sendSubscriptionMessage(channel: string, action: 'subscribe' | 'unsubscribe'): void {
    const payload = {
      type: action,
      channel
    };

    this.ws!.send(JSON.stringify(payload));
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      console.log(`🔌 Attempting to reconnect WebSocket in ${delay}ms (attempt ${this.reconnectAttempts})`);
      
      setTimeout(() => {
        this.connect().catch(error => {
          console.error('🔌 WebSocket reconnection failed:', error);
        });
      }, delay);
    } else {
      console.error('🔌 WebSocket max reconnection attempts reached');
    }
  }
} 