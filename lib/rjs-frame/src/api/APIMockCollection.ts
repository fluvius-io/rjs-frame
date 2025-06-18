import {
  ApiCollectionInterface,
  ApiParams,
  ApiPayload,
  ApiResponse,
  Publisher,
  SubscriptionHandler,
  SubscriptionRegister,
  UnsubscribeFunction,
} from "./types";

import { APIManager } from "./APIManager";

type ApiType = "query" | "socket" | "request" | "command";

class APIMockCollection implements ApiCollectionInterface {
  private collectionName: string = "mock";
  private registry: Record<string, ApiType> = {};

  private data: Record<string, any[]> = {};
  private metadata: Record<string, any> = {};

  private sockets: Record<string, any[]> = {};
  private commands: Record<string, any[]> = {};
  private requests: Record<string, any[]> = {};

  private validateApiName(name: string): void {
    if (name in this.registry) {
      throw new Error(
        `Mock API: ${name} already registered as type: ${this.registry[name]}`
      );
    }
  }

  private checkApiName(name: string, type: ApiType): boolean {
    if (!(name in this.registry && this.registry[name] === type)) {
      throw new Error(`Mock API: ${name} not registered as type: ${type}`);
    }
    return true;
  }

  registerQuery(name: string, data: any[], metadata?: any): string {
    this.validateApiName(name);

    this.data[name] = data;
    this.metadata[name] = metadata;
    this.registry[name] = "query";

    console.log("Mock API: registerQuery", name);
    return `${this.collectionName}:${name}`;
  }

  registerSocket(name: string, data: any[]): string {
    this.validateApiName(name);

    this.sockets[name] = data;
    this.registry[name] = "socket";

    console.log("Mock API: registerSocket", name);
    return `${this.collectionName}:${name}`;
  }

  registerRequest(name: string, data: any[]): string {
    this.validateApiName(name);
    this.requests[name] = data;
    this.registry[name] = "request";
    console.log("Mock API: registerRequest", name);
    return `${this.collectionName}:${name}`;
  }

  registerCommand(name: string, data: any[]): string {
    this.validateApiName(name);

    this.commands[name] = data;
    this.registry[name] = "command";

    console.log("Mock API: registerCommand", name);
    return `${this.collectionName}:${name}`;
  }

  getName(): string {
    return this.collectionName;
  }

  send<T = any>(
    commandName: string,
    data?: ApiPayload,
    params?: ApiParams
  ): Promise<ApiResponse<T>> {
    console.log("Mock API: send", commandName, data, params);

    this.checkApiName(commandName, "command");

    const command = this.commands[commandName];
    return Promise.resolve({
      data: command as unknown as T,
      meta: undefined,
      status: 200,
      statusText: "OK",
      headers: new Headers(),
      timestamp: Date.now(),
    });
  }

  queryItem<T = any>(
    queryName: string,
    itemId: string,
    params?: ApiParams
  ): Promise<ApiResponse<T>> {
    console.log("Mock API: queryItem", queryName, itemId, params);

    this.checkApiName(queryName, "query");

    const data = this.data[queryName];
    const item = data.find((item: any) => item.id === itemId);
    if (!item) {
      return Promise.resolve({
        data: null as unknown as T,
        meta: undefined,
        status: 404,
        statusText: "Not Found",
        headers: new Headers(),
        timestamp: Date.now(),
      });
    }

    return Promise.resolve({
      data: item as unknown as T,
      meta: undefined,
      status: 200,
      statusText: "OK",
      headers: new Headers(),
      timestamp: Date.now(),
    });
  }

  query<T = any>(
    queryName: string,
    params?: ApiParams
  ): Promise<ApiResponse<T>> {
    console.log("Mock API: query", queryName, params);

    this.checkApiName(queryName, "query");

    const data = this.data[queryName];
    const search = params?.search || {};
    const page = (search.page as unknown as number) || 1;
    const limit = (search.limit as unknown as number) || 10;
    const totalItems = data.length;
    const offset = (page - 1) * limit;
    const dataSlice = data.slice(offset, offset + limit);

    return Promise.resolve({
      data: dataSlice as unknown as T,
      meta: {
        total_items: totalItems,
        page_no: page,
        limit: limit,
      },
      status: 200,
      statusText: "OK",
      headers: new Headers(),
      timestamp: Date.now(),
    });
  }

  queryMeta<T = any>(
    queryName: string,
    params?: ApiParams
  ): Promise<ApiResponse<T>> {
    console.log("Mock API: queryMeta", queryName, params);

    this.checkApiName(queryName, "query");

    const metadata = this.metadata[queryName];
    return Promise.resolve({
      data: metadata,
      meta: undefined,
      status: 200,
      statusText: "OK",
      headers: new Headers(),
      timestamp: Date.now(),
    });
  }

  request<T = any>(
    requestName: string,
    data?: ApiPayload,
    params?: ApiParams
  ): Promise<ApiResponse<T>> {
    console.log("Mock API: request", requestName, data, params);

    this.checkApiName(requestName, "request");

    const response = this.requests[requestName];
    if (!response) {
      return Promise.resolve({
        data: null as unknown as T,
        meta: undefined,
        status: 404,
        statusText: "Not Found",
        headers: new Headers(),
        timestamp: Date.now(),
      });
    }

    return Promise.resolve({
      data: response as unknown as T,
      meta: undefined,
      status: 200,
      statusText: "OK",
      headers: new Headers(),
      timestamp: Date.now(),
    });
  }

  subscribe<T = any>(
    socketName: string,
    channel?: string,
    params?: ApiParams
  ): SubscriptionRegister<T> {
    return (handler: SubscriptionHandler<T>): UnsubscribeFunction => {
      console.log("Mock API: subscribe", socketName, channel, handler);
      return () => {
        console.log("Mock API: unsubscribe", socketName, channel, handler);
      };
    };
  }

  publish<T = any>(
    socketName: string,
    channel?: string,
    params?: ApiParams
  ): Publisher<T> {
    return (message: T): void => {
      console.log("Mock API: publish", socketName, channel, message);
    };
  }
}

export const MockAPI = new APIMockCollection();
APIManager.registerCollection(MockAPI);
