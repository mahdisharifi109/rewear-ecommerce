import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="group relative bg-transparent flex flex-col">
      {/* User small header inside card - Vinted style often implies user context */}
      <div className="flex items-center gap-2 mb-2">
         <div className="w-5 h-5 rounded-full bg-gray-200 overflow-hidden">
            {/* Placeholder avatar */}
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${product.sellerId}`} alt="User" className="w-full h-full object-cover" />
         </div>
         <span className="text-xs text-muted-foreground truncate">member{product.sellerId}</span>
      </div>

      <Link to={`/product/${product.id}`} className="block relative aspect-[3/4] overflow-hidden rounded-sm bg-gray-100">
        <img
          src={product.imageUrls[0]}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300"
          loading="lazy"
        />
        {product.status === 'sold' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white font-bold text-sm uppercase tracking-wider">
            Sold
          </div>
        )}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
             <button className="p-1.5 bg-white rounded shadow-sm hover:text-red-500 transition-colors text-gray-600">
                <Heart size={16} />
             </button>
        </div>
      </Link>
      
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