import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Globe, Clock } from 'lucide-react';

export default function Shipping() {
  return (
    <div className="min-h-screen bg-ivory pt-32 pb-20">
      <div className="container-luxury max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <p className="eyebrow-text mb-4">Delivery Information</p>
          <h1 className="font-heading text-5xl text-obsidian mb-6">Shipping & Delivery</h1>
          <p className="text-obsidian/60 max-w-xl mx-auto">
            We ensure your ZORROXO pieces reach you safely, securely, and in pristine condition.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            { icon: Truck, title: 'Complimentary Shipping', desc: 'Free standard shipping on all orders over $150.' },
            { icon: Clock, title: 'Express Delivery', desc: 'Need it sooner? Express delivery available at checkout.' },
            { icon: Globe, title: 'Global Reach', desc: 'We ship to over 40 countries worldwide.' },
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
          <h2 className="font-heading text-2xl text-obsidian mb-4">Standard Shipping Times</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>United States:</strong> 3-5 business days</li>
            <li><strong>Europe:</strong> 5-7 business days</li>
            <li><strong>Rest of the World:</strong> 7-14 business days</li>
          </ul>
          <p className="pt-4">
            Once your order is dispatched, you will receive a tracking number via email. You can use this number to track your package on our courier partner's website.
          </p>
        </div>
      </div>
    </div>
  );
}