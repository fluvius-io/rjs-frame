# EntityFormat Component

A class-based React component that fetches and displays entity data using the APIManager system.

## Overview

The `EntityFormat` component is designed to fetch individual entity records by their ID and render them in a customizable format. It handles loading states, error states, and provides a default rendering mechanism while allowing for complete customization.

## Features

- **Automatic Data Fetching**: Fetches entity data on mount and when props change
- **Loading States**: Built-in loading indicator with customization options
- **Error Handling**: Comprehensive error handling with retry functionality
- **Custom Rendering**: Flexible rendering through render props pattern
- **Responsive Design**: Mobile-friendly with dark mode support
- **TypeScript Support**: Full TypeScript support with comprehensive type definitions

## Basic Usage

```tsx
import { EntityFormat } from '@your-org/rjs-frame';

// Basic usage - fetches and displays entity with default formatting
<EntityFormat _id="user123" apiName="users" />
```

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `_id` | `string` | The unique identifier for the entity to fetch |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `apiName` | `string` | `'entity'` | The API endpoint name to query |
| `collectionName` | `string` | `undefined` | Collection name for multi-collection setups |
| `className` | `string` | `''` | Additional CSS classes for styling |
| `onError` | `(error: Error) => void` | `undefined` | Callback fired when an error occurs |
| `onLoad` | `(data: any) => void` | `undefined` | Callback fired when data loads successfully |
| `renderEntity` | `(entity: any) => React.ReactNode` | `undefined` | Custom rendering function for the entity |
| `loadingComponent` | `React.ReactNode` | `undefined` | Custom loading component |
| `errorComponent` | `React.ReactNode` | `undefined` | Custom error component |

## Examples

### Basic Entity Display

```tsx
<EntityFormat _id="user123" apiName="users" />
```

This will:
1. Call `APIManager.queryItem('users', 'user123')`
2. Display loading state while fetching
3. Render entity data as formatted JSON on success
4. Show error message with retry button on failure

### Custom Entity Rendering

```tsx
<EntityFormat 
  _id="product456" 
  apiName="products"
  renderEntity={(product) => (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>Price: ${product.price}</p>
      <p>{product.description}</p>
      <span className={`stock ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
        {product.inStock ? 'In Stock' : 'Out of Stock'}
      </span>
    </div>
  )}
/>
```

### Using with Multiple Collections

```tsx
<EntityFormat 
  _id="order789" 
  apiName="orders"
  collectionName="EcommerceAPI"
/>
```

This will call `APIManager.queryItem('EcommerceAPI:orders', 'order789')`.

### Custom Loading and Error States

```tsx
<EntityFormat 
  _id="profile123" 
  apiName="profiles"
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
  onLoad={(data) => console.log('Profile loaded:', data)}
  onError={(error) => console.error('Profile error:', error)}
/>
```

### Employee Card Example

```tsx
<EntityFormat 
  _id="emp456" 
  apiName="employees"
  renderEntity={(employee) => (
    <div className="employee-card">
      <div className="avatar">
        {employee.firstName?.[0]}{employee.lastName?.[0]}
      </div>
      <div className="info">
        <h3>{employee.firstName} {employee.lastName}</h3>
        <p className="title">{employee.title}</p>
        <p className="department">{employee.department}</p>
        <p className="email">{employee.email}</p>
      </div>
    </div>
  )}
/>
```

## Default Styling

The component comes with built-in CSS classes:

- `.entity-format` - Main container
- `.entity-format-loading` - Loading state wrapper
- `.entity-format-error` - Error state wrapper
- `.entity-format-default` - Default entity display
- `.entity-format-empty` - Empty state display

### CSS Classes

```css
.entity-format {
  /* Main container styling */
}

.entity-format-loading {
  /* Loading state styling with spinner */
}

.entity-format-error {
  /* Error state with retry button */
}

.entity-format-default {
  /* Default entity display with JSON formatting */
}
```

## Component Lifecycle

1. **Mount**: Component fetches entity data immediately
2. **Props Change**: Refetches if `_id` or `apiName` changes
3. **Loading**: Shows loading state during fetch
4. **Success**: Renders entity data using custom or default renderer
5. **Error**: Shows error state with retry functionality

## Error Handling

The component handles various error scenarios:

- **Network Errors**: Connection issues, timeouts
- **API Errors**: 404 Not Found, 500 Server Error, etc.
- **Validation Errors**: Missing `_id` prop
- **Configuration Errors**: Invalid API endpoint names

All errors are passed to the `onError` callback if provided.

## Performance Considerations

- **Automatic Refetch**: Component refetches when `_id` or `apiName` changes
- **Loading States**: Prevents multiple concurrent requests
- **Error Recovery**: Built-in retry mechanism
- **Memory Management**: Properly cleans up on unmount

## TypeScript Support

The component is fully typed with TypeScript:

```tsx
import { EntityFormat, EntityFormatProps } from '@your-org/rjs-frame';

// Type-safe props
const props: EntityFormatProps = {
  _id: "user123",
  apiName: "users",
  onLoad: (data: any) => console.log(data),
  renderEntity: (entity: any) => <div>{entity.name}</div>
};

<EntityFormat {...props} />
```

## Integration with APIManager

The component integrates seamlessly with the APIManager system:

1. **Single Collection**: Uses default collection if only one is registered
2. **Multiple Collections**: Specify collection via `collectionName` prop
3. **API Naming**: Supports `collection:endpoint` format
4. **Error Propagation**: APIManager errors are properly handled and displayed

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