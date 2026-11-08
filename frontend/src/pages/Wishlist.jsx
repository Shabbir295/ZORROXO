import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, X } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

export default function Wishlist() {
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-ivory pt-32 pb-20">
        <div className="container-luxury text-center max-w-md mx-auto">
          <Heart size={64} className="mx-auto text-bronze mb-6" strokeWidth={1} />
          <h1 className="font-heading text-4xl text-obsidian mb-4">Your Wishlist is Empty</h1>
          <Link to="/shop" className="btn-primary inline-block mt-4">Browse Collection</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory pt-28 pb-20">
      <div className="container-luxury">
        <div className="mb-12">
          <p className="eyebrow-text mb-3">Saved Items</p>
          <h1 className="font-heading text-5xl text-obsidian">Wishlist <span className="text-bronze">({wishlistItems.length})</span></h1>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistItems.map((product, i) => (
            <motion.div key={product.id} className="group">
              <div className="relative overflow-hidden bg-champagne/30 aspect-[3/4] mb-4">
                <Link to={`/product/${product.id}`}>
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </Link>
                <button onClick={() => toggleWishlist(product)} className="absolute top-4 right-4 w-9 h-9 bg-ivory/90 rounded-full flex items-center justify-center hover:bg-obsidian hover:text-ivory transition-colors">
                  <X size={14} />
                </button>
              </div>
              <Link to={`/product/${product.id}`}>
                <h3 className="font-heading text-base text-obsidian group-hover:text-bronze transition-colors mb-1">{product.name}</h3>
                <p className="text-[10px] tracking-[0.15em] uppercase text-bronze mb-2">{product.category}</p>
                <p className="font-heading text-base text-obsidian mb-3">${product.price}</p>
              </Link>
              <button onClick={() => addToCart(product)} className="btn-primary w-full flex items-center justify-center gap-2 !py-3">
                <ShoppingBag size={13} /> Add to Cart
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}