import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCurrency } from '../context/CurrencyContext'; // 🔥 Import

export default function Category() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { formatPrice } = useCurrency(); // 🔥 Hook

  const categoryName = slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : 'Collection';

  useEffect(() => {
    async function fetchCategoryProducts() {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', categoryName);

      if (error) console.error(error);
      else setProducts(data);
      
      setLoading(false);
    }
    fetchCategoryProducts();
  }, [categoryName]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory">
        <Loader2 className="w-10 h-10 animate-spin text-bronze" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory pt-28 pb-20">
      <div className="container-luxury">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <p className="eyebrow-text mb-4">Collection</p>
          <h1 className="font-heading text-5xl md:text-6xl text-obsidian mb-4 capitalize">{categoryName}</h1>
          <p className="text-obsidian/60 max-w-md mx-auto">{products.length} curated pieces in this collection</p>
        </motion.div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="group">
                <div className="relative overflow-hidden bg-champagne/30 aspect-[3/4] mb-4">
                  <Link to={`/product/${product.id}`}>
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </Link>
                  {product.tag && (<span className="absolute top-4 left-4 bg-obsidian text-ivory text-[9px] tracking-[0.2em] uppercase px-3 py-1">{product.tag}</span>)}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-9 h-9 bg-ivory/90 rounded-full flex items-center justify-center text-obsidian hover:bg-obsidian hover:text-ivory transition-colors"><Heart size={14} /></button>
                    <button className="w-9 h-9 bg-ivory/90 rounded-full flex items-center justify-center text-obsidian hover:bg-obsidian hover:text-ivory transition-colors"><ShoppingBag size={14} /></button>
                  </div>
                </div>
                <Link to={`/product/${product.id}`}>
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <h3 className="font-heading text-base text-obsidian group-hover:text-bronze transition-colors">{product.name}</h3>
                    <div className="flex items-center gap-1 text-bronze shrink-0"><Star size={10} fill="currentColor" /><span className="text-[10px] text-obsidian/60">{product.rating}</span></div>
                  </div>
                  <p className="text-[10px] tracking-[0.15em] uppercase text-bronze mb-2">{product.category}</p>
                  {/* 🔥 Formatted Price */}
                  <p className="font-heading text-base text-obsidian">{formatPrice(product.price)}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="font-heading text-3xl text-obsidian mb-4">No products found in this category</p>
            <Link to="/shop" className="btn-primary mt-4">View All Products</Link>
          </div>
        )}
        
        <div className="text-center mt-16">
          <Link to="/shop" className="btn-outline">View All Products</Link>
        </div>
      </div>
    </div>
  );
}