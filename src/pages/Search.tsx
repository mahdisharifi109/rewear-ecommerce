import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import ProductCard from '../features/products/components/ProductCard';
import { Product } from '../types';
import { X, PackageOpen } from 'lucide-react';
import { getProducts } from '../features/products/actions';

const Search = () => {
  const [searchParams] = useSearchParams();

  // Extract filters from URL
  const filters = useMemo(() => ({
    query: searchParams.get('q') || undefined,
    category: searchParams.get('category') || undefined,
    size: searchParams.get('size') || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    sortBy: searchParams.get('sortBy') || undefined,
  }), [searchParams]);

  // Fetch products
  const { data: products, isLoading } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => getProducts(filters),
  });

  const hasActiveFilters = !!(filters.category || filters.size || filters.minPrice || filters.maxPrice || filters.query || filters.sortBy);

  return (
    <div className="container mx-auto px-4 py-8 min-h-[60vh]">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-foreground">
            {filters.query ? `Results for "${filters.query}"` : 'All Items'}
        </h1>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-8">
             <span className="text-sm text-muted-foreground mr-2">Active filters:</span>
             
             {filters.category && (
                 <div className="bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1 border border-primary/20">
                    {filters.category}
                 </div>
             )}
             {filters.size && (
                 <div className="bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1 border border-primary/20">
                    Size: {filters.size}
                 </div>
             )}
             {(filters.minPrice || filters.maxPrice) && (
                 <div className="bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1 border border-primary/20">
                     Price: {filters.minPrice || 0}€ - {filters.maxPrice || 'Any'}€
                 </div>
             )}
             {filters.sortBy && (
                 <div className="bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1 border border-primary/20">
                    Sort: {filters.sortBy.replace('_', ' ')}
                 </div>
             )}
             
             <Link to="/search" className="text-xs text-muted-foreground hover:text-destructive transition-colors ml-2 flex items-center gap-1">
                <X size={14} /> Clear all
             </Link>
          </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                    <div className="aspect-[3/4] bg-secondary animate-pulse rounded-sm"></div>
                    <div className="h-4 bg-secondary w-2/3 rounded animate-pulse"></div>
                    <div className="h-4 bg-secondary w-1/3 rounded animate-pulse"></div>
                </div>
            ))}
        </div>
      ) : (!products || products.length === 0) ? (
        <div className="col-span-full py-20 text-center text-muted-foreground bg-secondary/20 rounded-lg border border-dashed flex flex-col items-center justify-center">
            <PackageOpen size={48} className="mb-4 opacity-20" />
            <p className="text-lg font-medium">No items found</p>
            <p className="text-sm mt-2 max-w-md mx-auto">
                We couldn't find any items matching your filters. Try removing some filters or searching for something else.
            </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
            {products.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
      )}
    </div>
  );
};

export default Search;