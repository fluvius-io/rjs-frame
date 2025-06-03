import React, { useEffect, useRef, useState } from 'react';
import { fetchJson } from '../../lib/api';
import { Button } from '../common/Button';
import PaginatedList from './PaginatedList';
import type { FilterConfig, PaginationConfig, SortConfig } from './types';

export interface ApiPaginatedListProps {
  metadataUrl: string;
  dataUrl?: string;
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
  showFilters?: boolean;
  className?: string;
  actions?: React.ReactNode;
}

/**
 * A convenience component that fetches both metadata and data from API endpoints
 * This demonstrates the complete workflow of using API-driven metadata
 */
const ApiPaginatedList: React.FC<ApiPaginatedListProps> = ({
  metadataUrl,
  dataUrl,
  title = "API Data Table",
  subtitle = "Data fetched from API with dynamic metadata",
  showSearch = true,
  showFilters = true,
  className,
  actions,
}) => {
  const [data, setData] = useState<Array<Record<string, any>>>([]);
  const [loading, setLoading] = useState(false);
  const [backgroundLoading, setBackgroundLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationConfig>({
    page: 1,
    pageSize: 10,
    total: 0,
  });
  
  // Keep track of current request to prevent race conditions
  const currentRequestRef = useRef<AbortController | null>(null);
  const isInitialLoadRef = useRef(true);

  // Generate sample data for demonstration (fallback when no dataUrl provided)
  const generateSampleData = (count: number): Array<Record<string, any>> => {
    const sampleData: Array<Record<string, any>> = [];
    for (let i = 1; i <= count; i++) {
      sampleData.push({
        _id: `user_${i}`,
        name__family: `LastName${i}`,
        name__given: `FirstName${i}`,
        email: `user${i}@example.com`,
        status: i % 2 === 0 ? 'Active' : 'Inactive',
        created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      });
    }
    return sampleData;
  };

  // Fetch data from API or generate sample data
  const fetchData = async (
    page: number, 
    pageSize: number, 
    sort?: SortConfig, 
    filters?: FilterConfig[], 
    searchQuery?: string
  ) => {
    // Cancel previous request if still in progress
    if (currentRequestRef.current) {
      currentRequestRef.current.abort();
    }
    
    // Create new abort controller for this request
    const abortController = new AbortController();
    currentRequestRef.current = abortController;
    
    // Determine loading state: initial load shows full loading, subsequent loads show background loading
    const isInitialLoad = isInitialLoadRef.current;
    if (isInitialLoad) {
      setLoading(true);
      isInitialLoadRef.current = false;
    } else {
      setBackgroundLoading(true);
    }
    
    setError(null);
    
    try {
      if (dataUrl) {
        console.log('🌐 ApiPaginatedList: Fetching data from API:', dataUrl);
        
        // Build query parameters
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', pageSize.toString());
        
        if (sort) {
          params.append('sort', `${sort.field}:${sort.direction}`);
          console.log('🔄 ApiPaginatedList: Adding sort parameter:', `${sort.field}:${sort.direction}`);
        }
        
        if (searchQuery) {
          params.append('search', searchQuery);
          console.log('🔍 ApiPaginatedList: Adding search parameter:', searchQuery);
        }
        
        if (filters && filters.length > 0) {
          filters.forEach((filter, index) => {
            if (filter.value) {
              params.append(`filter[${index}][field]`, filter.field);
              params.append(`filter[${index}][operator]`, filter.operator);
              params.append(`filter[${index}][value]`, filter.value);
            }
          });
          console.log('🔧 ApiPaginatedList: Adding filters:', filters);
        }
        
        const url = `${dataUrl}?${params.toString()}`;
        console.log('🌐 ApiPaginatedList: Making request to:', url);
        
        const result = await fetchJson(url, { signal: abortController.signal });
        console.log('📊 ApiPaginatedList: Received response:', result);
        
        // Handle different response formats
        if (result.data && Array.isArray(result.data)) {
          // Check for meta object format: { data: [...], meta: { total_items, page_no, limit, ... } }
          if (result.meta) {
            console.log('✅ ApiPaginatedList: Using meta-based response format');
            console.log('📊 ApiPaginatedList: Meta object:', result.meta);
            console.log('📊 ApiPaginatedList: Data count:', result.data.length);
            setData(result.data);
            setPagination(prev => ({
              ...prev,
              page: result.meta.page_no || page,
              pageSize: result.meta.limit || pageSize,
              total: result.meta.total_items || result.data.length,
            }));
          } else {
            // Standard paginated response: { data: [...], total: 100, page: 1, pageSize: 10 }
            console.log('✅ ApiPaginatedList: Using standard paginated response format');
            setData(result.data);
            setPagination(prev => ({
              ...prev,
              page: result.page || page,
              pageSize: result.pageSize || pageSize,
              total: result.total || result.data.length,
            }));
          }
        } else if (Array.isArray(result)) {
          // Simple array response
          console.log('✅ ApiPaginatedList: Using simple array response format');
          setData(result);
          setPagination(prev => ({
            ...prev,
            page,
            pageSize,
            total: result.length,
          }));
        } else {
          throw new Error('Invalid response format from data API');
        }
      } else {
        console.log('🔄 ApiPaginatedList: No dataUrl provided, using sample data fallback');
        
        // Fallback to sample data with simulated filtering/sorting
        await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
        
        let allData = generateSampleData(150);
        
        // Apply search filter
        if (searchQuery) {
          allData = allData.filter(item => 
            Object.values(item).some(value => 
              String(value).toLowerCase().includes(searchQuery.toLowerCase())
            )
          );
        }
        
        // Apply filters
        if (filters && filters.length > 0) {
          filters.forEach(filter => {
            if (filter.value) {
              allData = allData.filter(item => {
                const fieldValue = (item as Record<string, any>)[filter.field];
                const operator = filter.operator.split(':')[1] || filter.operator;
                
                switch (operator) {
                  case 'eq':
                    return String(fieldValue).toLowerCase() === String(filter.value).toLowerCase();
                  case 'ilike':
                    return String(fieldValue).toLowerCase().includes(String(filter.value).toLowerCase());
                  case 'in':
                    const values = String(filter.value).split(',').map(v => v.trim());
                    return values.some(v => String(fieldValue).toLowerCase().includes(v.toLowerCase()));
                  default:
                    return true;
                }
              });
            }
          });
        }
        
        // Apply sorting
        if (sort) {
          allData.sort((a, b) => {
            const aVal = (a as Record<string, any>)[sort.field];
            const bVal = (b as Record<string, any>)[sort.field];
            
            if (aVal < bVal) return sort.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sort.direction === 'asc' ? 1 : -1;
            return 0;
          });
        }
        
        // Apply pagination
        const startIndex = (page - 1) * pageSize;
        const paginatedData = allData.slice(startIndex, startIndex + pageSize);
        
        console.log('📊 ApiPaginatedList: Generated sample data:', {
          total: allData.length,
          pageData: paginatedData.length,
          page,
          pageSize
        });
        
        setData(paginatedData);
        setPagination(prev => ({
          ...prev,
          page,
          pageSize,
          total: allData.length,
        }));
      }
    } catch (error) {
      // Only set error if the request wasn't aborted
      if (!abortController.signal.aborted) {
        console.error('❌ ApiPaginatedList: Failed to fetch data:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch data');
      }
    } finally {
      // Clear loading states if this request wasn't aborted
      if (!abortController.signal.aborted) {
        setLoading(false);
        setBackgroundLoading(false);
        currentRequestRef.current = null;
      }
    }
  };

  // Initial data load
  useEffect(() => {
    fetchData(1, 10);
    
    // Cleanup function to abort any pending requests
    return () => {
      if (currentRequestRef.current) {
        currentRequestRef.current.abort();
      }
    };
  }, [dataUrl]);

  const handleSort = (sort: SortConfig) => {
    fetchData(pagination.page, pagination.pageSize, sort);
  };

  const handleFilter = (filters: FilterConfig[]) => {
    fetchData(1, pagination.pageSize, undefined, filters);
  };

  const handleSearch = (query: string) => {
    fetchData(1, pagination.pageSize, undefined, undefined, query);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    fetchData(page, pageSize);
  };

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-destructive mb-4">{error}</div>
        <Button onClick={() => fetchData(1, 10)}>Retry</Button>
      </div>
    );
  }

  return (
    <PaginatedList
      metadataUrl={metadataUrl}
      data={data}
      pagination={pagination}
      loading={loading}
      backgroundLoading={backgroundLoading}
      title={title}
      subtitle={subtitle}
      showSearch={showSearch}
      showFilters={showFilters}
      onSort={handleSort}
      onFilter={handleFilter}
      onSearch={handleSearch}
      onPageChange={handlePageChange}
      actions={actions}
      className={className}
    />
  );
};

export default ApiPaginatedList; 