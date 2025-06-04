import React from 'react';
import { cn } from '../../lib/utils';
import { RowComponentProps } from './types';

const RowComponent: React.FC<RowComponentProps> = ({
  metadata,
  data,
  index,
}) => {
  const getAlignmentClass = (fieldMeta: any) => {
    if (fieldMeta.identifier) return 'text-center';
    return 'text-left';
  };

  const formatValue = (value: any, fieldName: string) => {
    // Simple formatting for common data types
    if (value === null || value === undefined) {
      return '-';
    }
    
    if (typeof value === 'boolean') {
      return value ? '✓' : '✗';
    }
    
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    
    // Handle date strings
    if (typeof value === 'string' && (fieldName.includes('date') || fieldName.includes('time'))) {
      try {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString();
        }
      } catch {
        // Fall through to return original value
      }
    }
    
    return String(value);
  };

  // Return empty row if no metadata or fields
  if (!metadata?.fields) {
    return (
      <tr className={cn(
        "border-b hover:bg-muted/30 transition-colors",
        index % 2 === 0 ? "bg-background" : "bg-muted/10"
      )}>
        <td className="px-4 py-3 text-sm text-muted-foreground">
          Loading...
        </td>
      </tr>
    );
  }

  // Filter out hidden fields
  const visibleFields = Object.entries(metadata.fields).filter(([, fieldMeta]) => !fieldMeta.hidden);

  return (
    <tr 
      className={cn(
        "border-b hover:bg-muted/30 transition-colors",
        index % 2 === 0 ? "bg-background" : "bg-muted/10"
      )}
    >
      {visibleFields.map(([fieldName, fieldMeta]) => (
        <td
          key={fieldName}
          className={cn(
            "px-4 py-3 text-sm",
            getAlignmentClass(fieldMeta)
          )}
        >
          {formatValue(data[fieldName], fieldName)}
        </td>
      ))}
    </tr>
  );
};

export default RowComponent; 