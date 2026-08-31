import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../store';
import { formatPrice } from '../lib/utils';
import { Address, Order } from '../types';

export default function Checkout() {
  const { cart, cartTotal, clearCart, addOrder } = useAppStore();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Address, 2: Payment, 3: Success
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Online'>('Online');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [address, setAddress] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    addressLine1: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{code: string, discountAmount: number} | null>(null);
  const [promoError, setPromoError] = useState('');

  // Valid Promo Codes (You can add more influencers here)
  const validPromoCodes: Record<string, { type: 'percentage' | 'flat', value: number }> = {
    'SABTAI10': { type: 'percentage', value: 10 }, // 10% discount
    'INFLUENCER10': { type: 'percentage', value: 10 }, // 10% discount
    'FLAT50': { type: 'flat', value: 50 }, // Flat 50 Rupees discount
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (!code) return;

    if (validPromoCodes[code]) {
      const promo = validPromoCodes[code];
      const discount = promo.type === 'percentage' 
        ? Math.round(cartTotal * (promo.value / 100))
        : promo.value;
      
      // Ensure discount doesn't exceed cart total
      const finalDiscount = Math.min(discount, cartTotal);
      
      setAppliedPromo({ code, discountAmount: finalDiscount });
      setPromoError('');
    } else {
      setPromoError('Invalid coupon code');
      setAppliedPromo(null);
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
    setPromoError('');
  };

  const shippingCost = cartTotal >= 500 ? 0 : 99;
  const discountAmount = appliedPromo ? appliedPromo.discountAmount : 0;
  const finalTotal = Math.max(0, cartTotal + shippingCost - discountAmount);

  // Protect route
  React.useEffect(() => {
    if (cart.length === 0 && step !== 3) {
      navigate('/cart');
    }
  }, [cart, navigate, step]);

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const processOrder = async (paymentId?: string) => {
      // Prepare the payload for Google Apps Script using URLSearchParams
      // This sends data as application/x-www-form-urlencoded, which is the most reliable way 
      // to send data to Google Apps Script (accessible via e.parameter in the script)
      const formData = new URLSearchParams();
      formData.append('first name', address.firstName);
      formData.append('last name', address.lastName);
      formData.append('email', address.email);
      formData.append('address', address.addressLine1);
      formData.append('city', address.city);
      formData.append('zip code', address.pincode);
      formData.append('selected product', cart.map(item => `${item.name} (x${item.quantity})`).join(', '));
      formData.append('total amount', finalTotal.toString());
      formData.append('date&time', new Date().toLocaleString());
      formData.append('payment method', paymentMethod === 'Online' ? 'Prepaid' : 'COD');
      formData.append('promo code', appliedPromo ? appliedPromo.code : 'None');
      if (paymentId) formData.append('payment_id', paymentId);
  
      try {
        await fetch('https://script.google.com/macros/s/AKfycbxH7_8xCY6YLCLs1eTZmNvjL7PXTvN4E2o6UuYHMgagor3o6VZZn_wlNVcF0RVIg1Sc/exec', {
          method: 'POST',
          mode: 'no-cors',
          body: formData
        });
      } catch (error) {
        console.error('Error submitting order to Google Script:', error);
      }
      
      // Create mock order
      const newOrder: Order = {
        id: `ORD-${Math.floor(Math.random() * 1000000)}`,
        date: new Date().toISOString(),
        status: 'Processing',
        total: finalTotal,
        items: [...cart],
        shippingAddress: {
          fullName: `${address.firstName} ${address.lastName}`,
          phone: address.phone,
          addressLine1: address.addressLine1,
          city: address.city,
          state: address.state,
          pincode: address.pincode
        },
        paymentMethod
      };
      
      addOrder(newOrder);
      clearCart();
      setIsSubmitting(false);
      setStep(3);
    };

    if (paymentMethod === 'Online') {
      const options = {
        key: 'rzp_live_TUa2av0KChyCeY',
        amount: finalTotal * 100, // Razorpay expects amount in paise
        currency: 'INR',
        name: 'SABTAI STORE',
        description: 'Order Payment',
        handler: function (response: any) {
          processOrder(response.razorpay_payment_id);
        },
        prefill: {
          name: `${address.firstName} ${address.lastName}`,
          email: address.email,
          contact: address.phone
        },
        theme: {
          color: '#71182A' // Using brand-900 color
        },
        modal: {
          ondismiss: function() {
            setIsSubmitting(false);
          }
        }
      };
      const rzp1 = new (window as any).Razorpay(options);
      rzp1.on('payment.failed', function (response: any) {
        alert('Payment failed. Please try again.');
        setIsSubmitting(false);
      });
      rzp1.open();
    } else {
      processOrder();
    }
  };

  if (step === 3) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16">
        <CheckCircle2 size={80} className="text-green-500 mb-6" />
        <h1 className="font-serif text-4xl font-bold text-stone-900 mb-4 text-center">Order Confirmed!</h1>
        <p className="text-stone-600 mb-8 text-center max-w-md">
          Thank you for shopping at SABTAI STORE. Your order has been placed successfully. We'll send you a confirmation email shortly.
        </p>
        <Link to="/profile" className="bg-brand-900 text-white px-8 py-3 font-medium hover:bg-brand-800 transition-colors">
          View Order History
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      
      {/* Checkout Progress */}
      <div className="flex items-center justify-center mb-12">
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? 'bg-brand-900 text-white' : 'bg-stone-200 text-stone-500'}`}>1</div>
          <div className="ml-3 font-medium text-sm hidden sm:block text-stone-900">Shipping</div>
        </div>
        <div className={`w-16 sm:w-24 h-px mx-4 ${step >= 2 ? 'bg-brand-900' : 'bg-stone-300'}`}></div>
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 2 ? 'bg-brand-900 text-white' : 'bg-stone-200 text-stone-500'}`}>2</div>
          <div className="ml-3 font-medium text-sm hidden sm:block text-stone-900">Payment</div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
        
        {/* Main Form Area */}
        <div className="lg:w-3/5 order-2 lg:order-1">
          {step === 1 ? (
            <div>
              <div className="flex items-center mb-6">
                <button onClick={() => navigate('/cart')} className="mr-4 text-stone-400 hover:text-stone-900">
                  <ArrowLeft size={20} />
                </button>
                <h2 className="font-serif text-2xl font-bold text-stone-900">Shipping Address</h2>
              </div>
              
              <form onSubmit={handleAddressSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-stone-700">First Name *</label>
                    <input required type="text" value={address.firstName} onChange={e=>setAddress({...address, firstName: e.target.value})} className="w-full border-stone-300 p-3 focus:ring-brand-700 focus:border-brand-700 rounded-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-stone-700">Last Name *</label>
                    <input required type="text" value={address.lastName} onChange={e=>setAddress({...address, lastName: e.target.value})} className="w-full border-stone-300 p-3 focus:ring-brand-700 focus:border-brand-700 rounded-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-stone-700">Email Address *</label>
                    <input required type="email" value={address.email} onChange={e=>setAddress({...address, email: e.target.value})} className="w-full border-stone-300 p-3 focus:ring-brand-700 focus:border-brand-700 rounded-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-stone-700">Phone Number *</label>
                    <input required type="tel" value={address.phone} onChange={e=>setAddress({...address, phone: e.target.value})} className="w-full border-stone-300 p-3 focus:ring-brand-700 focus:border-brand-700 rounded-sm" />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-sm font-medium text-stone-700">Address Line 1 *</label>
                    <input required type="text" value={address.addressLine1} onChange={e=>setAddress({...address, addressLine1: e.target.value})} className="w-full border-stone-300 p-3 focus:ring-brand-700 focus:border-brand-700 rounded-sm" />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-sm font-medium text-stone-700">Address Line 2 (Optional)</label>
                    <input type="text" value={address.addressLine2 || ''} onChange={e=>setAddress({...address, addressLine2: e.target.value})} className="w-full border-stone-300 p-3 focus:ring-brand-700 focus:border-brand-700 rounded-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-stone-700">City *</label>
                    <input required type="text" value={address.city} onChange={e=>setAddress({...address, city: e.target.value})} className="w-full border-stone-300 p-3 focus:ring-brand-700 focus:border-brand-700 rounded-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-stone-700">State *</label>
                      <input required type="text" value={address.state} onChange={e=>setAddress({...address, state: e.target.value})} className="w-full border-stone-300 p-3 focus:ring-brand-700 focus:border-brand-700 rounded-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-stone-700">PIN Code *</label>
                      <input required type="text" value={address.pincode} onChange={e=>setAddress({...address, pincode: e.target.value})} className="w-full border-stone-300 p-3 focus:ring-brand-700 focus:border-brand-700 rounded-sm" />
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-stone-200">
                  <button type="submit" className="w-full bg-brand-900 text-white py-4 font-bold tracking-wider hover:bg-brand-800 transition-colors">
                    Continue to Payment
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div>
              <div className="flex items-center mb-6">
                <button onClick={() => setStep(1)} className="mr-4 text-stone-400 hover:text-stone-900">
                  <ArrowLeft size={20} />
                </button>
                <h2 className="font-serif text-2xl font-bold text-stone-900">Payment Method</h2>
              </div>
              
              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                
                <div className="border border-stone-200 rounded-sm overflow-hidden">
                  <label className={`flex items-center p-4 cursor-pointer ${paymentMethod === 'Online' ? 'bg-brand-50 border-b border-stone-200' : 'border-b border-stone-200 hover:bg-stone-50'}`}>
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'Online'} 
                      onChange={() => setPaymentMethod('Online')}
                      className="text-brand-900 focus:ring-brand-900 w-5 h-5"
                    />
                    <div className="ml-4 flex-1">
                      <span className="font-medium text-stone-900 block">UPI / Card / Netbanking</span>
                      <span className="text-sm text-stone-500">Secure online payment via SABTAI STORE Razorpay</span>
                    </div>
                  </label>
                  
                  {paymentMethod === 'Online' && (
                    <div className="p-6 bg-white flex flex-col items-center justify-center text-center">
                      <ShieldCheck size={48} className="text-green-500 mb-3" />
                      <p className="text-sm text-stone-600 mb-4 max-w-sm">After clicking "Place Order", you will be securely redirected to the SABTAI STORE Razorpay gateway to complete your purchase.</p>
                      <div className="flex space-x-2">
                        {/* Mock icons */}
                        <div className="px-3 py-1 bg-stone-100 rounded text-xs font-bold text-stone-500">UPI</div>
                        <div className="px-3 py-1 bg-stone-100 rounded text-xs font-bold text-stone-500">VISA</div>
                        <div className="px-3 py-1 bg-stone-100 rounded text-xs font-bold text-stone-500">MC</div>
                      </div>
                    </div>
                  )}

                  <label className={`flex items-center p-4 cursor-pointer ${paymentMethod === 'COD' ? 'bg-brand-50' : 'hover:bg-stone-50'}`}>
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'COD'} 
                      onChange={() => setPaymentMethod('COD')}
                      className="text-brand-900 focus:ring-brand-900 w-5 h-5"
                    />
                    <div className="ml-4 flex-1">
                      <span className="font-medium text-stone-900 block">Cash on Delivery (COD)</span>
                      <span className="text-sm text-stone-500">Pay at your doorstep</span>
                    </div>
                  </label>
                </div>

                <div className="pt-6 border-t border-stone-200">
                  <button type="submit" disabled={isSubmitting} className="w-full bg-brand-900 text-white py-4 font-bold tracking-wider hover:bg-brand-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                    {isSubmitting ? 'Processing...' : `Place Order - ${formatPrice(finalTotal)}`}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:w-2/5 order-1 lg:order-2">
          <div className="bg-stone-50 p-6 md:p-8 rounded-sm sticky top-24">
            <h3 className="font-serif text-xl font-bold text-stone-900 mb-6 border-b border-stone-200 pb-4">In Your Bag</h3>
            
            <div className="space-y-4 max-h-64 overflow-y-auto mb-6 pr-2">
              {cart.map(item => (
                <div key={item.cartId} className="flex gap-4">
                  <div className="h-16 w-12 flex-shrink-0 bg-stone-200 relative">
                    <img src={item.images[0]} alt={item.name} className="h-full w-full object-cover" />
                    <span className="absolute -top-2 -right-2 bg-stone-800 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h4 className="text-sm font-medium text-stone-900 line-clamp-1">{item.name}</h4>
                    <p className="text-xs text-stone-500">{formatPrice(item.price)}</p>
                  </div>
                  <div className="font-medium text-sm text-stone-900 flex items-center">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-6 border-t border-stone-200 text-sm">
              
              {/* Promo Code Input */}
              <div className="mb-4 pb-4 border-b border-stone-200">
                {!appliedPromo ? (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo/Influencer Code"
                      className="flex-1 border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:border-brand-900 uppercase"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <button 
                      type="submit"
                      className="bg-stone-900 text-white px-4 py-2 text-sm font-medium hover:bg-stone-800 transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                ) : (
                  <div className="flex justify-between items-center bg-green-50 text-green-700 px-3 py-2 border border-green-200 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{appliedPromo.code}</span> applied
                    </div>
                    <button onClick={removePromo} className="text-stone-500 hover:text-stone-900 underline text-xs">
                      Remove
                    </button>
                  </div>
                )}
                {promoError && <p className="text-red-500 text-xs mt-2">{promoError}</p>}
              </div>

              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</span>
              </div>
              
              {appliedPromo && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Discount ({appliedPromo.code})</span>
                  <span>-{formatPrice(appliedPromo.discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-stone-200 mt-2">
                <span className="font-bold text-stone-900 uppercase">Total</span>
                <span className="text-xl font-bold text-brand-900">{formatPrice(finalTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
