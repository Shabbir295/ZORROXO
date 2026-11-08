import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Check } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-ivory pt-28 pb-20">
      <div className="container-luxury">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <p className="eyebrow-text mb-4">Get in Touch</p>
          <h1 className="font-heading text-5xl md:text-6xl text-obsidian mb-4">
            Contact <span className="italic text-bronze">Us</span>
          </h1>
          <p className="text-obsidian/60 max-w-md mx-auto">
            Our team is here to help. Reach out with any questions.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-8">
            {[
              { icon: Mail, title: 'Email', value: 'hello@zorroxo.com' },
              { icon: Phone, title: 'Phone', value: '+1 (555) 123-4567' },
              { icon: MapPin, title: 'Address', value: 'Via Roma 42, Florence, Italy' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4"
              >
                <div className="w-12 h-12 border border-champagne flex items-center justify-center shrink-0">
                  <item.icon size={18} className="text-bronze" />
                </div>
                <div>
                  <h3 className="text-[11px] tracking-[0.2em] uppercase text-bronze mb-1">
                    {item.title}
                  </h3>
                  <p className="text-obsidian">{item.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="lg:col-span-2 space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-[11px] tracking-[0.2em] uppercase text-obsidian mb-2 block">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-transparent border border-champagne px-4 py-3 text-obsidian focus:outline-none focus:border-bronze transition-colors"
                />
              </div>
              <div>
                <label className="text-[11px] tracking-[0.2em] uppercase text-obsidian mb-2 block">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-transparent border border-champagne px-4 py-3 text-obsidian focus:outline-none focus:border-bronze transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="text-[11px] tracking-[0.2em] uppercase text-obsidian mb-2 block">
                Message
              </label>
              <textarea
                required
                rows={6}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-transparent border border-champagne px-4 py-3 text-obsidian focus:outline-none focus:border-bronze transition-colors resize-none"
              />
            </div>
            <button type="submit" className="btn-primary flex items-center gap-3">
              {submitted ? (
                <>Message Sent <Check size={14} /></>
              ) : (
                <>Send Message <Send size={14} /></>
              )}
            </button>
          </motion.form>
        </div>
      </div>
    </div>
  );
}