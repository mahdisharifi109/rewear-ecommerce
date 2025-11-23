import React, { Suspense } from 'react';
import ProductGrid from '@/features/products/components/ProductGrid';
import { ProductFilters } from '@/features/products/actions';
import { Filter, X } from 'lucide-react';
import Link from 'next/link';

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  
  const filters: ProductFilters = {
    query: typeof params.q === 'string' ? params.q : undefined,
    category: typeof params.category === 'string' ? params.category : undefined,
    size: typeof params.size === 'string' ? params.size : undefined,
    minPrice: typeof params.minPrice === 'string' ? Number(params.minPrice) : undefined,
    maxPrice: typeof params.maxPrice === 'string' ? Number(params.maxPrice) : undefined,
  };

  const hasActiveFilters = filters.category || filters.size || filters.minPrice || filters.maxPrice || filters.query;

  return (
    <div className="container mx-auto px-4 py-8 min-h-[60vh]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-serif font-bold text-foreground">
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
             
             <Link href="/search" className="text-xs text-muted-foreground hover:text-destructive transition-colors ml-2 flex items-center gap-1">
                <X size={14} /> Clear all
             </Link>
          </div>
      )}

      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductGrid filters={filters} />
      </Suspense>
    </div>
  );
}

function ProductGridSkeleton() {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="aspect-[3/4] bg-secondary animate-pulse rounded-sm"></div>
            <div className="h-4 bg-secondary w-2/3 rounded animate-pulse"></div>
            <div className="h-4 bg-secondary w-1/3 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }