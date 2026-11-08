import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, SlidersHorizontal, X, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCurrency } from '../context/CurrencyContext'; // 🔥 Currency Hook

const categories = ['All', 'Women', 'Men', 'Accessories'];
const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState(1000);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const { formatPrice } = useCurrency(); // 🔥 Currency Format Hook

  // Database se products fetch karna
  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        console.error('Error fetching products:', error);
      } else {
        setProducts(data);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    result = result.filter((p) => p.price <= priceRange);

    if (searchQuery) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (sortBy) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      default: break;
    }

    return result;
  }, [products, selectedCategory, sortBy, priceRange, searchQuery]);

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
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-12">
          <p className="eyebrow-text mb-4">The Collection</p>
          <h1 className="font-heading text-5xl md:text-6xl text-obsidian mb-4">Shop <span className="italic text-bronze">All</span></h1>
        </motion.div>

        {/* Search + Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
          <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full md:w-80 bg-transparent border border-champagne px-4 py-3 text-sm text-obsidian focus:outline-none focus:border-bronze transition-colors" />
          <div className="flex gap-3 w-full md:w-auto">
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 border border-champagne px-4 py-3 text-[11px] tracking-[0.15em] uppercase text-obsidian hover:border-bronze transition-colors">
              <SlidersHorizontal size={14} /> Filters
            </button>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent border border-champagne px-4 py-3 text-[11px] tracking-[0.15em] uppercase text-obsidian focus:outline-none focus:border-bronze cursor-pointer">
              {sortOptions.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
            </select>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-ivory-light border border-champagne p-6 mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-[11px] tracking-[0.2em] uppercase text-bronze mb-4">Category</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 text-xs tracking-[0.1em] uppercase transition-colors ${selectedCategory === cat ? 'bg-obsidian text-ivory' : 'bg-transparent border border-champagne text-obsidian hover:border-bronze'}`}>{cat}</button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-[11px] tracking-[0.2em] uppercase text-bronze mb-4">Max Price: ${priceRange}</h3>
                <input type="range" min="100" max="1000" step="50" value={priceRange} onChange={(e) => setPriceRange(Number(e.target.value))} className="w-full accent-bronze" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Results Info */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-champagne">
          <p className="text-xs text-obsidian/60 tracking-editorial uppercase">{filteredProducts.length} Products</p>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {filteredProducts.map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.05 }} className="group">
                <div className="relative overflow-hidden bg-champagne/30 aspect-[3/4] mb-4">
                  <Link to={`/product/${product.id}`}>
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                  </Link>
                  {product.tag && (<span className="absolute top-4 left-4 bg-obsidian text-ivory text-[9px] tracking-[0.2em] uppercase px-3 py-1">{product.tag}</span>)}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="w-9 h-9 bg-ivory/90 backdrop-blur-sm rounded-full flex items-center justify-center text-obsidian hover:bg-obsidian hover:text-ivory transition-colors"><Heart size={14} /></button>
                    <button className="w-9 h-9 bg-ivory/90 backdrop-blur-sm rounded-full flex items-center justify-center text-obsidian hover:bg-obsidian hover:text-ivory transition-colors"><ShoppingBag size={14} /></button>
                  </div>
                </div>
                <Link to={`/product/${product.id}`}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-heading text-base text-obsidian group-hover:text-bronze transition-colors">{product.name}</h3>
                    <div className="flex items-center gap-1 text-bronze shrink-0"><Star size={10} fill="currentColor" /><span className="text-[10px] text-obsidian/60">{product.rating}</span></div>
                  </div>
                  <p className="text-[10px] tracking-[0.15em] uppercase text-bronze mb-2">{product.category}</p>
                  {/* 🔥 FORMATTED PRICE */}
                  <p className="font-heading text-base text-obsidian">{formatPrice(product.price)}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="font-heading text-3xl text-obsidian mb-4">No products found</p>
            <button onClick={() => { setSelectedCategory('All'); setSearchQuery(''); setPriceRange(1000); }} className="btn-primary mt-4">Reset Filters</button>
          </div>
        )}
      </div>
    </div>
  );
}