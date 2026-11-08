import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function EditorialBanner() {
  return (
    <section className="relative h-[80vh] min-h-[600px] w-full overflow-hidden flex items-center justify-center">
      {/* Background Image with Parallax Zoom Effect */}
      <motion.div 
        initial={{ scale: 1.15 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="absolute inset-0 z-0"
      >
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop"
          alt="Editorial Campaign"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-obsidian/40" /> {/* Dark Overlay */}
      </motion.div>

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-[11px] tracking-[0.3em] uppercase text-champagne mb-6 font-bold"
        >
          The Campaign
        </motion.p>
        
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-heading text-5xl md:text-7xl text-ivory mb-8 leading-tight"
        >
          Timeless <span className="italic">Elegance</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link 
            to="/shop" 
            className="group inline-flex items-center gap-3 bg-ivory text-obsidian px-8 py-4 rounded-full text-xs tracking-[0.2em] uppercase font-semibold hover:bg-champagne transition-colors duration-300"
          >
            Shop The Campaign
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}