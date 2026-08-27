import React from 'react';
import { useLocation } from 'react-router-dom';

export default function StaticPages() {
  const location = useLocation();
  const path = location.pathname.substring(1); // remove leading slash
  
  const getTitle = () => {
    switch (path) {
      case 'about': return 'About Us';
      case 'faq': return 'Frequently Asked Questions';
      case 'shipping': return 'Shipping Policy';
      case 'returns': return 'Returns & Refunds';
      case 'terms': return 'Terms & Conditions';
      case 'privacy': return 'Privacy Policy';
      default: return 'Information';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="font-serif text-4xl font-bold text-stone-900 mb-8 text-center">{getTitle()}</h1>
      
      <div className="bg-white p-8 md:p-12 shadow-sm border border-stone-100 prose prose-stone max-w-none prose-headings:font-serif">
        {path === 'about' && (
          <>
            <p className="lead text-xl text-stone-600 mb-8 text-center font-serif italic">
              "We believe that true beauty stems from centuries of tradition and the purest elements of nature."
            </p>
            <h3>Our Story</h3>
            <p>
              SABTAI STORE was born out of a deep reverence for Indian heritage. We traveled across the diverse landscapes of India, from the aromatic spice gardens of Kerala to the vibrant bazaars of Rajasthan, to curate a collection that speaks to the soul of authentic Indian luxury.
            </p>
            <h3>Our Skincare</h3>
            <p>
              Our Ayurvedic night creams are formulated using ancient texts. We source pure Kumkumadi (Saffron), Sandalwood, and rare botanical extracts to create potent, effective blends that heal your skin as you sleep. No harsh chemicals, no artificial fragrances—just pure, unadulterated nature.
            </p>
            <h3>Our Jewelry</h3>
            <p>
              Every bangle in our collection is a testament to the skill of Indian artisans. From intricate Kundan work to vintage oxidised silver, our jewelry is designed to be passed down through generations, adding a touch of timeless elegance to modern wardrobes.
            </p>
          </>
        )}
        
        {path === 'faq' && (
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-lg mb-2">Are your skincare products suitable for all skin types?</h4>
              <p className="text-stone-600">Yes, our Ayurvedic formulations are designed to be gentle and effective across all skin types. However, we always recommend a patch test before regular use.</p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-2">Will the gold plating on the bangles tarnish?</h4>
              <p className="text-stone-600">Our bangles feature premium 22K gold micro-plating with a protective anti-tarnish coating. To ensure longevity, keep them away from perfumes, water, and store them in the provided cotton pouches.</p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-2">Do you offer Cash on Delivery?</h4>
              <p className="text-stone-600">Yes, Cash on Delivery is available across most pincodes in India.</p>
            </div>
          </div>
        )}

        {/* Shipping Policy */}
        {path === 'shipping' && (
          <div className="space-y-6 text-stone-700">
            <div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">Free Shipping Eligibility</h3>
              <p>We offer <strong>FREE Shipping</strong> across India on all orders of <strong>₹500 and above</strong>. For orders below ₹500, a flat standard shipping fee of ₹99 is applicable.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">Order Processing & Dispatch</h3>
              <p>All orders placed on SABTAI STORE are processed and dispatched within <strong>24 to 48 business hours</strong>. Orders placed on Sundays or national holidays are dispatched on the next working day.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">Estimated Delivery Time</h3>
              <p>Standard delivery typically takes <strong>4 to 7 business days</strong> depending on your delivery location and pincode serviceability.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">Order Tracking & Support</h3>
              <p>If you have any questions regarding your shipment, feel free to contact our support team on WhatsApp at <strong>+91 8368210589</strong> or email us at <strong>4hm786sayyedking@gmail.com</strong>.</p>
            </div>
          </div>
        )}

        {/* Returns & Refunds - No Return Policy */}
        {path === 'returns' && (
          <div className="space-y-6 text-stone-700">
            <div className="bg-amber-50 border-l-4 border-amber-600 p-4 rounded">
              <p className="font-semibold text-amber-900">
                Important Notice: SABTAI STORE operates under a strict <u>NO RETURN & NO REFUND</u> policy.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">No Return & No Exchange Policy</h3>
              <p>
                Due to personal hygiene and safety considerations (for Ayurvedic skincare products) as well as the delicate handcrafted nature of our jewelry and bangles, <strong>we do not accept returns, refunds, or size exchanges once an order has been delivered.</strong>
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">Damaged or Defective Items in Transit</h3>
              <p>
                In the rare case that your item arrives broken or damaged during delivery, please inform us within <strong>24 hours of delivery</strong>.
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Contact us on WhatsApp: <strong>+91 8368210589</strong> or Email: <strong>4hm786sayyedking@gmail.com</strong></li>
                <li>Please share your Order ID and clear unboxing photos/video showing the damaged package and product.</li>
                <li>After verification by our team, a replacement will be processed if approved.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">Cancellation Policy</h3>
              <p>
                Orders can only be cancelled before they are dispatched. Once your order has been packed and handed over to our courier partner, cancellations cannot be accepted.
              </p>
            </div>
          </div>
        )}

        {/* Terms & Privacy */}
        {['terms', 'privacy'].includes(path) && (
          <>
            <p>Welcome to SABTAI STORE. By accessing or purchasing from our store, you agree to our standard terms and conditions.</p>
            <p>Highlights:</p>
            <ul>
              <li>All orders are dispatched within 24-48 hours.</li>
              <li>Free shipping is available for all orders above ₹500.</li>
              <li>We strictly maintain a No Return & No Exchange policy for hygiene and quality assurance.</li>
              <li>Your privacy is our priority; your personal data and payment information are handled securely and never shared with third parties.</li>
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
