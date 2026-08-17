import ProductCard from './ProductCard';

export default function ProductGrid({ products }) {
  if (products.length === 0) {
    return (
      <div className="border border-line py-24 text-center">
        <p className="text-sm text-muted">No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 md:gap-y-14 xl:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}