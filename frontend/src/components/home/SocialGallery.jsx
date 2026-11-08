import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Share2 } from 'lucide-react';
import ShareModal from '../ui/ShareModal'; // 🔥 Share Modal Import

const images = [
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80",
  "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=600&q=80",
  "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&q=80",
  "https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&q=80",
  "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80"
];

export default function SocialGallery() {
  const [selectedImage, setSelectedImage] = useState(null); // 🔥 State for Share Modal

  return (
    <section className="py-20 bg-ivory-light relative">
      <div className="text-center mb-12">
        <Camera size={24} className="mx-auto text-bronze mb-4" />
        <h2 className="font-heading text-3xl text-obsidian">
          Follow <span className="italic text-bronze">@ZORROXO</span>
        </h2>
        <p className="text-xs text-obsidian/50 tracking-widest uppercase mt-2">On Social Media</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {images.map((img, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="relative aspect-square overflow-hidden group cursor-pointer"
            onClick={() => setSelectedImage(img)} // 🔥 Image click par share modal open
          >
            <img 
              src={img} 
              alt={`Gallery ${i}`} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-obsidian/0 group-hover:bg-obsidian/30 transition-colors duration-300 flex items-center justify-center">
              <Share2 size={24} className="text-ivory opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* 🔥 Share Modal */}
      <ShareModal 
        isOpen={!!selectedImage} 
        onClose={() => setSelectedImage(null)} 
        imageUrl={selectedImage} 
      />
    </section>
  );
}