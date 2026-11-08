import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useCurrency } from '../../context/CurrencyContext'; // 🔥 Import

export default function NewArrivals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { formatPrice } = useCurrency(); // 🔥 Hook

  useEffect(() => {
    async function fetchNewProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3); // Sirf 3 naye products dikhane ke liye

      if (!error) setProducts(data || []);
      setLoading(false);
    }
    fetchNewProducts();
  }, []);

  if (loading) return <div className="py-24 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-bronze" /></div>;

  return (
    <section className="py-24 bg-ivory">
      <div className="container-luxury">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <p className="eyebrow-text mb-3 text-bronze">Just Landed</p>
            <h2 className="font-heading text-4xl text-obsidian">New <span className="italic text-bronze">Arrivals</span></h2>
          </div>
          <Link to="/shop" className="text-[11px] tracking-[0.2em] uppercase text-obsidian border-b border-obsidian pb-1 hover:text-bronze hover:border-bronze transition-colors hidden md:block">
            View All
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <Link to={`/product/${product.id}`}>
                <div className="relative aspect-[4/5] overflow-hidden bg-champagne/20 mb-4">
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 bg-ivory/90 backdrop-blur-sm px-3 py-1 text-[10px] tracking-wider uppercase font-bold text-obsidian">
                    New
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-bronze mb-1">{product.category}</p>
                  <h3 className="font-heading text-xl text-obsidian mb-2">{product.name}</h3>
                  {/* 🔥 Formatted Price */}
                  <p className="font-medium text-obsidian">{formatPrice(product.price)}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}