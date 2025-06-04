import React from 'react';
import { cn } from '../../lib/utils';
import { RowComponentProps } from './types';

const RowComponent: React.FC<RowComponentProps> = ({
  metadata,
  data,
  index,
}) => {
  const getAlignmentClass = (align?: string) => {
    switch (align) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  };

  const formatValue = (value: any, fieldName: string) => {
    const fieldMeta = metadata?.fields?.[fieldName];
    
    if (!fieldMeta) {
      return value;
    }
    
    if (fieldMeta.format) {
      return fieldMeta.format(value);
    }

    switch (fieldMeta.type) {
      case 'boolean':
        return value ? '✓' : '✗';
      case 'date':
        if (value instanceof Date) {
          return value.toLocaleDateString();
        }
        if (typeof value === 'string') {
          return new Date(value).toLocaleDateString();
        }
        return value;
      case 'number':
        if (typeof value === 'number') {
          return value.toLocaleString();
        }
        return value;
      default:
        return value;
    }
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

  return (
    <tr 
      className={cn(
        "border-b hover:bg-muted/30 transition-colors",
        index % 2 === 0 ? "bg-background" : "bg-muted/10"
      )}
    >
      {Object.entries(metadata.fields).map(([fieldName, fieldMeta]) => (
        <td
          key={fieldName}
          className={cn(
            "px-4 py-3 text-sm",
            getAlignmentClass(fieldMeta.align),
            fieldMeta.className
          )}
          style={{
            width: fieldMeta.width
          }}
        >
          {formatValue(data[fieldName], fieldName)}
        </td>
      ))}
    </tr>
  );
};

export default RowComponent; 