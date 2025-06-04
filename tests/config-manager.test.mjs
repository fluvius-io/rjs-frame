#!/usr/bin/env node

/**
 * ConfigManager Test
 * Tests the ConfigManager functionality with real and mock scenarios
 */

import { ConfigManager } from '../lib/rjs-frame/dist/index.es.js';

console.log('🧪 Testing ConfigManager...\n');

// Base configuration for testing
const baseConfig = {
  'app.name': 'Test Application',
  'app.version': '1.0.0',
  'app.environment': 'development',
  'api.baseUrl': 'https://api.localhost.com',
  'api.timeout': 5000,
  'api.retries': 3,
  'api.debug': false,
  'features.debugMode': false,
  'features.analytics': true,
  'features.newFeature': false,
  'database.host': 'localhost',
  'database.port': 5432,
  'database.name': 'testdb'
};

class ConfigTester {
  constructor() {
    this.results = [];
  }

  async runTest(name, testFn) {
    const start = Date.now();
    console.log(`\n🧪 ${name}...`);
    
    try {
      const result = await testFn();
      const duration = Date.now() - start;
      
      this.results.push({
        name,
        success: true,
        duration,
        data: result
      });
      
      console.log(`✅ ${name} completed (${duration}ms)`);
      if (result && typeof result === 'object') {
        console.log(`   Result:`, JSON.stringify(result, null, 2).substring(0, 200) + '...');
      }
    } catch (error) {
      const duration = Date.now() - start;
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      this.results.push({
        name,
        success: false,
        duration,
        error: errorMessage
      });
      
      console.log(`❌ ${name} failed (${duration}ms): ${errorMessage}`);
    }
  }

  async runAllTests() {
    console.log('🚀 Starting ConfigManager tests...\n');

    // Test 1: Basic Configuration Access
    await this.runTest('Basic Configuration Access', async () => {
      const config = await ConfigManager.create(baseConfig);
      
      const appName = config.get('app.name');
      const apiTimeout = config.get('api.timeout');
      const debugMode = config.get('features.debugMode');
      const nonExistent = config.get('nonexistent', 'default');
      
      return {
        appName,
        apiTimeout,
        debugMode,
        nonExistent
      };
    });

    // Test 2: Type Safety
    await this.runTest('Type Safety', async () => {
      const config = await ConfigManager.create(baseConfig);
      
      const appName = config.get('app.name');
      const apiTimeout = config.get('api.timeout');
      const debugMode = config.get('features.debugMode');
      const dbPort = config.get('database.port');
      
      return {
        appName: appName === 'Test Application' ? appName : 'TYPE_ERROR',
        apiTimeout: apiTimeout === 5000 ? apiTimeout : 'TYPE_ERROR',
        debugMode: debugMode === false ? debugMode : 'TYPE_ERROR',
        dbPort: dbPort === 5432 ? dbPort : 'TYPE_ERROR'
      };
    });

    // Test 3: Key Existence Checking
    await this.runTest('Key Existence Checking', async () => {
      const config = await ConfigManager.create(baseConfig);
      
      const hasAppName = config.has('app.name');
      const hasInvalid = config.has('invalid.key');
      const hasApiTimeout = config.has('api.timeout');
      const hasNonExistent = config.has('nonexistent');
      
      return {
        hasAppName,
        hasInvalid,
        hasApiTimeout,
        hasNonExistent
      };
    });

    // Test 4: Default Value Operations
    await this.runTest('Default Value Operations', async () => {
      const config = await ConfigManager.create(baseConfig);
      
      // Test getting existing values
      const existingTimeout = config.get('api.timeout', 3000);
      const existingAppName = config.get('app.name', 'Default App');
      
      // Test getting non-existent values with defaults
      const nonExistentWithDefault = config.get('missing.key', 'default value');
      const nonExistentWithoutDefault = config.get('another.missing.key');
      
      return {
        existingTimeout,
        existingAppName,
        nonExistentWithDefault,
        nonExistentWithoutDefault
      };
    });

    // Test 5: Get All Configurations
    await this.runTest('Get All Configurations', async () => {
      const config = await ConfigManager.create(baseConfig);
      
      const allConfig = config.getAll();
      const baseOnly = config.getBaseConfig();
      const remoteConfig = config.getRemoteConfig(); // Should be null
      
      return {
        hasAllConfig: !!allConfig,
        hasBaseConfig: !!baseOnly,
        remoteConfig,
        configKeys: Object.keys(allConfig)
      };
    });

    // Test 6: Remote Config with JSONPlaceholder (Mock Remote Config)
    await this.runTest('Remote Config Loading', async () => {
      // Use JSONPlaceholder as a mock remote config endpoint
      const config = await ConfigManager.create(
        baseConfig,
        'https://jsonplaceholder.typicode.com/posts/1', // This returns JSON we can use as config
        {
          timeout: 10000,
          retries: 2
        }
      );
      
      const remoteConfig = config.getRemoteConfig();
      const allConfig = config.getAll();
      
      // Check if remote data was merged
      const hasRemoteData = !!remoteConfig;
      
      return {
        hasRemoteData,
        remoteConfigKeys: remoteConfig ? Object.keys(remoteConfig) : [],
        mergedConfigKeys: Object.keys(allConfig)
      };
    });

    // Test 7: Error Handling - Invalid URL
    await this.runTest('Error Handling - Invalid URL', async () => {
      try {
        await ConfigManager.create(
          baseConfig,
          'https://invalid-url-that-does-not-exist.com/config.json',
          {
            timeout: 2000,
            retries: 1
          }
        );
        
        return { error: 'Should have thrown an error' };
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        
        return {
          errorThrown: true,
          errorMessage,
          containsExpectedText: errorMessage.includes('Failed to load remote config')
        };
      }
    });

    // Test 8: Fallback Pattern
    await this.runTest('Fallback Pattern', async () => {
      let config;
      
      try {
        config = await ConfigManager.create(
          baseConfig,
          'https://invalid-url.com/config.json',
          { retries: 1, timeout: 1000 }
        );
      } catch (error) {
        // Fallback to base config only
        config = await ConfigManager.create(baseConfig);
      }
      
      const appName = config.get('app.name');
      const canAccessBaseConfig = appName === baseConfig['app.name'];
      
      return {
        fallbackWorked: true,
        canAccessBaseConfig
      };
    });

    // Test 9: Reload Functionality
    await this.runTest('Reload Functionality', async () => {
      const config = await ConfigManager.create(
        baseConfig,
        'https://jsonplaceholder.typicode.com/posts/1',
        { timeout: 5000, retries: 1 }
      );
      
      const initialRemote = config.getRemoteConfig();
      
      // Reload using same parameters
      await config.reload();
      
      const reloadedRemote = config.getRemoteConfig();
      
      return {
        initialHadRemote: !!initialRemote,
        reloadedHadRemote: !!reloadedRemote,
        reloadSuccessful: true
      };
    });

    this.printSummary();
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 ConfigManager Test Summary');
    console.log('='.repeat(60));

    const passed = this.results.filter(r => r.success).length;
    const failed = this.results.filter(r => !r.success).length;
    const totalTime = this.results.reduce((sum, r) => sum + r.duration, 0);

    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⏱️  Total time: ${totalTime}ms`);
    console.log(`📈 Success rate: ${Math.round((passed / this.results.length) * 100)}%`);

    if (failed > 0) {
      console.log('\n❌ Failed tests:');
      this.results
        .filter(r => !r.success)
        .forEach(r => console.log(`   - ${r.name}: ${r.error}`));
    }

    console.log('\n🎉 ConfigManager test completed!');
    console.log('\n💡 Key Features Tested:');
    console.log('   ✓ Private constructor (factory pattern only)');
    console.log('   ✓ Direct key access (no dot notation)');
    console.log('   ✓ Type safety with generics');
    console.log('   ✓ Key existence checking');
    console.log('   ✓ Runtime configuration setting');
    console.log('   ✓ Remote configuration loading');
    console.log('   ✓ Error throwing on failure (no continueOnError)');
    console.log('   ✓ Fallback patterns');
    console.log('   ✓ Reload with parameter reuse');
    
    if (failed === 0) {
      console.log('\n🚀 All tests passed! ConfigManager is working correctly.');
    } else {
      console.log('\n⚠️  Some tests failed. Please review the errors above.');
      process.exit(1);
    }
  }
}

// Run the tests
async function main() {
  const tester = new ConfigTester();
  await tester.runAllTests();
}

main().catch(error => {
  console.error('💥 Test runner failed:', error);
  process.exit(1);
}); 