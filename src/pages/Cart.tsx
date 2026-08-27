import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAppStore } from '../store';
import { formatPrice } from '../lib/utils';
import { motion } from 'motion/react';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useAppStore();
  const navigate = useNavigate();

  const shippingCost = cartTotal >= 500 ? 0 : 99;
  const finalTotal = cartTotal + shippingCost;

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="font-serif text-4xl font-bold text-stone-900 mb-4">Your Shopping Bag</h1>
        <p className="text-stone-500 mb-8 max-w-md">Your bag is currently empty. Discover our collections to find something beautiful.</p>
        <Link to="/shop" className="bg-brand-900 text-white px-8 py-3 font-medium hover:bg-brand-800 transition-colors">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <h1 className="font-serif text-3xl md:text-4xl font-bold text-stone-900 mb-10">Your Shopping Bag</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="hidden md:grid grid-cols-6 border-b border-stone-200 pb-4 mb-6 text-sm font-medium text-stone-500 uppercase tracking-wider">
            <div className="col-span-3">Product</div>
            <div className="col-span-1 text-center">Price</div>
            <div className="col-span-1 text-center">Quantity</div>
            <div className="col-span-1 text-right">Total</div>
          </div>
          
          <ul className="space-y-6 md:space-y-0 divide-y divide-stone-200">
            {cart.map((item) => (
              <motion.li 
                key={item.cartId} 
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-6 flex flex-col md:grid md:grid-cols-6 md:items-center gap-4"
              >
                {/* Product Info */}
                <div className="col-span-3 flex items-center">
                  <div className="h-24 w-20 flex-shrink-0 bg-stone-100 mr-4">
                    <img src={item.images[0]} alt={item.name} className="h-full w-full object-cover object-center" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-stone-900 mb-1">
                      <Link to={`/product/${item.id}`} className="hover:text-brand-700">{item.name}</Link>
                    </h3>
                    <div className="text-sm text-stone-500 space-y-1">
                      <p>{item.category}</p>
                      {Object.entries(item.selectedVariants).map(([key, val]) => (
                        <p key={key}>{key}: {val}</p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Mobile Price & Controls */}
                <div className="md:hidden flex justify-between items-center mt-2">
                  <p className="font-medium text-stone-900">{formatPrice(item.price)}</p>
                  <div className="flex items-center border border-stone-300">
                    <button onClick={() => updateQuantity(item.cartId, item.quantity - 1)} className="px-3 py-1 hover:bg-stone-100">-</button>
                    <span className="px-2 py-1 text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.cartId, item.quantity + 1)} className="px-3 py-1 hover:bg-stone-100">+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.cartId)} className="text-stone-400 hover:text-rose-500">
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Desktop Price */}
                <div className="hidden md:block col-span-1 text-center font-medium text-stone-900">
                  {formatPrice(item.price)}
                </div>

                {/* Desktop Quantity */}
                <div className="hidden md:flex col-span-1 justify-center">
                  <div className="flex items-center border border-stone-300">
                    <button onClick={() => updateQuantity(item.cartId, item.quantity - 1)} className="px-3 py-1 hover:bg-stone-100 transition-colors">-</button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.cartId, item.quantity + 1)} className="px-3 py-1 hover:bg-stone-100 transition-colors">+</button>
                  </div>
                </div>

                {/* Desktop Total & Remove */}
                <div className="hidden md:flex col-span-1 justify-end items-center space-x-4">
                  <span className="font-semibold text-brand-900">{formatPrice(item.price * item.quantity)}</span>
                  <button onClick={() => removeFromCart(item.cartId)} className="text-stone-400 hover:text-rose-500 transition-colors" title="Remove">
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-stone-50 p-6 md:p-8 rounded-sm">
            <h2 className="font-serif text-2xl font-bold text-stone-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</span>
              </div>
              {shippingCost > 0 && (
                <p className="text-xs text-brand-700 italic">
                  Add {formatPrice(500 - cartTotal)} more to get free shipping.
                </p>
              )}
            </div>
            
            <div className="border-t border-stone-200 pt-4 mb-8">
              <div className="flex justify-between items-end">
                <span className="font-bold text-stone-900 uppercase tracking-wide">Total</span>
                <span className="text-2xl font-bold text-brand-900">{formatPrice(finalTotal)}</span>
              </div>
              <p className="text-xs text-stone-500 mt-1 text-right">Inclusive of all taxes</p>
            </div>
            
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full bg-brand-900 text-white py-4 font-bold uppercase tracking-wider flex justify-center items-center hover:bg-brand-800 transition-colors"
            >
              Proceed to Checkout <ArrowRight size={18} className="ml-2" />
            </button>
            
            <div className="mt-6 flex items-center justify-center text-sm text-stone-500 space-x-2">
              <ShieldCheck size={18} className="text-green-600" />
              <span>Secure & Encrypted Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
