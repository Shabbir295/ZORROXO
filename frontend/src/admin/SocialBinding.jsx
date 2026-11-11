import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, AlertCircle, Save } from 'lucide-react';
import { FaInstagram, FaFacebookF, FaTwitter, FaYoutube, FaTiktok, FaLinkedin, FaPinterest } from 'react-icons/fa';
import { supabase } from '../lib/supabase';

const platforms = [
  { id: 'instagram', name: 'Instagram', icon: FaInstagram, color: '#E4405F' },
  { id: 'facebook', name: 'Facebook', icon: FaFacebookF, color: '#1877F2' },
  { id: 'twitter', name: 'Twitter (X)', icon: FaTwitter, color: '#1DA1F2' },
  { id: 'youtube', name: 'YouTube', icon: FaYoutube, color: '#FF0000' },
  { id: 'tiktok', name: 'TikTok', icon: FaTiktok, color: '#000000' },
  { id: 'linkedin', name: 'LinkedIn', icon: FaLinkedin, color: '#0A66C2' },
  { id: 'pinterest', name: 'Pinterest', icon: FaPinterest, color: '#E60023' },
];

export default function SocialBinding() {
  const [links, setLinks] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  useEffect(() => {
    async function fetchLinks() {
      const { data } = await supabase.from('social_links').select('*');
      const linkMap = {};
      data?.forEach(item => { linkMap[item.platform] = item.url; });
      setLinks(linkMap);
      setLoading(false);
    }
    fetchLinks();
  }, []);

  const handleChange = (platform, value) => {
    setLinks({ ...links, [platform]: value });
  };

  const handleSave = async () => {
    setSaving(true);

    // 🔥 Validation: Agar URL hai to wo sahi format mein hona chahiye
    for (const platform of platforms) {
      const url = links[platform.id];
      if (url && url.trim() !== '') {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          showToast(`${platform.name} URL must start with http:// or https://`, 'error');
          setSaving(false);
          return;
        }
      }
    }

    try {
      for (const platform of platforms) {
        await supabase
          .from('social_links')
          .update({ url: links[platform.id] || '', updated_at: new Date().toISOString() })
          .eq('platform', platform.id);
      }
      showToast('Social links updated successfully!');
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#A18A70]" size={40} /></div>;

  return (
    <div className="space-y-6 relative">
      {toast.show && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className={`fixed top-6 left-1/2 -translate-x-1/2 z-[400] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-medium ${toast.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {toast.message}
        </motion.div>
      )}

      <div>
        <p className="text-[10px] tracking-[0.2em] uppercase text-[#A18A70] font-bold mb-2">Settings</p>
        <h1 className="font-heading text-3xl sm:text-4xl text-[#111110]">Social Media Binding</h1>
        <p className="text-sm text-gray-500 mt-1">Add your social media links to display them in the footer.</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[#F5F1E9] space-y-6 max-w-2xl">
        {platforms.map((platform) => (
          <div key={platform.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${platform.color}15` }}>
              <platform.icon size={22} style={{ color: platform.color }} />
            </div>
            <div className="flex-1 w-full">
              <label className="text-[10px] tracking-[0.2em] uppercase text-gray-500 font-bold mb-1 block">{platform.name} URL</label>
              <input 
                type="url" 
                placeholder="https://instagram.com/yourusername"
                value={links[platform.id] || ''}
                onChange={(e) => handleChange(platform.id, e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm focus:outline-none focus:border-[#A18A70]"
              />
            </div>
          </div>
        ))}

        <div className="pt-6 border-t border-[#F5F1E9]">
          <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 py-3 px-6">
            {saving ? <Loader2 className="animate-spin" size={16} /> : <><Save size={16} /> Save Changes</>}
          </button>
        </div>
      </div>
    </div>
  );
}