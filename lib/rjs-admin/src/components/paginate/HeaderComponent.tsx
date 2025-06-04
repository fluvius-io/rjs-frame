import React from 'react';
import { cn } from '../../lib/utils';
import { HeaderComponentProps } from './types';

const HeaderComponent: React.FC<HeaderComponentProps> = ({
  metadata,
  sort,
  onSort,
}) => {
  const handleSort = (fieldName: string) => {
    const fieldMeta = metadata?.fields?.[fieldName];
    if (!fieldMeta?.sortable || !onSort) return;

    const newDirection = 
      sort?.field === fieldName && sort.direction === 'asc' ? 'desc' : 'asc';
    
    onSort({ field: fieldName, direction: newDirection });
  };

  const getSortIcon = (fieldName: string) => {
    const fieldMeta = metadata?.fields?.[fieldName];
    if (!fieldMeta?.sortable) return null;
    
    if (sort?.field === fieldName) {
      return sort.direction === 'asc' ? '↑' : '↓';
    }
    return '↕';
  };

  const getAlignmentClass = (fieldMeta: any) => {
    if (fieldMeta.identifier) return 'text-center';
    return 'text-left';
  };

  // Return empty header if no metadata or fields
  if (!metadata?.fields) {
    return (
      <thead className="bg-muted/50">
        <tr className="border-b">
          <th className="px-4 py-3 font-medium text-sm text-muted-foreground">
            Loading...
          </th>
        </tr>
      </thead>
    );
  }

  // Filter out hidden fields
  const visibleFields = Object.entries(metadata.fields).filter(([, fieldMeta]) => !fieldMeta.hidden);

  return (
    <thead className="bg-muted/50">
      <tr className="border-b">
        {visibleFields.map(([fieldName, fieldMeta]) => (
          <th
            key={fieldName}
            className={cn(
              "px-4 py-3 font-medium text-sm text-muted-foreground",
              getAlignmentClass(fieldMeta),
              fieldMeta.sortable && onSort && "cursor-pointer hover:text-foreground transition-colors"
            )}
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