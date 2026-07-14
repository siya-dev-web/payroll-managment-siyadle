import { MaterialIcon } from "@/components/ui/MaterialIcon";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalResults,
  pageSize,
  onPageChange,
}: PaginationProps) {
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalResults);

  return (
    <div className="px-6 py-4 flex items-center justify-between border-t border-outline-variant bg-surface-container-lowest">
      <p className="text-label-sm text-on-surface-variant font-label-sm">
        Showing {start} to {end} of {totalResults} results
      </p>
      <div className="flex gap-2">
        <button
          className="px-3 py-1.5 border border-outline-variant rounded-lg text-label-md font-label-md hover:bg-surface-container-low transition-colors flex items-center gap-1 disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <MaterialIcon icon="chevron_left" className="text-[18px]" />
          Previous
        </button>
        <div className="flex gap-1">
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`w-9 h-9 flex items-center justify-center rounded-lg font-label-md text-label-md transition-colors ${
                page === currentPage
                  ? "bg-primary text-on-primary"
                  : "hover:bg-surface-container-low"
              }`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ))}
        </div>
        <button
          className="px-3 py-1.5 border border-outline-variant rounded-lg text-label-md font-label-md hover:bg-surface-container-low transition-colors flex items-center gap-1 disabled:opacity-50"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
          <MaterialIcon icon="chevron_right" className="text-[18px]" />
        </button>
      </div>
    </div>
  );
}
