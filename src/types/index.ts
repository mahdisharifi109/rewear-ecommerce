
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  size: string;
  condition: ProductCondition;
  status: 'available' | 'sold' | 'reserved';
  sellerId: string;
  imageUrls: string[];
  createdAt: Date | string; // Flexibilidade para serialização do Firestore
  likes: number;
}

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  favorites: string[];
  walletBalance: number;
  createdAt: Date | string;
}

export enum ProductCategory {
  CLOTHING = "Clothing",
  SHOES = "Shoes",
  ACCESSORIES = "Accessories",
  BAGS = "Bags",
  HOME = "Home"
}

export enum ProductCondition {
  NEW = 'new',
  LIKE_NEW = 'like-new',
  GOOD = 'good',
  FAIR = 'fair'
}

export interface CartItem extends Product {
  addedAt: number;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'purchase' | 'sale';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  referenceId?: string; // ID do pedido ou venda
  createdAt: Date | string;
}

export interface Order {
  id: string;
  buyerId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string;
  createdAt: Date | string;
}
