# Query Builder Components

The Query Builder provides a complete visual interface for building complex database queries with field selection, sorting, and filtering.

## Main Component

### QueryBuilder

The primary component that provides the complete query building interface:

```tsx
import { QueryBuilder } from 'rjs-admin';

function MyComponent() {
  const [queryState, setQueryState] = useState<QueryBuilderState>();
  
  return (
    <QueryBuilder
      metadata={myMetadata}
      title="User Query Builder"
      onQueryChange={setQueryState}
      onExecute={(state) => console.log('Execute state:', state)}
    />
  );
}
```

**Features:**
- 📊 **Field Selection**: Choose which fields to include in results
- 🔄 **Sorting**: Define multiple sort criteria with direction control
- 🔍 **Advanced Filtering**: Build complex filters with AND/OR groups and nested conditions
- ⚡ **Real-time**: Live query state generation and validation
- 🎯 **Auto-detection**: Automatically adapts UI based on metadata capabilities

## Component Architecture

```
QueryBuilder (main component)
├── FieldSelector (field selection)
├── SortBuilder (sorting rules)
├── FilterBuilder (internal - filtering logic)
│   ├── CompositeFilterGroup (AND/OR groups)
│   └── FieldFilter (individual field filters)
└── QueryDisplay (query state preview)
```

## Props

### QueryBuilder Props

```tsx
interface QueryBuilderProps {
  metadata: QueryMetadata;           // Field metadata (required)
  initialQuery?: Partial<QueryBuilderState>;  // Initial state
  onQueryChange?: (state: QueryBuilderState) => void;  // State change callback
  onExecute?: (state: QueryBuilderState) => void;      // Execute button callback
  title?: string;                // Component title
  className?: string;            // Additional CSS classes
  
  // Section visibility controls
  showFieldSelection?: boolean;  // Show/hide field selection (default: true)
  showSortRules?: boolean;      // Show/hide sort rules (default: true)
  showFilterRules?: boolean;    // Show/hide filter rules (default: true)
  showQueryDisplay?: boolean;   // Show/hide query display (default: true)
}
```

## Query State Structure

The component operates on `QueryBuilderState` internally:

```tsx
interface QueryBuilderState {
  selectedFields: string[];      // Fields to include
  sortRules: SortRule[];        // Sort criteria
  filterRules: FilterRule[];    // Filter conditions
}

interface SortRule {
  field: string;
  direction: 'asc' | 'desc';
}

interface FilterRule {
  id: string;
  type: 'field' | 'composite';
  // ... additional properties based on type
}
```

## Converting to Backend Format

To convert `QueryBuilderState` to `ResourceQuery` for API calls:

```tsx
import { toResourceQuery } from 'rjs-admin';

const resourceQuery = toResourceQuery(queryBuilderState);
// Results in: { select?: string[], sort?: string[], query?: string }
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

## Metadata Requirements

The component expects metadata in this format:

```tsx
interface QueryMetadata {
  fields: Record<string, {
    label: string;
    sortable: boolean;
    hidden: boolean;
    identifier: boolean;
    factory: string | null;
    source: string | null;
  }>;
  operators: Record<string, {
    index: number;
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
  metadata={myMetadata}
  onQueryChange={(state) => setCurrentState(state)}
/>
```

### With Initial State
```tsx
<QueryBuilder
  metadata={myMetadata}
  initialQuery={{
    selectedFields: ['name', 'email'],
    sortRules: [{ field: 'name', direction: 'asc' }],
    filterRules: []
  }}
  onExecute={(state) => executeSearch(state)}
/>
```

### Section Visibility Control
```tsx
<QueryBuilder
  metadata={myMetadata}
  showFieldSelection={false}  // Hide field selection
  showSortRules={true}       // Show sorting
  showFilterRules={true}     // Show filters
  showQueryDisplay={false}   // Hide raw state display
/>
```

### Integration with Data Table
```tsx
function MyDataTable() {
  const [queryState, setQueryState] = useState<QueryBuilderState>();
  
  const handleExecute = (state: QueryBuilderState) => {
    const resourceQuery = toResourceQuery(state);
    // Send resourceQuery to your API
    fetchData(resourceQuery);
  };

  return (
    <div>
      <QueryBuilder
        metadata={myMetadata}
        onExecute={handleExecute}
      />
      
      <DataTable
        data={data}
        // ... other props
      />
    </div>
  );
}
```

## Storybook Examples

See the Storybook stories for interactive examples:
- **Basic**: Simple query building with real API
- **Organizations**: Different metadata structure
- **Composite Operators**: Advanced AND/OR filtering demo 