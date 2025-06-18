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

class APIMockCollection implements ApiCollectionInterface {
  private data: Record<string, any[]> = {};
  private metadata: Record<string, any> = {};
  private collectionName: string = "mock";

  registerQuery(name: string, data: any[], metadata?: any): string {
    this.data[name] = data;
    this.metadata[name] = metadata;
    console.log("Mock API: registerQuery", name, data, metadata, this);
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
    throw new Error("Method not implemented.");
  }

  queryItem<T = any>(
    queryName: string,
    itemId: string,
    params?: ApiParams
  ): Promise<ApiResponse<T>> {
    console.log("Mock API: queryItem", queryName, itemId, params);
    throw new Error("Method not implemented.");
  }

  query<T = any>(
    queryName: string,
    params?: ApiParams
  ): Promise<ApiResponse<T>> {
    const data = this.data[queryName];
    console.log("Mock API: query", queryName, data);
    if (typeof data === "undefined") {
      throw new Error(`Data not found for query ${queryName}`);
    }
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
    const metadata = this.metadata[queryName];
    console.log("Mock API: queryMeta", queryName, this);
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
    throw new Error("Method not implemented.");
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
