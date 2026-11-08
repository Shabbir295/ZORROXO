import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="min-h-screen bg-ivory pt-28 pb-20">
      <div className="container-luxury">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <p className="eyebrow-text mb-6">Since 2018</p>
          <h1 className="font-heading text-5xl md:text-7xl text-obsidian mb-8 leading-tight">
            The Art of <span className="italic text-bronze">Elevated</span> Living
          </h1>
          <p className="text-obsidian/70 text-lg leading-relaxed">
            ZORROXO was born from a simple belief: that luxury should be quiet,
            considered, and built to last. Every piece in our collection is
            designed with intention and crafted by master artisans.
          </p>
        </motion.div>

        {/* Image + Text */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <img
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80"
              alt="Our atelier"
              className="w-full aspect-[4/5] object-cover"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h2 className="font-heading text-4xl text-obsidian mb-6">
              Our <span className="italic text-bronze">Story</span>
            </h2>
            <p className="text-obsidian/70 leading-relaxed mb-4">
              What began as a small atelier in Florence has grown into a global
              brand trusted by discerning clients in over 40 countries. We
              remain committed to our founding principles: exceptional
              craftsmanship, timeless design, and honest pricing.
            </p>
            <p className="text-obsidian/70 leading-relaxed mb-8">
              Every ZORROXO piece tells a story — of skilled hands, carefully
              sourced materials, and an unwavering commitment to quality that
              transcends trends.
            </p>
            <Link to="/shop" className="btn-primary inline-flex">Explore Collection</Link>
          </motion.div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <p className="eyebrow-text mb-4">Our Values</p>
            <h2 className="font-heading text-4xl text-obsidian">What We Stand For</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Craftsmanship', desc: 'Every piece is meticulously crafted by master artisans in Italy.' },
              { title: 'Sustainability', desc: 'Responsibly sourced materials and ethical production practices.' },
              { title: 'Timeless Design', desc: 'Pieces that transcend trends and become treasured heirlooms.' },
            ].map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="text-center border border-champagne p-8"
              >
                <h3 className="font-heading text-2xl text-obsidian mb-4">{value.title}</h3>
                <p className="text-obsidian/60 text-sm leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-obsidian text-ivory p-12 md:p-16">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { num: '250+', label: 'Curated Pieces' },
              { num: '15K', label: 'Happy Clients' },
              { num: '40', label: 'Countries' },
              { num: '99%', label: 'Satisfaction' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-heading text-4xl md:text-5xl text-champagne mb-2">{stat.num}</p>
                <p className="text-[11px] tracking-[0.2em] uppercase text-ivory/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}