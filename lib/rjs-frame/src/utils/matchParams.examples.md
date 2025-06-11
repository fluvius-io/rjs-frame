# MatchParams Utility Functions

The `matchParams` utility provides flexible parameter matching functionality for PageModule and PageSlot components in the rjs-frame system.

## API Overview

```typescript
export type MatchParamValue = boolean | string | RegExp | MatchConfig;

export type MatchParams =
  | Record<string, MatchParamValue>
  | ((pageParams: Record<string, any>) => boolean);

export interface MatchConfig {
  /** Check if the key does not exist at all */
  $absent?: true;
  /** Check if the key exists (regardless of value) */
  $exists?: true;
}
```

## Literal Value Matching

Direct value comparison using primitives:

```tsx
// String matching (exact)
<PageModule matchParams={{ userType: "admin" }} />

// Boolean matching
<PageModule matchParams={{ isActive: true }} />

// Numeric matching (passed as string)
<PageModule matchParams={{ level: "5" }} />
```

## Regular Expression Matching

Pattern matching using RegExp objects:

```tsx
// UUID validation
<PageModule matchParams={{ userId: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i }} />

// Email validation
<PageModule matchParams={{ email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }} />

// Alphanumeric codes
<PageModule matchParams={{ code: /^[A-Z0-9]{6}$/ }} />
```

## Match Configuration Objects

Advanced matching using special configuration objects:

```tsx
// Check if key exists (regardless of value)
<PageModule matchParams={{
  userId: { $exists: true }
}} />

// Check if key is absent
<PageModule matchParams={{
  debug: { $absent: true }
}} />
```

## Function-Based Matching

Complex logic using custom functions:

```tsx
// Custom validation function
<PageModule matchParams={(params) => {
  return params.role === 'admin' && params.permissions?.includes('write');
}} />

// Multi-condition logic
<PageModule matchParams={(params) => {
  const isWeekend = [0, 6].includes(new Date().getDay());
  return params.schedule === 'weekend' ? isWeekend : !isWeekend;
}} />
```

## Combining Different Match Types

You can combine different matching approaches within the same matchParams:

```tsx
<PageModule
  matchParams={{
    // Literal matching
    userType: "admin",

    // RegExp matching
    userId: /^[a-f0-9]{32}$/,

    // Existence checking
    feature: { $exists: true },

    // Absence checking
    debug: { $absent: true },
  }}
/>
```

## Examples by Use Case

### User Authentication & Authorization

```tsx
// Admin-only content
<PageModule matchParams={{ role: "admin" }} />

// Multi-role access
<PageModule matchParams={{ role: /^(admin|moderator)$/ }} />

// Permission-based rendering
<PageModule matchParams={(params) =>
  params.permissions?.includes('user_management')
} />
```

### Feature Flags & A/B Testing

```tsx
// Feature flag enabled
<PageModule matchParams={{ enableNewUI: true }} />

// A/B test variant
<PageModule matchParams={{ variant: /^(a|b)$/ }} />

// Beta features (when beta flag exists)
<PageModule matchParams={{ beta: { $exists: true } }} />
```

### Environment-Specific Content

```tsx
// Development only
<PageModule matchParams={{ env: "development" }} />

// Production with debug disabled
<PageModule matchParams={{
  env: "production",
  debug: { $absent: true }
}} />
```

### URL Parameter Validation

```tsx
// Valid user ID format
<PageModule matchParams={{ id: /^\d+$/ }} />

// Category pages
<PageModule matchParams={{ category: /^[a-z-]+$/ }} />

// Optional search parameters
<PageModule matchParams={(params) =>
  !params.search || params.search.length >= 3
} />
```

## Best Practices

1. **Use literal values** for simple exact matches
2. **Use RegExp** for pattern validation (IDs, emails, etc.)
3. **Use functions** for complex business logic
4. **Use $exists/$absent** for presence/absence checks
5. **Combine approaches** when you need multiple conditions
6. **Keep functions simple** and avoid side effects
7. **Handle edge cases** in custom functions (null, undefined, etc.)

## Error Handling

The utility includes built-in error handling:

- Function errors are caught and logged, component won't render
- Unknown parameter types log warnings and default to not rendering
- Invalid RegExp patterns will throw during component definition

## Performance Considerations

- Literal and RegExp matching are fast
- Function matching should avoid expensive operations
- Consider caching results for complex computations
- Use specific patterns over broad matching when possible
