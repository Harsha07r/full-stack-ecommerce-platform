export default function SectionHeader({ eyebrow, title, action }) {
  return (
    <div className="mb-10 flex items-end justify-between gap-6">
      <div>
        {eyebrow && (
          <p className="mb-2.5 text-[10px] uppercase tracking-[0.22em] text-muted">{eyebrow}</p>
        )}
        <h2 className="font-display text-3xl md:text-4xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}