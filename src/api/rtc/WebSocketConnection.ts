/**
 * WebSocket Connection Implementation
 * Handles WebSocket-based real-time communication
 */

import {
  ApiParams,
  RTCConnection,
  SocketConfig,
  SubscriptionHandler,
  UnsubscribeFunction,
} from "../types";
import { resolveUrl } from "../utils";

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
        const url =
          (this.baseUrl || "") +
          resolveUrl(this.config.path, this.config.uri, this.params);
        const headers = this.resolveHeaders();

        // Convert HTTP/HTTPS URLs to WS/WSS
        const wsUrl = url.replace(
          /^https?:/,
          url.startsWith("https:") ? "wss:" : "ws:"
        );

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
          console.log("🔌 WebSocket disconnected");
          this.handleReconnect();
        };

        this.ws.onerror = (error) => {
          console.error("🔌 WebSocket error:", error);
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

  subscribe(
    channel: string,
    handler: SubscriptionHandler
  ): UnsubscribeFunction {
    const channelName = channel || "default";

    if (!this.subscriptions.has(channelName)) {
      this.subscriptions.set(channelName, new Set());
    }

    this.subscriptions.get(channelName)!.add(handler);

    // Send subscription message if connected
    if (this.isConnected()) {
      this.sendSubscriptionMessage(channelName, "subscribe");
    }

    return () => {
      const handlers = this.subscriptions.get(channelName);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.subscriptions.delete(channelName);
          if (this.isConnected()) {
            this.sendSubscriptionMessage(channelName, "unsubscribe");
          }
        }
      }
    };
  }

  send(data: any, channel?: string): void {
    if (!this.isConnected()) {
      throw new Error("WebSocket not connected");
    }

    const payload = {
      type: "publish",
      channel: channel || "default",
      message: data,
    };

    this.ws!.send(JSON.stringify(payload));
  }

  publish(channel: string, message: any): void {
    this.send(message, channel);
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  private resolveHeaders(): Record<string, string> {
    if (!this.config.headers) {
      return {};
    }

    if (typeof this.config.headers === "function") {
      return this.config.headers(this.params, {});
    }

    return this.config.headers;
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data);
      const { channel, message } = data;

      if (channel && this.subscriptions.has(channel)) {
        const handlers = this.subscriptions.get(channel)!;
        handlers.forEach((handler) => {
          try {
            handler(message);
          } catch (error) {
            console.error(
              `🔌 Error in subscription handler for channel ${channel}:`,
              error
            );
          }
        });
      }
    } catch (error) {
      console.error("🔌 Error parsing WebSocket message:", error);
    }
  }

  private sendSubscriptionMessage(
    channel: string,
    action: "subscribe" | "unsubscribe"
  ): void {
    const payload = {
      type: action,
      channel,
    };

    this.ws!.send(JSON.stringify(payload));
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay =
        this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

      console.log(
        `🔌 Attempting to reconnect WebSocket in ${delay}ms (attempt ${this.reconnectAttempts})`
      );

      setTimeout(() => {
        this.connect().catch((error) => {
          console.error("🔌 WebSocket reconnection failed:", error);
        });
      }, delay);
    } else {
      console.error("🔌 WebSocket max reconnection attempts reached");
    }
  }
}
