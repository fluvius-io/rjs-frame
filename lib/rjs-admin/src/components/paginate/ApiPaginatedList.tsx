import React, { useEffect, useRef, useState } from 'react';
import { APIManager } from 'rjs-frame';
import { Button } from '../common/Button';
import PaginatedList from './PaginatedList';
import type { FilterConfig, PaginationConfig, SortConfig } from './types';

export interface ApiPaginatedListProps {
  metadataApi?: string;
  dataApi: string;
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
  metadataApi,
  dataApi,
  title = "API Data Table",
  subtitle = "Data fetched from API with dynamic metadata",
  showSearch = true,
  showFilters = true,
  className,
  actions,
}) => {
  const [data, setData] = useState<Array<Record<string, any>>>([]);
  const [metadata, setMetadata] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [metadataLoading, setMetadataLoading] = useState(false);
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
  // Store previous data to prevent flicker during page changes
  const previousDataRef = useRef<Array<Record<string, any>>>([]);

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

  // Fetch metadata from API
  const fetchMetadata = async () => {
    setMetadataLoading(true);
    try {
      console.log('🌐 ApiPaginatedList: Fetching metadata...');
      
      console.log('📋 ApiPaginatedList: Using queryMeta on dataApi:', metadataApi || dataApi);
      let metadataResult = await APIManager.queryMeta(metadataApi || dataApi);

      
      console.log('📋 ApiPaginatedList: Received metadata:', metadataResult);
      setMetadata(metadataResult.data);
    } catch (error) {
      console.error('❌ ApiPaginatedList: Failed to fetch metadata:', error);
      console.error('❌ ApiPaginatedList: Error details:', {
        metadataApi: metadataApi || dataApi,
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      setError(error instanceof Error ? error.message : 'Failed to fetch metadata');
    } finally {
      setMetadataLoading(false);
    }
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
      // Store current data before starting background load
      previousDataRef.current = data;
      setBackgroundLoading(true);
    }
    
    setError(null);
    
    try {
      // Build query parameters
      const params: Record<string, any> = {
        page: page.toString(),
        limit: pageSize.toString(),
      };
      
      if (sort) {
        params.sort = `${sort.field}:${sort.direction}`;
        console.log('🔄 ApiPaginatedList: Adding sort parameter:', `${sort.field}:${sort.direction}`);
      }
      
      if (searchQuery) {
        params.search = searchQuery;
        console.log('🔍 ApiPaginatedList: Adding search parameter:', searchQuery);
      }
      
      if (filters && filters.length > 0) {
        filters.forEach((filter, index) => {
          if (filter.value) {
            params[`filter[${index}][field]`] = filter.field;
            params[`filter[${index}][operator]`] = filter.operator;
            params[`filter[${index}][value]`] = filter.value;
          }
        });
        console.log('🔧 ApiPaginatedList: Adding filters:', filters);
      }

      console.log('🌐 ApiPaginatedList: Fetching data from API:', dataApi);
      const result = await APIManager.query(dataApi, {search: params});
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
            page: result.meta?.page_no || page,
            pageSize: result.meta?.limit || pageSize,
            total: result.meta?.total_items || result.data.length,
          }));
        } else {
          // Standard paginated response: { data: [...], total: 100, page: 1, pageSize: 10 }
          console.log('✅ ApiPaginatedList: Using standard paginated response format');
          
          setData(result.data);
          setPagination(prev => ({
            ...prev,
            page: (result.data as any).page || page,
            pageSize: (result.data as any).pageSize || pageSize,
            total: (result.data as any).total || result.data.length,
          }));
        }
      } else {
        // No valid data found
        console.log('❌ ApiPaginatedList: No valid data in response:', result);
        setData([]);
        setPagination(prev => ({
          ...prev,
          page,
          pageSize,
          total: 0,
        }));
      }
    } catch (error) {
      // Only set error if the request wasn't aborted
      if (!abortController.signal.aborted) {
        console.error('❌ ApiPaginatedList: Failed to fetch data:', error);
        console.error('❌ ApiPaginatedList: Data fetch error details:', {
          dataApi,
          page,
          pageSize,
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined
        });
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

  // Initial data and metadata load
  useEffect(() => {
    fetchMetadata();
    fetchData(1, 10);
    
    // Cleanup function to abort any pending requests
    return () => {
      if (currentRequestRef.current) {
        currentRequestRef.current.abort();
      }
    };
  }, [metadataApi, dataApi]);

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

  // Determine which data to show: use previous data during background loading to prevent flicker
  const displayData = backgroundLoading && previousDataRef.current.length > 0 ? previousDataRef.current : data;

  // Show loading screen while fetching initial metadata or data
  if (loading || metadataLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-destructive mb-4">{error}</div>
        <Button onClick={() => {
          fetchMetadata();
          fetchData(1, 10);
        }}>Retry</Button>
      </div>
    );
  }

  // Only render PaginatedList when we have metadata
  if (!metadata) {
    return (
      <div className="p-8 text-center">
        <div>No metadata available</div>
      </div>
    );
  }

  return (
    <PaginatedList
      metadata={metadata}
      data={displayData}
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