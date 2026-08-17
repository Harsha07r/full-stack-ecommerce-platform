export default function Button({
  as: Component = 'button',
  variant = 'solid',
  className = '',
  children,
  type = 'button',
  ...rest
}) {
  const base =
    'inline-flex items-center justify-center px-8 py-3.5 text-[11px] uppercase tracking-[0.16em] transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed';

  // Each variant owns its full bg/text pairing so callers never override
  // individual utilities piecemeal — mixed bg-*/text-* overrides in a
  // className prop have no reliable precedence over these since Tailwind
  // resolves conflicting utilities by generated CSS order, not prop order.
  const variants = {
    solid: 'bg-ink text-paper hover:bg-ink/85',
    inverse: 'bg-paper text-ink hover:bg-paper/80',
    outline: 'border border-ink text-ink hover:bg-ink hover:text-paper',
    ghost: 'underline underline-offset-4 hover:opacity-55 px-0 py-0',
  };

  const typeProp = Component === 'button' ? { type } : {};

  return (
    <Component className={`${base} ${variants[variant]} ${className}`} {...typeProp} {...rest}>
      {children}
    </Component>
  );
}