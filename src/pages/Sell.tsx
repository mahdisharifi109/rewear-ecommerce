import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, Sparkles, Loader2, Plus } from 'lucide-react';
import { generateProductDescription } from '../../services/geminiService';
import { cn } from '../lib/utils';

const productSchema = z.object({
  name: z.string().min(3, "Title is required"),
  price: z.number().min(1, "Price is required"),
  category: z.string().min(1, "Category is required"),
  condition: z.enum(['new', 'like-new', 'good', 'fair']),
  size: z.string().min(1, "Size is required"),
  description: z.string().min(5, "Description is required"),
});

type ProductFormValues = z.infer<typeof productSchema>;

const Sell = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
        category: '',
        condition: 'good',
        description: ''
    }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
        const newFiles = Array.from(files);
        setSelectedFiles(prev => [...prev, ...newFiles]);

        // Preview logic
        newFiles.forEach((file: File) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImages(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    }
  };

  const uploadImages = async (files: File[]): Promise<string[]> => {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload ${file.name}`);
      }

      const data = await response.json();
      return data.url;
    });

    return Promise.all(uploadPromises);
  };

  const handleGenerateDescription = async () => {
    const { name, category, condition } = getValues();
    if (!name) {
        alert("Enter a title first.");
        return;
    }
    setIsGenerating(true);
    try {
        const apiKey = process.env.API_KEY || ''; 
        if(!apiKey) {
             await new Promise(resolve => setTimeout(resolve, 1000));
             setValue('description', `Selling this amazing ${name}. It is in ${condition} condition. Great for ${category} lovers. Size details in the listing.`);
             setIsGenerating(false);
             return;
        }
        const desc = await generateProductDescription(name, category, condition, apiKey);
        setValue('description', desc);
    } catch (error) {
        console.error(error);
    } finally {
        setIsGenerating(false);
    }
  };

  const onSubmit = async (data: ProductFormValues) => {
    if (selectedFiles.length === 0) {
      alert("Please upload at least one photo.");
      return;
    }

    setIsUploading(true);
    try {
      // 1. Upload Images in Parallel
      const imageUrls = await uploadImages(selectedFiles);

      // 2. Create Product
      const productData = {
        ...data,
        id: crypto.randomUUID(), // Generate ID on client or let DB handle it (if auto-increment)
        imageUrls,
        sellerId: 'user_demo', // Replace with real auth user ID
      };

      const response = await fetch('http://localhost:3001/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      alert("Product listed successfully!");
      // Reset form or redirect
      window.location.href = '/';
      
    } catch (error) {
      console.error("Error listing product:", error);
      alert("Failed to list product. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl bg-white">
      <h1 className="text-2xl font-bold mb-6 text-center md:text-left">Sell an item</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Photo Upload Section - Vinted Style: Big dashed area */}
        <div className="bg-white p-6 rounded-sm border border-dashed border-gray-300 text-center">
             {previewImages.length === 0 ? (
                <label className="cursor-pointer flex flex-col items-center gap-4 py-8">
                    <div className="p-4 bg-secondary rounded-full text-primary">
                        <Plus size={32} />
                    </div>
                    <div>
                        <p className="font-bold text-foreground">Upload photos</p>
                        <p className="text-sm text-muted-foreground mt-1">Add up to 20 photos</p>
                    </div>
                    <input type="file" multiple className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
             ) : (
                 <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                     {previewImages.map((img, i) => (
                         <div key={i} className="relative aspect-square bg-gray-100 rounded overflow-hidden">
                             <img src={img} className="w-full h-full object-cover" alt="preview" />
                         </div>
                     ))}
                     <label className="cursor-pointer flex flex-col items-center justify-center aspect-square bg-secondary/30 border border-dashed">
                         <Plus size={24} className="text-primary" />
                         <span className="text-xs mt-2 text-primary font-medium">Add more</span>
                         <input type="file" multiple className="hidden" accept="image/*" onChange={handleImageChange} />
                     </label>
                 </div>
             )}
        </div>

        {/* Form Fields - Grouped closer to look like Vinted sections */}
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                <input 
                    {...register('name')}
                    className="w-full border-b border-gray-300 py-2 focus:border-primary focus:outline-none transition-colors bg-transparent"
                    placeholder="e.g. White COS T-shirt"
                />
                {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Describe your item</label>
                 <div className="relative">
                    <textarea 
                        {...register('description')}
                        rows={5}
                        className="w-full border border-gray-300 rounded-md p-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none text-sm"
                        placeholder="e.g. worn only a few times, true to size"
                    />
                    <button 
                        type="button"
                        onClick={handleGenerateDescription}
                        disabled={isGenerating}
                        className="absolute bottom-3 right-3 text-xs flex items-center gap-1 text-primary bg-primary/10 px-2 py-1 rounded hover:bg-primary/20 transition-colors"
                    >
                        {isGenerating ? <Loader2 className="animate-spin h-3 w-3" /> : <Sparkles className="h-3 w-3" />}
                        Auto-write
                    </button>
                 </div>
                 {errors.description && <span className="text-xs text-red-500">{errors.description.message}</span>}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                    <select 
                        {...register('category')}
                        className="w-full border-b border-gray-300 py-2 focus:border-primary focus:outline-none bg-transparent"
                    >
                        <option value="">Select a category</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Shoes">Shoes</option>
                        <option value="Bags">Bags</option>
                        <option value="Accessories">Accessories</option>
                    </select>
                     {errors.category && <span className="text-xs text-red-500">{errors.category.message}</span>}
                </div>
                <div>
                     <label className="block text-sm font-bold text-gray-700 mb-1">Brand</label>
                     <input placeholder="Select a brand" className="w-full border-b border-gray-300 py-2 focus:border-primary focus:outline-none bg-transparent" />
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                 <div>
                     <label className="block text-sm font-bold text-gray-700 mb-1">Size</label>
                     <input 
                        {...register('size')}
                        className="w-full border-b border-gray-300 py-2 focus:border-primary focus:outline-none bg-transparent"
                        placeholder="e.g. M / 38"
                    />
                    {errors.size && <span className="text-xs text-red-500">{errors.size.message}</span>}
                </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Condition</label>
                    <select 
                        {...register('condition')}
                        className="w-full border-b border-gray-300 py-2 focus:border-primary focus:outline-none bg-transparent"
                    >
                        <option value="good">Good</option>
                        <option value="new">New with tags</option>
                        <option value="like-new">Very good</option>
                        <option value="fair">Satisfactory</option>
                    </select>
                </div>
            </div>

            <div className="pt-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">Price</label>
                <div className="relative max-w-[200px]">
                    <span className="absolute left-0 top-2 text-gray-500">€</span>
                    <input 
                        type="number"
                        step="0.1"
                        {...register('price', { valueAsNumber: true })}
                        className="w-full border-b border-gray-300 py-2 pl-6 focus:border-primary focus:outline-none bg-transparent font-medium text-lg"
                        placeholder="0.00"
                    />
                </div>
                 {errors.price && <span className="text-xs text-red-500">{errors.price.message}</span>}
            </div>
        </div>

        <div className="pt-6 flex justify-end">
            <button 
                type="submit" 
                disabled={isSubmitting || isUploading}
                className="w-full md:w-auto bg-primary text-white font-medium py-3 px-8 rounded-md hover:bg-primary/90 transition-all shadow-sm disabled:opacity-70 flex items-center justify-center gap-2"
            >
                {(isSubmitting || isUploading) && <Loader2 className="animate-spin h-4 w-4" />}
                {isUploading ? 'Uploading Photos...' : isSubmitting ? 'Saving...' : 'Upload'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default Sell;