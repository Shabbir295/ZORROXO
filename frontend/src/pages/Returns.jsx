import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, ShieldCheck, Mail } from 'lucide-react';

export default function Returns() {
  return (
    <div className="min-h-screen bg-ivory pt-32 pb-20">
      <div className="container-luxury max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <p className="eyebrow-text mb-4">Peace of Mind</p>
          <h1 className="font-heading text-5xl text-obsidian mb-6">Returns & Exchanges</h1>
          <p className="text-obsidian/60 max-w-xl mx-auto">
            We want you to love your purchase. If you are not completely satisfied, we are here to help.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            { icon: RotateCcw, title: '30-Day Returns', desc: 'Return any unworn item within 30 days of delivery.' },
            { icon: ShieldCheck, title: 'Quality Guarantee', desc: 'All items are inspected for quality before dispatch.' },
            { icon: Mail, title: 'Easy Process', desc: 'Contact our support team to initiate a free return.' },
          ].map((item, i) => (
            <motion.div 
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="border border-champagne p-8 text-center bg-white/40"
            >
              <item.icon size={28} className="mx-auto text-bronze mb-4" />
              <h3 className="font-heading text-xl text-obsidian mb-3">{item.title}</h3>
              <p className="text-obsidian/60 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="prose prose-lg text-obsidian/70 max-w-none space-y-6">
          <h2 className="font-heading text-2xl text-obsidian mb-4">How to Return an Item</h2>
          <ol className="list-decimal pl-6 space-y-3">
            <li>Email our support team at <strong>returns@zorroxo.com</strong> with your order number.</li>
            <li>We will send you a prepaid return shipping label (for domestic orders).</li>
            <li>Pack the item securely in its original packaging.</li>
            <li>Drop the package at your nearest courier location.</li>
          </ol>
          <p className="pt-4 text-sm text-obsidian/50 italic">
            * Please note that items must be in original condition, with tags attached, to be eligible for a refund.
          </p>
        </div>
      </div>
    </div>
  );
}