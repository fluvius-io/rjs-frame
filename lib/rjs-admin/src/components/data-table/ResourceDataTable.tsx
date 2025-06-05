import React, { useEffect, useRef, useState } from 'react';
import { APIManager } from 'rjs-frame';
import { Button } from '../common/Button';
import { ResourceQuery } from '../query-builder/types';
import DataTable from './DataTable';
import type { PaginationConfig } from './types';

export interface ResourceDataTableProps {
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
const ResourceDataTable: React.FC<ResourceDataTableProps> = ({
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
  
  // Track previous pagination values
  const previousPaginationRef = useRef(pagination);

  // Current query state
  const [currentQuery, setCurrentQuery] = useState<ResourceQuery & { searchQuery?: string }>({});



  // Example: Access previous pagination in useEffect
  useEffect(() => {
    if (metadata) {
      const prevPagination = previousPaginationRef.current;
      console.log('🔄 Pagination changed from:', prevPagination, 'to:', pagination);
      
      // Only fetch if page or pageSize actually changed
      if (prevPagination.page !== pagination.page || prevPagination.pageSize !== pagination.pageSize) {
        console.log('🔄 ResourceDataTable: Fetching data due to pagination change');
        fetchData();
      }
      
      // Update the ref with current value for next time
      previousPaginationRef.current = pagination;
    }
  }, [pagination]);

  // Track previous query values
  const previousQueryRef = useRef(currentQuery);
  
  useEffect(() => {
    if (metadata) {
      const prevQuery = previousQueryRef.current;
      console.log('🔄 Query changed from:', prevQuery, 'to:', currentQuery);
      
      // Reset to page 1 when query changes (but not pagination)
      if (prevQuery.query !== currentQuery.query || 
          prevQuery.searchQuery !== currentQuery.searchQuery ||
          JSON.stringify(prevQuery.sort) !== JSON.stringify(currentQuery.sort)) {
        console.log('🔄 ResourceDataTable: Fetching data due to query change');
        
        // Reset pagination to page 1 when filter/search/sort changes
        setPagination(prev => ({ ...prev, page: 1 }));
        fetchData();
      }
      
      // Update the ref with current value for next time
      previousQueryRef.current = currentQuery;
    }
  }, [currentQuery]);

  // Fetch metadata from API
  const fetchMetadata = async () => {
    setMetadataLoading(true);
    try {
      console.log('🌐 ResourceDataTable: Fetching metadata...');
      
      console.log('📋 ResourceDataTable: Using queryMeta on dataApi:', dataApi);
      let metadataResult = await APIManager.queryMeta(dataApi);

      
      console.log('📋 ResourceDataTable: Received metadata:', metadataResult);
      setMetadata(metadataResult.data);
    } catch (error) {
      console.error('❌ ResourceDataTable: Failed to fetch metadata:', error);
      console.error('❌ ResourceDataTable: Error details:', {
        dataApi: dataApi,
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      setError(error instanceof Error ? error.message : 'Failed to fetch metadata');
    } finally {
      setMetadataLoading(false);
    }
  };

  // Fetch data from API using ResourceQuery
  const fetchData = async () => {
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
      // Build query parameters from current state
      const params: Record<string, any> = {
        page: pagination.page.toString(),
        limit: pagination.pageSize.toString(),
      };
      
      // Add sort parameters from ResourceQuery
      if (currentQuery.sort && currentQuery.sort.length > 0) {
        params.sort = currentQuery.sort[0]; // Take the first sort rule
        console.log('🔄 ResourceDataTable: Adding sort parameter:', currentQuery.sort[0]);
      }
      
      // Add search query if provided
      if (currentQuery.searchQuery) {
        params.search = currentQuery.searchQuery;
        console.log('🔍 ResourceDataTable: Adding search parameter:', currentQuery.searchQuery);
      }
      
      // Add filter query from ResourceQuery
      if (currentQuery.query) {
        params.query = currentQuery.query;
        console.log('🔧 ResourceDataTable: Adding query string:', currentQuery.query);
      }

      console.log('🌐 ResourceDataTable: Fetching data from API:', dataApi);
      const result = await APIManager.query(dataApi, {search: params});
      console.log('📊 ResourceDataTable: Received response:', result);
      
      // Handle different response formats
      if (!(Array.isArray(result.data) && result.meta)) {
        throw new Error('Invalid response format: ' + JSON.stringify(result));
      }

      // Check for meta object format: { data: [...], meta: { total_items, page_no, limit, ... } }
      console.log('✅ ResourceDataTable: Using meta-based response format');
      console.log('📊 ResourceDataTable: Meta object:', result.meta);
      console.log('📊 ResourceDataTable: Data count:', result.data.length);
      
      setData(result.data);
      setPagination(prev => ({
        ...prev,
        page: result.meta?.page_no || prev.page,
        pageSize: result.meta?.limit || prev.pageSize,
        total: result.meta?.total_items || result.data.length,
      }));
    } catch (error) {
      // Only set error if the request wasn't aborted
      if (!abortController.signal.aborted) {
        console.error('❌ ResourceDataTable: Failed to fetch data:', error);
        console.error('❌ ResourceDataTable: Data fetch error details:', {
          dataApi,
          currentQuery,
          pagination,
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
    fetchData();
    
    // Cleanup function to abort any pending requests
    return () => {
      if (currentRequestRef.current) {
        currentRequestRef.current.abort();
      }
    };
  }, [dataApi]);

  // Handle query changes (filters, search, sort)
  const handleQueryChange = (query: ResourceQuery & { searchQuery?: string }) => {
    setCurrentQuery(query);
  };

  // Handle pagination changes
  const handlePageChange = (page: number, pageSize: number) => {
    setPagination(prev => ({
      ...prev,
      page,
      pageSize
    }));
  };

  // Determine which data to show: use previous data during background loading to prevent flicker
  const displayData = backgroundLoading && previousDataRef.current.length > 0 ? previousDataRef.current : data;

  // Show loading screen while fetching initial metadata or data
  if (loading || metadataLoading) {
    return null;
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-destructive mb-4">{error}</div>
        <Button onClick={() => {
          fetchMetadata();
          fetchData();
        }}>Retry</Button>
        <Button className="ml-2" onClick={() => {
          setCurrentQuery({});
        }}>Reset</Button>

      </div>
    );
  }

  // Only render DataTable when we have metadata
  if (!metadata) {
    return (
      <div className="p-8 text-center">
        <div>No metadata available</div>
      </div>
    );
  }

  return (
    <DataTable
      metadata={metadata}
      data={displayData}
      pagination={pagination}
      loading={loading}
      backgroundLoading={backgroundLoading}
      title={title}
      subtitle={subtitle}
      showSearch={showSearch}
      showFilters={showFilters}
      onQueryChange={handleQueryChange}
      onPageChange={handlePageChange}
      actions={actions}
      className={className}
    />
  );
};

export default ResourceDataTable; 