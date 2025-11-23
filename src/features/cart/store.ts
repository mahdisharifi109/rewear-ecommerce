
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product, CartItem } from '../../types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (product) => {
        const currentItems = get().items;
        // Evita duplicados simples baseados no ID
        if (currentItems.some(item => item.id === product.id)) return;
        
        set({ 
          items: [...currentItems, { ...product, addedAt: Date.now() }],
          isOpen: true 
        });
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.id !== productId) });
      },

      clearCart: () => set({ items: [] }),

      toggleCart: () => set({ isOpen: !get().isOpen }),

      total: () => get().items.reduce((sum, item) => sum + item.price, 0),
    }),
    {
      name: 'rewear-cart-storage',
      storage: createJSONStorage(() => localStorage),
      // Apenas persistir items, não o estado de UI (isOpen)
      partialize: (state) => ({ items: state.items }),
    }
  )
);
