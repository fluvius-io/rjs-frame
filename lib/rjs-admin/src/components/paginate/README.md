# PaginatedList Component

The PaginatedList component now supports dynamic column generation from API metadata in addition to the existing manual metadata format.

## Usage with API Metadata

### Option 1: Using metadataUrl (Recommended)

```tsx
import { PaginatedList } from 'rjs-admin';

function UsersTable() {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  return (
    <PaginatedList
      metadataUrl="/api/_info/idm.user/"
      data={data}
      pagination={pagination}
      title="Users"
      showSearch
      showFilters
      onPageChange={(page, pageSize) => {
        // Fetch new data
      }}
    />
  );
}
```

### Option 2: Using ApiPaginatedList (Complete Solution)

```tsx
import { ApiPaginatedList } from 'rjs-admin';

function UsersTable() {
  return (
    <ApiPaginatedList
      metadataUrl="/api/_info/idm.user"
      dataUrl="/api/idm.user/"
      title="Users"
      subtitle="Manage system users"
      showSearch
      showFilters
      actions={
        <Button onClick={() => createUser()}>
          Add User
        </Button>
      }
    />
  );
}
```

### Option 3: Using metadata directly

```tsx
import { PaginatedList, type ApiMetadata } from 'rjs-admin';

const apiMetadata: ApiMetadata = {
  fields: {
    "_id": {
      "label": "User ID",
      "sortable": true,
      "hidden": false,
      "identifier": true,
      "factory": null,
      "source": null
    },
    "name__family": {
      "label": "Family Name",
      "sortable": true,
      "hidden": false,
      "identifier": false,
      "factory": null,
      "source": null
    }
    // ... more fields
  },
  params: {
    // ... operator definitions
  },
  sortables: ["_id", "name__family"],
  default_order: ["_id:asc"]
};

function UsersTable() {
  return (
    <PaginatedList
      metadata={apiMetadata}
      data={data}
      pagination={pagination}
      // ... other props
    />
  );
}
```

## API Endpoints

The component expects these API endpoints:

### Metadata Endpoint: `/api/_info/idm.user`
Returns metadata in this format:

```json
{
  "fields": {
    "field_name": {
      "label": "Display Name",
      "sortable": true,
      "hidden": false,
      "identifier": false,
      "factory": null,
      "source": null
    }
  },
  "params": {
    "field_name:operator": {
      "index": 1,
      "field_name": "field_name",
      "operator": "eq",
      "widget": null
    }
  },
  "sortables": ["field_name"],
  "default_order": ["field_name:asc"]
}
```

### Data Endpoint: `/api/idm.user/` (Optional)
Supports query parameters for pagination, sorting, filtering, and search:

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `sort` - Sort field and direction (e.g., "name__family:asc")
- `search` - Search query string
- `filter[n][field]` - Filter field name
- `filter[n][operator]` - Filter operator
- `filter[n][value]` - Filter value

**Response format:**
```json
{
  "data": [...],           // Array of data items
  "total": 150,            // Total number of items
  "page": 1,               // Current page
  "pageSize": 10,          // Items per page
  "totalPages": 15         // Total number of pages
}
```

Or simple array format:
```json
[...] // Array of data items
```

## Vite Proxy Configuration

For development, add this to your `vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:8000',
    },
  },
})
```

## Features

- **Dynamic Columns**: Table columns are automatically generated from API metadata
- **Automatic Sorting**: Sortable columns are determined by the `sortable` field
- **Smart Filtering**: Filter operators are generated from the `params` section
- **Type Inference**: Field types are automatically inferred from field names
- **Default Sorting**: Initial sort order is applied from `default_order`
- **Hidden Fields**: Fields marked as `hidden: true` are excluded from the table
- **Error Handling**: Graceful handling of metadata loading errors
- **Loading States**: Shows loading indicator while fetching metadata
- **Server Integration**: Full API integration for both metadata and data

## Supported Operators

The component automatically maps API operators to UI controls:

- `eq` → "Equals" (text input)
- `ilike` → "Contains" (text input)
- `in` → "In List" (text input, comma-separated)
- `is` → "Is" (boolean select)
- `gt`, `lt`, `gte`, `lte` → Number comparison (number input)

## Backward Compatibility

The component maintains full backward compatibility with the existing metadata format. You can continue using the old format without any changes to your existing code. 