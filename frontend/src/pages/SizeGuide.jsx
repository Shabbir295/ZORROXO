import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function SizeGuide() {
  const [activeTab, setActiveTab] = useState('women');

  const sizes = {
    women: [
      { size: 'XS', bust: '30-32', waist: '23-25', hips: '33-35' },
      { size: 'S', bust: '32-34', waist: '25-27', hips: '35-37' },
      { size: 'M', bust: '34-36', waist: '27-29', hips: '37-39' },
      { size: 'L', bust: '36-38', waist: '29-31', hips: '39-41' },
      { size: 'XL', bust: '38-40', waist: '31-33', hips: '41-43' },
    ],
    men: [
      { size: 'S', chest: '34-36', waist: '28-30', neck: '14-14.5' },
      { size: 'M', chest: '38-40', waist: '32-34', neck: '15-15.5' },
      { size: 'L', chest: '42-44', waist: '36-38', neck: '16-16.5' },
      { size: 'XL', chest: '46-48', waist: '40-42', neck: '17-17.5' },
    ]
  };

  return (
    <div className="min-h-screen bg-ivory pt-32 pb-20">
      <div className="container-luxury max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <p className="eyebrow-text mb-4">Perfect Fit</p>
          <h1 className="font-heading text-5xl text-obsidian mb-6">Size Guide</h1>
          <p className="text-obsidian/60">Find your perfect ZORROXO fit. Measurements are in inches.</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('women')}
            className={`px-8 py-2 text-xs uppercase tracking-widest transition-colors ${activeTab === 'women' ? 'bg-obsidian text-ivory' : 'bg-champagne/30 text-obsidian'}`}
          >
            Women
          </button>
          <button 
            onClick={() => setActiveTab('men')}
            className={`px-8 py-2 text-xs uppercase tracking-widest transition-colors ${activeTab === 'men' ? 'bg-obsidian text-ivory' : 'bg-champagne/30 text-obsidian'}`}
          >
            Men
          </button>
        </div>

        {/* Table */}
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-x-auto bg-white/40 border border-champagne"
        >
          <table className="w-full text-left text-sm text-obsidian/80">
            <thead className="bg-champagne/20 text-xs uppercase tracking-widest text-obsidian">
              {activeTab === 'women' ? (
                <tr>
                  <th className="px-6 py-4">Size</th>
                  <th className="px-6 py-4">Bust</th>
                  <th className="px-6 py-4">Waist</th>
                  <th className="px-6 py-4">Hips</th>
                </tr>
              ) : (
                <tr>
                  <th className="px-6 py-4">Size</th>
                  <th className="px-6 py-4">Chest</th>
                  <th className="px-6 py-4">Waist</th>
                  <th className="px-6 py-4">Neck</th>
                </tr>
              )}
            </thead>
            <tbody className="divide-y divide-champagne/50">
              {sizes[activeTab].map((row, i) => (
                <tr key={i} className="hover:bg-white/60 transition-colors">
                  <td className="px-6 py-4 font-bold text-obsidian">{row.size}</td>
                  <td className="px-6 py-4">{row.bust || row.chest}</td>
                  <td className="px-6 py-4">{row.waist}</td>
                  <td className="px-6 py-4">{row.hips || row.neck}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </div>
  );
}