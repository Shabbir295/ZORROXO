import React from 'react';
import { motion } from 'framer-motion';

export default function AnnouncementBar() {
  const messages = [
    '✦ Complimentary Shipping on Orders Over $150',
    '✦ New Collection 2026 Now Live',
    '✦ Members Get Early Access',
    '✦ Handcrafted in Italy',
  ];

  return (
    <div className="relative z-[60] bg-obsidian text-ivory py-3 overflow-hidden">
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        className="flex whitespace-nowrap"
      >
        {[0, 1].map((i) => (
          <div key={i} className="flex gap-16 px-8 text-[10px] tracking-[0.25em] uppercase">
            {messages.map((msg, idx) => (
              <span key={idx}>{msg}</span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}