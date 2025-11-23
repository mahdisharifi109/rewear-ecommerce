import React from 'react';
import { HashRouter, Routes, Route, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from './components/Header';
import Home from './pages/Home';
import Search from './pages/Search';
import ProductDetails from './pages/ProductDetails';
import Sell from './pages/Sell';
import Profile from './pages/Profile';

// Initialize QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t py-12 bg-white mt-12">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm text-muted-foreground">
            <div>
                <h4 className="font-bold text-foreground mb-4">Rewear</h4>
                <ul className="space-y-2">
                    <li>About us</li>
                    <li>Jobs</li>
                    <li>Sustainability</li>
                    <li>Press</li>
                </ul>
            </div>
            <div>
                <h4 className="font-bold text-foreground mb-4">Discover</h4>
                <ul className="space-y-2">
                    <li>How it works</li>
                    <li>Verification</li>
                    <li>Mobile apps</li>
                    <li>Infoboard</li>
                </ul>
            </div>
             <div>
                <h4 className="font-bold text-foreground mb-4">Help</h4>
                <ul className="space-y-2">
                    <li>Help Centre</li>
                    <li>Selling</li>
                    <li>Buying</li>
                    <li>Trust & Safety</li>
                </ul>
            </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t text-xs text-muted-foreground">
             <p>&copy; 2025 Rewear. Privacy Policy • Terms & Conditions</p>
        </div>
      </footer>
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="search" element={<Search />} />
            <Route path="product/:id" element={<ProductDetails />} />
            <Route path="sell" element={<Sell />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </HashRouter>
    </QueryClientProvider>
  );
};

export default App;