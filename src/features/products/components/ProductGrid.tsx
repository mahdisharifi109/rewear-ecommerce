
import React from 'react';
import { getProducts, ProductFilters } from '../actions';
import ProductCard from './ProductCard';
import { PackageOpen } from 'lucide-react';

interface ProductGridProps {
  filters?: ProductFilters;
}

export default async function ProductGrid({ filters }: ProductGridProps) {
  const products = await getProducts(filters);

  if (!products || products.length === 0) {
    return (
      <div className="col-span-full py-20 text-center text-muted-foreground bg-secondary/20 rounded-lg border border-dashed flex flex-col items-center justify-center">
        <PackageOpen size={48} className="mb-4 opacity-20" />
        <p className="text-lg font-medium">No items found</p>
        <p className="text-sm mt-2 max-w-md mx-auto">
            We couldn't find any items matching your filters. Try removing some filters or searching for something else.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}