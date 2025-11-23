import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ui/ProductCard';
import { Product } from '../types';
import { Loader2 } from 'lucide-react';

// Mock Data Service
const fetchProducts = async (): Promise<Product[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Generating more mock items for grid look
  const items: Product[] = [
    {
      id: '1',
      name: 'Zara Denim Jacket',
      description: 'Classic oversized denim jacket.',
      price: 15.00,
      category: 'Clothing',
      size: 'M / 38 / 10',
      condition: 'good',
      status: 'available',
      sellerId: 'user1',
      imageUrls: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600'],
      createdAt: '2023-10-01',
      likes: 12
    },
    {
      id: '2',
      name: 'Vintage Leather Bag',
      description: 'Genuine leather.',
      price: 45.50,
      category: 'Bags',
      size: 'One Size',
      condition: 'like-new',
      status: 'available',
      sellerId: 'user2',
      imageUrls: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=600'],
      createdAt: '2023-10-02',
      likes: 45
    },
    {
      id: '3',
      name: 'Nike Sneakers',
      description: 'Air force one.',
      price: 80.00,
      category: 'Shoes',
      size: '39',
      condition: 'good',
      status: 'available',
      sellerId: 'user3',
      imageUrls: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600'],
      createdAt: '2023-10-03',
      likes: 8
    },
    {
      id: '4',
      name: 'Silk Scarf',
      description: 'Hand painted silk scarf.',
      price: 5.00,
      category: 'Accessories',
      size: 'One Size',
      condition: 'new',
      status: 'available',
      sellerId: 'user4',
      imageUrls: ['https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&q=80&w=600'],
      createdAt: '2023-10-03',
      likes: 8
    },
    {
        id: '5',
        name: 'Levi\'s 501 Jeans',
        description: 'Classic fit.',
        price: 25.00,
        category: 'Clothing',
        size: 'W30 L32',
        condition: 'fair',
        status: 'available',
        sellerId: 'user5',
        imageUrls: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=600'],
        createdAt: '2023-10-03',
        likes: 22
    },
    {
        id: '6',
        name: 'Dr Martens Boots',
        description: 'Black leather boots.',
        price: 110.00,
        category: 'Shoes',
        size: '40',
        condition: 'like-new',
        status: 'available',
        sellerId: 'user6',
        imageUrls: ['https://images.unsplash.com/photo-1638319533874-e0f306868035?auto=format&fit=crop&q=80&w=600'],
        createdAt: '2023-10-03',
        likes: 105
    }
  ];
  return items;
};

const Home = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <div className="relative w-full h-[350px] bg-white overflow-hidden">
        {/* Background Image Part */}
        <div className="absolute inset-0">
            <img 
                src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=1600" 
                alt="Hero" 
                className="w-full h-full object-cover object-center opacity-90"
            />
             {/* Tear effect visual trick usually used by Vinted, simplified here to a clip path or overlay */}
             <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
        </div>

        {/* CTA Box */}
        <div className="absolute top-1/2 left-4 md:left-16 transform -translate-y-1/2 bg-white p-6 md:p-8 rounded-lg shadow-lg max-w-md z-10">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                Ready to declutter your wardrobe?
            </h1>
            <Link to="/sell">
                <button className="w-full md:w-auto bg-primary text-white font-medium py-3 px-6 rounded hover:bg-primary/90 transition-all">
                    Sell now
                </button>
            </Link>
            <Link to="/how-it-works" className="block mt-3 text-primary text-sm font-medium hover:underline text-center md:text-left">
                Discover how it works
            </Link>
        </div>
      </div>

      {/* Content Container */}
      <div className="container mx-auto px-4 py-8">
        
        {/* Newsfeed Header */}
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-foreground">Popular items</h2>
            <Link to="/all" className="text-primary text-sm font-medium hover:underline">See all</Link>
        </div>

        {/* Grid */}
        {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="space-y-2">
                        <div className="aspect-[3/4] bg-secondary animate-pulse rounded-sm"></div>
                        <div className="h-4 bg-secondary w-2/3 rounded animate-pulse"></div>
                        <div className="h-4 bg-secondary w-1/3 rounded animate-pulse"></div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
            {products?.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
            </div>
        )}
        
        <div className="mt-12 border-t pt-8">
            <div className="bg-secondary/30 rounded-lg p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h3 className="text-xl font-bold mb-2">Shop popular brands</h3>
                    <div className="flex flex-wrap gap-2 mt-4">
                         {['Zara', 'Nike', 'H&M', 'Adidas', 'Levi\'s', 'Ralph Lauren'].map(brand => (
                             <span key={brand} className="px-4 py-2 bg-white border rounded shadow-sm text-sm font-medium cursor-pointer hover:bg-gray-50">
                                 {brand}
                             </span>
                         ))}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Home;