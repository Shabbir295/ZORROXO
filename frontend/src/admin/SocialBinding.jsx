import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, AlertCircle, Save, Edit, X } from 'lucide-react';
import { FaInstagram, FaFacebookF, FaTwitter, FaYoutube, FaTiktok, FaLinkedin, FaPinterest } from 'react-icons/fa';
import { supabase } from '../lib/supabase';

const platforms = [
  { id: 'instagram', name: 'Instagram', icon: FaInstagram, color: '#E4405F', example: 'https://instagram.com/yourusername', domain: 'instagram.com' },
  { id: 'facebook', name: 'Facebook', icon: FaFacebookF, color: '#1877F2', example: 'https://facebook.com/yourpage', domain: 'facebook.com' },
  { id: 'twitter', name: 'Twitter (X)', icon: FaTwitter, color: '#1DA1F2', example: 'https://twitter.com/yourusername', domain: 'twitter.com' },
  { id: 'youtube', name: 'YouTube', icon: FaYoutube, color: '#FF0000', example: 'https://youtube.com/@yourchannel', domain: 'youtube.com' },
  { id: 'tiktok', name: 'TikTok', icon: FaTiktok, color: '#000000', example: 'https://tiktok.com/@yourusername', domain: 'tiktok.com' },
  { id: 'linkedin', name: 'LinkedIn', icon: FaLinkedin, color: '#0A66C2', example: 'https://linkedin.com/in/yourprofile', domain: 'linkedin.com' },
  { id: 'pinterest', name: 'Pinterest', icon: FaPinterest, color: '#E60023', example: 'https://pinterest.com/yourusername', domain: 'pinterest.com' },
];

export default function SocialBinding() {
  const [links, setLinks] = useState({});
  const [editingPlatform, setEditingPlatform] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 5000);
  };

  useEffect(() => {
    async function fetchLinks() {
      const { data } = await supabase.from('social_links').select('*');
      const linkMap = {};
      data?.forEach(item => { linkMap[item.platform] = item.url || ''; });
      setLinks(linkMap);
      setLoading(false);
    }
    fetchLinks();
  }, []);

  const handleEditClick = (platformId) => {
    setEditingPlatform(platformId);
  };

  const handleCancelEdit = () => {
    setEditingPlatform(null);
  };

  const handleChange = (platform, value) => {
    setLinks({ ...links, [platform]: value });
  };

  const handleSave = async (platformId) => {
    setSaving(true);
    let url = links[platformId] || '';
    const platform = platforms.find(p => p.id === platformId);

    if (url.trim() !== '') {
      url = url.trim().toLowerCase();

      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }

      let domainName = '';
      try {
        const parsed = new URL(url);
        domainName = parsed.hostname;
      } catch (e) {
        showToast(`Invalid URL format for ${platform.name}.`, 'error');
        setSaving(false);
        return;
      }

      // 1. Domain Check
      const validDomains = [platform.domain, `www.${platform.domain}`, `m.${platform.domain}`];
      if (!validDomains.includes(domainName)) {
        showToast(`Invalid link! Please enter a valid ${platform.name} URL (e.g., ${platform.example}).`, 'error');
        setSaving(false);
        return;
      }

      // 🔥 2. Video/Post Link Check (Sirf Profile Link Allow Hoga)
      // Agar link mein ye cheezein hain, matlab ye video/post ka link hai
      const badPatterns = ['/watch', '/shorts', '/reel', '/reels', '/p/', '/status/', '/video/'];
      const isBadLink = badPatterns.some(pattern => url.includes(pattern));

      if (isBadLink) {
        showToast(`Please enter your ${platform.name} PROFILE link, not a video/post link.`, 'error');
        setSaving(false);
        return;
      }
      
      links[platformId] = url;
    }

    try {
      await supabase
        .from('social_links')
        .update({ url: url, updated_at: new Date().toISOString() })
        .eq('platform', platformId);

      showToast(`${platform.name} profile link updated!`);
      setEditingPlatform(null);
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#A18A70]" size={40} /></div>;

  return (
    <div className="space-y-6 relative">
      
      <AnimatePresence>
        {toast.show && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`fixed top-6 left-1/2 -translate-x-1/2 z-[400] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-medium w-[90%] max-w-md justify-center text-center ${toast.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {toast.type === 'success' ? <CheckCircle2 size={18} className="shrink-0" /> : <AlertCircle size={18} className="shrink-0" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <p className="text-[10px] tracking-[0.2em] uppercase text-[#A18A70] font-bold mb-2">Settings</p>
        <h1 className="font-heading text-3xl sm:text-4xl text-[#111110]">Social Media Binding</h1>
        <p className="text-sm text-gray-500 mt-1">Add your social media profile links to display them in the footer.</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[#F5F1E9] space-y-4 max-w-3xl">
        {platforms.map((platform) => (
          <div key={platform.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition-colors bg-gray-50/50">
            
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${platform.color}15` }}>
              <platform.icon size={22} style={{ color: platform.color }} />
            </div>
            
            <div className="flex-1 w-full">
              <label className="text-[10px] tracking-[0.2em] uppercase text-gray-500 font-bold mb-1 block">
                {platform.name} Profile URL
              </label>
              
              {editingPlatform === platform.id ? (
                <div className="flex flex-col sm:flex-row gap-2 mt-1">
                  <input 
                    type="text" 
                    placeholder={platform.example}
                    value={links[platform.id] || ''}
                    onChange={(e) => handleChange(platform.id, e.target.value)}
                    className="flex-1 bg-white border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-[#A18A70]"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button onClick={() => handleSave(platform.id)} disabled={saving} className="px-4 py-2 bg-obsidian text-white text-xs font-bold uppercase rounded-lg hover:bg-bronze transition-colors flex items-center gap-1">
                      {saving ? <Loader2 className="animate-spin" size={14} /> : <><Save size={14} /> Save</>}
                    </button>
                    <button onClick={handleCancelEdit} className="px-4 py-2 bg-gray-200 text-gray-700 text-xs font-bold uppercase rounded-lg hover:bg-gray-300 transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between mt-1 bg-white border border-gray-200 p-2.5 rounded-lg">
                  <p className={`text-sm truncate ${links[platform.id] ? 'text-obsidian' : 'text-gray-400'}`}>
                    {links[platform.id] || `Example: ${platform.example}`}
                  </p>
                  <button onClick={() => handleEditClick(platform.id)} className="ml-2 p-1.5 text-gray-400 hover:text-[#A18A70] transition-colors rounded-md hover:bg-gray-100" title="Edit">
                    <Edit size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}