import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    q: 'How long does shipping take?',
    a: 'Standard shipping takes 3-5 business days within the US, 7-10 business days for international orders. Express shipping options are available at checkout.',
  },
  {
    q: 'What is your return policy?',
    a: 'We offer free returns within 30 days of delivery. Items must be in original condition with tags attached.',
  },
  {
    q: 'Do you ship internationally?',
    a: 'Yes, we ship to over 40 countries worldwide. International shipping rates and delivery times are calculated at checkout.',
  },
  {
    q: 'How do I care for my ZORROXO pieces?',
    a: 'Each piece comes with a care card. We recommend professional dry cleaning for delicate fabrics and following the specific care instructions on the garment label.',
  },
  {
    q: 'Are your products ethically made?',
    a: 'Absolutely. We work directly with master artisans and ateliers in Italy, ensuring fair wages and ethical production practices throughout our supply chain.',
  },
  {
    q: 'Can I cancel or modify my order?',
    a: 'Orders can be modified or canceled within 2 hours of placement. Contact our team immediately at hello@zorroxo.com for assistance.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="min-h-screen bg-ivory pt-28 pb-20">
      <div className="container-luxury max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <p className="eyebrow-text mb-4">Support</p>
          <h1 className="font-heading text-5xl md:text-6xl text-obsidian mb-4">
            Frequently Asked <span className="italic text-bronze">Questions</span>
          </h1>
          <p className="text-obsidian/60">Everything you need to know</p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="border border-champagne"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-ivory-light transition-colors"
              >
                <span className="font-heading text-lg text-obsidian pr-4">{faq.q}</span>
                <span className="shrink-0 text-bronze">
                  {openIndex === i ? <Minus size={18} /> : <Plus size={18} />}
                </span>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 text-obsidian/70 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}