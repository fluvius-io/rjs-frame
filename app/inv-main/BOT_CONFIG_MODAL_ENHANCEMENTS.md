# BotConfigModal Enhancements

## Overview
The BotConfigModal component has been significantly enhanced to provide a better user experience and align with the app's design system.

## Key Improvements

### 🎨 **Design System Alignment**
- **Consistent Styling**: Now uses the app's design tokens and CSS variables
- **Modern UI**: Enhanced modal with backdrop blur, better shadows, and smooth animations
- **Responsive Design**: Works seamlessly across different screen sizes
- **Color Scheme**: Follows the app's light/dark theme support

### 🔧 **Enhanced Form Experience**
- **Custom RJSF Styling**: Form controls now match the app's design language
- **Better Validation**: Real-time validation with clear error messages
- **Field Types**: Support for text, number, select, checkbox, radio, and textarea inputs
- **Array Fields**: Improved styling for complex parameter arrays
- **Tooltips**: Hover tooltips for field descriptions

### ♿ **Accessibility Improvements**
- **Keyboard Navigation**: Full keyboard support with focus trapping
- **Screen Reader Support**: Proper ARIA labels and roles
- **Focus Management**: Automatic focus handling and visual indicators
- **Escape Key**: Modal closes with Escape key

### 🚀 **User Experience Enhancements**
- **Loading States**: Clear loading indicators for data fetching and form submission
- **Error Handling**: Comprehensive error states with user-friendly messages
- **Success Feedback**: Visual feedback during bot startup
- **Form Validation**: Real-time validation with field-level error clearing

### 🎯 **Visual Improvements**
- **Enhanced Spinner**: Modern loading animation
- **Better Typography**: Consistent font weights and sizes
- **Icon Integration**: Lucide React icons for better visual hierarchy
- **Card Layout**: Organized information in clean card components
- **Status Indicators**: Clear visual feedback for different states

## Technical Features

### Modal Component
```tsx
<Modal 
  open={open} 
  onClose={onClose} 
  title="Configure Bot Parameters"
  icon={<Bot className="h-6 w-6" />}
>
  {/* Content */}
</Modal>
```

### Form Styling
- Custom CSS for RJSF forms that matches the app's design system
- Responsive form controls with proper focus states
- Support for all common input types

### State Management
- Loading states for data fetching
- Form validation with error tracking
- Submission states with loading indicators

## Usage Example

```tsx
import { BotConfigModal } from './components/bot_management/BotConfigModal';

function BotManager() {
  const [showModal, setShowModal] = useState(false);
  const [botId, setBotId] = useState<string | null>(null);

  const handleRunBot = async (params: any) => {
    try {
      // API call to start bot
      await startBot(botId, params);
      setShowModal(false);
    } catch (error) {
      // Error handling
    }
  };

  return (
    <>
      {/* Your bot manager UI */}
      
      <BotConfigModal
        open={showModal}
        onClose={() => setShowModal(false)}
        botDefId={botId || ""}
        onRun={handleRunBot}
      />
    </>
  );
}
```

## Design System Integration

The enhanced modal uses the following design tokens:
- `--background`, `--foreground` for colors
- `--border`, `--ring` for focus states
- `--primary`, `--secondary` for accents
- `--muted`, `--accent` for subtle elements
- `--destructive` for error states
- `--radius` for border radius consistency

## Browser Support
- Modern browsers with CSS Grid and Flexbox support
- Responsive design for mobile and desktop
- Progressive enhancement for older browsers

## Performance
- Efficient re-renders with proper React hooks usage
- Minimal bundle size impact
- Optimized animations and transitions

## Future Enhancements
- Dark mode support (already prepared with CSS variables)
- Custom field widgets for complex parameter types
- Form templates for common bot configurations
- Integration with form validation libraries
- Advanced parameter validation rules

# BotConfigModal Metadata Enhancements

The `BotConfigModal` component now supports metadata-based input fields that can dynamically render different types of input controls based on field configuration, with comprehensive validation for required fields and API integration for bot creation.

## Supported Metadata Types

### 1. API-Based Searchable Select Fields

For fields that need to fetch options from an API endpoint with real-time search:

```json
{
  "metadata": {
    "input": {
      "type": "api",
      "data": {
        "resource": "trade-manager:block",
        "select": ["symbol", "description"]
      },
      "display": ["symbol"],
      "actual": "id"
    }
  }
}
```

**Properties:**
- `type`: Set to "api" for API-based fields
- `data.resource`: The API resource to query (e.g., "trade-manager:block")
- `data.select`: Array of fields to select from the API response
- `display`: Array specifying which fields to display in the dropdown
- `actual`: Field to use as the actual value (defaults to 'id')

**Features:**
- **Real-time search**: Options are loaded dynamically as the user types
- **Debounced API calls**: 300ms delay to prevent excessive API requests
- **Search highlighting**: Results are filtered based on user input
- **Loading states**: Visual feedback during API calls
- **Error handling**: Graceful fallback for API failures

### 2. Enum-Based Select Fields with Metadata

For fields with predefined options that include display values:

```json
{
  "metadata": {
    "input": {
      "type": "fixture",
      "data": [
        {"key": "BLOCK:HPG", "display": "HPG"},
        {"key": "BLOCK:VNM", "display": "VNM"}
      ],
      "display": ["display"]
    }
  }
}
```

**Properties:**
- `type`: Set to "fixture" for predefined enum fields
- `data`: Array of objects with `key` and `display` properties
- `display`: Array specifying which field to display

## Bot Creation API Integration

The component now integrates with the `trade-bot:create-bot` API to create and run bots:

### API Call
When the user submits the form, the component:

1. **Validates all required fields**
2. **Calls the API**: `APIManager.create("trade-bot:create-bot", { bot_def_id, params })`
3. **Handles response**: Success/error handling with user feedback
4. **Updates UI**: Loading states and error messages

### Request Payload
```json
{
  "bot_def_id": "bot-definition-id",
  "params": {
    "field1": "value1",
    "field2": "value2"
  }
}
```

### Response Handling
- **Success**: Bot created successfully, modal closes, success feedback shown
- **Error**: Error message displayed, modal remains open for correction

### Loading States
- **Form submission**: "Creating Bot..." button state
- **API call**: Disabled form during API request
- **Error display**: Clear error messages for failed requests

## Required Field Validation

The component now includes comprehensive validation for required fields:

### Visual Indicators
- **Red asterisk (*)**: Required fields are marked with a red asterisk
- **Red border**: Invalid fields have red borders
- **Error messages**: Individual field error messages appear below each field
- **Error summary**: All validation errors are summarized at the top of the form

### Validation Rules
- **Required fields**: Fields listed in `params.required` must have values
- **Empty string validation**: Empty strings are treated as invalid
- **Real-time feedback**: Validation errors appear immediately
- **Form submission**: Form only submits if all validations pass

### Validation Features
- **Field-level validation**: Each field shows its own error message
- **Summary display**: All errors are listed at the top for easy review
- **Visual feedback**: Invalid fields are highlighted with red borders
- **Prevent submission**: Form submission is blocked until all errors are resolved

## Implementation Details

### SearchableSelect Component

The new `SearchableSelect` component provides:

- **Input field**: Text input for search terms
- **Dropdown**: Dynamic list of search results
- **Debounced search**: 300ms delay between keystrokes and API calls
- **Loading states**: Visual feedback during data fetching
- **Selection handling**: Proper value and display management
- **Validation support**: Required field and error state handling

### Type Guards

The component includes type guards to safely handle different metadata formats:

- `isObjectSchema()`: Checks if the definition is an object schema
- **Type-based detection**: Uses `type` field to determine input type

### Dynamic Data Loading

For API-based fields, the component:

1. **Triggers on focus**: Loads initial data when user focuses the input
2. **Debounced search**: Waits 300ms after user stops typing before making API call
3. **Search parameters**: Uses the search term in the API query with `text` parameter
4. **Result limiting**: Limits results to 10 items for performance
5. **Error handling**: Gracefully handles API failures

### Input Field Rendering

The `renderInputField()` function handles the rendering logic:

1. **API-based searchable selects**: Renders `SearchableSelect` component with dynamic loading
2. **Enum-based selects**: Uses predefined enum values
3. **Fallback**: Defaults to text input for other field types
4. **Validation**: All input types support required field validation

## Usage Example

```typescript
// Bot definition with searchable API metadata and required fields
const botDefinition = {
  name: "My Bot",
  key: "my-bot",
  description: "A trading bot",
  params: {
    required: ["block", "market"], // Required fields
    properties: {
      block: {
        type: "string",
        title: "Block",
        metadata: {
          input: {
            type: "api",
            data: {
              resource: "trade-manager:block",
              select: ["symbol", "description"]
            },
            display: ["symbol"],
            actual: "id"
          }
        }
      },
      market: {
        type: "string",
        title: "Market",
        metadata: {
          input: {
            type: "fixture",
            data: [
              {"key": "HOSE", "display": "Ho Chi Minh Stock Exchange"},
              {"key": "HNX", "display": "Hanoi Stock Exchange"}
            ],
            display: ["display"]
          }
        }
      },
      optional_field: {
        type: "string",
        title: "Optional Field",
        description: "This field is optional"
      }
    }
  }
};

// BotManager integration
const handleBotRun = (result: any) => {
  if (result.success) {
    console.log("Bot created successfully:", result.data);
    // Handle success - show notification, refresh data, etc.
  } else {
    console.error("Failed to create bot:", result.error);
    // Handle error - show error message
  }
};

<BotConfigModal
  open={showModal}
  onClose={() => setShowModal(false)}
  botDefId={botDefId}
  onRun={handleBotRun}
/>
```

## User Experience Features

### Searchable API Fields
- **Type to search**: Users can type to search through available options
- **Real-time results**: Results update as the user types
- **Loading indicators**: Clear feedback during API calls
- **No results message**: Helpful message when no results are found
- **Keyboard navigation**: Full keyboard support for accessibility

### Validation Features
- **Required field indicators**: Clear visual markers for required fields
- **Real-time validation**: Immediate feedback on field changes
- **Error summaries**: All errors displayed in one place
- **Form submission control**: Prevents submission with validation errors
- **Visual error states**: Red borders and error messages for invalid fields

### Bot Creation Features
- **Loading states**: Clear feedback during bot creation
- **Error handling**: Comprehensive error messages for failed requests
- **Success feedback**: Confirmation when bot is created successfully
- **Form validation**: Prevents submission with invalid data
- **API integration**: Seamless integration with backend services

### Performance Optimizations
- **Debounced API calls**: Prevents excessive server requests
- **Result limiting**: Limits to 10 results per search
- **Caching**: Uses API manager caching when available
- **Error boundaries**: Graceful handling of network issues

## Backward Compatibility

The implementation maintains full backward compatibility with existing bot definitions:

- Fields without metadata continue to work as before
- Existing enum-based fields still function correctly
- Text input fields remain the default for simple parameters
- Required field validation works with all input types

## Error Handling

- API failures are gracefully handled with empty option arrays
- Invalid metadata configurations fall back to text input
- Loading states are properly managed during API calls
- Network timeouts and errors are handled gracefully
- Validation errors are clearly displayed to users
- Bot creation errors are shown with helpful messages 