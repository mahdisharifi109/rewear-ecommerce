import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, Bell, Mail, Heart, User as UserIcon, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

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
          <div className="hidden md:block flex-1 max-w-2xl mx-4">
             <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-muted-foreground" />
                </div>
                <button className="absolute inset-y-0 right-0 pr-3 flex items-center border-l pl-3 my-2 text-sm text-muted-foreground hover:text-foreground">
                    Items
                    <ChevronDown className="h-3 w-3 ml-1" />
                </button>
                <input 
                    type="text" 
                    placeholder="Search for items, members..." 
                    className="block w-full rounded-md border border-input bg-secondary/30 py-2.5 pl-10 pr-20 text-sm placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
             </div>
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
                    <Link 
                        key={cat} 
                        to={`/?category=${cat}`} 
                        className="hover:text-primary hover:border-b-2 hover:border-primary pb-0.5 transition-colors whitespace-nowrap"
                    >
                        {cat}
                    </Link>
                ))}
            </nav>
        </div>
      </div>

      {/* Mobile Nav Sheet */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-white z-40 overflow-y-auto animate-in fade-in slide-in-from-top-2">
          <div className="p-4 space-y-6">
             <Link to="/sell" className="block w-full">
                <button className="w-full rounded-md bg-primary text-white font-medium py-3">
                    Sell now
                </button>
             </Link>
             
             <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input 
                    type="text" 
                    placeholder="Search..." 
                    className="w-full bg-secondary/50 rounded-md py-2.5 pl-10 border-none focus:ring-1 focus:ring-primary"
                />
             </div>

             <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Categories</p>
                {categories.map((cat) => (
                    <Link
                        key={cat}
                        to="/"
                        className="block py-3 border-b border-gray-50 text-base hover:text-primary"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        {cat}
                    </Link>
                ))}
             </div>

             <div className="space-y-1 pt-4">
                 <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">My Profile</p>
                 <Link to="/profile" className="block py-2 text-base" onClick={() => setIsMobileMenuOpen(false)}>Profile</Link>
                 <Link to="/profile" className="block py-2 text-base" onClick={() => setIsMobileMenuOpen(false)}>Inbox</Link>
                 <Link to="/profile" className="block py-2 text-base" onClick={() => setIsMobileMenuOpen(false)}>My Orders</Link>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;