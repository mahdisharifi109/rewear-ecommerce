import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Product } from '../../../types/index';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="group relative bg-transparent flex flex-col">
      {/* User Info Header */}
      <div className="flex items-center gap-2 mb-2">
         <div className="w-5 h-5 rounded-full bg-gray-200 overflow-hidden relative">
            <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${product.sellerId}`} 
                alt="User" 
                className="object-cover w-full h-full"
            />
         </div>
         <span className="text-xs text-muted-foreground truncate">member{product.sellerId}</span>
      </div>

      {/* Product Image */}
      <Link to={`/product/${product.id}`} className="block relative aspect-[3/4] overflow-hidden rounded-sm bg-secondary">
        <img
          src={product.imageUrls[0]}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Status Overlay */}
        {product.status === 'sold' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white font-bold text-sm uppercase tracking-wider z-10">
            Sold
          </div>
        )}

        {/* Hover Actions */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
             <button 
                className="p-1.5 bg-white rounded shadow-sm hover:text-red-500 transition-colors text-gray-600"
                onClick={(e) => {
                    e.preventDefault();
                    // Implement like logic here
                }}
             >
                <Heart size={16} />
             </button>
        </div>
      </Link>
      
      {/* Product Info */}
      <div className="mt-2 space-y-0.5">
        <div className="flex items-baseline gap-2">
            <span className="font-bold text-base text-foreground">{product.price.toFixed(2)} €</span>
            <span className="text-xs text-muted-foreground bg-gray-100 px-1 rounded">i</span>
        </div>
        
        <p className="text-xs text-muted-foreground truncate">{product.size}</p>
        <p className="text-xs text-muted-foreground truncate font-medium">{product.name}</p>
      </div>
    </div>
  );
};

export default ProductCard;