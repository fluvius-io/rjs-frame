# Error Boundary in PageModule

The `PageModule` class now includes built-in error boundary functionality to gracefully handle and display errors that occur within modules.

## How it Works

When a `PageModule` encounters an error during rendering, lifecycle methods, or any other React operation, the error boundary will:

1. **Catch the error** using React's `componentDidCatch` lifecycle method
2. **Log the error** to the console for debugging purposes
3. **Display a user-friendly error UI** instead of crashing the entire application
4. **Provide a recovery mechanism** with a "Try Again" button

## Error UI Features

The error boundary displays:

- **Warning icon** (⚠️) to indicate an error state
- **Module name** in the error title for easy identification
- **Error message** from the caught exception
- **"Try Again" button** to reset the error state and attempt recovery
- **Responsive design** that works on mobile and desktop

## Usage

Error boundaries are automatically active for all modules that extend `PageModule`. No additional configuration is required.

### Example Error Handling

```tsx
import { PageModule } from "rjs-frame";

class MyModule extends PageModule {
  renderContent() {
    // If this throws an error, the error boundary will catch it
    if (someCondition) {
      throw new Error("Something went wrong!");
    }

    return <div>Normal content</div>;
  }
}
```

### Error Recovery

Users can click the "Try Again" button to:

1. Reset the error state
2. Clear the error information
3. Attempt to re-render the module

This is useful for transient errors that might resolve themselves.

## Styling

The error UI uses CSS custom properties from the RJS design system:

- `--rjs-error-bg`: Error background color
- `--rjs-error-border`: Error border color
- `--rjs-error-text`: Error text color
- `--rjs-primary`: Primary button color

## Example

See `examples/ErrorBoundaryExample.tsx` for a complete demonstration of the error boundary functionality, including:

- Normal modules that work without errors
- Manual error triggering with buttons
- Automatic error simulation with timeouts

## Best Practices

1. **Use for unexpected errors**: Error boundaries are best for catching unexpected errors, not for expected error states
2. **Provide meaningful error messages**: The error message should help users understand what went wrong
3. **Consider logging**: Errors are automatically logged to the console for debugging
4. **Test error scenarios**: Use the example components to test how your modules handle errors

## Technical Details

- Uses React's `componentDidCatch` lifecycle method
- Maintains error state in the component's state
- Provides a `renderError()` method that can be overridden for custom error UI
- Integrates with the existing RJS design system and CSS variables
