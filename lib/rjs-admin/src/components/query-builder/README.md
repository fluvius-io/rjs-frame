# Query Builder Components

The Query Builder provides a complete visual interface for building complex database queries with field selection, sorting, filtering, and pagination.

## Main Component

### QueryBuilder

The primary component that provides the complete query building interface:

```tsx
import { QueryBuilder } from 'rjs-admin';

function MyComponent() {
  return (
    <QueryBuilder
      metadataApi="idm:user"
      title="User Query Builder"
      onQueryChange={(query) => console.log('Query changed:', query)}
      onExecute={(query) => console.log('Execute query:', query)}
    />
  );
}
```

**Features:**
- 📊 **Field Selection**: Choose which fields to include/exclude in results
- 🔄 **Sorting**: Define multiple sort criteria with direction control
- 🔍 **Advanced Filtering**: Build complex filters with AND/OR groups and nested conditions
- 📄 **Pagination**: Control page size and current page
- ⚡ **Real-time**: Live query generation and validation
- 🎯 **Auto-detection**: Automatically adapts UI based on API capabilities

## Component Architecture

```
QueryBuilder (main component)
├── FieldSelector (field selection)
├── SortBuilder (sorting rules)
├── FilterBuilder (internal - filtering logic)
│   ├── CompositeFilterGroup (AND/OR groups)
│   └── FieldFilter (individual field filters)
├── QueryDisplay (generated query preview)
└── Pagination controls
```

## Props

### QueryBuilder Props

```tsx
interface QueryBuilderProps {
  metadataApi: string;           // API endpoint for field metadata
  initialQuery?: Partial<FrontendQuery>;  // Initial query state
  onQueryChange?: (query: FrontendQuery) => void;  // Query change callback
  onExecute?: (query: FrontendQuery) => void;      // Execute button callback
  title?: string;                // Component title
  className?: string;            // Additional CSS classes
}
```

## Query Structure

The component generates queries in this format:

```tsx
interface FrontendQuery {
  limit: number;           // Page size
  page: number;           // Current page
  select?: string[];      // Fields to include
  deselect?: string[];    // Fields to exclude
  sort?: string[];        // Sort criteria ['field:asc', 'field:desc']
  query?: string;         // Filter query string
}
```

## Filtering Capabilities

### Simple Filters
For APIs without composite operator support:
```
name = "John" AND age > 25
```

### Composite Filters (Advanced)
For APIs with `:and`/`:or` operators:
```json
{
  "type": "composite",
  "operator": ":and",
  "children": [
    {
      "type": "composite", 
      "operator": ":or",
      "children": [
        {"field": "name", "operator": "eq", "value": "Smith"},
        {"field": "name", "operator": "eq", "value": "Jones"}
      ]
    },
    {"field": "age", "operator": "gte", "value": 25}
  ]
}
```

## API Metadata Requirements

The component expects metadata in this format:

```tsx
interface QueryMetadata {
  fields: Record<string, {
    label: string;
    sortable: boolean;
    hidden: boolean;
    identifier: boolean;
  }>;
  operators: Record<string, {
    field_name: string;
    operator: string;
    widget?: any;
  }>;
  sortables: string[];
  default_order: string[];
}
```

## Examples

### Basic Usage
```tsx
<QueryBuilder
  metadataApi="idm:user"
  onQueryChange={(query) => setCurrentQuery(query)}
/>
```

### With Initial Query
```tsx
<QueryBuilder
  metadataApi="idm:user"
  initialQuery={{
    limit: 25,
    page: 1,
    select: ['name', 'email'],
    sort: ['name:asc']
  }}
  onExecute={(query) => executeSearch(query)}
/>
```

### Integration with Data Table
```tsx
function UserList() {
  const [query, setQuery] = useState<FrontendQuery>();
  
  return (
    <div>
      <QueryBuilder
        metadataApi="idm:user"
        onQueryChange={setQuery}
      />
      
      {query && (
        <ApiPaginatedList
          metadataApi="idm:user"
          dataApi="idm:user"
          initialQuery={query}
        />
      )}
    </div>
  );
}
```

## Storybook Examples

See the Storybook stories for interactive examples:
- **Basic**: Simple query building with real API
- **Organizations**: Different metadata structure
- **Composite Operators**: Advanced AND/OR filtering demo 