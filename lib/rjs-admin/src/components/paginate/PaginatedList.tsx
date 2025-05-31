import React, { useState } from 'react';
import { PaginatedListProps, FilterConfig, SortConfig } from './types';
import HeaderComponent from './HeaderComponent';
import RowComponent from './RowComponent';
import PaginationControls from './PaginationControls';
import { Button } from '../common/Button';
import { cn } from '../../lib/utils';

const PaginatedList: React.FC<PaginatedListProps> = ({
  metadata,
  data,
  pagination,
  loading = false,
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
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterConfig[]>([]);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [currentSort, setCurrentSort] = useState<SortConfig>();

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
    const newFilter: FilterConfig = {
      field: Object.keys(metadata.fields)[0],
      operator: Object.keys(metadata.operators || {})[0] || 'equals',
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
    const operator = metadata.operators?.[filter.operator];
    
    switch (operator?.type) {
      case 'select':
        return (
          <select
            value={filter.value}
            onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
            className="px-2 py-1 text-sm border rounded bg-background"
          >
            <option value="">Select...</option>
            {operator.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'boolean':
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
      default:
        return (
          <input
            type={operator?.type === 'number' ? 'number' : operator?.type === 'date' ? 'date' : 'text'}
            value={filter.value}
            onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
            placeholder={operator?.placeholder}
            className="px-2 py-1 text-sm border rounded bg-background"
          />
        );
    }
  };

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

              {showFilters && metadata.operators && (
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
          {showFilterPanel && showFilters && metadata.operators && (
            <div className="mt-4 p-3 border rounded-md bg-muted/20">
              <div className="space-y-3">
                {filters.map((filter, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <select
                      value={filter.field}
                      onChange={(e) => handleFilterChange(index, 'field', e.target.value)}
                      className="px-2 py-1 text-sm border rounded bg-background"
                    >
                      {Object.entries(metadata.fields).map(([fieldName, fieldMeta]) => (
                        <option key={fieldName} value={fieldName}>
                          {fieldMeta.label}
                        </option>
                      ))}
                    </select>

                    <select
                      value={filter.operator}
                      onChange={(e) => handleFilterChange(index, 'operator', e.target.value)}
                      className="px-2 py-1 text-sm border rounded bg-background"
                    >
                      {Object.entries(metadata.operators || {}).map(([opName, opMeta]) => (
                        <option key={opName} value={opName}>
                          {opMeta.label}
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
        {loading && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
            <div className="text-sm text-muted-foreground">Loading...</div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <HeaderComponent metadata={metadata} sort={currentSort} onSort={handleSort} />
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={Object.keys(metadata.fields).length}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No data available
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
        loading={loading}
      />
    </div>
  );
};

export default PaginatedList; 