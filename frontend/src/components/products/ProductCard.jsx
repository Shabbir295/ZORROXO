import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext'; // 🔥 Auth Import
import { useCurrency } from '../../context/CurrencyContext';

export default function ProductCard({ product, index }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth(); // 🔥 Login Status
  const { formatPrice } = useCurrency();

  const inWishlist = isInWishlist(product.id);

  // 🔥 Login Check Function
  const checkLogin = () => {
    if (!user) {
      navigate('/login');
      return false;
    }
    return true;
  };

  const handleAddToCart = (e) => {
    e.preventDefault(); // Link ko rokne ke liye
    if (!checkLogin()) return;
    addToCart(product, 1, 'M'); // Default size M
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    if (!checkLogin()) return;
    toggleWishlist(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className="group"
    >
      <div className="relative overflow-hidden bg-champagne/30 aspect-[3/4] mb-4">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        </Link>

        {product.tag && (
          <span className="absolute top-4 left-4 bg-obsidian text-ivory text-[9px] tracking-[0.2em] uppercase px-3 py-1">
            {product.tag}
          </span>
        )}

        {/* Hover Icons */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={handleWishlist} 
            className={`w-9 h-9 bg-ivory/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors ${inWishlist ? 'text-bronze' : 'text-obsidian hover:bg-obsidian hover:text-ivory'}`}
          >
            <Heart size={14} fill={inWishlist ? "currentColor" : "none"} />
          </button>
          <button 
            onClick={handleAddToCart} 
            className="w-9 h-9 bg-ivory/90 backdrop-blur-sm rounded-full flex items-center justify-center text-obsidian hover:bg-obsidian hover:text-ivory transition-colors"
          >
            <ShoppingBag size={14} />
          </button>
        </div>
      </div>

      <Link to={`/product/${product.id}`}>
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-heading text-lg text-obsidian group-hover:text-bronze transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 text-bronze shrink-0">
            <Star size={11} fill="currentColor" />
            <span className="text-[10px] text-obsidian/60">{product.rating}</span>
          </div>
        </div>
        <p className="text-[10px] tracking-[0.15em] uppercase text-bronze mb-2">
          {product.category}
        </p>
        <p className="font-heading text-base text-obsidian">{formatPrice(product.price)}</p>
      </Link>
    </motion.div>
  );
}