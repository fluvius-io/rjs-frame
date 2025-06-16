import React from 'react'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'
import { PaginationProps } from '../../types/datatable'

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100]

export const Pagination: React.FC<PaginationProps> = ({
  pagination,
  onChange,
  loading = false,
  className
}) => {
  const { page, pageSize, total } = pagination
  const totalPages = Math.ceil(total / pageSize)
  const startItem = (page - 1) * pageSize + 1
  const endItem = Math.min(page * pageSize, total)

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      onChange({ ...pagination, page: newPage })
    }
  }

  const handlePageSizeChange = (newPageSize: number) => {
    if (newPageSize !== pageSize) {
      // Reset to first page when changing page size
      onChange({ ...pagination, pageSize: newPageSize, page: 1 })
    }
  }

  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
      range.push(i)
    }

    if (page - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (page + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else {
      if (totalPages > 1) {
        rangeWithDots.push(totalPages)
      }
    }

    return rangeWithDots.filter((item, index, arr) => 
      arr.indexOf(item) === index && item !== 1 || index === 0
    )
  }

  const visiblePages = getVisiblePages()

  if (total === 0) {
    return (
      <div className={cn("dt-pagination", className)}>
        <div className="dt-pagination-info">
          No records found
        </div>
        <div className="dt-pagination-controls">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Show</span>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="dt-page-size-select"
            >
              {PAGE_SIZE_OPTIONS.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-500">per page</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("dt-pagination", className)}>
      <div className="dt-pagination-info">
        Showing {startItem.toLocaleString()} to {endItem.toLocaleString()} of {total.toLocaleString()} results
      </div>
      
      <div className="dt-pagination-controls">
        {/* Page Size Selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Show</span>
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="dt-page-size-select"
            disabled={loading}
          >
            {PAGE_SIZE_OPTIONS.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-500">per page</span>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="dt-pagination-loading">
            <Loader2 className="dt-pagination-loading-spinner" />
            Loading...
          </div>
        )}

        {/* Page Navigation */}
        <div className="dt-pagination-buttons">
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1 || loading}
            className="dt-pagination-button"
            title="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Page Numbers */}
          {visiblePages.map((pageNum, index) => {
            if (pageNum === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-3 py-1 text-sm text-gray-500"
                >
                  ...
                </span>
              )
            }

            const pageNumber = pageNum as number
            return (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                disabled={loading}
                className={cn(
                  "dt-pagination-button",
                  pageNumber === page && "active"
                )}
                title={`Go to page ${pageNumber}`}
              >
                {pageNumber}
              </button>
            )
          })}

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages || loading}
            className="dt-pagination-button"
            title="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
} 