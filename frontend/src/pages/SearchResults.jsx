import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { Heart, ShoppingBag, Search, Star } from 'lucide-react';
import products from '../data/products';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(query);

  const results = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-ivory pt-28 pb-20">
      <div className="container-luxury">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <p className="eyebrow-text mb-4">Search</p>
          <h1 className="font-heading text-4xl md:text-5xl text-obsidian mb-8">
            {query ? (
              <>Results for "<span className="italic text-bronze">{query}</span>"</>
            ) : (
              'Search Products'
            )}
          </h1>

          <div className="max-w-xl">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-obsidian/40" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-12 pr-4 py-4 border border-champagne bg-transparent text-obsidian placeholder:text-obsidian/40 focus:outline-none focus:border-bronze transition-colors"
              />
            </div>
          </div>

          {query && (
            <p className="text-sm text-obsidian/60 mt-4">
              {results.length} {results.length === 1 ? 'result' : 'results'} found
            </p>
          )}
        </motion.div>

        {results.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {results.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group"
              >
                <div className="relative overflow-hidden bg-champagne/30 aspect-[3/4] mb-4">
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </Link>
                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-9 h-9 bg-ivory/90 rounded-full flex items-center justify-center text-obsidian hover:bg-obsidian hover:text-ivory transition-colors">
                      <Heart size={14} />
                    </button>
                    <button className="w-9 h-9 bg-ivory/90 rounded-full flex items-center justify-center text-obsidian hover:bg-obsidian hover:text-ivory transition-colors">
                      <ShoppingBag size={14} />
                    </button>
                  </div>
                </div>
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-heading text-base text-obsidian group-hover:text-bronze transition-colors mb-1">
                    {product.name}
                  </h3>
                  <p className="text-[10px] tracking-[0.15em] uppercase text-bronze mb-2">
                    {product.category}
                  </p>
                  <p className="font-heading text-base text-obsidian">${product.price}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="font-heading text-3xl text-obsidian mb-4">No results found</p>
            <p className="text-obsidian/60 mb-8">Try a different search term</p>
            <Link to="/shop" className="btn-primary">Browse All Products</Link>
          </div>
        )}
      </div>
    </div>
  );
}