export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="mt-14 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[11px] uppercase tracking-[0.16em]">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="disabled:cursor-not-allowed disabled:opacity-40 hover:opacity-55"
      >
        Previous
      </button>

      <div className="flex gap-4">
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={p === page ? 'font-medium underline underline-offset-4' : 'text-muted hover:opacity-55'}
          >
            {p}
          </button>
        ))}
      </div>

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="disabled:cursor-not-allowed disabled:opacity-40 hover:opacity-55"
      >
        Next
      </button>
    </nav>
  );
}
