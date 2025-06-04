# Configuration Management for RJS Demo

This application uses a **browser-compatible configuration system** designed for frontend React applications, inspired by node-config but built specifically for client-side environments.

## Why Not Node-Config?

Node-config is designed for Node.js server environments and relies on the `process` object, which isn't available in browsers. Our custom configuration system provides:

- ✅ **Browser Compatibility**: Works in all modern browsers
- ✅ **Vite Integration**: Uses Vite's environment variable system
- ✅ **Type Safety**: Full TypeScript support with interface validation
- ✅ **Environment-Specific**: Support for development, production, and test environments
- ✅ **Override Support**: Environment variables can override configuration

## Configuration Structure

The configuration is defined in TypeScript with three levels of override:

```
1. Default Configuration (base settings)
   ↓
2. Environment Configuration (dev/prod/test overrides)
   ↓  
3. Environment Variables (runtime overrides)
```

## Environment Configuration

### Development Mode
- **API Debug**: Enabled for detailed logging
- **X-Ray Mode**: Enabled for visual debugging  
- **Debug Mode**: Enabled for console logging
- **Dev Tools**: Visible for development
- **Longer Timeout**: 10 seconds for debugging

### Production Mode
- **Production API**: Points to production endpoints
- **Debug Disabled**: No debug logging
- **Analytics**: Enabled for tracking
- **Security**: Dev tools hidden
- **Optimized Logging**: Warning level only

### Test Mode
- **Fast Timeouts**: Quick API timeouts for tests
- **Debug Enabled**: For test debugging
- **Minimal Retries**: Faster test execution
- **Test-specific**: Endpoints and settings

## Usage

### Environment Scripts

```bash
# Development mode (default)
npm run dev

# Production mode in development  
npm run dev:prod

# Test mode in development
npm run dev:test

# Production build
npm run build

# Development build
npm run build:dev
```

### In Code

```typescript
import { appConfig, api, features, app } from './config';

// Access configuration
console.log(appConfig.environment);     // Current environment
console.log(api.baseUrl);              // API base URL
console.log(features.debugMode);       // Debug mode flag

// Check feature flags
if (appConfig.isFeatureEnabled('xrayMode')) {
  // Enable X-Ray mode
}

// Environment checks
if (appConfig.isDevelopment) {
  // Development-specific code
}

// Get configuration with defaults
const customSetting = appConfig.getWithDefault('custom.setting', 'defaultValue');
```

### API Manager Integration

The API Manager is automatically configured using our configuration system:

```typescript
import { apiManager } from './config/api';

// API Manager uses configuration settings
const users = await apiManager.query('getUsers');
const metadata = await apiManager.queryMeta('getUsers');
```

## Environment Variables

The application supports Vite environment variables for runtime configuration:

### Available Variables

- `VITE_API_BASE_URL`: API base URL
- `VITE_API_DEBUG`: Enable/disable API debug logging (true/false)
- `VITE_DEBUG_MODE`: Enable/disable debug mode (true/false)  
- `VITE_XRAY_MODE`: Enable/disable X-Ray mode (true/false)

### Using Environment Variables

Create `.env.local` for local development overrides:

```bash
# .env.local
VITE_API_BASE_URL=http://localhost:8080
VITE_API_DEBUG=true
VITE_DEBUG_MODE=true
VITE_XRAY_MODE=false
```

**Note**: `.env.local` is gitignored and won't be committed to version control.

### Environment File Priority

Vite loads environment files in this order (higher priority overwrites lower):

1. `.env` (loaded in all cases)
2. `.env.local` (loaded in all cases, ignored by git)
3. `.env.[mode]` (e.g., `.env.development`)
4. `.env.[mode].local` (e.g., `.env.development.local`)

## Configuration Structure

```typescript
interface AppConfig {
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
```

## Environment Detection

The system automatically detects the current environment using Vite's `import.meta.env.MODE`:

- **Development**: `npm run dev` → `MODE=development`
- **Production**: `npm run build` → `MODE=production`
- **Test**: `npm run dev:test` → `MODE=test`

## TypeScript Support

Full TypeScript support is provided through:

- `vite-env.d.ts`: Defines environment variable types
- `AppConfig` interface: Ensures type safety
- ConfigService class: Provides type-safe access methods

## Best Practices

1. **Environment Variables**: Use for runtime configuration and secrets
2. **Type Safety**: Always use the provided TypeScript interfaces
3. **Feature Flags**: Use for conditional functionality
4. **Documentation**: Document configuration changes in this file
5. **Local Overrides**: Use `.env.local` for local development

## Demo Component

The application includes a `ConfigDemo` component that shows:
- Current environment and configuration
- Feature flag status
- API integration examples
- Live API testing with configuration settings
- Environment variable examples

Visit the home page to see the configuration in action!

## Migration from Node-Config

If migrating from node-config:

1. ✅ **Remove** `config` and `@types/config` packages
2. ✅ **Replace** config files with our TypeScript configuration
3. ✅ **Update** imports to use our config system
4. ✅ **Add** environment variables for runtime overrides
5. ✅ **Test** in all environments (dev/prod/test) 