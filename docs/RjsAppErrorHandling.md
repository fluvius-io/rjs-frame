# RjsApp Error Handling

The `RjsApp` component now includes comprehensive error handling that catches errors from the entire React component tree and provides a centralized way to manage application errors.

## How it Works

RjsApp implements error handling at two levels:

1. **Error Boundary**: Wraps the entire application content in a React error boundary
2. **Error State Management**: Provides a centralized error state that can be accessed and modified throughout the app

## Error Boundary Features

- **Automatic Error Catching**: Catches any unhandled errors from child components
- **Error Logging**: Logs errors to console with detailed information
- **Error Display**: Shows the `ErrorScreen` component when errors occur
- **Error Recovery**: Allows clearing errors to return to normal app state

## Error State Management

The app context now includes a `setError` function that allows components to:

- Set application-wide errors
- Clear existing errors
- Access current error state

### Using Error State

```tsx
import { useAppContext } from "rjs-frame";

const MyComponent = () => {
  const { error, setError } = useAppContext();

  const handleSomeAction = () => {
    try {
      // Some operation that might fail
      riskyOperation();
    } catch (err) {
      // Set the error in the app context
      setError(err instanceof Error ? err : new Error("Unknown error"));
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <div>
      {error && (
        <div>
          <p>Error: {error.message}</p>
          <button onClick={clearError}>Clear Error</button>
        </div>
      )}
      <button onClick={handleSomeAction}>Risky Action</button>
    </div>
  );
};
```

## Error Display Priority

RjsApp follows a specific priority order for displaying content:

1. **Loading State** (highest priority)
2. **Error State** (shows ErrorScreen)
3. **Unauthorized State** (shows UnauthorizedScreen)
4. **Normal App Content** (lowest priority)

## Error Types Handled

The error boundary catches various types of errors:

- **React Component Errors**: Errors thrown during rendering
- **Lifecycle Method Errors**: Errors in componentDidMount, componentDidUpdate, etc.
- **Event Handler Errors**: Errors in onClick, onSubmit, etc.
- **PageModule Errors**: Errors from PageModule components
- **Async Operation Errors**: Errors from promises, async/await

## Error Recovery

### Automatic Recovery

- Some errors may resolve themselves (network issues, temporary failures)
- Users can refresh the page to attempt recovery

### Manual Recovery

- Use `setError(null)` to clear the error state
- This returns the app to normal operation
- Useful for transient errors that don't require a full page reload

## Integration with PageModule

RjsApp error handling works seamlessly with PageModule error boundaries:

- **PageModule Level**: Catches errors within individual modules
- **App Level**: Catches errors that escape module boundaries
- **Graceful Degradation**: If a module fails, the rest of the app continues to work

## Best Practices

1. **Use setError for Application Errors**: Set errors that affect the entire app
2. **Handle Expected Errors**: Don't use error boundaries for expected error states
3. **Provide Meaningful Error Messages**: Help users understand what went wrong
4. **Log Errors for Debugging**: Errors are automatically logged to console
5. **Test Error Scenarios**: Use the example components to test error handling

## Example Usage

See `examples/RjsAppErrorExample.tsx` for a complete demonstration including:

- Components that trigger errors
- Error state management
- Error recovery mechanisms
- Integration with PageModule error boundaries

## Technical Details

- Uses React's `componentDidCatch` lifecycle method
- Maintains error state in the app context
- Integrates with existing ErrorScreen component
- Provides error logging for debugging
- Supports error recovery through context API
