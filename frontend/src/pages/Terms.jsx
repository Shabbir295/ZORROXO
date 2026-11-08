import React from 'react';
import { motion } from 'framer-motion';

export default function Terms() {
  return (
    <div className="min-h-screen bg-ivory pt-32 pb-20">
      <div className="container-luxury max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <p className="eyebrow-text mb-4">Legal</p>
          <h1 className="font-heading text-5xl text-obsidian mb-6">Terms of Service</h1>
          <p className="text-obsidian/60 text-sm">Last Updated: October 2026</p>
        </motion.div>

        <div className="prose prose-lg text-obsidian/70 max-w-none space-y-8">
          <section>
            <h2 className="font-heading text-2xl text-obsidian mb-4">1. Agreement to Terms</h2>
            <p>
              These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity, and ZORROXO, concerning your access to and use of our website. By accessing the site, you agree that you have read, understood, and agree to be bound by all of these Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-obsidian mb-4">2. Intellectual Property Rights</h2>
            <p>
              Unless otherwise indicated, the website is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the site are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-obsidian mb-4">3. Product Information</h2>
            <p>
              We make every effort to display as accurately as possible the colors, features, specifications, and details of the products available on the site. However, we do not guarantee that the colors, features, specifications, and details of the products will be accurate, complete, reliable, current, or free of other errors.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-obsidian mb-4">4. Governing Law</h2>
            <p>
              These Terms shall be governed by and defined following the laws of Italy. ZORROXO and yourself irrevocably consent that the courts of Florence, Italy shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}