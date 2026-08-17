export default function FormField({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] uppercase tracking-[0.22em] text-muted">{label}</span>
      <input
        {...props}
        className="w-full border border-line bg-surface px-4 py-3 text-sm outline-none transition-colors focus:border-ink"
      />
    </label>
  );
}
