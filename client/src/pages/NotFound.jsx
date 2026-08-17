import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[1400px] px-5 py-32 text-center md:px-10">
      <h1 className="font-display text-5xl">404</h1>
      <p className="mt-3 text-sm text-muted">That page doesn't exist.</p>
      <Link to="/" className="mt-8 inline-block text-[11px] uppercase tracking-[0.16em] underline underline-offset-4">
        Back to home
      </Link>
    </div>
  );
}