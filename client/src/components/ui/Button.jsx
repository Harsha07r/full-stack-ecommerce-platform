export default function Button({
  variant = 'solid',
  className = '',
  children,
  onClick,
  type = 'button',
  disabled = false,
}) {
  const base =
    'inline-flex items-center justify-center px-8 py-3.5 text-[11px] uppercase tracking-[0.16em] transition-colors disabled:opacity-40 disabled:cursor-not-allowed';

  const variants = {
    solid: 'bg-ink text-paper hover:bg-ink/85',
    outline: 'border border-ink hover:bg-ink hover:text-paper',
    ghost: 'underline underline-offset-4 hover:opacity-55 px-0 py-0',
  };

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}