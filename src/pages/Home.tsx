import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, ShieldCheck, Truck, Lock } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products } from '../data';

export default function Home() {
  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center bg-stone-900 overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <img 
            src="/Hero-Banner.PNG" 
            alt="Hero Banner" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900/80 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-white"
          >
            <span className="text-brand-300 font-medium tracking-widest uppercase text-sm mb-4 block">
              The Essence of India
            </span>
            <h1 className="font-serif text-5xl md:text-7xl font-bold leading-tight mb-6">
              Handcrafted Elegance & <br /> Timeless Beauty
            </h1>
            <p className="text-lg md:text-xl text-stone-200 mb-8 font-light max-w-xl">
              Discover our exquisite collection of premium traditional bangles and luxury jewelry.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/shop?category=Bangles" 
                className="bg-white text-stone-900 px-8 py-4 text-sm font-bold uppercase tracking-wider hover:bg-stone-100 transition-colors text-center"
              >
                Shop Collection
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-brand-900 py-10 border-b border-brand-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-brand-100">
            <div className="flex flex-col items-center">
              <ShieldCheck size={32} className="mb-4 text-brand-300" />
              <h3 className="font-semibold mb-2">100% Authentic</h3>
              <p className="text-sm text-brand-200">Premium quality materials & craftsmanship</p>
            </div>
            <div className="flex flex-col items-center">
              <Truck size={32} className="mb-4 text-brand-300" />
              <h3 className="font-semibold mb-2">Free Delivery</h3>
              <p className="text-sm text-brand-200">On all orders above ₹500 across India</p>
            </div>
            <div className="flex flex-col items-center">
              <Lock size={32} className="mb-4 text-brand-300" />
              <h3 className="font-semibold mb-2">Secure Checkout</h3>
              <p className="text-sm text-brand-200">100% safe & trusted payment options</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl text-stone-900 font-bold mb-4">Curated For You</h2>
              <p className="text-stone-500">Our most loved skincare and jewelry pieces.</p>
            </div>
            <Link to="/shop" className="hidden md:flex items-center text-brand-700 font-medium hover:text-brand-900 transition-colors">
              View All <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="mt-12 text-center md:hidden">
            <Link to="/shop" className="inline-flex items-center justify-center border border-stone-300 px-8 py-3 text-stone-700 font-medium hover:bg-stone-100 transition-colors w-full">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Category Split */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Category 1 */}
            <div className="relative group overflow-hidden h-[500px]">
              <img 
                src="/night-cream.PNG" 
                alt="Ayurvedic Radiance"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-stone-900/30 group-hover:bg-stone-900/40 transition-colors"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                <h3 className="font-serif text-4xl font-bold mb-4">Ayurvedic Radiance</h3>
                <p className="mb-8 max-w-sm">Repair and rejuvenate your skin overnight with our potent botanical formulations.</p>
                <Link to="/shop?category=Night Creams" className="bg-white text-stone-900 px-8 py-3 text-sm font-bold uppercase tracking-wider hover:bg-stone-100 transition-colors">
                  Shop Creams
                </Link>
              </div>
            </div>

            {/* Category 2 */}
            <div className="relative group overflow-hidden h-[500px]">
              <img 
                src="/Silver-Bangles.PNG" 
                alt="Silver Bangles"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-stone-900/30 group-hover:bg-stone-900/40 transition-colors"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                <h3 className="font-serif text-4xl font-bold mb-4">Everyday Elegance</h3>
                <p className="mb-8 max-w-sm">Minimalist silver designs for a sophisticated, versatile look.</p>
                <Link to="/shop?category=Bangles" className="bg-white text-stone-900 px-8 py-3 text-sm font-bold uppercase tracking-wider hover:bg-stone-100 transition-colors">
                  Shop Silver
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-brand-50 border-t border-brand-100">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl font-bold text-stone-900 mb-4">Join the SABTAI Society</h2>
          <p className="text-stone-600 mb-8">Subscribe to receive updates, access to exclusive deals, and more.</p>
          <form className="flex max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="flex-1 px-4 py-3 border border-stone-300 focus:outline-none focus:border-brand-700 bg-white"
              required
            />
            <button type="submit" className="bg-brand-900 text-white px-6 py-3 font-medium hover:bg-brand-800 transition-colors">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
