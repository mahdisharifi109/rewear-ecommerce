import { Product, ProductCategory, ProductCondition } from '../../types';

const API_URL = 'http://localhost:3001/api';

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
    const params = new URLSearchParams();
    if (filters) {
      if (filters.category) params.append('category', filters.category);
      if (filters.size) params.append('size', filters.size);
      if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
      if (filters.query) params.append('search', filters.query);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
    }

    const response = await fetch(`${API_URL}/products?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const products = await response.json();
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return MOCK_PRODUCTS; // Fallback ensures UI doesn't crash
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) {
        return MOCK_PRODUCTS.find(p => p.id === id) || null;
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    return MOCK_PRODUCTS.find(p => p.id === id) || null;
  }
}