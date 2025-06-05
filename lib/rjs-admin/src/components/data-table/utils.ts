import { fetchJson } from '../../lib/api';
import { QueryMetadata } from './types';

/**
 * Checks if metadata is in the correct QueryMetadata format
 */
export function isQueryMetadata(metadata: any): metadata is QueryMetadata {
  return metadata && 
    typeof metadata === 'object' && 
    'operators' in metadata && 
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
export async function fetchMetadata(url: string): Promise<QueryMetadata> {
  try {
    const metadata = await fetchJson<QueryMetadata>(url);
    
    if (!isQueryMetadata(metadata)) {
      throw new Error('Invalid metadata format received from API');
    }
    
    return metadata;
  } catch (error) {
    console.error('Error fetching metadata:', error);
    throw error;
  }
}

/**
 * Gets default sort configuration from QueryMetadata
 */
export function getDefaultSort(metadata: QueryMetadata): { field: string; direction: 'asc' | 'desc' } | undefined {
  if (metadata.default_order && metadata.default_order.length > 0) {
    const defaultOrder = metadata.default_order[0];
    const [field, direction] = defaultOrder.split(':');
    return {
      field,
      direction: direction === 'desc' ? 'desc' : 'asc'
    };
  }
  return undefined;
} 