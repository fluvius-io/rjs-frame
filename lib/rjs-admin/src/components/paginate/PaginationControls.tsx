import React from 'react';
import { PaginationControlsProps } from './types';
import { Button } from '../common/Button';
import { cn } from '../../lib/utils';

const PaginationControls: React.FC<PaginationControlsProps> = ({
  pagination,
  onPageChange,
  loading = false,
}) => {
  const { page, pageSize, total, showSizeChanger = true, pageSizeOptions = [10, 20, 50, 100] } = pagination;
  
  const totalPages = Math.ceil(total / pageSize);
  const startRecord = (page - 1) * pageSize + 1;
  const endRecord = Math.min(page * pageSize, total);

  const handlePageChange = (newPage: number) => {
    if (onPageChange && newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage, pageSize);
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    if (onPageChange) {
      const newPage = Math.ceil(startRecord / newPageSize);
      onPageChange(newPage, newPageSize);
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (page > 4) {
        pages.push('...');
      }
      
      const start = Math.max(2, page - 2);
      const end = Math.min(totalPages - 1, page + 2);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (page < totalPages - 3) {
        pages.push('...');
      }
      
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (total === 0) {
    return (
      <div className="flex items-center justify-between px-4 py-3 bg-background">
        <div className="text-sm text-muted-foreground">
          No records found
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-background">
      <div className="flex items-center gap-4">
        
        {showSizeChanger && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Show:</span>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              disabled={loading}
              className="px-2 py-1 text-sm border rounded bg-background"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="text-sm text-muted-foreground">
           {startRecord} to {endRecord} of {total} records
        </div>

      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(1)}
          disabled={page === 1 || loading}
        >
          ⇤
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1 || loading}
        >
          ←
        </Button>

        {getPageNumbers().map((pageNum, index) => (
          <React.Fragment key={index}>
            {pageNum === '...' ? (
              <span className="px-2 py-1 text-sm text-muted-foreground">
                ...
              </span>
            ) : (
              <Button
                variant={page === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(pageNum as number)}
                disabled={loading}
                className={cn(
                  page === pageNum && "bg-primary text-primary-foreground"
                )}
              >
                {pageNum}
              </Button>
            )}
          </React.Fragment>
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages || loading}
        >
          →
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(totalPages)}
          disabled={page === totalPages || loading}
        >
          ⇥
        </Button>
      </div>
    </div>
  );
};

export default PaginationControls; 