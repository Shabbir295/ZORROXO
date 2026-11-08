import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center max-w-lg"
      >
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.6em' }}
          animate={{ opacity: 1, letterSpacing: '0.4em' }}
          transition={{ duration: 1.4 }}
          className="eyebrow-text mb-6"
        >
          Error 404
        </motion.p>

        <h1 className="font-heading text-8xl md:text-9xl text-obsidian mb-6 leading-none">
          4<span className="italic text-bronze">0</span>4
        </h1>

        <h2 className="font-heading text-3xl text-obsidian mb-4">Page Not Found</h2>

        <p className="text-obsidian/60 mb-10 max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/" className="btn-primary flex items-center gap-2">
            <ArrowLeft size={14} /> Back Home
          </Link>
          <Link to="/shop" className="btn-outline">
            Browse Shop
          </Link>
        </div>
      </motion.div>
    </div>
  );
}