import React from "react";
import { cn } from "../../lib/utils";
import { Button } from "../common/Button";
import { PaginationControlsProps } from "./types";

const PaginationControls: React.FC<PaginationControlsProps> = ({
  pagination,
  onPageChange,
  loading = false,
}) => {
  const {
    page,
    pageSize,
    total,
    showSizeChanger = true,
    pageSizeOptions = [10, 20, 50, 100],
  } = pagination;

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
        pages.push("...");
      }

      const start = Math.max(2, page - 2);
      const end = Math.min(totalPages - 1, page + 2);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (page < totalPages - 3) {
        pages.push("...");
      }

      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (total === 0) {
    return (
      <div className="flex items-center justify-between px-4 py-3 bg-muted/50">
        <div className="text-sm text-muted-foreground">No records found</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-muted/50">
      <div className="flex items-center gap-1">
        {(totalPages > 1 && (
          <>
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
                {pageNum === "..." ? (
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
          </>
        )) || (
          <span className="text-sm text-muted-foreground">No pagination</span>
        )}
      </div>

      {loading && (
        <div className="flex items-center gap-2 px-3 py-1 bg-background/90 text-xs text-muted-foreground">
          <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          Updating...
        </div>
      )}
      <div className="flex items-center gap-4">
        {/* Background loading indicator - small and subtle */}
        <div className="text-sm text-muted-foreground">
          Showing {startRecord} - {endRecord} / {total} records
        </div>
        {showSizeChanger && (
          <div className="flex items-center gap-2 ml-2">
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
      </div>
    </div>
  );
};

export default PaginationControls;
