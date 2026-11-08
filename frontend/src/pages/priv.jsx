import React from 'react';
import { motion } from 'framer-motion';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-ivory pt-32 pb-20">
      <div className="container-luxury max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <p className="eyebrow-text mb-4">Legal</p>
          <h1 className="font-heading text-5xl text-obsidian mb-6">Privacy Policy</h1>
          <p className="text-obsidian/60 text-sm">Last Updated: October 2026</p>
        </motion.div>

        <div className="prose prose-lg text-obsidian/70 max-w-none space-y-8">
          <section>
            <h2 className="font-heading text-2xl text-obsidian mb-4">1. Information We Collect</h2>
            <p>
              At ZORROXO, we collect information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products, when you participate in activities on the website, or otherwise when you contact us. The personal information we collect may include names, phone numbers, email addresses, mailing addresses, and payment information.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-obsidian mb-4">2. How We Use Your Information</h2>
            <p>
              We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-obsidian mb-4">3. Sharing Your Information</h2>
            <p>
              We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We do not sell your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-obsidian mb-4">4. Contact Us</h2>
            <p>
              If you have questions or comments about this notice, you may email us at privacy@zorroxo.com or by post to: ZORROXO, Via Roma 42, Florence, Italy.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}