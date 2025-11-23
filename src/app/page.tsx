
import React, { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProductGrid from '@/features/products/components/ProductGrid';

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section - LCP Optimization (Priority loading) */}
      <section className="relative w-full h-[400px] bg-secondary overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/20 to-transparent z-10" />
        <Image 
            src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=1600" 
            alt="Hero Image"
            fill
            priority
            className="object-cover object-center opacity-90"
        />
        
        <div className="container mx-auto px-4 h-full flex items-center relative z-20">
          <div className="bg-white/95 backdrop-blur-sm p-8 rounded shadow-lg max-w-md">
            <h1 className="text-4xl font-serif font-bold text-foreground mb-4 leading-tight">
              Give your clothes a second life.
            </h1>
            <div className="flex gap-4">
              <Link 
                href="/sell" 
                className="flex-1 bg-primary text-white text-center font-semibold py-3 rounded hover:bg-primary/90 transition-all"
              >
                Sell now
              </Link>
              <Link 
                href="/search" 
                className="flex-1 border border-primary text-primary text-center font-semibold py-3 rounded hover:bg-primary/5 transition-all"
              >
                Shop
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feed Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-serif font-bold text-foreground">Fresh on Rewear</h2>
          <Link href="/search" className="text-primary text-sm font-medium hover:underline">
            View all
          </Link>
        </div>
        
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGrid />
        </Suspense>

        <div className="mt-16 border-t pt-12">
            <div className="bg-secondary/30 rounded-lg p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h3 className="text-xl font-bold mb-2">Shop popular brands</h3>
                    <div className="flex flex-wrap gap-2 mt-4">
                         {['Zara', 'Nike', 'H&M', 'Adidas', 'Levi\'s', 'Ralph Lauren'].map(brand => (
                             <Link 
                                key={brand}
                                href={`/search?brand=${brand}`} 
                                className="px-4 py-2 bg-white border rounded shadow-sm text-sm font-medium cursor-pointer hover:bg-gray-50 transition-colors"
                             >
                                 {brand}
                             </Link>
                         ))}
                    </div>
                </div>
            </div>
        </div>
      </section>
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
