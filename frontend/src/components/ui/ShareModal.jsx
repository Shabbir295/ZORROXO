import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Link as LinkIcon, Check, MessageCircle, Globe, AtSign, Camera } from 'lucide-react';

// 🔥 Social Media Options (Lucide Icons)
const socials = [
  { name: 'WhatsApp', icon: MessageCircle, url: 'https://wa.me/?text=' },
  { name: 'Facebook', icon: Globe, url: 'https://www.facebook.com/sharer/sharer.php?u=' },
  { name: 'Twitter', icon: AtSign, url: 'https://twitter.com/intent/tweet?url=' },
  { name: 'Instagram', icon: Camera, url: 'https://www.instagram.com/' }, 
];

export default function ShareModal({ isOpen, onClose, url }) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose} 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
          />
          
          {/* Modal Box */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: 20 }} 
            className="relative w-full max-w-sm bg-[#F5F1E9] p-8 shadow-2xl rounded-2xl border border-[#D8CBB8]"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-obsidian/50 hover:text-obsidian transition-colors">
              <X size={20} />
            </button>

            <div className="text-center mb-6">
              <h3 className="font-heading text-2xl text-obsidian mb-2">Share ZORROXO</h3>
              <p className="text-obsidian/60 text-xs">Spread the word with your friends.</p>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {socials.map((social) => (
                <a 
                  key={social.name} 
                  href={`${social.url}${encodeURIComponent(url)}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-3 p-3 bg-white/50 border border-[#D8CBB8] hover:border-[#A18A70] hover:bg-white transition-all rounded-lg text-sm text-obsidian font-medium group"
                >
                  <social.icon size={18} className="text-[#A18A70] group-hover:text-obsidian transition-colors" />
                  {social.name}
                </a>
              ))}
            </div>

            {/* Copy Link Button */}
            <button onClick={handleCopyLink} className="w-full flex items-center justify-center gap-2 p-4 bg-obsidian text-ivory hover:bg-[#A18A70] transition-colors rounded-lg text-xs tracking-[0.1em] uppercase font-bold">
              {copied ? <Check size={16} /> : <LinkIcon size={16} />}
              {copied ? 'Link Copied!' : 'Copy Link'}
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}