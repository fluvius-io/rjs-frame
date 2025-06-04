#!/usr/bin/env node

/**
 * APIManager queryMeta Caching Test
 * Demonstrates the new metadata caching functionality
 */

import { APIManager } from '../lib/rjs-frame/dist/index.es.js';

console.log('🧪 Testing APIManager queryMeta caching functionality...\n');

// Simple test configuration with metadata
const testConfig = {
  name: 'QueryMetaTestAPI',
  baseUrl: 'https://jsonplaceholder.typicode.com',
  debug: true,  // Enable debug logging for this test
  
  queries: {
    getUsers: {
      uri: '/users',
      meta: '/users',  // Metadata endpoint
      resp: (response) => response.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email
      }))
    },
    
    getPosts: {
      uri: '/posts',
      meta: '/posts',  // Metadata endpoint
      resp: (response) => response.slice(0, 3)
    }
  }
};

async function demonstrateQueryMeta() {
  const api = new APIManager(testConfig);
  
  console.log('🚀 Starting queryMeta caching demonstration...\n');
  console.log(`📊 API: ${api.getName()} - ${api.getBaseUrl()}`);
  console.log(`🐛 Debug mode: ${testConfig.debug ? 'ENABLED' : 'DISABLED'}\n`);

  // Test 1: First call to queryMeta (should fetch and cache)
  console.log('📝 Test 1: First call to queryMeta (should fetch and cache)');
  const start1 = Date.now();
  const result1 = await api.queryMeta('getUsers');
  const duration1 = Date.now() - start1;
  console.log(`✅ Completed in ${duration1}ms`);
  console.log(`📋 Cache stats:`, api.getMetadataCacheStats());
  console.log(`📄 Status: ${result1.statusText}\n`);

  // Test 2: Second call to queryMeta (should use cache)
  console.log('📝 Test 2: Second call to queryMeta (should use cache)');
  const start2 = Date.now();
  const result2 = await api.queryMeta('getUsers');
  const duration2 = Date.now() - start2;
  console.log(`✅ Completed in ${duration2}ms`);
  console.log(`📋 Cache stats:`, api.getMetadataCacheStats());
  console.log(`📄 Status: ${result2.statusText}\n`);

  // Test 3: Different query (should fetch and cache separately)
  console.log('📝 Test 3: Different query (should fetch and cache separately)');
  const start3 = Date.now();
  const result3 = await api.queryMeta('getPosts');
  const duration3 = Date.now() - start3;
  console.log(`✅ Completed in ${duration3}ms`);
  console.log(`📋 Cache stats:`, api.getMetadataCacheStats());
  console.log(`📄 Status: ${result3.statusText}\n`);

  // Test 4: Query with parameters (should create separate cache entry)
  console.log('📝 Test 4: Query with parameters (should create separate cache entry)');
  const start4 = Date.now();
  const result4 = await api.queryMeta('getUsers', { category: 'admin' });
  const duration4 = Date.now() - start4;
  console.log(`✅ Completed in ${duration4}ms`);
  console.log(`📋 Cache stats:`, api.getMetadataCacheStats());
  console.log(`📄 Status: ${result4.statusText}\n`);

  // Test 5: Same query with parameters (should use cache)
  console.log('📝 Test 5: Same query with parameters (should use cache)');
  const start5 = Date.now();
  const result5 = await api.queryMeta('getUsers', { category: 'admin' });
  const duration5 = Date.now() - start5;
  console.log(`✅ Completed in ${duration5}ms`);
  console.log(`📋 Cache stats:`, api.getMetadataCacheStats());
  console.log(`📄 Status: ${result5.statusText}\n`);

  // Performance comparison
  console.log('⚡ Performance Comparison:');
  console.log(`   First call (fetch):     ${duration1}ms`);
  console.log(`   Cached call:            ${duration2}ms`);
  console.log(`   Speed improvement:      ${Math.round((duration1 - duration2) / duration1 * 100)}%\n`);

  // Clear cache demonstration
  console.log('📝 Test 6: Clear cache');
  console.log('📋 Before clearing:', api.getMetadataCacheStats());
  api.clearMetadataCache();
  console.log('📋 After clearing:', api.getMetadataCacheStats());

  console.log('\n🎉 queryMeta caching demonstration completed!');
  console.log('\n💡 Key Features Demonstrated:');
  console.log('   ✓ Automatic metadata caching');
  console.log('   ✓ Cache key generation with parameters');
  console.log('   ✓ Significant performance improvement');
  console.log('   ✓ Separate cache entries for different queries/parameters');
  console.log('   ✓ Cache statistics and management');
  console.log('   ✓ Manual cache clearing');
  console.log('   ✓ Debug logging control');
}

async function demonstrateDebugModes() {
  console.log('\n' + '='.repeat(60));
  console.log('🐛 Debug Mode Demonstration');
  console.log('='.repeat(60));

  // Test with debug disabled
  console.log('\n📝 Testing with debug DISABLED:');
  const configNoDebug = { ...testConfig, debug: false };
  const apiNoDebug = new APIManager(configNoDebug);
  
  console.log('Making API call (should not show debug messages)...');
  await apiNoDebug.queryMeta('getUsers');
  await apiNoDebug.queryMeta('getUsers'); // Cached call
  apiNoDebug.clearMetadataCache();

  // Test with debug enabled
  console.log('\n📝 Testing with debug ENABLED:');
  const configWithDebug = { ...testConfig, debug: true };
  const apiWithDebug = new APIManager(configWithDebug);
  
  console.log('Making API call (should show debug messages)...');
  await apiWithDebug.queryMeta('getUsers');
  await apiWithDebug.queryMeta('getUsers'); // Cached call
  apiWithDebug.clearMetadataCache();

  console.log('\n✅ Debug mode demonstration completed!');
}

// Run the demonstration
async function main() {
  await demonstrateQueryMeta();
  await demonstrateDebugModes();
}

main().catch(error => {
  console.error('💥 Demonstration failed:', error);
  process.exit(1);
}); 