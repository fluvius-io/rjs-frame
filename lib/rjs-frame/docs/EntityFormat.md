# EntityFormat Component

A class-based React component that fetches and displays entity data using the updated APIManager system.

## Overview

The `EntityFormat` component is designed to fetch individual entity records by their ID and render them in a customizable format. It handles loading states, error states, and provides a default rendering mechanism while allowing for complete customization. Updated to work with the new APIManager collection routing system.

## Features

- **Automatic Data Fetching**: Fetches entity data on mount and when props change
- **Loading States**: Built-in loading indicator with customization options
- **Error Handling**: Comprehensive error handling with retry functionality
- **Custom Rendering**: Flexible rendering through render props pattern
- **Responsive Design**: Mobile-friendly with dark mode support
- **TypeScript Support**: Full TypeScript support with comprehensive type definitions
- **Collection Routing**: Support for the new APIManager collection:queryName format
- **Parameter Support**: Additional API parameters for caching, headers, and more

## Basic Usage

```tsx
import { EntityFormat } from '@your-org/rjs-frame';

// Basic usage with collection routing
<EntityFormat _id="user123" apiName="idm:user" />

// Simple query name (uses default collection)
<EntityFormat _id="user123" apiName="user" />
```

## Props

### Required Props

| Prop      | Type     | Description                                                    |
| --------- | -------- | -------------------------------------------------------------- |
| `_id`     | `string` | The unique identifier for the entity to fetch                  |
| `apiName` | `string` | The API endpoint name (supports "collection:queryName" format) |

### Optional Props

| Prop               | Type                               | Default     | Description                                                   |
| ------------------ | ---------------------------------- | ----------- | ------------------------------------------------------------- |
| `className`        | `string`                           | `''`        | Additional CSS classes for styling                            |
| `onError`          | `(error: Error) => void`           | `undefined` | Callback fired when an error occurs                           |
| `onLoad`           | `(data: any) => void`              | `undefined` | Callback fired when data loads successfully                   |
| `renderEntity`     | `(entity: any) => React.ReactNode` | `undefined` | Custom rendering function for the entity                      |
| `loadingComponent` | `React.ReactNode`                  | `undefined` | Custom loading component                                      |
| `errorComponent`   | `React.ReactNode`                  | `undefined` | Custom error component                                        |
| `params`           | `ApiParams`                        | `undefined` | Additional parameters for the API call (cache, headers, etc.) |

## API Name Format

The component supports the new APIManager collection routing format:

- **Collection:QueryName**: `"idm:user"`, `"shop:product"`, `"hr:employee"`
- **Simple QueryName**: `"user"` (uses default collection)

## Examples

### Basic Entity Display

```tsx
<EntityFormat _id="user123" apiName="idm:user" />
```

This will:

1. Call `APIManager.queryItem('idm:user', 'user123')`
2. Display loading state while fetching
3. Render entity data as formatted JSON on success
4. Show error message with retry button on failure

### Custom Entity Rendering

```tsx
<EntityFormat
  _id="product456"
  apiName="shop:product"
  renderEntity={(product) => (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>Price: ${product.price}</p>
      <p>{product.description}</p>
      <span
        className={`stock ${product.inStock ? "in-stock" : "out-of-stock"}`}
      >
        {product.inStock ? "In Stock" : "Out of Stock"}
      </span>
    </div>
  )}
/>
```

### Using with API Parameters

```tsx
<EntityFormat
  _id="user123"
  apiName="idm:user"
  params={{
    cache: false,
    headers: {
      "X-Custom-Header": "value",
    },
    search: {
      include: "profile,settings",
    },
  }}
/>
```

### Custom Loading and Error States

```tsx
<EntityFormat
  _id="profile123"
  apiName="idm:profile"
  loadingComponent={
    <div className="custom-loader">
      <div className="spinner" />
      <p>Loading profile...</p>
    </div>
  }
  errorComponent={
    <div className="custom-error">
      <h4>Failed to load profile</h4>
      <p>Please check your connection and try again.</p>
    </div>
  }
  onLoad={(data) => console.log("Profile loaded:", data)}
  onError={(error) => console.error("Profile error:", error)}
/>
```

### Employee Card Example

```tsx
<EntityFormat
  _id="emp456"
  apiName="hr:employee"
  renderEntity={(employee) => (
    <div className="employee-card">
      <div className="avatar">
        {employee.firstName?.[0]}
        {employee.lastName?.[0]}
      </div>
      <div className="info">
        <h3>
          {employee.firstName} {employee.lastName}
        </h3>
        <p className="title">{employee.title}</p>
        <p className="department">{employee.department}</p>
        <p className="email">{employee.email}</p>
      </div>
    </div>
  )}
/>
```

### Different API Name Formats

```tsx
// Collection-based API
<EntityFormat _id="user123" apiName="idm:user" />

// Simple query name
<EntityFormat _id="user456" apiName="user" />

// Different collection
<EntityFormat _id="org789" apiName="shop:organization" />
```

## Default Styling

The component comes with built-in CSS classes:

- `.entity-format` - Main container
- `.entity-format__loading` - Loading state wrapper
- `.entity-format__error` - Error state wrapper
- `.entity-format__default` - Default entity display
- `.entity-format__empty` - Empty state display

### CSS Classes

```css
.entity-format {
  /* Main container styling */
}

.entity-format__loading {
  /* Loading state styling with spinner */
}

.entity-format__error {
  /* Error state with retry button */
}

.entity-format__default {
  /* Default entity display with JSON formatting */
}
```

## Component Lifecycle

1. **Mount**: Component fetches entity data immediately
2. **Props Change**: Refetches if `_id`, `apiName`, or `params` change
3. **Loading**: Shows loading state during fetch
4. **Success**: Renders entity data using custom or default renderer
5. **Error**: Shows error state with retry functionality

## Error Handling

The component handles various error scenarios:

- **Network Errors**: Connection issues, timeouts
- **API Errors**: 404 Not Found, 500 Server Error, etc.
- **Validation Errors**: Missing `_id` or `apiName` props
- **Configuration Errors**: Invalid API endpoint names or unregistered collections

All errors are passed to the `onError` callback if provided.

## Performance Considerations

- **Automatic Refetch**: Component refetches when `_id`, `apiName`, or `params` change
- **Loading States**: Prevents multiple concurrent requests
- **Error Recovery**: Built-in retry mechanism
- **Memory Management**: Properly cleans up on unmount
- **Caching**: Supports APIManager caching through params

## TypeScript Support

The component is fully typed with TypeScript:

```tsx
import { EntityFormat, EntityFormatProps } from "@your-org/rjs-frame";

interface User {
  id: string;
  name: string;
  email: string;
}

<EntityFormat<User>
  _id="user123"
  apiName="idm:user"
  onLoad={(user: User) => console.log(user.name)}
/>;
```

## Migration from Old APIManager

If you're migrating from the old APIManager:

1. **API Names**: Update from simple names to collection-based names

   - Old: `apiName="users"`
   - New: `apiName="idm:user"`

2. **Parameters**: Use the new `params` prop for additional options

   - Old: Direct parameters in queryItem call
   - New: `params={{ cache: true, headers: {...} }}`

3. **Response Structure**: The response now includes additional metadata
   - `response.data` - The actual entity data
   - `response.meta` - Additional metadata
   - `response.pagination` - Pagination information (if applicable)

## Accessibility

The component follows accessibility best practices:

- Semantic HTML structure
- ARIA labels for loading and error states
- Keyboard navigation support for retry button
- Screen reader friendly content

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Supports both light and dark modes via CSS media queries

## Migration from Function Components

If you have existing function components that fetch entity data, migration is straightforward:

```tsx
// Before (function component)
const UserDisplay = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    APIManager.queryItem('users', userId).then(setUser);
  }, [userId]);

  // ... render logic
};

// After (EntityFormat)
<EntityFormat
  _id={userId}
  apiName="users"
  renderEntity={(user) => /* your render logic */}
/>
```

## Best Practices

1. **Custom Rendering**: Use `renderEntity` for complex layouts
2. **Error Handling**: Provide meaningful error messages via `onError`
3. **Loading States**: Use custom loading components for branded experiences
4. **Caching**: Enable API-level caching for frequently accessed entities
5. **Accessibility**: Ensure custom renderers maintain accessibility standards
