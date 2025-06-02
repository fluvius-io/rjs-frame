import React, { useState, useEffect } from 'react';
import { PaginatedListProps, FilterConfig, SortConfig, PaginatedListMetadata, ApiMetadata } from './types';
import { transformApiMetadata, isApiMetadata, fetchMetadata, getDefaultSort } from './utils';
import HeaderComponent from './HeaderComponent';
import RowComponent from './RowComponent';
import PaginationControls from './PaginationControls';
import { Button } from '../common/Button';
import { cn } from '../../lib/utils';

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
  } = props;

  // Extract metadata and metadataUrl based on props type
  const initialMetadata = 'metadata' in props ? props.metadata : undefined;
  const metadataUrl = 'metadataUrl' in props ? props.metadataUrl : undefined;

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterConfig[]>([]);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [currentSort, setCurrentSort] = useState<SortConfig>();
  const [metadata, setMetadata] = useState<PaginatedListMetadata | null>(null);
  const [metadataLoading, setMetadataLoading] = useState(false);
  const [metadataError, setMetadataError] = useState<string | null>(null);

  // Handle metadata initialization and fetching
  useEffect(() => {
    const initializeMetadata = async () => {
      try {
        let processedMetadata: PaginatedListMetadata;

        if (metadataUrl) {
          // Fetch metadata from API
          setMetadataLoading(true);
          setMetadataError(null);
          
          const apiMetadata = await fetchMetadata(metadataUrl);
          processedMetadata = transformApiMetadata(apiMetadata);
          
          // Set default sort if provided
          const defaultSort = getDefaultSort(apiMetadata);
          if (defaultSort && !currentSort) {
            setCurrentSort(defaultSort);
          }
        } else if (initialMetadata) {
          // Use provided metadata
          if (isApiMetadata(initialMetadata)) {
            processedMetadata = transformApiMetadata(initialMetadata);
            
            // Set default sort if provided
            const defaultSort = getDefaultSort(initialMetadata);
            if (defaultSort && !currentSort) {
              setCurrentSort(defaultSort);
            }
          } else {
            processedMetadata = initialMetadata;
          }
        } else {
          throw new Error('No metadata provided');
        }

        setMetadata(processedMetadata);
      } catch (error) {
        console.error('Failed to initialize metadata:', error);
        setMetadataError(error instanceof Error ? error.message : 'Failed to load metadata');
      } finally {
        setMetadataLoading(false);
      }
    };

    initializeMetadata();
  }, [initialMetadata, metadataUrl]);

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
    if (!metadata) return;
    
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
    if (!metadata) return null;
    
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

  // Show loading state while fetching metadata
  if (metadataLoading) {
    return (
      <div className={cn("bg-background border rounded-lg shadow-sm", className)}>
        <div className="p-8 text-center">
          <div className="text-sm text-muted-foreground">Loading metadata...</div>
        </div>
      </div>
    );
  }

  // Show error state if metadata failed to load
  if (metadataError || !metadata) {
    return (
      <div className={cn("bg-background border rounded-lg shadow-sm", className)}>
        <div className="p-8 text-center">
          <div className="text-sm text-destructive mb-2">
            Failed to load metadata: {metadataError || 'No metadata available'}
          </div>
          {metadataUrl && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          )}
        </div>
      </div>
    );
  }

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
                    colSpan={Object.keys(metadata.fields).length}
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