/**
 * ConfigManager - Configuration Management System
 * Handles base configuration with optional remote configuration loading and merging
 */

export interface ConfigManagerOptions {
  /** Timeout for remote config fetch in milliseconds */
  timeout?: number;
  /** Number of retry attempts for remote config fetch */
  retries?: number;
  /** Custom headers for remote config request */
  headers?: Record<string, string>;
}

export class ConfigManager<T = any> {
  private config: T;
  private baseConfig: T;
  private remoteConfig: Partial<T> | null = null;
  private remoteConfigUrl?: string;
  private options?: ConfigManagerOptions;

  constructor(
    baseConfig: T,
    remoteConfigUrl?: string,
    options?: ConfigManagerOptions
  ) {
    this.baseConfig = { ...baseConfig } as T;
    this.config = { ...baseConfig } as T;
    this.remoteConfigUrl = remoteConfigUrl;
    this.options = options;
  }

  /**
   * Load remote configuration and merge with base config
   */
  async loadRemoteConfig(): Promise<ConfigManager<T>> {
    const { timeout = 5000, retries = 3, headers = {} } = this.options || {};
    const url = this.remoteConfigUrl;
    if (!url) {
      return this;
    }

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const remoteConfig = await response.json();
        this.remoteConfig = remoteConfig;
        this.config = this.mergeConfigs(this.baseConfig, remoteConfig);
        return this;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (attempt < retries) {
          // Wait before retry with exponential backoff
          await new Promise((resolve) =>
            setTimeout(resolve, Math.pow(2, attempt) * 1000)
          );
        }
      }
    }

    // Throw error if all attempts failed
    throw new Error(
      `Failed to load remote config from ${url} after ${
        retries + 1
      } attempts: ${lastError?.message}`
    );
  }

  /**
   * Merge configurations at top level only - remote config keys completely replace base config keys
   */
  private mergeConfigs<U>(target: U, source: Partial<U>): U {
    return { ...target, ...source };
  }

  /**
   * Get a configuration value by key
   * @param key - Configuration key
   * @param defaultValue - Default value if key doesn't exist
   */
  get<U = any>(key: string, defaultValue?: U): U {
    const config = this.config as any;

    if (key in config) {
      return config[key] as U;
    }

    return defaultValue as U;
  }

  /**
   * Check if a configuration key exists
   * @param key - Configuration key
   */
  has(key: string): boolean {
    const config = this.config as any;
    return key in config && config[key] !== undefined;
  }

  /**
   * Get the full configuration object
   */
  getAll(): T {
    return { ...this.config };
  }

  /**
   * Get the base configuration (before remote merge)
   */
  getBaseConfig(): T {
    return { ...this.baseConfig };
  }

  /**
   * Get the remote configuration (if loaded)
   */
  getRemoteConfig(): Partial<T> | null {
    return this.remoteConfig ? { ...this.remoteConfig } : null;
  }
}
