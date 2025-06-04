import React, { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../common/Button';
import HeaderComponent from './HeaderComponent';
import PaginationControls from './PaginationControls';
import RowComponent from './RowComponent';
import { FilterConfig, PaginatedListProps, SortConfig } from './types';

const PaginatedList: React.FC<PaginatedListProps> = (props) => {
  const {
    data,
    pagination,
    loading = false,
    backgroundLoading = false,
    title,
    subtitle,
    showSearch = false,
    showFilters = false,
    searchPlaceholder = "Search...",
    onSort,
    onFilter,
    onSearch,
    onPageChange,
    actions,
    className,
    metadata,
  } = props;

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterConfig[]>([]);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [currentSort, setCurrentSort] = useState<SortConfig>();

  // Handle metadata initialization
  useEffect(() => {
    if (metadata?.default_order && metadata.default_order.length > 0 && !currentSort) {
      const defaultOrder = metadata.default_order[0];
      const [field, direction] = defaultOrder.split(':');
      setCurrentSort({
        field,
        direction: direction === 'desc' ? 'desc' : 'asc'
      });
    }
  }, [metadata]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  const handleSort = (sort: SortConfig) => {
    setCurrentSort(sort);
    onSort?.(sort);
  };

  const handleFilterAdd = () => {
    if (!metadata || !metadata.fields) return;
    
    const availableFields = Object.entries(metadata.fields)
      .filter(([, fieldMeta]) => !fieldMeta.hidden)
      .map(([fieldName]) => fieldName);
    
    const availableOperators = Object.entries(metadata.operators || {})
      .filter(([, paramMeta]) => paramMeta.field_name !== '')
      .map(([, paramMeta]) => paramMeta.operator);
    
    if (availableFields.length === 0) return;
    
    const newFilter: FilterConfig = {
      field: availableFields[0],
      operator: availableOperators[0] || 'eq',
      value: '',
    };
    setFilters([...filters, newFilter]);
  };

  const handleFilterChange = (index: number, field: keyof FilterConfig, value: any) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], [field]: value };
    setFilters(newFilters);
    onFilter?.(newFilters);
  };

  const handleFilterRemove = (index: number) => {
    const newFilters = filters.filter((_, i) => i !== index);
    setFilters(newFilters);
    onFilter?.(newFilters);
  };

  const renderFilterInput = (filter: FilterConfig, index: number) => {
    if (!metadata) return null;
    
    // For QueryMetadata, we need to infer the input type based on the operator
    const getInputType = (operator: string) => {
      switch (operator) {
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
    };

    const inputType = getInputType(filter.operator);
    
    if (inputType === 'boolean') {
      return (
        <select
          value={filter.value}
          onChange={(e) => handleFilterChange(index, 'value', e.target.value === 'true')}
          className="px-2 py-1 text-sm border rounded bg-background"
        >
          <option value="">Select...</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      );
    }

    return (
      <input
        type={inputType}
        value={filter.value}
        onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
        placeholder={`Enter ${filter.field} value`}
        className="px-2 py-1 text-sm border rounded bg-background"
      />
    );
  };

  // Show loading state while fetching metadata
  if (!metadata) {
    return (
      <div className={cn("bg-background border rounded-lg shadow-sm", className)}>
        <div className="p-8 text-center">
          <div className="text-sm text-muted-foreground">Loading metadata...</div>
        </div>
      </div>
    );
  }

  const availableFields = Object.entries(metadata.fields)
    .filter(([, fieldMeta]) => !fieldMeta.hidden)
    .map(([fieldName]) => fieldName);

  const hasFilters = metadata.operators && Object.values(metadata.operators).some(param => param.field_name !== '');

  return (
    <div className={cn("bg-background border rounded-lg shadow-sm", className)}>
      {/* Header Section */}
      {(title || subtitle || actions || showSearch || showFilters) && (
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <div>
              {title && <h2 className="text-lg font-semibold">{title}</h2>}
              {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            <div className="flex items-center gap-2">
              {actions}
            </div>
          </div>

          {(showSearch || showFilters) && (
            <div className="flex items-center gap-4">
              {showSearch && (
                <div className="flex-1 max-w-sm">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder={searchPlaceholder}
                    className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                  />
                </div>
              )}

              {showFilters && hasFilters && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilterPanel(!showFilterPanel)}
                  >
                    Filters {filters.length > 0 && `(${filters.length})`}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleFilterAdd}
                  >
                    + Add Filter
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Filter Panel */}
          {showFilterPanel && showFilters && hasFilters && (
            <div className="mt-4 p-3 border rounded-md bg-muted/20">
              <div className="space-y-3">
                {filters.map((filter, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <select
                      value={filter.field}
                      onChange={(e) => handleFilterChange(index, 'field', e.target.value)}
                      className="px-2 py-1 text-sm border rounded bg-background"
                    >
                      {availableFields.map((fieldName) => (
                        <option key={fieldName} value={fieldName}>
                          {fieldName}
                        </option>
                      ))}
                    </select>

                    <select
                      value={filter.operator}
                      onChange={(e) => handleFilterChange(index, 'operator', e.target.value)}
                      className="px-2 py-1 text-sm border rounded bg-background"
                    >
                      {Object.entries(metadata.operators || {}).map(([opName, opMeta]) => (
                        <option key={opName} value={opMeta.operator}>
                          {opMeta.operator}
                        </option>
                      ))}
                    </select>

                    {renderFilterInput(filter, index)}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFilterRemove(index)}
                    >
                      ✕
                    </Button>
                  </div>
                ))}

                {filters.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No filters applied. Click "Add Filter" to add one.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="relative">
        {/* Background loading indicator - small and subtle */}
        {backgroundLoading && (
          <div className="absolute top-2 right-2 z-10">
            <div className="flex items-center gap-2 px-3 py-1 bg-background/90 border rounded-full text-xs text-muted-foreground">
              <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              Updating...
            </div>
          </div>
        )}
        
        {/* Full loading overlay - only for initial loads */}
        {loading && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              Loading...
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <HeaderComponent metadata={metadata} sort={currentSort} onSort={handleSort} />
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={metadata?.fields ? Object.keys(metadata.fields).length : 1}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    {loading ? 'Loading...' : 'No data available'}
                  </td>
                </tr>
              ) : (
                data.map((row, index) => (
                  <RowComponent
                    key={index}
                    metadata={metadata}
                    data={row}
                    index={index}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <PaginationControls
        pagination={pagination}
        onPageChange={onPageChange}
        loading={loading || backgroundLoading}
      />
    </div>
  );
};

export default PaginatedList; 