export interface Product {
  id: string;
  name: string;
  category: 'Night Creams' | 'Bangles';
  price: number;
  originalPrice?: number;
  description: string;
  benefits: string[];
  images: string[];
  variants?: { name: string; options: string[] }[];
  inStock: boolean;
  rating: number;
  reviewsCount: number;
  isFeatured?: boolean;
}

export interface CartItem extends Product {
  cartId: string;
  quantity: number;
  selectedVariants: Record<string, string>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
  items: CartItem[];
  shippingAddress: Address;
  paymentMethod: 'COD' | 'Online';
}

export interface Address {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}
