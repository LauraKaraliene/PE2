import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
}) {
  if (totalPages <= 1) return null;

  const pageNumbers = [];

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center items-center space-x-2  my-6">
      {/* Previous button */}
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 text-sm  cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
      >
        <ChevronLeftIcon className="w-6 h-6 hover:scale-125 transition-transform duration-200" />
      </button>

      {/* Show first page if not visible */}
      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-3 py-1 text-sm border border-gray-300 rounded  cursor-pointer hover:scale-110 transition-transform duration-200"
          >
            1
          </button>
          {startPage > 2 && <span className="px-2">...</span>}
        </>
      )}

      {/* Page numbers */}
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`px-3 py-1 text-sm border border-gray-300 rounded cursor-pointer ${
            currentPage === number
              ? "bg-green-700 text-white border-green-700 hover:scale-110"
              : " hover:scale-110"
          }`}
        >
          {number}
        </button>
      ))}

      {/* Show last page if not visible */}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-3 py-1 text-sm border border-gray-300 rounded  cursor-pointer hover:scale-110 transition-transform duration-200"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next button */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-3 py-1 text-sm  cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
      >
        <ChevronRightIcon className="w-6 h-6 hover:scale-125 transition-transform duration-200" />
      </button>
    </div>
  );
}
