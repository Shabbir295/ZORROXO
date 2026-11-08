import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function BrandStory() {
  return (
    <section className="py-24 bg-obsidian text-ivory relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 40%, #D8CBB8 0%, transparent 40%),
                           radial-gradient(circle at 70% 80%, #A18A70 0%, transparent 40%)`,
        }}
      />

      <div className="container-luxury relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80"
                alt="ZORROXO craftsmanship"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 border border-bronze/40 hidden md:block" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <p className="text-[11px] tracking-[0.25em] uppercase text-champagne mb-6">
              Since 2018
            </p>
            <h2 className="font-heading text-4xl md:text-5xl text-ivory mb-8 leading-tight">
              Crafted with <span className="italic text-champagne">intention.</span>
              <br />
              Worn with <span className="italic text-champagne">purpose.</span>
            </h2>
            <p className="text-ivory/70 text-base leading-relaxed mb-6">
              ZORROXO was born from a simple belief: that luxury should be
              quiet, considered, and built to last. Every piece in our
              collection is designed with intention and crafted by master
              artisans in Italy.
            </p>
            <p className="text-ivory/70 text-base leading-relaxed mb-10">
              We work directly with the finest ateliers, cutting out the
              middlemen to bring you pieces of exceptional quality at honest
              prices.
            </p>

            <div className="grid grid-cols-2 gap-6 mb-10 border-t border-ivory/20 pt-8">
              <div>
                <p className="font-heading text-2xl text-ivory">100%</p>
                <p className="text-[10px] tracking-[0.2em] uppercase text-bronze mt-1">Handcrafted</p>
              </div>
              <div>
                <p className="font-heading text-2xl text-ivory">Premium</p>
                <p className="text-[10px] tracking-[0.2em] uppercase text-bronze mt-1">Materials</p>
              </div>
            </div>

            <Link to="/about" className="inline-flex items-center gap-3 text-[11px] tracking-[0.2em] uppercase text-champagne border-b border-champagne pb-1 hover:text-ivory hover:border-ivory transition-colors">
              Discover Our Story
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}