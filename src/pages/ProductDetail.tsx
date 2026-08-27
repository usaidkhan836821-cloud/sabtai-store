import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, Truck, ShieldCheck, Heart, Minus, Plus, ShoppingBag, X, ZoomIn, ZoomOut } from 'lucide-react';
import { useAppStore } from '../store';
import { products } from '../data';
import { formatPrice, cn } from '../lib/utils';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, wishlist, toggleWishlist } = useAppStore();
  
  const product = products.find(p => p.id === id);
  const relatedProducts = products.filter(p => p.category === product?.category && p.id !== product?.id).slice(0, 3);
  
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  
  const [showImageModal, setShowImageModal] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  
  // Initialize default variants
  React.useEffect(() => {
    if (product?.variants) {
      const defaults: Record<string, string> = {};
      product.variants.forEach(v => {
        defaults[v.name] = v.options[0];
      });
      setSelectedVariants(defaults);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-serif mb-4">Product Not Found</h2>
        <Link to="/shop" className="text-brand-700 underline">Return to Shop</Link>
      </div>
    );
  }

  const isWishlisted = wishlist.includes(product.id);
  
  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariants);
  };
  
  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariants);
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-stone-500 mb-8">
        <Link to="/" className="hover:text-brand-700">Home</Link>
        <span className="mx-2">/</span>
        <Link to={`/shop?category=${product.category}`} className="hover:text-brand-700">{product.category}</Link>
        <span className="mx-2">/</span>
        <span className="text-stone-900 truncate">{product.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
        
        {/* Product Images */}
        <div className="lg:w-1/2 flex flex-col-reverse md:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto md:w-24 flex-shrink-0 hide-scrollbar">
            {product.images.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={cn(
                  "w-20 h-20 md:w-full md:h-24 flex-shrink-0 bg-stone-100 border-2 transition-all rounded-md overflow-hidden",
                  activeImage === idx ? "border-brand-700" : "border-transparent opacity-70 hover:opacity-100"
                )}
              >
                <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
          
          {/* Main Image */}
          <div 
            className="w-full flex-1 bg-stone-100 aspect-square md:max-h-[600px] relative rounded-lg overflow-hidden cursor-zoom-in group"
            onClick={() => {
              setShowImageModal(true);
              setIsZoomed(false);
            }}
          >
            <img src={product.images[activeImage]} alt={product.name} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300" />
            {!product.inStock && (
              <span className="absolute top-4 left-4 bg-stone-900 text-white px-3 py-1 text-xs font-bold uppercase tracking-widest z-10">
                Out of Stock
              </span>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="lg:w-1/2 flex flex-col">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-stone-500 uppercase tracking-widest">{product.category}</span>
            <div className="flex items-center text-amber-500 text-sm">
              <Star size={16} className="fill-amber-500 mr-1" />
              <span className="text-stone-700 font-medium">{product.rating}</span>
              <span className="text-stone-400 ml-1">({product.reviewsCount} reviews)</span>
            </div>
          </div>
          
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-stone-900 mb-4">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <span className="text-2xl font-bold text-brand-900">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <>
                <span className="text-lg text-stone-400 line-through">{formatPrice(product.originalPrice)}</span>
                <span className="bg-rose-100 text-rose-700 px-2 py-1 text-xs font-bold uppercase">
                  Save {formatPrice(product.originalPrice - product.price)}
                </span>
              </>
            )}
          </div>
          
          <p className="text-stone-600 mb-8 leading-relaxed">
            {product.description}
          </p>
          
          <div className="border-t border-stone-200 py-6 mb-6">
            <h3 className="font-medium text-stone-900 mb-3">Benefits:</h3>
            <ul className="list-disc pl-5 space-y-2 text-stone-600">
              {product.benefits.map((benefit, idx) => (
                <li key={idx}>{benefit}</li>
              ))}
            </ul>
          </div>

          {/* Variants */}
          {product.variants && product.variants.map(variant => (
            <div key={variant.name} className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium text-stone-900">{variant.name}</span>
                {variant.name.toLowerCase() === 'size' && product.category === 'Bangles' && (
                  <button className="text-sm text-brand-700 underline">Size Guide</button>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                {variant.options.map(option => (
                  <button
                    key={option}
                    onClick={() => setSelectedVariants({...selectedVariants, [variant.name]: option})}
                    className={cn(
                      "px-6 py-2 border text-sm transition-all",
                      selectedVariants[variant.name] === option 
                        ? "border-brand-900 bg-brand-900 text-white" 
                        : "border-stone-300 text-stone-700 hover:border-stone-400"
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
          
          {/* Add to Cart Actions */}
          <div className="mt-auto">
            <div className="flex gap-4 mb-4">
              <div className="flex items-center border border-stone-300">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 text-stone-500 hover:bg-stone-100 transition-colors"><Minus size={18} /></button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-3 text-stone-500 hover:bg-stone-100 transition-colors"><Plus size={18} /></button>
              </div>
              
              <button 
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 bg-white border border-brand-900 text-brand-900 font-bold uppercase tracking-wider hover:bg-brand-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <ShoppingBag size={18} className="mr-2" /> Add to Bag
              </button>
              
              <button 
                onClick={() => toggleWishlist(product.id)}
                className="px-4 border border-stone-300 text-stone-400 hover:text-rose-500 hover:border-rose-200 transition-colors flex items-center justify-center"
              >
                <Heart size={20} className={cn(isWishlisted && "fill-rose-500 text-rose-500")} />
              </button>
            </div>
            
            <button 
              onClick={handleBuyNow}
              disabled={!product.inStock}
              className="w-full bg-brand-900 text-white py-4 font-bold uppercase tracking-wider hover:bg-brand-800 transition-colors disabled:bg-stone-400"
            >
              Buy It Now
            </button>
          </div>
          
          {/* Product Guarantees */}
          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-stone-200 pt-6">
            <div className="flex items-center text-sm text-stone-600">
              <Truck size={20} className="mr-3 text-brand-700" />
              <span>Free Shipping on ₹500+</span>
            </div>
            <div className="flex items-center text-sm text-stone-600">
              <ShieldCheck size={20} className="mr-3 text-brand-700" />
              <span>No Return Policy (Final Sale)</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-24">
          <h2 className="font-serif text-3xl font-bold text-stone-900 mb-8 text-center">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 md:p-8">
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-6 right-6 text-white hover:text-stone-300 z-[60] bg-black/50 p-2 rounded-full"
          >
            <X size={28} />
          </button>
          
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="absolute bottom-6 right-6 text-white hover:text-stone-300 z-[60] bg-black/50 p-3 rounded-full flex items-center gap-2"
          >
            {isZoomed ? (
              <><ZoomOut size={24} /> <span className="text-sm font-medium">Zoom Out</span></>
            ) : (
              <><ZoomIn size={24} /> <span className="text-sm font-medium">Zoom In</span></>
            )}
          </button>

          <div 
            className={cn(
              "relative w-full h-full flex items-center justify-center overflow-auto scrollbar-hide",
              isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
            )}
            onClick={() => setIsZoomed(!isZoomed)}
          >
            <img
              src={product.images[activeImage]}
              alt={product.name}
              className={cn(
                "transition-transform duration-300 origin-center object-contain max-h-full max-w-full",
                isZoomed ? "scale-150 md:scale-[2]" : "scale-100"
              )}
            />
          </div>
        </div>
      )}
    </div>
  );
}
