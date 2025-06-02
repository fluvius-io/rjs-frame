import { ApiMetadata, PaginatedListMetadata, QueryOperator, FieldMetadata } from './types';

/**
 * Transforms API metadata format to internal metadata format
 */
export function transformApiMetadata(apiMetadata: ApiMetadata): PaginatedListMetadata {
  const fields: Record<string, FieldMetadata> = {};
  const operators: Record<string, QueryOperator> = {};

  // Transform fields
  Object.entries(apiMetadata.fields).forEach(([fieldName, fieldMeta]) => {
    // Skip hidden fields
    if (fieldMeta.hidden) return;

    fields[fieldName] = {
      label: fieldMeta.label,
      sortable: fieldMeta.sortable,
      type: inferFieldType(fieldName, fieldMeta),
      align: fieldMeta.identifier ? 'center' : 'left',
    };
  });

  // Transform operators/params
  Object.entries(apiMetadata.params).forEach(([paramKey, paramMeta]) => {
    // Skip logical operators (and, or)
    if (paramMeta.operator === 'and' || paramMeta.operator === 'or') return;

    const operatorKey = `${paramMeta.field_name}:${paramMeta.operator}`;
    operators[operatorKey] = {
      label: formatOperatorLabel(paramMeta.operator),
      type: inferOperatorType(paramMeta.operator),
      placeholder: getOperatorPlaceholder(paramMeta.operator, paramMeta.field_name),
    };
  });

  return {
    fields,
    operators,
  };
}

/**
 * Infers field type based on field name and metadata
 */
function inferFieldType(fieldName: string, fieldMeta: any): FieldMetadata['type'] {
  // Check if field name suggests a specific type
  if (fieldName.includes('date') || fieldName.includes('time') || fieldName.includes('created') || fieldName.includes('updated')) {
    return 'date';
  }
  
  if (fieldName.includes('count') || fieldName.includes('amount') || fieldName.includes('price') || fieldName.includes('number')) {
    return 'number';
  }
  
  if (fieldName.includes('active') || fieldName.includes('enabled') || fieldName.includes('is_')) {
    return 'boolean';
  }

  return 'text';
}

/**
 * Infers operator type based on operator name
 */
function inferOperatorType(operator: string): QueryOperator['type'] {
  switch (operator) {
    case 'eq':
    case 'ilike':
    case 'in':
      return 'text';
    case 'gt':
    case 'lt':
    case 'gte':
    case 'lte':
      return 'number';
    case 'is':
      return 'boolean';
    default:
      return 'text';
  }
}

/**
 * Formats operator name for display
 */
function formatOperatorLabel(operator: string): string {
  const operatorLabels: Record<string, string> = {
    'eq': 'Equals',
    'ilike': 'Contains',
    'in': 'In List',
    'is': 'Is',
    'gt': 'Greater Than',
    'lt': 'Less Than',
    'gte': 'Greater Than or Equal',
    'lte': 'Less Than or Equal',
  };

  return operatorLabels[operator] || operator.toUpperCase();
}

/**
 * Gets placeholder text for operator input
 */
function getOperatorPlaceholder(operator: string, fieldName: string): string {
  switch (operator) {
    case 'eq':
      return `Enter ${fieldName} value`;
    case 'ilike':
      return `Search ${fieldName}`;
    case 'in':
      return `Enter comma-separated values`;
    case 'is':
      return 'true/false';
    case 'gt':
    case 'gte':
      return 'Enter minimum value';
    case 'lt':
    case 'lte':
      return 'Enter maximum value';
    default:
      return `Enter ${fieldName} value`;
  }
}

/**
 * Checks if metadata is in API format
 */
export function isApiMetadata(metadata: any): metadata is ApiMetadata {
  return metadata && 
    typeof metadata === 'object' && 
    'params' in metadata && 
    'sortables' in metadata && 
    'default_order' in metadata &&
    metadata.fields &&
    Object.values(metadata.fields).some((field: any) => 
      'hidden' in field && 'identifier' in field
    );
}

/**
 * Fetches metadata from API endpoint
 */
export async function fetchMetadata(url: string): Promise<ApiMetadata> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch metadata: ${response.status} ${response.statusText}`);
    }
    const metadata = await response.json();
    
    if (!isApiMetadata(metadata)) {
      throw new Error('Invalid metadata format received from API');
    }
    
    return metadata;
  } catch (error) {
    console.error('Error fetching metadata:', error);
    throw error;
  }
}

/**
 * Gets default sort configuration from API metadata
 */
export function getDefaultSort(apiMetadata: ApiMetadata): { field: string; direction: 'asc' | 'desc' } | undefined {
  if (apiMetadata.default_order && apiMetadata.default_order.length > 0) {
    const defaultOrder = apiMetadata.default_order[0];
    const [field, direction] = defaultOrder.split(':');
    return {
      field,
      direction: direction === 'desc' ? 'desc' : 'asc'
    };
  }
  return undefined;
} 