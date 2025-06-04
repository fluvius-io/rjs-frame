// Browser-compatible configuration system
// Replaces node-config for frontend applications

// Type definitions for our configuration structure
export interface AppConfig {
  app: {
    name: string;
    version: string;
    description: string;
    port: number;
  };
  api: {
    baseUrl: string;
    timeout: number;
    retries: number;
    debug: boolean;
  };
  features: {
    xrayMode: boolean;
    debugMode: boolean;
    analytics: boolean;
    hotReload: boolean;
  };
  ui: {
    theme: string;
    language: string;
    pageTitle: string;
    showDevTools: boolean;
  };
  routing: {
    basePath: string;
    defaultRoute: string;
    enableHashRouting: boolean;
  };
  logging: {
    level: string;
    enableConsole: boolean;
    enableFile: boolean;
  };
}

// Get current environment
const getEnvironment = (): string => {
  return import.meta.env.MODE || 'development';
};

// Default configuration
const defaultConfig: AppConfig = {
  app: {
    name: "RJS Demo Application",
    version: "0.1.0",
    description: "Demo application showcasing RJS Frame capabilities",
    port: 3000
  },
  api: {
    baseUrl: "https://jsonplaceholder.typicode.com",
    timeout: 5000,
    retries: 3,
    debug: false
  },
  features: {
    xrayMode: false,
    debugMode: false,
    analytics: false,
    hotReload: true
  },
  ui: {
    theme: "light",
    language: "en",
    pageTitle: "RJS Frame Demo",
    showDevTools: false
  },
  routing: {
    basePath: "/",
    defaultRoute: "/home",
    enableHashRouting: false
  },
  logging: {
    level: "info",
    enableConsole: true,
    enableFile: false
  }
};

// Development environment overrides
const developmentConfig: Partial<AppConfig> = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || "https://jsonplaceholder.typicode.com",
    debug: true,
    timeout: 10000,
    retries: 3
  },
  features: {
    xrayMode: true,
    debugMode: true,
    analytics: false,
    hotReload: true
  },
  ui: {
    theme: "light",
    language: "en",
    pageTitle: "RJS Frame Demo",
    showDevTools: true
  },
  logging: {
    level: "debug",
    enableConsole: true,
    enableFile: false
  }
};

// Production environment overrides
const productionConfig: Partial<AppConfig> = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || "https://api.production-domain.com",
    debug: false,
    timeout: 5000,
    retries: 3
  },
  features: {
    xrayMode: false,
    debugMode: false,
    analytics: true,
    hotReload: false
  },
  ui: {
    theme: "light",
    language: "en",
    pageTitle: "RJS Frame Demo",
    showDevTools: false
  },
  logging: {
    level: "warn",
    enableConsole: false,
    enableFile: true
  }
};

// Test environment overrides
const testConfig: Partial<AppConfig> = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || "https://jsonplaceholder.typicode.com",
    debug: true,
    timeout: 3000,
    retries: 1
  },
  features: {
    xrayMode: false,
    debugMode: true,
    analytics: false,
    hotReload: false
  },
  ui: {
    theme: "light",
    language: "en",
    pageTitle: "RJS Frame Demo",
    showDevTools: false
  },
  logging: {
    level: "debug",
    enableConsole: true,
    enableFile: false
  }
};

// Deep merge utility
function deepMerge<T>(target: T, source: Partial<T>): T {
  const result = { ...target };
  
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key], source[key] as any);
    } else if (source[key] !== undefined) {
      result[key] = source[key] as any;
    }
  }
  
  return result;
}

// Get environment-specific configuration
function getEnvironmentConfig(): AppConfig {
  const environment = getEnvironment();
  
  let envConfig: Partial<AppConfig> = {};
  
  switch (environment) {
    case 'development':
      envConfig = developmentConfig;
      break;
    case 'production':
      envConfig = productionConfig;
      break;
    case 'test':
      envConfig = testConfig;
      break;
    default:
      envConfig = developmentConfig;
  }
  
  return deepMerge(defaultConfig, envConfig);
}

// Type-safe configuration access
class ConfigService {
  private _config: AppConfig;
  private _environment: string;

  constructor() {
    this._environment = getEnvironment();
    this._config = getEnvironmentConfig();
    
    // Apply environment variable overrides
    this.applyEnvironmentVariables();
  }

  private applyEnvironmentVariables(): void {
    // Apply environment variable overrides
    if (import.meta.env.VITE_API_DEBUG === 'true') {
      this._config.api.debug = true;
    }
    if (import.meta.env.VITE_API_DEBUG === 'false') {
      this._config.api.debug = false;
    }
    
    if (import.meta.env.VITE_DEBUG_MODE === 'true') {
      this._config.features.debugMode = true;
    }
    if (import.meta.env.VITE_DEBUG_MODE === 'false') {
      this._config.features.debugMode = false;
    }
    
    if (import.meta.env.VITE_XRAY_MODE === 'true') {
      this._config.features.xrayMode = true;
    }
    if (import.meta.env.VITE_XRAY_MODE === 'false') {
      this._config.features.xrayMode = false;
    }
  }

  // App configuration
  get app() {
    return this._config.app;
  }

  // API configuration
  get api() {
    return this._config.api;
  }

  // Feature flags
  get features() {
    return this._config.features;
  }

  // UI configuration
  get ui() {
    return this._config.ui;
  }

  // Routing configuration
  get routing() {
    return this._config.routing;
  }

  // Logging configuration
  get logging() {
    return this._config.logging;
  }

  // Environment helpers
  get isDevelopment(): boolean {
    return this._environment === 'development';
  }

  get isProduction(): boolean {
    return this._environment === 'production';
  }

  get isTest(): boolean {
    return this._environment === 'test';
  }

  // Get the current environment
  get environment(): string {
    return this._environment;
  }

  // Check if a feature is enabled
  isFeatureEnabled(feature: keyof AppConfig['features']): boolean {
    return this._config.features[feature];
  }

  // Get a configuration value by path (with dot notation)
  get(path: string): any {
    const keys = path.split('.');
    let current: any = this._config;
    
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return undefined;
      }
    }
    
    return current;
  }

  // Check if a configuration path exists
  has(path: string): boolean {
    return this.get(path) !== undefined;
  }

  // Get configuration with default value
  getWithDefault<T>(path: string, defaultValue: T): T {
    try {
      const value = this.get(path);
      return value !== undefined ? value : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  // Debug helper to log current configuration
  logConfig(): void {
    if (this.features.debugMode) {
      console.log('🔧 Current Configuration:', {
        environment: this.environment,
        config: this._config
      });
    }
  }
}

// Export singleton instance
export const appConfig = new ConfigService();

// Export individual configuration objects for convenience
export const { app, api, features, ui, routing, logging } = appConfig;

// Export default
export default appConfig; 