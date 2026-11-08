import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, Check, ArrowLeft, Loader2, CreditCard, Upload, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext'; // 🔥 Currency Hook
import { supabase } from '../lib/supabase';

export default function Checkout() {
  const [step, setStep] = useState(1);
  const [isPlacing, setIsPlacing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [screenshot, setScreenshot] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', postalCode: '', country: ''
  });

  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const { formatPrice } = useCurrency(); // 🔥 Currency Hook
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 15;
  const total = subtotal + shipping;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }

    if ((paymentMethod === 'easypaisa' || paymentMethod === 'jazzcash') && !screenshot) {
      alert('Please upload the payment screenshot.');
      return;
    }

    setIsPlacing(true);
    let screenshotUrl = null;

    try {
      // 1. Screenshot Upload (Agar hai)
      if (screenshot) {
        const fileExt = screenshot.name.split('.').pop();
        const fileName = `${Date.now()}-${user.id}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('payment_screenshots').upload(fileName, screenshot);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from('payment_screenshots').getPublicUrl(fileName);
        screenshotUrl = urlData.publicUrl;
      }

      // 2. Order Data (Customer Name & Phone Save Ho Raha Hai)
      const orderData = {
        user_id: user.id,
        customer_name: `${formData.firstName} ${formData.lastName}`, // 🔥 Naya
        customer_phone: formData.phone, // 🔥 Naya
        total_amount: total,
        status: 'pending',
        payment_method: paymentMethod,
        payment_screenshot_url: screenshotUrl,
        shipping_address: { 
          name: `${formData.firstName} ${formData.lastName}`, 
          email: formData.email, 
          phone: formData.phone, 
          address: formData.address, 
          city: formData.city, 
          postal_code: formData.postalCode, 
          country: formData.country 
        }
      };

      const { data: order, error: orderError } = await supabase
        .from('orders').insert([orderData]).select().single();

      if (orderError) throw orderError;

      // 3. Order Items (Product Name Save Ho Raha Hai)
      const orderItems = cartItems.map(item => ({ 
        order_id: order.id, 
        product_id: item.id, 
        product_name: item.name, // 🔥 Naya
        quantity: item.quantity, 
        price: item.price 
      }));
      
      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      setPlacedOrder(order);
      setShowSuccess(true);
      
    } catch (error) {
      console.error('Order Error:', error);
      alert(`Failed to place order: ${error.message}`);
    } finally {
      setIsPlacing(false);
    }
  };

  // 🔥 RECEIPT SCREEN
  if (showSuccess && placedOrder) {
    return (
      <div className="min-h-screen bg-[#F5F1E9] flex items-center justify-center p-4 py-12">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-white p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-[#22221F]" />
          
          <div className="text-center mb-8">
            <h2 className="font-heading text-3xl tracking-[0.25em] text-[#22221F] mb-2">ZORROXO</h2>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#A18A70] font-bold">Order Confirmed</p>
          </div>

          <div className="w-full bg-white">
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-[#F5F1E9] rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 size={32} className="text-[#A18A70]" />
              </div>
              <h3 className="font-heading text-2xl text-[#22221F] mb-1">Thank You, {formData.firstName || 'Customer'}!</h3>
              <p className="text-xs text-gray-500 text-center">Your order has been placed successfully.</p>
            </div>

            <div className="border-t border-dashed border-gray-300 py-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 uppercase tracking-wider">Order No.</span>
                <span className="font-bold text-sm text-[#22221F]">#ZX-{placedOrder.id.split('-')[0].toUpperCase()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 uppercase tracking-wider">Date</span>
                <span className="text-sm text-[#22221F]">{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 uppercase tracking-wider">Payment Method</span>
                <span className="text-sm uppercase font-semibold text-[#22221F]">{placedOrder.payment_method}</span>
              </div>
            </div>

            <div className="border-t border-dashed border-gray-300 py-6 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-[#22221F] font-medium">{item.name}</p>
                    <p className="text-[10px] text-gray-500">Qty: {item.quantity} {item.size && `| Size: ${item.size}`}</p>
                  </div>
                  <span className="text-sm text-[#22221F]">{formatPrice(item.price)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed border-gray-300 pt-6 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 font-medium">Total Amount</span>
                <span className="font-heading text-2xl text-[#22221F]">{formatPrice(placedOrder.total_amount)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link to="/orders" onClick={clearCart} className="w-full bg-[#22221F] text-white py-4 text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#A18A70] transition-colors flex items-center justify-center gap-2">
              View Order History
            </Link>
          </div>

          <div className="mt-6 text-center">
            <Link to="/shop" onClick={clearCart} className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-[#22221F] transition-colors">
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-ivory pt-32 pb-20 px-4">
        <div className="max-w-md mx-auto text-center">
          <h1 className="font-heading text-4xl text-obsidian mb-4">Your Cart is Empty</h1>
          <Link to="/shop" className="btn-primary w-full block mt-6">Return to Shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory pt-32 pb-20 w-full overflow-x-hidden">
      <div className="container-luxury px-4 sm:px-6 w-full max-w-full">
        
        <div className="text-center mb-10">
          <p className="eyebrow-text mb-3 text-[#A18A70]">Secure Checkout</p>
          <h1 className="font-heading text-4xl sm:text-5xl text-obsidian">Checkout</h1>
        </div>

        {/* Progress Bar */}
        <div className="max-w-md mx-auto mb-10 w-full">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-champagne -z-10" />
            
            {['Info', 'Shipping', 'Payment'].map((label, i) => {
              const stepNum = i + 1;
              const isActive = step >= stepNum;
              return (
                <div key={label} className="flex flex-col items-center bg-ivory px-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-colors ${isActive ? 'bg-obsidian text-ivory' : 'bg-champagne/50 text-obsidian/50'}`}>
                    {step > stepNum ? <Check size={14} /> : stepNum}
                  </div>
                  <span className={`text-[10px] tracking-wider uppercase mt-2 ${isActive ? 'text-obsidian' : 'text-obsidian/40'}`}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8 w-full">
          
          {/* Left Side: Forms */}
          <div className="w-full lg:col-span-2">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="border border-champagne p-5 sm:p-8 bg-white/40 w-full"
            >
              {step === 1 && (
                <>
                  <h2 className="font-heading text-xl sm:text-2xl text-obsidian mb-6">Customer Information</h2>
                  <div className="space-y-4 w-full">
                    <div className="grid sm:grid-cols-2 gap-4 w-full">
                      <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} className="w-full bg-transparent border border-champagne px-4 py-3 text-sm focus:outline-none focus:border-bronze" required />
                      <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className="w-full bg-transparent border border-champagne px-4 py-3 text-sm focus:outline-none focus:border-bronze" required />
                    </div>
                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full bg-transparent border border-champagne px-4 py-3 text-sm focus:outline-none focus:border-bronze" required />
                    <input type="tel" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="w-full bg-transparent border border-champagne px-4 py-3 text-sm focus:outline-none focus:border-bronze" required />
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="font-heading text-xl sm:text-2xl text-obsidian mb-6">Shipping Address</h2>
                  <div className="space-y-4 w-full">
                    <input type="text" name="address" placeholder="Street Address" value={formData.address} onChange={handleChange} className="w-full bg-transparent border border-champagne px-4 py-3 text-sm focus:outline-none focus:border-bronze" required />
                    <div className="grid sm:grid-cols-2 gap-4 w-full">
                      <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} className="w-full bg-transparent border border-champagne px-4 py-3 text-sm focus:outline-none focus:border-bronze" required />
                      <input type="text" name="postalCode" placeholder="Postal Code" value={formData.postalCode} onChange={handleChange} className="w-full bg-transparent border border-champagne px-4 py-3 text-sm focus:outline-none focus:border-bronze" required />
                    </div>
                    <input type="text" name="country" placeholder="Country" value={formData.country} onChange={handleChange} className="w-full bg-transparent border border-champagne px-4 py-3 text-sm focus:outline-none focus:border-bronze" required />
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <h2 className="font-heading text-xl sm:text-2xl text-obsidian mb-6">Payment Method</h2>
                  
                  <div className="space-y-3 mb-6 w-full">
                    <label className={`flex items-center gap-3 p-4 border cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-bronze bg-champagne/10' : 'border-champagne'}`}>
                      <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="accent-bronze" />
                      <CreditCard size={20} className="text-obsidian/60" />
                      <div><p className="text-sm font-medium text-obsidian">Cash on Delivery</p><p className="text-xs text-obsidian/50">Pay when you receive your order.</p></div>
                    </label>

                    <label className={`flex flex-col p-4 border cursor-pointer transition-colors ${paymentMethod === 'easypaisa' ? 'border-bronze bg-champagne/10' : 'border-champagne'}`}>
                      <div className="flex items-center gap-3">
                        <input type="radio" name="payment" value="easypaisa" checked={paymentMethod === 'easypaisa'} onChange={() => setPaymentMethod('easypaisa')} className="accent-bronze" />
                        <div><p className="text-sm font-medium text-obsidian">Easypaisa</p><p className="text-xs text-obsidian/50">Manual Payment</p></div>
                      </div>
                      {paymentMethod === 'easypaisa' && (
                        <div className="mt-4 p-3 bg-ivory border border-champagne text-sm">
                          <p className="font-bold text-obsidian mb-1">Account Details:</p>
                          <p className="text-obsidian/80">Number: <strong>03012520087</strong></p>
                          <p className="text-obsidian/80">Account Holder: <strong>Afshan</strong></p>
                        </div>
                      )}
                    </label>

                    <label className={`flex flex-col p-4 border cursor-pointer transition-colors ${paymentMethod === 'jazzcash' ? 'border-bronze bg-champagne/10' : 'border-champagne'}`}>
                      <div className="flex items-center gap-3">
                        <input type="radio" name="payment" value="jazzcash" checked={paymentMethod === 'jazzcash'} onChange={() => setPaymentMethod('jazzcash')} className="accent-bronze" />
                        <div><p className="text-sm font-medium text-obsidian">JazzCash</p><p className="text-xs text-obsidian/50">Manual Payment</p></div>
                      </div>
                      {paymentMethod === 'jazzcash' && (
                        <div className="mt-4 p-3 bg-ivory border border-champagne text-sm">
                          <p className="font-bold text-obsidian mb-1">Account Details:</p>
                          <p className="text-obsidian/80">Number: <strong>03042848429</strong></p>
                          <p className="text-obsidian/80">Account Holder: <strong>Afshan</strong></p>
                        </div>
                      )}
                    </label>
                  </div>

                  {(paymentMethod === 'easypaisa' || paymentMethod === 'jazzcash') && (
                    <div className="mb-6 p-4 border border-dashed border-bronze bg-champagne/5">
                      <h3 className="text-sm font-medium text-obsidian mb-2 flex items-center gap-2"><Upload size={16} /> Upload Payment Screenshot</h3>
                      <input type="file" accept="image/*" onChange={(e) => setScreenshot(e.target.files[0])} className="w-full text-sm text-obsidian/70 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:uppercase file:font-semibold file:bg-obsidian file:text-ivory hover:file:bg-bronze" required />
                    </div>
                  )}
                </>
              )}

              <div className="flex flex-col-reverse sm:flex-row items-center justify-between mt-8 pt-6 border-t border-champagne gap-4 w-full">
                {step > 1 ? (
                  <button onClick={() => setStep(step - 1)} className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-obsidian/60 hover:text-obsidian transition-colors py-3">
                    <ArrowLeft size={14} /> Back
                  </button>
                ) : (
                  <Link to="/cart" className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-obsidian/60 hover:text-obsidian transition-colors py-3">
                    <ArrowLeft size={14} /> Cart
                  </Link>
                )}
                
                {step < 3 ? (
                  <button onClick={() => setStep(step + 1)} className="w-full sm:w-auto btn-primary flex items-center justify-center gap-2 py-4 sm:py-3">
                    Continue <ArrowRight size={14} />
                  </button>
                ) : (
                  <button onClick={handlePlaceOrder} disabled={isPlacing} className="w-full sm:w-auto btn-primary flex items-center justify-center gap-2 py-4 sm:py-3">
                    {isPlacing ? <Loader2 className="animate-spin" size={16} /> : 'Place Order'}
                  </button>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Side: Order Summary */}
          <div className="w-full lg:col-span-1">
            <div className="bg-ivory-light border border-champagne p-5 sm:p-8 lg:sticky lg:top-28 w-full">
              <h2 className="font-heading text-lg sm:text-xl text-obsidian mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 pb-6 border-b border-champagne max-h-60 overflow-y-auto pr-2 w-full">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-4 w-full">
                    <img src={item.image_url} alt={item.name} className="w-16 h-20 object-cover bg-champagne/30 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-heading text-sm text-obsidian truncate">{item.name}</p>
                      <p className="text-[10px] text-obsidian/60 mt-1 uppercase tracking-wider">Qty: {item.quantity} {item.size && `· ${item.size}`}</p>
                      <p className="text-sm font-medium mt-1">{formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-obsidian/60">Subtotal</span>
                  <span className="text-obsidian">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-obsidian/60">Shipping</span>
                  <span className="text-obsidian">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
              </div>
              
              <div className="flex justify-between font-heading text-lg border-t border-champagne pt-4">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}