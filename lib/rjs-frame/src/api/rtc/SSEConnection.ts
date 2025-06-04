/**
 * Server-Sent Events Connection Implementation
 * Handles SSE-based real-time communication
 */

import { ApiParams, RTCConnection, SocketConfig, SubscriptionHandler, UnsubscribeFunction } from '../types';

export class SSEConnection implements RTCConnection {
  private eventSource: EventSource | null = null;
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
        
        this.eventSource = new EventSource(uri);

        this.eventSource.onopen = () => {
          console.log(`📡 SSE connected: ${uri}`);
          this.reconnectAttempts = 0;
          resolve();
        };

        this.eventSource.onmessage = (event) => {
          this.handleMessage(event);
        };

        this.eventSource.onerror = (error) => {
          console.error('📡 SSE error:', error);
          if (this.eventSource?.readyState === EventSource.CLOSED) {
            this.handleReconnect();
          } else {
            reject(error);
          }
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.subscriptions.clear();
  }

  subscribe(channel: string, handler: SubscriptionHandler): UnsubscribeFunction {
    if (!this.subscriptions.has(channel)) {
      this.subscriptions.set(channel, new Set());
    }
    
    this.subscriptions.get(channel)!.add(handler);

    // For SSE, we typically add event listeners for specific channel types
    if (this.isConnected()) {
      this.addChannelListener(channel);
    }

    return () => {
      const handlers = this.subscriptions.get(channel);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.subscriptions.delete(channel);
          this.removeChannelListener(channel);
        }
      }
    };
  }

  publish(channel: string, message: any): void {
    // SSE is typically one-way (server to client)
    // If publishing is needed, it would require a separate HTTP request
    throw new Error('SSE does not support publishing. Use a separate HTTP request for sending data to server.');
  }

  isConnected(): boolean {
    return this.eventSource?.readyState === EventSource.OPEN;
  }

  private resolveUri(): string {
    if (typeof this.config.uri === 'string') {
      return this.baseUrl + this.config.uri;
    }
    return this.config.uri(this.params);
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data);
      const { channel, message } = data;

      // Handle default channel (when no specific channel is specified)
      if (!channel) {
        this.notifySubscribers('default', data);
        return;
      }

      if (this.subscriptions.has(channel)) {
        this.notifySubscribers(channel, message);
      }
    } catch (error) {
      // If it's not JSON, treat as plain text message for default channel
      this.notifySubscribers('default', event.data);
    }
  }

  private addChannelListener(channel: string): void {
    if (this.eventSource && channel !== 'default') {
      this.eventSource.addEventListener(channel, (event: any) => {
        try {
          const message = JSON.parse(event.data);
          this.notifySubscribers(channel, message);
        } catch (error) {
          this.notifySubscribers(channel, event.data);
        }
      });
    }
  }

  private removeChannelListener(channel: string): void {
    // EventSource doesn't have a direct way to remove listeners
    // This would need to be handled by recreating the connection
    // or using a wrapper that tracks listeners
  }

  private notifySubscribers(channel: string, message: any): void {
    const handlers = this.subscriptions.get(channel);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(message);
        } catch (error) {
          console.error(`📡 Error in SSE handler for channel ${channel}:`, error);
        }
      });
    }
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      console.log(`📡 Attempting to reconnect SSE in ${delay}ms (attempt ${this.reconnectAttempts})`);
      
      setTimeout(() => {
        this.connect().catch(error => {
          console.error('📡 SSE reconnection failed:', error);
        });
      }, delay);
    } else {
      console.error('📡 SSE max reconnection attempts reached');
    }
  }
} 