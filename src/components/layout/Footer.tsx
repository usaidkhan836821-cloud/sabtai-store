import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-900 text-stone-300 pt-16 pb-8 border-t border-brand-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          <div className="space-y-4">
            <h3 className="font-serif text-2xl text-white font-bold tracking-wide">SABTAI STORE</h3>
            <p className="text-sm leading-relaxed text-stone-400">
              Curating the finest Indian beauty secrets and exquisite handcrafted bangles. Embrace elegance, everyday.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="hover:text-white transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><Twitter size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-medium mb-6 uppercase tracking-wider text-sm">Shop</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/shop" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="/shop?category=Night Creams" className="hover:text-white transition-colors">Night Creams</Link></li>
              <li><Link to="/shop?category=Bangles" className="hover:text-white transition-colors">Bangles</Link></li>
              <li><Link to="/shop?featured=true" className="hover:text-white transition-colors">Featured</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-6 uppercase tracking-wider text-sm">Customer Care</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping Policy</Link></li>
              <li><Link to="/returns" className="hover:text-white transition-colors">Returns & Refunds</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-6 uppercase tracking-wider text-sm">Contact Us</h4>
            <ul className="space-y-3 text-sm text-stone-400">
              <li>
                <a href="mailto:4hm786sayyedking@gmail.com" className="hover:text-white transition-colors">
                  Email: 4hm786sayyedking@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+918368210589" className="hover:text-white transition-colors">
                  Phone: +91 8368210589
                </a>
              </li>
              <li>Hours: Mon-Sat, 10 AM - 6 PM</li>
              <li className="pt-4">
                <a href="https://wa.me/918368210589" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-[#25D366] text-white rounded hover:bg-[#128C7E] transition-colors font-medium">
                  <MessageCircle size={18} className="mr-2" />
                  WhatsApp Support
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-brand-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-stone-500">
          <p>&copy; {new Date().getFullYear()} SABTAI STORE. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <span className="flex items-center justify-center bg-white px-2 py-1 rounded text-stone-800 font-bold tracking-tighter">VISA</span>
            <span className="flex items-center justify-center bg-white px-2 py-1 rounded text-stone-800 font-bold tracking-tighter">MasterCard</span>
            <span className="flex items-center justify-center bg-white px-2 py-1 rounded text-stone-800 font-bold tracking-tighter">UPI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
