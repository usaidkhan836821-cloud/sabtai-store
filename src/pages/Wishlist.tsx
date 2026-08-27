import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useAppStore } from '../store';
import { products } from '../data';
import ProductCard from '../components/ProductCard';

export default function Wishlist() {
  const { wishlist } = useAppStore();
  
  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 min-h-[60vh]">
      <h1 className="font-serif text-3xl md:text-4xl font-bold text-stone-900 mb-10 text-center">Your Wishlist</h1>
      
      {wishlistedProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto py-12">
          <Heart size={64} className="text-stone-200 mb-6" />
          <h2 className="text-xl font-medium text-stone-900 mb-2">Love it? Save it!</h2>
          <p className="text-stone-500 mb-8">Save your favorite items here to keep track of them and buy them later.</p>
          <Link to="/shop" className="bg-brand-900 text-white px-8 py-3 font-medium hover:bg-brand-800 transition-colors">
            Explore Collection
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {wishlistedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
