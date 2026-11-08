import React from 'react';
import { motion } from 'framer-motion';

export default function Loader() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-2 border-champagne border-t-bronze rounded-full"
        />
        <p className="text-[10px] tracking-[0.25em] uppercase text-bronze">Loading</p>
      </div>
    </div>
  );
}