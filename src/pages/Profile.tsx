import React, { useState } from 'react';
import { Package, User as UserIcon, LogOut, ChevronRight } from 'lucide-react';
import { useAppStore } from '../store';
import { formatPrice } from '../lib/utils';
import { Navigate } from 'react-router-dom';

export default function Profile() {
  const { user, login, logout, orders } = useAppStore();
  const [email, setEmail] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'details'>('orders');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) login(email);
  };

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-stone-50">
        <div className="bg-white p-8 max-w-md w-full shadow-sm border border-stone-100 rounded-sm">
          <div className="text-center mb-8">
            <h2 className="font-serif text-3xl font-bold text-stone-900 mb-2">Welcome Back</h2>
            <p className="text-stone-500">Sign in to track your orders and manage your account.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Email Address</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-stone-300 focus:ring-brand-700 focus:border-brand-700 rounded-sm"
                placeholder="you@example.com"
              />
            </div>
            <button type="submit" className="w-full bg-brand-900 text-white py-3 font-medium hover:bg-brand-800 transition-colors">
              Continue with Email
            </button>
            <p className="text-xs text-stone-400 text-center mt-4">
              For this demo, any email will log you in instantly.
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Sidebar */}
        <div className="lg:w-1/4">
          <div className="bg-stone-50 p-6 rounded-sm mb-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-brand-900 text-white rounded-full flex items-center justify-center font-serif text-xl font-bold uppercase">
                {user.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-medium text-stone-900">{user.name}</h3>
                <p className="text-sm text-stone-500">{user.email}</p>
              </div>
            </div>
            
            <nav className="space-y-1">
              <button 
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-sm transition-colors ${activeTab === 'orders' ? 'bg-white text-brand-900 shadow-sm' : 'text-stone-600 hover:bg-white hover:text-stone-900'}`}
              >
                <div className="flex items-center"><Package size={18} className="mr-3" /> Orders</div>
                <ChevronRight size={16} />
              </button>
              <button 
                onClick={() => setActiveTab('details')}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-sm transition-colors ${activeTab === 'details' ? 'bg-white text-brand-900 shadow-sm' : 'text-stone-600 hover:bg-white hover:text-stone-900'}`}
              >
                <div className="flex items-center"><UserIcon size={18} className="mr-3" /> Account Details</div>
                <ChevronRight size={16} />
              </button>
              <button 
                onClick={logout}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-rose-600 hover:bg-white rounded-sm transition-colors mt-4"
              >
                <div className="flex items-center"><LogOut size={18} className="mr-3" /> Sign Out</div>
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:w-3/4">
          {activeTab === 'orders' && (
            <div>
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-6">Order History</h2>
              
              {orders.length === 0 ? (
                <div className="bg-stone-50 p-12 text-center rounded-sm border border-stone-100">
                  <Package size={48} className="mx-auto text-stone-300 mb-4" />
                  <h3 className="text-lg font-medium text-stone-900 mb-2">No orders yet</h3>
                  <p className="text-stone-500">When you place an order, it will appear here.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-stone-200 rounded-sm overflow-hidden bg-white">
                      <div className="bg-stone-50 p-4 sm:p-6 border-b border-stone-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <p className="text-xs text-stone-500 uppercase tracking-wider mb-1">Order Placed</p>
                          <p className="font-medium text-stone-900">{new Date(order.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                        <div>
                          <p className="text-xs text-stone-500 uppercase tracking-wider mb-1">Total</p>
                          <p className="font-medium text-stone-900">{formatPrice(order.total)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-stone-500 uppercase tracking-wider mb-1">Order #</p>
                          <p className="font-medium text-stone-900">{order.id}</p>
                        </div>
                        <div>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            {order.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-4 sm:p-6 space-y-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center">
                            <div className="h-16 w-16 bg-stone-100 flex-shrink-0">
                              <img src={item.images[0]} alt={item.name} className="h-full w-full object-cover" />
                            </div>
                            <div className="ml-4 flex-1">
                              <h4 className="text-sm font-medium text-stone-900">{item.name}</h4>
                              <p className="text-xs text-stone-500 mt-1">Qty: {item.quantity}</p>
                            </div>
                            <div className="font-medium text-sm text-stone-900">
                              {formatPrice(item.price)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'details' && (
            <div>
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-6">Account Details</h2>
              <div className="bg-white border border-stone-200 rounded-sm p-6 max-w-2xl">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Name</label>
                      <input type="text" defaultValue={user.name} className="w-full p-3 border border-stone-300 focus:ring-brand-700 focus:border-brand-700 rounded-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
                      <input type="email" defaultValue={user.email} disabled className="w-full p-3 border border-stone-200 bg-stone-50 text-stone-500 rounded-sm cursor-not-allowed" />
                    </div>
                  </div>
                  <button type="button" className="bg-brand-900 text-white px-6 py-2 font-medium hover:bg-brand-800 transition-colors">
                    Save Changes
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
