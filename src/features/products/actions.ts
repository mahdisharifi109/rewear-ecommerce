'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, limit, orderBy, QueryConstraint } from 'firebase/firestore';
import { Product, ProductCategory, ProductCondition } from '../../types';

export interface ProductFilters {
  query?: string;
  category?: string;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
}

// Mock Data for Development/Fallback
const MOCK_PRODUCTS: Product[] = [
    {
      id: '1',
      name: 'Zara Denim Jacket',
      description: 'Classic oversized denim jacket.',
      price: 15.00,
      category: ProductCategory.CLOTHING,
      size: 'M',
      condition: ProductCondition.GOOD,
      status: 'available',
      sellerId: 'user1',
      imageUrls: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600'],
      createdAt: '2023-10-01T10:00:00Z',
      likes: 12
    },
    {
      id: '2',
      name: 'Vintage Leather Bag',
      description: 'Genuine leather.',
      price: 45.50,
      category: ProductCategory.BAGS,
      size: 'One Size',
      condition: ProductCondition.LIKE_NEW,
      status: 'available',
      sellerId: 'user2',
      imageUrls: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=600'],
      createdAt: '2023-10-05T12:00:00Z',
      likes: 45
    },
    {
      id: '3',
      name: 'Nike Sneakers',
      description: 'Air force one.',
      price: 80.00,
      category: ProductCategory.SHOES,
      size: '39',
      condition: ProductCondition.GOOD,
      status: 'available',
      sellerId: 'user3',
      imageUrls: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600'],
      createdAt: '2023-09-28T09:30:00Z',
      likes: 8
    },
    {
      id: '4',
      name: 'Silk Scarf',
      description: 'Hand painted silk scarf.',
      price: 5.00,
      category: ProductCategory.ACCESSORIES,
      size: 'One Size',
      condition: ProductCondition.NEW,
      status: 'available',
      sellerId: 'user4',
      imageUrls: ['https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&q=80&w=600'],
      createdAt: '2023-10-03T15:20:00Z',
      likes: 8
    },
    {
        id: '5',
        name: 'Levi\'s 501 Jeans',
        description: 'Classic fit.',
        price: 25.00,
        category: ProductCategory.CLOTHING,
        size: 'M',
        condition: ProductCondition.FAIR,
        status: 'available',
        sellerId: 'user5',
        imageUrls: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=600'],
        createdAt: '2023-10-02T11:00:00Z',
        likes: 22
    },
    {
        id: '6',
        name: 'Dr Martens Boots',
        description: 'Black leather boots.',
        price: 110.00,
        category: ProductCategory.SHOES,
        size: '40',
        condition: ProductCondition.LIKE_NEW,
        status: 'available',
        sellerId: 'user6',
        imageUrls: ['https://images.unsplash.com/photo-1638319533874-e0f306868035?auto=format&fit=crop&q=80&w=600'],
        createdAt: '2023-10-06T14:45:00Z',
        likes: 105
    }
];

export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  try {
    const productsRef = collection(db, 'products');
    const constraints: QueryConstraint[] = [
        where('status', '==', 'available'),
        orderBy('createdAt', 'desc'),
        limit(50)
    ];

    // Basic Firestore Filtering
    if (filters?.category) {
        constraints.push(where('category', '==', filters.category));
    }
    
    // Execute Query
    const q = query(productsRef, ...constraints);
    const snapshot = await getDocs(q);

    let results: Product[] = [];

    if (!snapshot.empty) {
        results = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Product[];
    } else {
        // If DB is empty, use mock data for demo purposes
        results = [...MOCK_PRODUCTS];
    }

    // Advanced In-Memory Filtering 
    // (Simulating complex search engine logic that Firestore struggles with natively without Algolia/Typesense)
    if (filters) {
        if (filters.category) {
            // Re-apply for mock data case
            results = results.filter(p => p.category === filters.category);
        }
        if (filters.size) {
            results = results.filter(p => p.size.includes(filters.size!));
        }
        if (filters.minPrice !== undefined) {
            results = results.filter(p => p.price >= filters.minPrice!);
        }
        if (filters.maxPrice !== undefined) {
            results = results.filter(p => p.price <= filters.maxPrice!);
        }
        if (filters.query) {
            const lowerQ = filters.query.toLowerCase();
            results = results.filter(p => 
                p.name.toLowerCase().includes(lowerQ) || 
                p.description.toLowerCase().includes(lowerQ)
            );
        }

        // Sorting
        if (filters.sortBy) {
          switch (filters.sortBy) {
            case 'price_asc':
              results.sort((a, b) => a.price - b.price);
              break;
            case 'price_desc':
              results.sort((a, b) => b.price - a.price);
              break;
            case 'likes':
              results.sort((a, b) => b.likes - a.likes);
              break;
            case 'newest':
              results.sort((a, b) => new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime());
              break;
            default:
              break;
          }
        }
    }

    return results;

  } catch (error) {
    console.error("Error fetching products:", error);
    return MOCK_PRODUCTS; // Fallback ensures UI doesn't crash
  }
}

export async function getProductById(id: string): Promise<Product | null> {
    const product = MOCK_PRODUCTS.find(p => p.id === id);
    return product || null;
}