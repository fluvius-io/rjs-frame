# Data Table Components

The Data Table components provide powerful data display and management capabilities with dynamic column generation from API metadata.

## Components

### DataTable
The core table component that displays data with provided metadata.

### ResourceDataTable  
A convenience component that fetches both metadata and data from API endpoints using a single API reference.

## Usage

### Option 1: Using ResourceDataTable (Complete Solution)

```tsx
import { ResourceDataTable } from 'rjs-admin';

function UsersTable() {
  return (
    <ResourceDataTable
      dataApi="idm:user"
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

### Option 2: Using DataTable with provided metadata

```tsx
import { DataTable, type QueryMetadata } from 'rjs-admin';

const apiMetadata: QueryMetadata = {
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
  operators: {
    // ... operator definitions
  },
  sortables: ["_id", "name__family"],
  default_order: ["_id:asc"]
};

function UsersTable() {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  const handleQueryChange = (query) => {
    // Handle filter, search, and sort changes
    // Reset to page 1 is handled automatically
  };

  const handlePageChange = (page, pageSize) => {
    // Handle pagination changes
    setPagination(prev => ({ ...prev, page, pageSize }));
  };

  return (
    <DataTable
      metadata={apiMetadata}
      data={data}
      pagination={pagination}
      title="Users"
      showSearch
      showFilters
      onQueryChange={handleQueryChange}
      onPageChange={handlePageChange}
    />
  );
}
```

## API Integration

### Unified API Endpoint

ResourceDataTable uses a single `dataApi` prop to fetch both metadata and data from the same API endpoint:

- **Metadata**: Fetched using `APIManager.queryMeta(dataApi)`
- **Data**: Fetched using `APIManager.query(dataApi, params)`

This simplified approach reduces configuration complexity and ensures consistency between metadata and data sources.

### Callback Structure

The new callback structure provides better separation of concerns:

- `onQueryChange`: Handles filters, search, and sorting changes
- `onPageChange`: Handles pagination changes separately

```tsx
// Before (old structure)
onQueryUpdate={(query) => {
  // Had to handle everything in one callback
  console.log(query.page, query.pageSize, query.searchQuery, query.filters);
}}

// After (new structure)
onQueryChange={(query) => {
  // Only handles query-related changes
  console.log(query.searchQuery, query.query, query.sort);
}}
onPageChange={(page, pageSize) => {
  // Dedicated pagination handler
  console.log(page, pageSize);
}}
```

## API Endpoints

### Metadata Endpoint
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
  "operators": {
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

### Data Endpoint
Supports query parameters for pagination, sorting, filtering, and search:

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)  
- `sort` - Sort field and direction (e.g., "name__family:asc")
- `search` - Search query string
- `query` - JSON filter query string

**Response format:**
```json
{
  "data": [...],           // Array of data items
  "meta": {
    "total_items": 150,    // Total number of items
    "page_no": 1,          // Current page
    "limit": 10            // Items per page
  }
}
```

## Features

- **Dynamic Columns**: Table columns are automatically generated from API metadata
- **Automatic Sorting**: Sortable columns are determined by the `sortable` field
- **Advanced Filtering**: QueryBuilder-based filter system with AND/OR support
- **Separated Callbacks**: Clean separation between query and pagination handling
- **Type Inference**: Field types are automatically inferred from field names
- **Default Sorting**: Initial sort order is applied from `default_order`
- **Hidden Fields**: Fields marked as `hidden: true` are excluded from the table
- **Error Handling**: Graceful handling of metadata loading errors
- **Loading States**: Shows loading indicator while fetching metadata
- **Server Integration**: Full API integration for both metadata and data

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

## Supported Operators

The component automatically maps API operators to UI controls:

- `eq` → "Equals" (text input)
- `ilike` → "Contains" (text input)
- `in` → "In List" (text input, comma-separated)
- `is` → "Is" (boolean select)
- `gt`, `lt`, `gte`, `lte` → Number comparison (number input)

## Migration Guide

If migrating from the old PaginatedList components:

1. **Component Names**: 
   - `PaginatedList` → `DataTable`
   - `ApiPaginatedList` → `ResourceDataTable`

2. **Import Paths**:
   - `from './components/paginate'` → `from './components/data-table'`

3. **Callback Structure**:
   - Replace `onQueryUpdate` with `onQueryChange` + `onPageChange`
   - Extract pagination handling from query handling 