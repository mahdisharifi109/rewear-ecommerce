import React from 'react';
import { Settings, Package, Heart, Wallet } from 'lucide-react';

const Profile = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-6 mb-8">
        <div className="h-24 w-24 rounded-full bg-secondary flex items-center justify-center text-3xl font-serif text-secondary-foreground">
            JD
        </div>
        <div>
            <h1 className="text-2xl font-serif font-medium">Jane Doe</h1>
            <p className="text-muted-foreground">Member since 2023 • Portugal</p>
            <div className="flex gap-2 mt-2">
                {[1, 2, 3, 4, 5].map(star => (
                    <span key={star} className="text-yellow-500 text-sm">★</span>
                ))}
                <span className="text-xs text-muted-foreground ml-1">(12 reviews)</span>
            </div>
        </div>
        <button className="ml-auto p-2 hover:bg-muted rounded-full">
            <Settings size={20} className="text-muted-foreground" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Wallet size={18} />
                <span className="text-sm font-medium">Wallet Balance</span>
            </div>
            <p className="text-3xl font-serif font-medium text-foreground">€124.50</p>
            <p className="text-xs text-muted-foreground mt-1">€35.00 pending</p>
        </div>
         <div className="bg-card border rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Package size={18} />
                <span className="text-sm font-medium">Active Listings</span>
            </div>
            <p className="text-3xl font-serif font-medium text-foreground">8</p>
        </div>
         <div className="bg-card border rounded-lg p-6 shadow-sm">
             <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Heart size={18} />
                <span className="text-sm font-medium">Favorites</span>
            </div>
            <p className="text-3xl font-serif font-medium text-foreground">14</p>
        </div>
      </div>

      {/* Tabs Mock */}
      <div className="border-b mb-6">
        <div className="flex gap-8">
            <button className="border-b-2 border-primary pb-2 text-primary font-medium text-sm">Selling</button>
            <button className="pb-2 text-muted-foreground font-medium text-sm hover:text-foreground">Purchases</button>
            <button className="pb-2 text-muted-foreground font-medium text-sm hover:text-foreground">Reviews</button>
        </div>
      </div>

      <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
        <p className="text-muted-foreground">You have no active orders currently.</p>
      </div>
    </div>
  );
};

export default Profile;