import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products } from '../data';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryQuery = searchParams.get('category');
  const searchQuery = searchParams.get('q');
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState('featured');
  const [activeCategory, setActiveCategory] = useState<string | null>(categoryQuery);
  const [priceRange, setPriceRange] = useState<number>(5000);

  // Sync state with URL when it changes externally
  useEffect(() => {
    setActiveCategory(categoryQuery);
  }, [categoryQuery]);

  // Update URL when category changes internally
  const handleCategoryChange = (cat: string | null) => {
    setActiveCategory(cat);
    if (cat) {
      setSearchParams({ category: cat });
    } else {
      searchParams.delete('category');
      setSearchParams(searchParams);
    }
  };

  // Filter products
  let filteredProducts = products.filter(p => p.price <= priceRange);
  
  if (activeCategory) {
    filteredProducts = filteredProducts.filter(p => p.category === activeCategory);
  }
  
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }

  // Sort products
  switch (sortOption) {
    case 'price-low':
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      // Mock newest by using id string comparison for now
      filteredProducts.sort((a, b) => b.id.localeCompare(a.id));
      break;
    case 'featured':
    default:
      filteredProducts.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
      break;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-stone-900 mb-4">
          {searchQuery ? `Search Results for "${searchQuery}"` : (activeCategory || 'All Products')}
        </h1>
        <p className="text-stone-500 max-w-2xl mx-auto">
          Explore our luxurious range of handcrafted jewelry and Ayurvedic skincare essentials.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex justify-between items-center border-b border-stone-200 pb-4">
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center font-medium text-stone-700"
          >
            <Filter size={18} className="mr-2" /> Filter
          </button>
          
          <div className="flex items-center">
            <span className="text-sm text-stone-500 mr-2">Sort:</span>
            <select 
              className="text-sm border-none bg-transparent focus:ring-0 font-medium p-0"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        {/* Filters Sidebar */}
        <aside className={`
          fixed inset-0 z-50 bg-white p-6 transform transition-transform duration-300 ease-in-out lg:static lg:block lg:w-64 lg:p-0 lg:transform-none lg:bg-transparent lg:z-auto
          ${isFilterOpen ? 'translate-x-0 overflow-y-auto' : '-translate-x-full'}
        `}>
          <div className="flex justify-between items-center lg:hidden mb-6">
            <h2 className="text-xl font-bold">Filters</h2>
            <button onClick={() => setIsFilterOpen(false)} className="text-stone-500">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-8">
            {/* Category Filter */}
            <div>
              <h3 className="font-medium text-stone-900 mb-4 uppercase tracking-wider text-sm flex items-center">
                <SlidersHorizontal size={16} className="mr-2" /> Categories
              </h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="category" 
                    checked={activeCategory === null}
                    onChange={() => handleCategoryChange(null)}
                    className="text-brand-700 focus:ring-brand-700" 
                  />
                  <span className={activeCategory === null ? 'font-medium text-brand-700' : 'text-stone-600'}>All Products</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="category" 
                    checked={activeCategory === 'Night Creams'}
                    onChange={() => handleCategoryChange('Night Creams')}
                    className="text-brand-700 focus:ring-brand-700" 
                  />
                  <span className={activeCategory === 'Night Creams' ? 'font-medium text-brand-700' : 'text-stone-600'}>Night Creams</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="category" 
                    checked={activeCategory === 'Bangles'}
                    onChange={() => handleCategoryChange('Bangles')}
                    className="text-brand-700 focus:ring-brand-700" 
                  />
                  <span className={activeCategory === 'Bangles' ? 'font-medium text-brand-700' : 'text-stone-600'}>Bangles</span>
                </label>
              </div>
            </div>

            {/* Price Filter */}
            <div className="border-t border-stone-200 pt-8">
              <h3 className="font-medium text-stone-900 mb-4 uppercase tracking-wider text-sm">Max Price: ₹{priceRange}</h3>
              <input 
                type="range" 
                min="500" 
                max="5000" 
                step="100"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-brand-700"
              />
              <div className="flex justify-between text-xs text-stone-500 mt-2">
                <span>₹500</span>
                <span>₹5,000</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 lg:hidden">
            <button 
              onClick={() => setIsFilterOpen(false)}
              className="w-full bg-brand-900 text-white py-3 font-medium"
            >
              Apply Filters
            </button>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          <div className="hidden lg:flex justify-between items-center mb-8 border-b border-stone-200 pb-4">
            <p className="text-stone-500 text-sm">Showing {filteredProducts.length} results</p>
            <div className="flex items-center">
              <span className="text-sm text-stone-500 mr-2">Sort by:</span>
              <select 
                className="text-sm border-stone-300 rounded focus:ring-brand-700 focus:border-brand-700"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-xl font-medium text-stone-900 mb-2">No products found</h3>
              <p className="text-stone-500">Try adjusting your filters or search query.</p>
              <button 
                onClick={() => {
                  setActiveCategory(null);
                  setPriceRange(5000);
                  searchParams.delete('q');
                  setSearchParams(searchParams);
                }}
                className="mt-6 border border-brand-900 text-brand-900 px-6 py-2 hover:bg-brand-50 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
