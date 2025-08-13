# LoadingScreen and ErrorScreen Components

These components provide consistent, accessible loading and error states for your application. They can be used independently or as part of the RjsApp configuration system.

## LoadingScreen Component

A full-screen loading overlay with spinner and customizable message.

### Basic Usage

```tsx
import { LoadingScreen } from "rjs-frame";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div>
      <LoadingScreen visible={isLoading} />
      {/* Your app content */}
    </div>
  );
}
```

### Props

| Prop        | Type      | Default                    | Description                        |
| ----------- | --------- | -------------------------- | ---------------------------------- |
| `message`   | `string`  | `"Loading application..."` | Loading message to display         |
| `className` | `string`  | `""`                       | Additional CSS class names         |
| `visible`   | `boolean` | `true`                     | Whether to show the loading screen |

### Examples

#### Custom Message

```tsx
<LoadingScreen visible={isLoading} message="Fetching your data..." />
```

#### Custom Styling

```tsx
<LoadingScreen
  visible={isLoading}
  className="custom-loading"
  message="Please wait..."
/>
```

```css
.custom-loading .loading-screen__backdrop {
  background-color: rgba(139, 92, 246, 0.9);
}

.custom-loading .loading-screen__spinner {
  border-top-color: #ffffff;
}

.custom-loading .loading-screen__message {
  color: #ffffff;
  font-weight: 600;
}
```

## ErrorScreen Component

A full-screen error overlay with icon, message, and optional retry functionality.

### Basic Usage

```tsx
import { ErrorScreen } from "rjs-frame";

function App() {
  const [error, setError] = useState<Error | null>(null);

  return (
    <div>
      {error && <ErrorScreen error={error} />}
      {/* Your app content */}
    </div>
  );
}
```

### Props

| Prop        | Type         | Default                          | Description                                    |
| ----------- | ------------ | -------------------------------- | ---------------------------------------------- |
| `error`     | `Error`      | required                         | Error object to display                        |
| `title`     | `string`     | `"Configuration Error"`          | Title for the error screen                     |
| `className` | `string`     | `""`                             | Additional CSS class names                     |
| `retryText` | `string`     | `"Reload Application"`           | Text for the retry button                      |
| `onRetry`   | `() => void` | `() => window.location.reload()` | Callback for retry action                      |
| `showRetry` | `boolean`    | `true`                           | Whether to show the retry button               |
| `message`   | `string`     | `undefined`                      | Custom error message (overrides error.message) |

### Examples

#### Basic Error

```tsx
const error = new Error("Unable to connect to server");

<ErrorScreen error={error} />;
```

#### Custom Title and Retry

```tsx
<ErrorScreen
  error={error}
  title="Network Error"
  retryText="Try Again"
  onRetry={() => {
    console.log("Retrying...");
    fetchData();
  }}
/>
```

#### No Retry Button

```tsx
<ErrorScreen error={error} title="Service Unavailable" showRetry={false} />
```

#### Custom Message

```tsx
<ErrorScreen
  error={error}
  title="Authentication Required"
  message="Your session has expired. Please sign in again."
  retryText="Sign In"
  onRetry={() => redirectToLogin()}
/>
```

#### Custom Styling

```tsx
<ErrorScreen error={error} className="custom-error" />
```

```css
.custom-error .error-screen__backdrop {
  background-color: rgba(99, 102, 241, 0.8);
}

.custom-error .error-screen__content {
  border-color: #6366f1;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
}

.custom-error .error-screen__title {
  color: #6366f1;
}

.custom-error .error-screen__retry-button {
  background-color: #6366f1;
}
```

## CSS Architecture

Both components use BEM methodology for CSS class naming:

### LoadingScreen Classes

- `.loading-screen` - Main container
- `.loading-screen__backdrop` - Background overlay
- `.loading-screen__content` - Content container
- `.loading-screen__spinner` - Loading spinner
- `.loading-screen__message` - Loading message text

### ErrorScreen Classes

- `.error-screen` - Main container
- `.error-screen__backdrop` - Background overlay
- `.error-screen__content` - Content container
- `.error-screen__icon` - Error icon container
- `.error-screen__icon-svg` - SVG icon
- `.error-screen__header` - Header section
- `.error-screen__title` - Error title
- `.error-screen__body` - Body section
- `.error-screen__message` - Error message
- `.error-screen__footer` - Footer section
- `.error-screen__retry-button` - Retry button

## Accessibility Features

### LoadingScreen

- **ARIA Labels**: Screen readers announce loading state
- **Focus Management**: Prevents focus on background content
- **Reduced Motion**: Respects `prefers-reduced-motion` setting
- **High Contrast**: Supports high contrast mode
- **Print Friendly**: Hidden during printing

### ErrorScreen

- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Proper focus handling for retry button
- **Screen Reader Support**: Descriptive ARIA labels
- **Color Contrast**: Meets WCAG guidelines
- **Reduced Motion**: Animation-free for sensitive users

## Responsive Design

Both components are fully responsive:

- **Mobile Optimized**: Smaller spinners and adjusted spacing on mobile
- **Flexible Layout**: Adapts to different screen sizes
- **Touch Friendly**: Properly sized touch targets

## Dark Theme Support

Both components automatically adapt to dark themes using CSS media queries:

```css
@media (prefers-color-scheme: dark) {
  .loading-screen__backdrop {
    background-color: rgba(0, 0, 0, 0.95);
  }

  .error-screen__content {
    background-color: #1f2937;
    color: #d1d5db;
  }
}
```

## Integration with RjsApp

These components are automatically used by RjsApp for configuration loading and error states:

```tsx
// LoadingScreen shows during config loading
// ErrorScreen shows for config errors
<RjsApp configUrl="/config/app.json">
  <Routes>
    <Route path="/" element={<HomePage />} />
  </Routes>
</RjsApp>
```

## Best Practices

### LoadingScreen

1. **Use for blocking operations**: Only show for operations that prevent user interaction
2. **Provide context**: Use descriptive messages that explain what's loading
3. **Don't overuse**: Avoid showing loading screens for fast operations
4. **Timeout handling**: Implement timeouts for long-running operations

```tsx
const [isLoading, setIsLoading] = useState(false);

const loadData = async () => {
  setIsLoading(true);
  try {
    // Add timeout
    const timeoutId = setTimeout(() => {
      throw new Error("Operation timed out");
    }, 30000);

    const data = await fetchData();
    clearTimeout(timeoutId);

    // Handle success
  } catch (error) {
    // Handle error
  } finally {
    setIsLoading(false);
  }
};
```

### ErrorScreen

1. **Be specific**: Provide clear, actionable error messages
2. **Offer solutions**: Include retry buttons or helpful suggestions
3. **Log errors**: Always log errors for debugging
4. **Graceful degradation**: Allow apps to continue functioning when possible

```tsx
const handleError = (error: Error) => {
  // Log for debugging
  console.error('Application error:', error);

  // Show user-friendly error
  setError(new Error(
    'We're having trouble loading your data. Please check your connection and try again.'
  ));
};
```

## Performance Considerations

- **Lazy Loading**: Components are optimized for bundle splitting
- **CSS Loading**: Styles are automatically included when components are used
- **Memory Management**: Components clean up properly when unmounted
- **Animation Performance**: Uses CSS transforms for smooth animations

## Browser Support

- **Modern Browsers**: Full support for Chrome, Firefox, Safari, Edge
- **Backdrop Filter**: Graceful degradation for unsupported browsers
- **CSS Grid/Flexbox**: Uses widely supported layout methods
- **SVG Icons**: Vector icons for crisp display on all devices
