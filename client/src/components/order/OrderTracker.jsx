// Mirrors the real Order.status enum (pending/processing/shipped/delivered),
// not an idealized set of steps — cancelled is a terminal state, not a
// point on this timeline.
const STEPS = [
  { key: 'pending', label: 'Order Placed' },
  { key: 'processing', label: 'Processing' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
];

export default function OrderTracker({ status }) {
  if (status === 'cancelled') {
    return <p className="text-[10px] uppercase tracking-[0.16em] text-sale">Order cancelled</p>;
  }

  const currentIndex = STEPS.findIndex((s) => s.key === status);

  return (
    <ol>
      {STEPS.map((step, i) => {
        const done = i <= currentIndex;
        const isLast = i === STEPS.length - 1;
        return (
          <li key={step.key} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] ${
                  done ? 'bg-ink text-paper' : 'border border-line'
                }`}
              >
                {done && '✓'}
              </span>
              {!isLast && (
                <span className={`my-0.5 min-h-[1.25rem] w-px flex-1 ${i < currentIndex ? 'bg-ink' : 'bg-line'}`} />
              )}
            </div>
            <span className={`pb-5 text-sm ${done ? 'text-ink' : 'text-muted'}`}>{step.label}</span>
          </li>
        );
      })}
    </ol>
  );
}
