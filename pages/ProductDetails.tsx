import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Product } from '../types';
import { User, ShieldCheck, MapPin, Heart, Share2 } from 'lucide-react';

const fetchProductById = async (id: string): Promise<Product> => {
    // Mock fetch
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id: id,
      name: 'Vintage Denim Jacket',
      description: 'Classic 90s oversized denim jacket in perfect wash. Heavy cotton, no rips or tears. A timeless piece that goes with everything.',
      price: 15.00,
      category: 'Clothing',
      size: 'L / 40',
      condition: 'like-new',
      status: 'available',
      sellerId: 'user1',
      imageUrls: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000'],
      createdAt: '2023-10-01',
      likes: 12
    };
};

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id || ''),
    enabled: !!id
  });

  if (isLoading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="container mx-auto px-4 py-8 bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Images (takes up 2 cols) */}
        <div className="lg:col-span-2 space-y-4">
             <div className="bg-gray-100 rounded-sm overflow-hidden flex items-center justify-center min-h-[400px] lg:min-h-[600px]">
                 <img 
                     src={product.imageUrls[0]} 
                     alt={product.name} 
                     className="max-h-[80vh] object-contain"
                 />
             </div>
        </div>

        {/* Right: Details Sidebar (Sticky) */}
        <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6 p-6 bg-white border rounded-lg shadow-sm">
                
                {/* Price & Title */}
                <div className="border-b pb-4">
                    <div className="flex justify-between items-start">
                        <h1 className="text-2xl font-bold text-foreground">€{product.price.toFixed(2)}</h1>
                        <div className="flex gap-2 text-muted-foreground">
                             <Heart className="hover:text-red-500 cursor-pointer transition-colors" size={24} />
                             <Share2 className="hover:text-primary cursor-pointer transition-colors" size={24} />
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Including Buyer Protection</p>
                </div>

                {/* Specs Table */}
                <div className="space-y-3 text-sm">
                     <div className="flex justify-between py-1 border-b border-gray-50">
                        <span className="text-muted-foreground uppercase text-xs font-semibold">Brand</span>
                        <span className="text-primary font-medium">ZARA</span>
                     </div>
                     <div className="flex justify-between py-1 border-b border-gray-50">
                        <span className="text-muted-foreground uppercase text-xs font-semibold">Size</span>
                        <span className="text-foreground font-medium">{product.size}</span>
                     </div>
                     <div className="flex justify-between py-1 border-b border-gray-50">
                        <span className="text-muted-foreground uppercase text-xs font-semibold">Condition</span>
                        <span className="text-foreground font-medium">{product.condition}</span>
                     </div>
                     <div className="flex justify-between py-1 border-b border-gray-50">
                        <span className="text-muted-foreground uppercase text-xs font-semibold">Colour</span>
                        <span className="text-foreground font-medium">Blue</span>
                     </div>
                     <div className="flex justify-between py-1 border-b border-gray-50">
                         <span className="text-muted-foreground uppercase text-xs font-semibold">Location</span>
                         <span className="text-foreground flex items-center gap-1"><MapPin size={12}/> Lisbon, Portugal</span>
                     </div>
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-2">
                    <button className="w-full bg-primary text-white font-medium py-3 rounded-md hover:bg-primary/90 transition-colors shadow-sm">
                        Buy now
                    </button>
                    <button className="w-full border border-primary text-primary font-medium py-3 rounded-md hover:bg-primary/5 transition-colors">
                        Message
                    </button>
                </div>

                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <ShieldCheck className="text-primary" size={16} />
                    <p>Our <span className="text-primary underline cursor-pointer">Buyer Protection</span> is added for a fee to every purchase.</p>
                </div>

                {/* Description */}
                <div className="pt-4 border-t">
                     <h3 className="text-sm font-bold text-muted-foreground uppercase mb-2">Description</h3>
                     <p className="text-foreground leading-relaxed whitespace-pre-line text-sm">
                         {product.description}
                     </p>
                     <p className="text-xs text-muted-foreground mt-4">Uploaded {product.createdAt}</p>
                </div>

                {/* Seller */}
                <div className="pt-4 border-t flex items-center justify-between">
                    <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${product.sellerId}`} alt="Seller" />
                         </div>
                         <div>
                             <p className="font-medium text-sm">maria_silva99</p>
                             <div className="flex text-yellow-400 text-xs">★★★★★ <span className="text-muted-foreground ml-1">(45)</span></div>
                         </div>
                    </div>
                    <span className="text-primary text-xs font-medium cursor-pointer hover:underline">Profile</span>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;