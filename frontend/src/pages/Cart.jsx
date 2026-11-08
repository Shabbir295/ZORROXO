import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext'; // 🔥 Currency Hook

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const { formatPrice } = useCurrency(); // 🔥 Hook

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 150 ? 0 : 15;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-ivory pt-32 pb-20">
        <div className="container-luxury text-center max-w-md mx-auto">
          <ShoppingBag size={64} className="mx-auto text-bronze mb-6" strokeWidth={1} />
          <h1 className="font-heading text-4xl text-obsidian mb-4">Your Cart is Empty</h1>
          <Link to="/shop" className="btn-primary inline-flex items-center gap-2 mt-4">Continue Shopping <ArrowRight size={14} /></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory pt-28 pb-20">
      <div className="container-luxury">
        <div className="mb-12">
          <p className="eyebrow-text mb-3">Shopping Bag</p>
          <h1 className="font-heading text-5xl text-obsidian">Your Cart ({cartItems.length})</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item, i) => (
              <motion.div key={`${item.id}-${item.size}`} className="flex gap-6 border-b border-champagne pb-6">
                <div className="w-24 md:w-32 shrink-0">
                  <div className="aspect-[3/4] overflow-hidden bg-champagne/30">
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-heading text-lg text-obsidian">{item.name}</h3>
                      <p className="text-[10px] tracking-editorial uppercase text-bronze mt-1">{item.category} {item.size && `/ ${item.size}`}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.id, item.size)} className="text-obsidian/40 hover:text-obsidian">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex justify-between items-end mt-6">
                    <div className="flex items-center border border-champagne">
                      <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)} className="w-9 h-9 flex items-center justify-center hover:text-bronze"><Minus size={14} /></button>
                      <span className="w-10 text-center text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)} className="w-9 h-9 flex items-center justify-center hover:text-bronze"><Plus size={14} /></button>
                    </div>
                    {/* 🔥 Formatted Price */}
                    <p className="font-heading text-lg">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-ivory-light border border-champagne p-8 sticky top-28">
              <h2 className="font-heading text-2xl text-obsidian mb-6">Order Summary</h2>
              <div className="space-y-3 mb-6 pb-6 border-b border-champagne">
                <div className="flex justify-between text-sm"><span className="text-obsidian/60">Subtotal</span><span className="text-obsidian">{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-obsidian/60">Shipping</span><span className="text-obsidian">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
              </div>
              <div className="flex justify-between mb-8">
                <span className="font-heading text-xl text-obsidian">Total</span>
                <span className="font-heading text-xl text-obsidian">{formatPrice(total)}</span>
              </div>
              <Link to="/checkout" className="btn-primary w-full flex items-center justify-center gap-2 mb-3">Checkout <ArrowRight size={14} /></Link>
              <Link to="/shop" className="block text-center text-[11px] tracking-[0.2em] uppercase text-obsidian hover:text-bronze transition-colors">Continue Shopping</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}