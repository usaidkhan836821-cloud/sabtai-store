import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { useAppStore } from '../store';
import { cn, formatPrice } from '../lib/utils';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { wishlist, toggleWishlist, addToCart } = useAppStore();
  const isWishlisted = wishlist.includes(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Default to first variant option if available
    const defaultVariants: Record<string, string> = {};
    product.variants?.forEach(v => {
      defaultVariants[v.name] = v.options[0];
    });
    addToCart(product, 1, defaultVariants);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <Link to={`/product/${product.id}`} className="group flex flex-col relative h-full bg-white hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {product.originalPrice && (
          <span className="bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1">
            Sale -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
          </span>
        )}
        {!product.inStock && (
          <span className="bg-stone-800 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1">
            Sold Out
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button 
        onClick={handleWishlist}
        className="absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur rounded-full shadow-sm hover:bg-white text-stone-400 hover:text-rose-500 transition-colors"
      >
        <Heart size={18} className={cn(isWishlisted && "fill-rose-500 text-rose-500")} />
      </button>

      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
        <motion.img 
          initial={{ opacity: 0.8 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          src={product.images[0]} 
          alt={product.name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        {product.images[1] && (
          <img 
            src={product.images[1]} 
            alt={`${product.name} alternate`}
            className="absolute inset-0 object-cover w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"
          />
        )}
        
        {/* Quick Add Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out opacity-0 group-hover:opacity-100">
          <button 
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-full bg-brand-900 text-white py-3 text-sm font-medium hover:bg-brand-800 transition-colors disabled:bg-stone-300 disabled:text-stone-500 flex items-center justify-center"
          >
            <ShoppingCart size={16} className="mr-2" />
            {product.inStock ? 'Quick Add' : 'Out of Stock'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow text-center">
        <span className="text-xs text-stone-500 mb-1 uppercase tracking-widest">{product.category}</span>
        <h3 className="font-serif text-lg font-medium text-stone-900 mb-2 leading-tight flex-grow line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center justify-center gap-2 mt-auto">
          <span className="text-brand-900 font-semibold">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-stone-400 line-through text-sm">{formatPrice(product.originalPrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
