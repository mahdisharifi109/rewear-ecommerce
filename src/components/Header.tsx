import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Search, Menu, X, Bell, Mail, Heart, User as UserIcon, ChevronDown, Filter } from 'lucide-react';
import { cn } from '../lib/utils';
import { ProductCategory } from '../types';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Search State
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [size, setSize] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('');

  // 1. Sync State from URL
  useEffect(() => {
    setQuery(searchParams.get('q') || '');
    setCategory(searchParams.get('category') || '');
    setSize(searchParams.get('size') || '');
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    setSortBy(searchParams.get('sortBy') || '');
  }, [searchParams]);

  // 2. Persistence: Restore from LocalStorage if on /search with no params
  useEffect(() => {
    if (location.pathname === '/search' && Array.from(searchParams.keys()).length === 0) {
      const savedSearch = localStorage.getItem('rewear_last_search');
      if (savedSearch) {
        navigate(`/search?${savedSearch}`, { replace: true });
      }
    }
  }, [location.pathname, searchParams, navigate]);

  // 3. Execute Search
  const executeSearch = useCallback((overrideParams?: any) => {
    const params = new URLSearchParams();
    
    const q = overrideParams?.query ?? query;
    const c = overrideParams?.category ?? category;
    const s = overrideParams?.size ?? size;
    const min = overrideParams?.minPrice ?? minPrice;
    const max = overrideParams?.maxPrice ?? maxPrice;
    const sort = overrideParams?.sortBy ?? sortBy;

    if (q) params.set('q', q);
    if (c) params.set('category', c);
    if (s) params.set('size', s);
    if (min) params.set('minPrice', min);
    if (max) params.set('maxPrice', max);
    if (sort) params.set('sortBy', sort);

    const queryString = params.toString();
    
    // Save to local storage
    if (queryString) {
        localStorage.setItem('rewear_last_search', queryString);
    }

    navigate(`/search?${queryString}`);
    if (overrideParams?.closeMenu !== false) {
       setIsFilterOpen(false);
       setIsMobileMenuOpen(false);
    }
  }, [query, category, size, minPrice, maxPrice, sortBy, navigate]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch();
  };

  // Sub-navigation categories
  const categories = [
    'Women', 'Men', 'Kids', 'Home', 'Entertainment', 'Pet Care'
  ];

  return (
    <div className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* Main Header */}
      <div className="border-b border-gray-100">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <span className="text-2xl font-bold text-primary tracking-tight">rewear</span>
          </Link>

          {/* Desktop Search - Central & Prominent */}
          <div className="hidden md:block flex-1 max-w-2xl mx-4 relative">
             <div className="relative group z-10">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-muted-foreground" />
                </div>
                
                <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={cn(
                        "absolute inset-y-0 right-0 pr-3 flex items-center border-l pl-3 my-2 text-sm font-medium transition-colors hover:text-foreground",
                        isFilterOpen ? "text-primary" : "text-muted-foreground"
                    )}
                >
                    <Filter className="w-3 h-3 mr-1" />
                    Filters
                    <ChevronDown className={cn("h-3 w-3 ml-1 transition-transform", isFilterOpen && "rotate-180")} />
                </button>

                <form onSubmit={handleSearchSubmit}>
                    <input 
                        type="text" 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for items, members..." 
                        className="block w-full rounded-md border border-input bg-secondary/30 py-2.5 pl-10 pr-24 text-sm placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                </form>

                {/* Filter Popover */}
                {isFilterOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 p-5 animate-in fade-in zoom-in-95 duration-200 origin-top">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-muted-foreground uppercase">Category</label>
                                <select 
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full text-sm border rounded-md p-2 bg-white focus:outline-none focus:border-primary cursor-pointer"
                                >
                                    <option value="">All Categories</option>
                                    {Object.values(ProductCategory).map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-muted-foreground uppercase">Size</label>
                                <select 
                                    value={size}
                                    onChange={(e) => setSize(e.target.value)}
                                    className="w-full text-sm border rounded-md p-2 bg-white focus:outline-none focus:border-primary cursor-pointer"
                                >
                                    <option value="">Any Size</option>
                                    <option value="XS">XS</option>
                                    <option value="S">S</option>
                                    <option value="M">M</option>
                                    <option value="L">L</option>
                                    <option value="XL">XL</option>
                                </select>
                            </div>

                            <div className="col-span-2 space-y-1.5 pt-2">
                                <label className="text-xs font-semibold text-muted-foreground uppercase">Price Range (€)</label>
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="number" 
                                        placeholder="Min" 
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        className="w-full text-sm border rounded-md p-2 bg-white focus:outline-none focus:border-primary"
                                    />
                                    <span className="text-muted-foreground">-</span>
                                    <input 
                                        type="number" 
                                        placeholder="Max" 
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        className="w-full text-sm border rounded-md p-2 bg-white focus:outline-none focus:border-primary"
                                    />
                                </div>
                            </div>

                             <div className="col-span-2 space-y-1.5 pt-2 border-t border-gray-50 mt-2">
                                <label className="text-xs font-semibold text-muted-foreground uppercase">Sort By</label>
                                <select 
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full text-sm border rounded-md p-2 bg-white focus:outline-none focus:border-primary cursor-pointer"
                                >
                                    <option value="">Relevance</option>
                                    <option value="newest">Newest</option>
                                    <option value="price_asc">Price: Low to High</option>
                                    <option value="price_desc">Price: High to Low</option>
                                    <option value="likes">Most Liked</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-5 pt-4 border-t border-gray-50">
                            <button 
                                type="button"
                                onClick={() => {
                                    setCategory('');
                                    setSize('');
                                    setMinPrice('');
                                    setMaxPrice('');
                                    setSortBy('');
                                }}
                                className="flex-1 px-4 py-2 text-sm text-muted-foreground hover:bg-gray-50 rounded-md transition-colors"
                            >
                                Clear
                            </button>
                            <button 
                                type="button"
                                onClick={() => executeSearch()}
                                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors shadow-sm"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                )}
             </div>
             {isFilterOpen && <div className="fixed inset-0 z-0" onClick={() => setIsFilterOpen(false)} />}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* User Auth/Menu */}
            <div className="hidden md:flex items-center gap-4 text-muted-foreground text-sm">
                <Link to="/profile" className="hover:text-primary transition-colors">
                    <UserIcon size={20} />
                </Link>
                <button className="hover:text-primary transition-colors">
                    <Heart size={20} />
                </button>
                <button className="hover:text-primary transition-colors">
                    <Mail size={20} />
                </button>
            </div>

            <Link to="/sell">
               <button className="hidden md:inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2">
                  Sell now
               </button>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-muted-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Category Nav (Desktop) */}
      <div className="hidden md:block border-b border-gray-100 bg-white">
        <div className="container mx-auto px-4">
            <nav className="flex items-center gap-8 text-sm text-muted-foreground overflow-x-auto no-scrollbar py-3">
                {categories.map((cat) => (
                    <button 
                        key={cat} 
                        onClick={() => executeSearch({ category: cat })}
                        className={cn(
                            "hover:text-primary hover:border-b-2 hover:border-primary pb-0.5 transition-colors whitespace-nowrap",
                            category === cat ? "text-primary border-b-2 border-primary" : ""
                        )}
                    >
                        {cat}
                    </button>
                ))}
            </nav>
        </div>
      </div>

      {/* Mobile Nav Sheet */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-white z-40 overflow-y-auto animate-in fade-in slide-in-from-top-2">
          <div className="p-4 space-y-6">
             <Link to="/sell" className="block w-full" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="w-full rounded-md bg-primary text-white font-medium py-3">
                    Sell now
                </button>
             </Link>
             
             <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input 
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search..." 
                    className="w-full bg-secondary/50 rounded-md py-2.5 pl-10 border-none focus:ring-1 focus:ring-primary"
                />
             </div>
             
             <div className="grid grid-cols-2 gap-2">
                 <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 bg-secondary/50 rounded text-sm"
                 >
                     <option value="">Category</option>
                     {Object.values(ProductCategory).map(c => <option key={c} value={c}>{c}</option>)}
                 </select>
                 <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-2 bg-secondary/50 rounded text-sm"
                 >
                    <option value="">Sort By</option>
                    <option value="newest">Newest</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="likes">Most Liked</option>
                 </select>
             </div>
             
             <button onClick={() => executeSearch()} className="w-full bg-primary text-white rounded p-2 text-sm font-bold">
                 Apply
             </button>

             <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Categories</p>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => executeSearch({ category: cat })}
                        className="block w-full text-left py-3 border-b border-gray-50 text-base hover:text-primary"
                    >
                        {cat}
                    </button>
                ))}
             </div>

             <div className="space-y-1 pt-4">
                 <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">My Profile</p>
                 <Link to="/profile" className="block py-2 text-base" onClick={() => setIsMobileMenuOpen(false)}>Profile</Link>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;