# APIManager Tests

This directory contains tests for the APIManager implementation in rjs-frame.

## Available Tests

### 1. Simple Test (`api-simple.test.mjs`)
Basic functionality test that demonstrates:
- ✅ Command operations (POST requests)
- ✅ Query operations (GET requests)  
- ✅ Response processing
- ✅ ES Module compatibility
- ✅ Configuration-based API management

**Run with:**
```bash
npm run test:api
```

### 2. Comprehensive Test (`api-manager.test.mjs`)
Advanced test suite that covers:
- ✅ All operation types (commands, queries, requests)
- ✅ Dynamic URI generation
- ✅ Data validation and processing
- ✅ Response transformation
- ✅ Header management (static and dynamic)
- ✅ Error handling and validation
- ✅ Query metadata retrieval
- ✅ HTTP methods (POST, GET, PATCH, DELETE)

**Run with:**
```bash
node tests/api-manager.test.mjs
# OR
npm run test:api:full
```

### 3. React Component Test (`api-react.test.tsx`)
Interactive React component for browser testing:
- 🖥️ Visual test interface
- 📊 Real-time test results
- 🎛️ Individual test controls
- 📝 Test logging system
- ⚙️ Configuration viewer

**Usage:**
Import and use in any React application:
```tsx
import APIManagerReactTest from './tests/api-react.test';

function App() {
  return <APIManagerReactTest />;
}
```

### 4. QueryMeta Caching Test (`api-queryMeta.test.mjs`)
Demonstrates the new metadata caching functionality:
- 📋 Automatic metadata caching
- ⚡ Performance improvements (100% speed increase!)
- 🔑 Cache key generation with parameters
- 📊 Cache statistics and management
- 🗑️ Manual cache clearing
- 🐛 Debug logging control

**Run with:**
```bash
node tests/api-queryMeta.test.mjs
# OR
npm run test:api:cache
```

**Features Demonstrated:**
- First call fetches and caches metadata
- Subsequent calls return cached data instantly
- Different queries create separate cache entries
- Parameters create unique cache keys
- Cache can be cleared manually
- Significant performance improvements
- Debug mode controls console logging output

### 5. TypeScript Tests (`*.test.ts`)
TypeScript versions of the tests are available but require additional setup:
- TypeScript compilation configuration
- ES module handling for imports
- Type definitions from built library

**Note:** The JavaScript ES module tests (`.mjs`) are recommended for simplicity and reliability.

## Test API

All tests use the [JSONPlaceholder](https://jsonplaceholder.typicode.com/) API for testing:
- **Base URL:** `https://jsonplaceholder.typicode.com`
- **Endpoints:** `/posts`, `/users`
- **Methods:** GET, POST, PATCH, DELETE

## Configuration Options

### Debug Mode
The APIManager supports a `debug` flag in the configuration to control console logging:

```javascript
const apiConfig = {
  name: 'MyAPI',
  baseUrl: 'https://api.example.com',
  debug: true,  // Enable debug logging (default: false)
  // ... other config
};
```

**Debug Output Includes:**
- 📋 Cache hit/miss messages for metadata queries
- 🗑️ Cache clearing confirmations
- 🔌 Real-time connection management

**Production Usage:**
- Set `debug: false` or omit the flag for production
- Reduces console noise in production environments
- All functionality remains the same, only logging is affected

## Running Tests

### Prerequisites
- Node.js 18+
- rjs-frame built and available (`npm run build --workspace=lib/rjs-frame`)

### Quick Start
```bash
# Build the library first
npm run build --workspace=lib/rjs-frame

# Run the simple test (via npm script)
npm run test:api

# Run the comprehensive test
npm run test:api:full

# Run the caching demonstration
npm run test:api:cache

# Run specific tests directly
node tests/api-simple.test.mjs
node tests/api-manager.test.mjs
node tests/api-queryMeta.test.mjs
```

### Development

The tests are designed to:
1. **Validate** APIManager functionality without mocking
2. **Demonstrate** real-world usage patterns
3. **Ensure** ES Module compatibility
4. **Test** all major features and error cases

### Test Structure

Each test file follows this pattern:
```javascript
// Import APIManager from built distribution
import { APIManager } from '../lib/rjs-frame/dist/index.es.js';

// Define test configuration
const testConfig = {
  name: 'MyTest',
  baseUrl: 'https://api.example.com',
  // ... your config
};

// Create APIManager instance
const api = new APIManager(testConfig);

// Run tests and verify results
```

## Coverage

The test suite covers:
- ✅ **Core Operations**: send(), query(), request()
- ✅ **Configuration**: All config options and validation
- ✅ **Data Processing**: Validation, transformation, response processing
- ✅ **URI Generation**: Static strings and dynamic functions
- ✅ **Headers**: Static and dynamic header generation
- ✅ **Error Handling**: Configuration errors, validation errors, API errors
- ✅ **ES Modules**: Full ES module compatibility
- ✅ **Real API**: Actual HTTP requests to verify functionality
- ✅ **Metadata Caching**: queryMeta() with session-based caching
- ✅ **Cache Management**: Cache statistics and manual clearing

## Adding New Tests

1. Create a new `.test.mjs` file in this directory
2. Import APIManager from the built distribution
3. Define your test configuration
4. Implement test cases
5. Add documentation to this README

Example:
```javascript
import { APIManager } from '../lib/rjs-frame/dist/index.es.js';

const myTestConfig = {
  name: 'MyTest',
  baseUrl: 'https://api.example.com',
  // ... your config
};

async function runMyTests() {
  const api = new APIManager(myTestConfig);
  // ... your test cases
}
```

## Notes

- **JavaScript ES Modules** (`.mjs`) are the recommended format for tests
- **TypeScript tests** are available but require additional configuration
- **React tests** can be imported into any React application
- All tests use the **built distribution** (`dist/index.es.js`) rather than source files
- Tests require the **rjs-frame library to be built** before running 