import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AuthModal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
          
          {/* Dark Blurred Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-obsidian/60 backdrop-blur-md"
          />

          {/* Modal Box - Center Locked */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
            className="relative w-full max-w-lg bg-[#F5F1E9] shadow-2xl overflow-hidden rounded-xl border border-[#D8CBB8]"
          >
            {/* Decorative Background Element */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#D8CBB8]/30 to-transparent pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/50 hover:bg-white text-obsidian transition-colors backdrop-blur-sm"
            >
              <X size={20} />
            </button>

            {/* Content */}
            <div className="relative p-8 md:p-12 text-center">
              <p className="eyebrow-text mb-4">The Inner Circle</p>
              <h2 className="font-heading text-4xl text-obsidian mb-4">Welcome to ZORROXO</h2>
              <p className="text-obsidian/60 text-sm mb-10 max-w-xs mx-auto leading-relaxed">
                Sign in to unlock exclusive access to new collections, track your orders, and save your favorite pieces.
              </p>

              <div className="flex flex-col gap-4">
                {/* Sign In Button */}
                <Link
                  to="/login"
                  onClick={onClose}
                  className="group relative w-full bg-obsidian text-ivory py-4 text-xs tracking-[0.2em] uppercase font-semibold overflow-hidden flex items-center justify-center"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Sign In <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 bg-bronze transform scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100" />
                </Link>

                {/* Create Account Button */}
                <Link
                  to="/signup"
                  onClick={onClose}
                  className="w-full bg-transparent border border-obsidian/20 text-obsidian py-4 text-xs tracking-[0.2em] uppercase font-semibold hover:border-obsidian transition-colors flex items-center justify-center"
                >
                  Create Account
                </Link>
              </div>

              <p className="text-[10px] text-obsidian/40 mt-8 tracking-wider">
                By continuing, you agree to our <br />
                <span className="underline cursor-pointer hover:text-obsidian">Terms of Service</span> & <span className="underline cursor-pointer hover:text-obsidian">Privacy Policy</span>.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}