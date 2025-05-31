import React from 'react';
import { HeaderComponentProps, SortConfig } from './types';
import { cn } from '../../lib/utils';

const HeaderComponent: React.FC<HeaderComponentProps> = ({
  metadata,
  sort,
  onSort,
}) => {
  const handleSort = (fieldName: string) => {
    if (!metadata.fields[fieldName]?.sortable || !onSort) return;

    const newDirection = 
      sort?.field === fieldName && sort.direction === 'asc' ? 'desc' : 'asc';
    
    onSort({ field: fieldName, direction: newDirection });
  };

  const getSortIcon = (fieldName: string) => {
    if (!metadata.fields[fieldName]?.sortable) return null;
    
    if (sort?.field === fieldName) {
      return sort.direction === 'asc' ? '↑' : '↓';
    }
    return '↕';
  };

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

  return (
    <thead className="bg-muted/50">
      <tr className="border-b">
        {Object.entries(metadata.fields).map(([fieldName, fieldMeta]) => (
          <th
            key={fieldName}
            className={cn(
              "px-4 py-3 font-medium text-sm text-muted-foreground",
              getAlignmentClass(fieldMeta.align),
              fieldMeta.sortable && onSort && "cursor-pointer hover:text-foreground transition-colors",
              fieldMeta.className
            )}
            style={{
              width: fieldMeta.width
            }}
            onClick={() => handleSort(fieldName)}
          >
            <div className="flex items-center gap-2">
              <span>{fieldMeta.label}</span>
              {fieldMeta.sortable && onSort && (
                <span className="text-xs opacity-60">
                  {getSortIcon(fieldName)}
                </span>
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default HeaderComponent; 