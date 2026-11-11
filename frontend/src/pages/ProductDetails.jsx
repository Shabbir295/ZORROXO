import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Minus, Plus, Truck, RotateCcw, Shield, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext'; // 🔥 Auth Import
import { useCurrency } from '../context/CurrencyContext';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth(); // 🔥 Auth Check
  const { formatPrice } = useCurrency();

  const sizes = ['XS', 'S', 'M', 'L', 'XL'];

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      if (!id || id.length < 30) { navigate('/shop'); return; }

      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();

      if (error) {
        navigate('/shop');
      } else {
        setProduct(data);
        const { data: related } = await supabase.from('products').select('*').eq('category', data.category).neq('id', id).limit(4);
        if (related) setRelatedProducts(related);
      }
      setLoading(false);
    }
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id, navigate]);

  // 🔥 LOGIN CHECK FUNCTION
  const checkLogin = () => {
    if (!user) {
      navigate('/login');
      return false;
    }
    return true;
  };

  const handleAddToCart = () => {
    if (!checkLogin()) return;
    addToCart(product, quantity, selectedSize);
  };

  const handleBuyNow = () => {
    if (!checkLogin()) return;
    addToCart(product, quantity, selectedSize);
    navigate('/checkout');
  };

  const handleWishlist = () => {
    if (!checkLogin()) return;
    toggleWishlist(product);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory">
        <Loader2 className="w-10 h-10 animate-spin text-bronze" />
      </div>
    );
  }

  if (!product) return null;

  const images = [product.image_url, product.image_2, product.image_3, product.image_4].filter(Boolean);
  const inWishlist = isInWishlist(product.id);

  return (
    <div className="min-h-screen bg-ivory pt-24 pb-20 w-full overflow-x-hidden">
      <div className="container-luxury px-4 sm:px-6">
        
        <div className="mb-4 md:mb-8 text-[10px] md:text-xs text-obsidian/60 tracking-editorial flex items-center gap-1 md:gap-2 flex-wrap">
          <Link to="/" className="hover:text-bronze transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-bronze transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-obsidian line-clamp-1">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 mb-16">
          
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
            <div className="aspect-[3/4] md:aspect-[4/5] overflow-hidden bg-champagne/30 mb-3 w-full">
              <img src={images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
            </div>
            
            <div className="grid grid-cols-4 gap-2 md:gap-3 w-full">
              {images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)} className={`aspect-square overflow-hidden bg-champagne/30 border-2 transition-colors ${selectedImage === i ? 'border-bronze' : 'border-transparent'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
            {product.tag && (
              <span className="inline-block bg-bronze text-ivory text-[9px] tracking-[0.2em] uppercase px-3 py-1 mb-3">
                {product.tag}
              </span>
            )}
            
            <p className="text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-bronze mb-2">
              {product.category}
            </p>
            
            <h1 className="font-heading text-3xl md:text-5xl text-obsidian mb-3 leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1 text-bronze">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'} />
                ))}
              </div>
              <span className="text-xs md:text-sm text-obsidian/60">{product.rating} (127 reviews)</span>
            </div>

            <p className="font-heading text-2xl md:text-3xl text-obsidian mb-5">
              {formatPrice(product.price)}
            </p>
            
            <p className="text-obsidian/70 text-sm md:text-base leading-relaxed mb-6">
              {product.description || 'Crafted from the finest materials with meticulous attention to detail. This timeless piece embodies the essence of elevated living.'}
            </p>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <p className="text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-obsidian">Select Size</p>
                <button className="text-[10px] text-bronze underline tracking-wider">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button key={size} onClick={() => setSelectedSize(size)} className={`w-10 h-10 md:w-12 md:h-12 text-sm transition-colors ${selectedSize === size ? 'bg-obsidian text-ivory' : 'border border-champagne text-obsidian hover:border-bronze'}`}>
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 mb-8 w-full">
              <div className="flex gap-3 w-full">
                <div className="flex items-center justify-between border border-champagne w-full sm:w-32">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-12 flex items-center justify-center text-obsidian hover:text-bronze transition-colors"><Minus size={16} /></button>
                  <span className="w-10 text-center font-heading text-base">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-12 flex items-center justify-center text-obsidian hover:text-bronze transition-colors"><Plus size={16} /></button>
                </div>
                
                <button onClick={handleWishlist} className={`flex-1 sm:flex-none sm:w-12 h-12 border border-champagne flex items-center justify-center transition-colors ${inWishlist ? 'bg-bronze text-white border-bronze' : 'text-obsidian hover:border-bronze hover:text-bronze'}`}>
                  <Heart size={18} fill={inWishlist ? "currentColor" : "none"} />
                </button>
              </div>

              <button onClick={handleAddToCart} className="w-full btn-primary flex items-center justify-center gap-2 h-12 md:h-14">
                <ShoppingBag size={16} /> <span className="text-xs md:text-sm">Add to Cart</span>
              </button>

              <button onClick={handleBuyNow} className="w-full bg-bronze text-white py-4 text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#8A7458] transition-colors flex items-center justify-center h-12 md:h-14">
                Buy It Now
              </button>
            </div>

            <div className="border-t border-champagne pt-5 space-y-3">
              {[
                { icon: Truck, text: 'Complimentary shipping on orders over $150' },
                { icon: RotateCcw, text: 'Free returns within 30 days' },
                { icon: Shield, text: 'Authenticity guaranteed' },
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-xs md:text-sm text-obsidian/70">
                  <feature.icon size={14} className="text-bronze shrink-0" />
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {relatedProducts.length > 0 && (
          <div>
            <div className="text-center mb-8">
              <p className="eyebrow-text mb-2">You May Also Like</p>
              <h2 className="font-heading text-3xl md:text-4xl text-obsidian">Related Pieces</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="group">
                  <Link to={`/product/${p.id}`}>
                    <div className="aspect-[3/4] overflow-hidden bg-champagne/30 mb-2">
                      <img src={p.image_url} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <h3 className="font-heading text-sm md:text-base text-obsidian group-hover:text-bronze transition-colors line-clamp-1">{p.name}</h3>
                    <p className="font-heading text-xs md:text-sm text-obsidian mt-1">{formatPrice(p.price)}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}