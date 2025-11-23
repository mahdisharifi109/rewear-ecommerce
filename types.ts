export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  size: string;
  condition: 'new' | 'like-new' | 'good' | 'fair';
  status: 'available' | 'sold';
  sellerId: string;
  imageUrls: string[];
  createdAt: string;
  likes: number;
}

export interface User {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
  favorites: string[]; // Product IDs
  walletBalance: number;
  rating: number;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageTimestamp: string;
  productId?: string;
}

export enum ProductCategory {
  CLOTHING = "Clothing",
  SHOES = "Shoes",
  ACCESSORIES = "Accessories",
  BAGS = "Bags"
}
