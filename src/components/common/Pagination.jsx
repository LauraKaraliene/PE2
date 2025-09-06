import { useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
}) {
  if (totalPages <= 1) return null;

  const [isSmall, setIsSmall] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 639px)").matches
      : false
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 639px)");
    const handler = (e) => setIsSmall(e.matches);
    mq.addEventListener?.("change", handler);
    mq.addListener?.(handler);
    return () => {
      mq.removeEventListener?.("change", handler);
      mq.removeListener?.(handler);
    };
  }, []);

  // Fewer page buttons on small screens
  const visible = isSmall ? 4 : Math.max(3, maxVisiblePages);

  // Windowed page
  let startPage = Math.max(1, currentPage - Math.floor(visible / 2));
  let endPage = Math.min(totalPages, startPage + visible - 1);
  if (endPage - startPage < visible - 1) {
    startPage = Math.max(1, endPage - visible + 1);
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) pages.push(i);

  const go = (p) => {
    const n = Math.min(Math.max(1, p), totalPages);
    if (n !== currentPage) onPageChange(n);
  };

  return (
    <nav aria-label="Pagination" className="my-6">
      <div className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2">
        {/* Previous */}
        <button
          onClick={() => go(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-2.5 sm:px-3 py-1 text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          aria-label="Previous page"
        >
          <ChevronLeftIcon className="w-6 h-6  text-[color:var(--color-neutral)]" />
        </button>

        {startPage > 1 && (
          <>
            <PageBtn page={1} currentPage={currentPage} onClick={() => go(1)} />
            {startPage > 2 && (
              <span className="px-1 sm:px-2 text-[color:var(--color-neutral)]">
                …
              </span>
            )}
          </>
        )}

        {pages.map((n) => (
          <PageBtn
            key={n}
            page={n}
            currentPage={currentPage}
            onClick={() => go(n)}
          />
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="px-1 sm:px-2 text-[color:var(--color-neutral)]">
                …
              </span>
            )}
            <PageBtn
              page={totalPages}
              currentPage={currentPage}
              onClick={() => go(totalPages)}
            />
          </>
        )}

        {/* Next */}
        <button
          onClick={() => go(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-2.5 sm:px-3 py-1 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          aria-label="Next page"
        >
          <ChevronRightIcon className="w-6 h-6  text-[color:var(--color-neutral)]" />
        </button>
      </div>
    </nav>
  );
}

function PageBtn({ page, currentPage, onClick }) {
  const active = currentPage === page;
  return (
    <button
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={[
        "px-2.5 sm:px-3 py-1 rounded border text-xs sm:text-sm transition-transform",
        "border-[color:var(--color-background-gray)]",
        active
          ? "bg-[color:var(--color-primary)] text-white border-[color:var(--color-primary)]"
          : "text-[color:var(--color-neutral)] hover:scale-105",
      ].join(" ")}
    >
      {page}
    </button>
  );
}
