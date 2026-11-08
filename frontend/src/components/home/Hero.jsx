import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import HeroScene from '../../three/HeroScene';
import Loader from '../ui/Loader';

export default function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-85px)] bg-[#F5F1E9] flex items-center overflow-hidden py-8 lg:py-0">
      
      {/* 🌟 BACKGROUND IMAGE */}
      <motion.div 
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="absolute inset-0 z-0"
      >
        <img
          src="https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=2000&auto=format&fit=crop" 
          alt="Luxury Background"
          className="w-full h-full object-cover object-center lg:object-left"
        />
        
        {/* 🔥 MOBILE OVERLAY: Halka sa Warm Ivory taake text saaf padhe */}
        <div className="absolute inset-0 bg-[#F5F1E9]/40 lg:hidden" />

        {/* LAPTOP OVERLAY (Jaisa pehle tha) */}
        <div className="hidden lg:block absolute inset-0 bg-[#F5F1E9]/20" />
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-[#F5F1E9]/80 via-[#F5F1E9]/30 to-transparent" />
      </motion.div>

      <div className="container-luxury relative z-10 w-full mt-12 lg:mt-0">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* LEFT — TEXT CONTENT */}
          <div className="order-2 lg:order-1 flex flex-col justify-center text-center lg:text-left lg:ml-12 xl:ml-24">
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-4 lg:mb-6 flex items-center justify-center lg:justify-start gap-3"
            >
              <span className="w-8 lg:w-12 h-[1px] bg-[#A18A70]"></span>
              <p className="text-[10px] lg:text-[11px] tracking-[0.25em] lg:tracking-[0.3em] uppercase text-[#A18A70] font-bold">
                The 2026 Collection
              </p>
              <span className="w-8 lg:w-12 h-[1px] bg-[#A18A70] lg:hidden"></span>
            </motion.div>

            {/* HEADING */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] text-[#111110] mb-4 lg:mb-6 leading-[1.05]"
            >
              The Art of <br />
              <span className="italic text-[#A18A70]">Elevated</span> <br />
              Living.
            </motion.h1>

            {/* PARAGRAPH */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-[#22221F] text-sm sm:text-base lg:text-lg max-w-xs sm:max-w-md mx-auto lg:mx-0 mb-8 lg:mb-10 leading-relaxed font-medium"
            >
              Curated pieces for the modern connoisseur. Where craftsmanship
              meets timeless elegance in every detail.
            </motion.p>

            {/* BUTTONS */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 lg:gap-5 w-full"
            >
              <Link 
                to="/shop" 
                className="group relative overflow-hidden bg-[#22221F] text-[#F5F1E9] px-8 py-4 inline-flex items-center justify-center rounded-full w-full sm:w-auto shadow-lg"
              >
                <span className="relative z-10 flex items-center gap-3 text-[10px] lg:text-xs tracking-[0.2em] uppercase font-semibold">
                  Explore Collection
                  <ArrowRight size={14} className="transition-transform duration-500 group-hover:translate-x-2" />
                </span>
                <div className="absolute inset-0 bg-[#A18A70] transform scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100" />
              </Link>
              
              <Link 
                to="/about" 
                className="text-[10px] lg:text-xs tracking-[0.2em] uppercase font-semibold text-[#111110] border-b border-[#111110] pb-1 hover:text-[#A18A70] hover:border-[#A18A70] transition-colors duration-300 mt-2 sm:mt-0"
              >
                Our Story
              </Link>
            </motion.div>
          </div>

          {/* RIGHT — 3D SCENE (Desktop Only) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
            className="hidden lg:flex order-1 lg:order-2 h-[650px] relative w-full items-center justify-center"
          >
            <Suspense fallback={<Loader />}>
              <HeroScene />
            </Suspense>
          </motion.div>
        </div>
      </div>
    </section>
  );
}