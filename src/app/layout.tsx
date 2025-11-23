
import React from 'react';
import { Open_Sans, Lora } from 'next/font/google';
import Header from '@/components/layout/Header';
import './globals.css';

// Otimização de Fontes do Next.js
const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
  display: 'swap',
});

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
});

export const metadata = {
  title: 'Rewear | Second Hand Fashion',
  description: 'Buy and sell pre-loved fashion securely.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${openSans.variable} ${lora.variable}`}>
      <body className="font-sans bg-background text-foreground antialiased min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <footer className="border-t py-12 bg-white mt-12">
          <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm text-muted-foreground">
              <div>
                  <h4 className="font-bold text-foreground mb-4">Rewear</h4>
                  <ul className="space-y-2">
                      <li>About us</li>
                      <li>Sustainability</li>
                      <li>Press</li>
                  </ul>
              </div>
              <div>
                  <h4 className="font-bold text-foreground mb-4">Discover</h4>
                  <ul className="space-y-2">
                      <li>How it works</li>
                      <li>Mobile apps</li>
                      <li>Infoboard</li>
                  </ul>
              </div>
          </div>
          <div className="container mx-auto px-4 mt-12 pt-8 border-t text-xs text-muted-foreground">
             <p>&copy; 2025 Rewear. Privacy Policy • Terms & Conditions</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
