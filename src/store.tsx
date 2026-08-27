import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, User, Order } from './types';

interface AppContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, variants: Record<string, string>) => void;
  removeFromCart: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
  
  orders: Order[];
  addOrder: (order: Order) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('sabtai_cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('sabtai_wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('sabtai_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('sabtai_orders');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('sabtai_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('sabtai_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('sabtai_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('sabtai_user');
    }
  }, [user]);
  
  useEffect(() => {
    localStorage.setItem('sabtai_orders', JSON.stringify(orders));
  }, [orders]);

  const addToCart = (product: Product, quantity: number, selectedVariants: Record<string, string>) => {
    setCart(prev => {
      // Create a unique ID based on product ID and selected variants
      const cartId = `${product.id}-${JSON.stringify(selectedVariants)}`;
      
      const existing = prev.find(item => item.cartId === cartId);
      if (existing) {
        return prev.map(item => 
          item.cartId === cartId 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, cartId, quantity, selectedVariants }];
    });
  };

  const removeFromCart = (cartId: string) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const updateQuantity = (cartId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartId);
      return;
    }
    setCart(prev => prev.map(item => 
      item.cartId === cartId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const login = (email: string) => {
    // Mock login
    setUser({ id: 'u1', name: email.split('@')[0], email });
  };

  const logout = () => setUser(null);
  
  const addOrder = (order: Order) => setOrders(prev => [order, ...prev]);

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <AppContext.Provider value={{
      cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal,
      wishlist, toggleWishlist,
      user, login, logout,
      orders, addOrder
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
};
