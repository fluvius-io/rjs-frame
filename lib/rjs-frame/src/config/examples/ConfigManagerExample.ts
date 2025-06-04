/**
 * ConfigManager Usage Examples
 * Demonstrates various ways to use the ConfigManager class
 */

import { ConfigManager } from '../ConfigManager';

// Example 1: Basic Usage with Flattened Config Structure
interface AppConfig {
  'app.name': string;
  'app.version': string;
  'api.baseUrl': string;
  'api.timeout': number;
  'features.debugMode': boolean;
  'features.analytics': boolean;
}

const baseConfig: AppConfig = {
  'app.name': 'My Application',
  'app.version': '1.0.0',
  'api.baseUrl': 'https://api.example.com',
  'api.timeout': 5000,
  'features.debugMode': false,
  'features.analytics': true
};

// Usage 1: Base config only (must use factory method)
async function useBaseConfigOnly() {
  const configManager = await ConfigManager.create(baseConfig);

  // Get values with direct key access
  const appName = configManager.get<string>('app.name');
  const appVersion = configManager.get<string>('app.version');
  const apiBaseUrl = configManager.get<string>('api.baseUrl');
  const apiTimeout = configManager.get<number>('api.timeout');
  const debugMode = configManager.get<boolean>('features.debugMode');

  console.log('App Name:', appName);
  console.log('App Version:', appVersion);
  console.log('API Base URL:', apiBaseUrl);
  console.log('API Timeout:', apiTimeout);
  console.log('Debug Mode:', debugMode);
  
  return configManager;
}

// Usage 2: With remote config URL
async function useRemoteConfig() {
  const configManager = await ConfigManager.create(
    baseConfig, 
    'https://api.example.com/config/production.json'
  );
  
  // Note: Remote config keys completely replace base config keys at the top level
  // If remote config has { 'api.baseUrl': 'prod.com' }, it will replace the base config's 'api.baseUrl'
  const remoteApiUrl = configManager.get<string>('api.baseUrl');
  const remoteDebugMode = configManager.get<boolean>('features.debugMode');
  
  console.log('Remote API URL:', remoteApiUrl);
  console.log('Remote Debug Mode:', remoteDebugMode);
  
  return configManager;
}

// Usage 3: With options
async function useConfigWithOptions() {
  const configManager = await ConfigManager.create(
    baseConfig,
    'https://api.example.com/config/production.json',
    {
      timeout: 10000,
      retries: 2,
      headers: {
        'Authorization': 'Bearer token123',
        'X-Client-Version': '1.0.0'
      }
    }
  );
  
  return configManager;
}

// Usage 4: Advanced operations
async function advancedUsage() {
  const config = await ConfigManager.create(baseConfig, 'https://api.example.com/config');
  
  // Check if key exists
  if (config.has('api.baseUrl')) {
    const apiUrl = config.get<string>('api.baseUrl');
    console.log('API URL:', apiUrl);
  }
  
  // Get with default value
  const retryCount = config.get<number>('api.retries', 3);
  console.log('Retry count:', retryCount);
  
  // Get all configurations
  const allConfig = config.getAll();
  console.log('Full config:', allConfig);
  
  // Get base vs remote config
  const baseOnly = config.getBaseConfig();
  const remoteOnly = config.getRemoteConfig();
  console.log('Base config:', baseOnly);
  console.log('Remote config:', remoteOnly);
  
  // Reload configuration (reuses original parameters)
  await config.reload();
  console.log('Configuration reloaded');
  
  return config;
}

// Usage 5: Real-world example with API Manager integration
interface ApiManagerConfig {
  name: string;
  baseUrl: string;
  debug: boolean;
  timeout: number;
  retries: number;
}

const apiBaseConfig: ApiManagerConfig = {
  name: 'MyAPI',
  baseUrl: 'https://api.localhost.com',
  debug: false,
  timeout: 5000,
  retries: 3
};

async function createApiManagerWithRemoteConfig() {
  // Load remote configuration for API Manager
  const configManager = await ConfigManager.create(
    apiBaseConfig,
    'https://api.example.com/config/api-settings.json'
  );
  
  // Use the merged configuration to create API Manager
  const apiConfig = configManager.getAll();
  
  // Note: This would be used with actual APIManager
  console.log('API Manager Config:', apiConfig);
  
  // Get specific values for API Manager
  const baseUrl = apiConfig.baseUrl;
  const debugMode = apiConfig.debug;
  const timeout = apiConfig.timeout;
  
  return {
    baseUrl,
    debug: debugMode,
    timeout
  };
}

// Usage 6: Error handling
async function errorHandlingExample() {
  try {
    // This will throw an error if remote config fails to load
    const config = await ConfigManager.create(
      baseConfig,
      'https://invalid-url.com/config.json',
      { retries: 1, timeout: 2000 }
    );
    
    console.log('Config loaded successfully');
    
  } catch (error) {
    console.error('Config loading failed:', error);
    
    // Fallback to base config only
    const fallbackConfig = await ConfigManager.create(baseConfig);
    console.log('Using fallback base config');
    
    return fallbackConfig;
  }
}

// Usage 7: Working with flattened configuration
async function flattenedConfigExample() {
  const config = await ConfigManager.create(baseConfig);
  
  // Access configuration with dotted keys
  const appName = config.get<string>('app.name');
  const appVersion = config.get<string>('app.version');
  const apiBaseUrl = config.get<string>('api.baseUrl');
  const apiTimeout = config.get<number>('api.timeout');
  const debugMode = config.get<boolean>('features.debugMode');
  const analytics = config.get<boolean>('features.analytics');
  
  console.log('App:', { name: appName, version: appVersion });
  console.log('API:', { baseUrl: apiBaseUrl, timeout: apiTimeout });
  console.log('Features:', { debugMode, analytics });
  
  // Check existence of flattened keys
  const hasAppConfig = config.has('app.name') && config.has('app.version');
  const hasApiConfig = config.has('api.baseUrl') && config.has('api.timeout');
  
  console.log('Has complete app config:', hasAppConfig);
  console.log('Has complete API config:', hasApiConfig);
}

// Usage 8: Reload functionality
async function reloadExample() {
  const config = await ConfigManager.create(
    baseConfig,
    'https://api.example.com/config/production.json'
  );
  
  console.log('Initial config loaded');
  const initialTimeout = config.get<number>('api.timeout');
  console.log('Initial timeout:', initialTimeout);
  
  // Later in the application, reload the same remote config
  await config.reload();
  console.log('Config reloaded with same parameters');
  
  // Check if config changed
  const updatedTimeout = config.get<number>('api.timeout');
  console.log('Updated timeout:', updatedTimeout);
  
  return config;
}

// Export examples for testing
export {
  advancedUsage, baseConfig, createApiManagerWithRemoteConfig,
  errorHandlingExample, flattenedConfigExample, reloadExample, useBaseConfigOnly, useConfigWithOptions, useRemoteConfig
};

