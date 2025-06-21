# ItemView Component

A generic class-based component for retrieving and displaying items using APIManager with tab functionality and context support.

## Features

- **Item Fetching**: Automatically fetches item data using APIManager
- **Tab Interface**: Built-in tab functionality using Radix UI primitives
- **Named Tabs**: Support for multiple named tabs using TabItem components
- **Context Support**: Provides context for child components to access item data
- **Error Handling**: Built-in loading and error states
- **Customizable**: Supports custom tab content and styling
- **TypeScript**: Fully typed with TypeScript support

## Props

| Prop               | Type                     | Required | Description                                                                      |
| ------------------ | ------------------------ | -------- | -------------------------------------------------------------------------------- |
| `_id`              | `string`                 | Yes      | The unique identifier of the item to fetch                                       |
| `apiName`          | `string`                 | Yes      | The API endpoint name to fetch from (e.g., "idm:user" or "collection:queryName") |
| `className`        | `string`                 | No       | Additional CSS classes                                                           |
| `onError`          | `(error: Error) => void` | No       | Callback function called when an error occurs                                    |
| `onLoad`           | `(data: any) => void`    | No       | Callback function called when data is loaded                                     |
| `loadingComponent` | `React.ReactNode`        | No       | Custom loading component                                                         |
| `errorComponent`   | `React.ReactNode`        | No       | Custom error component                                                           |
| `params`           | `ApiParams`              | No       | Additional parameters for the API call                                           |
| `defaultTab`       | `string`                 | No       | Default active tab (defaults to "details")                                       |
| `children`         | `React.ReactNode`        | No       | TabItem components for custom tabs                                               |

## TabItem Component

The `TabItem` component is used to define individual named tabs within the ItemView:

```typescript
interface TabItemProps {
  name: string; // Unique identifier for the tab
  label: string; // Display label for the tab
  children: React.ReactNode; // Tab content
}
```

## Context

The component provides a context that child components can use to access item data:

```typescript
interface ItemViewContextValue {
  item: any | null;
  loading: boolean;
  error: Error | null;
  itemId: string;
  apiName: string;
  refreshItem: () => void;
}
```

## Usage

### Basic Usage

```tsx
import { ItemView } from "rjs-admin";

<ItemView _id="42a7f9a5-7e12-4384-a97d-abe9271797dd" apiName="idm:user" />;
```

### With Named Tabs

```tsx
import { ItemView, TabItem, useItemView } from "rjs-admin";

const UserProfileTab = () => {
  const { item, loading, error } = useItemView();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h3>
        {item.name__given} {item.name__family}
      </h3>
      <p>Email: {item.verified_email}</p>
    </div>
  );
};

<ItemView
  _id="42a7f9a5-7e12-4384-a97d-abe9271797dd"
  apiName="idm:user"
  defaultTab="profile"
>
  <TabItem name="profile" label="Profile">
    <UserProfileTab />
  </TabItem>
  <TabItem name="settings" label="Settings">
    <UserSettingsTab />
  </TabItem>
</ItemView>;
```

### With Parameters

```tsx
<ItemView
  _id="42a7f9a5-7e12-4384-a97d-abe9271797dd"
  apiName="idm:user"
  params={{
    cache: false,
    headers: {
      "X-Custom-Header": "value",
    },
  }}
  onLoad={(data) => console.log("User loaded:", data)}
  onError={(error) => console.error("Error:", error)}
/>
```

## Tab Structure

The component automatically creates tabs based on the provided TabItem components:

1. **Details Tab**: Always present, shows the item data in JSON format
2. **Custom Tabs**: Created from TabItem components with their own names and labels

### Multiple Custom Tabs Example

```tsx
<ItemView _id="user123" apiName="idm:user" defaultTab="profile">
  <TabItem name="profile" label="Profile">
    <UserProfileTab />
  </TabItem>
  <TabItem name="settings" label="Settings">
    <UserSettingsTab />
  </TabItem>
  <TabItem name="activity" label="Activity">
    <UserActivityTab />
  </TabItem>
</ItemView>
```

This creates four tabs: "Details", "Profile", "Settings", and "Activity".

## API Integration

The component uses APIManager to fetch data:

- **Item Fetching**: Uses `APIManager.queryItem(apiName, _id, params)`
- **Error Handling**: Catches and displays API errors
- **Caching**: Supports APIManager caching through params
- **Headers**: Supports custom headers through params

## Styling

The component uses CSS classes with the `iv__` prefix:

- `.item-view` - Main container
- `.iv__tabs` - Tabs container
- `.iv__tabs-list` - Tab list
- `.iv__tab-trigger` - Tab trigger buttons
- `.iv__tab-content` - Tab content areas
- `.iv__loading` - Loading state
- `.iv__error` - Error state
- `.iv__details` - Default details view
- `.iv__title` - Item title
- `.iv__content` - Content area
- `.iv__data` - Raw data display
- `.iv__empty` - Empty state
- `.iv__retry` - Retry button

## Examples

See the [ItemView examples](../examples/ItemView.example.tsx) for comprehensive usage examples including:

- Basic item display
- Custom tab components with TabItem
- Organization data with multiple tabs
- Parameter passing
- Error handling
- Loading states

## Storybook

The component includes Storybook stories demonstrating various use cases:

- Basic user display
- Custom tabs with user profile and settings
- Organization data with multiple tabs
- Error and loading states
- Parameter examples

## Dependencies

- **Radix UI**: For tab functionality
- **rjs-frame**: For APIManager integration
- **React**: For component functionality
