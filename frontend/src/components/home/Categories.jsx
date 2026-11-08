import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const categories = [
  {
    name: 'Women',
    slug: 'women',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
    tag: '12 Pieces',
  },
  {
    name: 'Men',
    slug: 'men',
    image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800&q=80',
    tag: '14 Pieces',
  },
  {
    name: 'Home',
    slug: 'home',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80',
    tag: '20 Pieces',
  },
];

export default function Categories() {
  return (
    <section className="py-24 bg-ivory">
      <div className="container-luxury">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
          className="text-center mb-16"
        >
          <p className="eyebrow-text mb-4">Curated Collections</p>
          <h2 className="font-heading text-4xl md:text-5xl text-obsidian">
            Shop by <span className="italic text-bronze">Category</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.65, 0, 0.35, 1] }}
              whileHover={{ y: -10 }}
            >
              <Link to={`/category/${cat.slug}`} className="group block relative overflow-hidden">
                <div className="aspect-[3/4] overflow-hidden bg-champagne">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                    loading="lazy"
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 via-obsidian/0 to-obsidian/0" />

                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[10px] tracking-[0.25em] uppercase text-champagne mb-2">
                        {cat.tag}
                      </p>
                      <h3 className="font-heading text-3xl text-ivory">{cat.name}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-ivory/10 backdrop-blur-sm border border-ivory/30 flex items-center justify-center text-ivory transition-all duration-500 group-hover:bg-ivory group-hover:text-obsidian">
                      <ArrowUpRight size={18} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}