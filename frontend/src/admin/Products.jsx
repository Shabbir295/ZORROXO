import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, Upload, Loader2, CheckCircle2, Search, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCurrency } from '../context/CurrencyContext'; // 🔥 Currency Hook

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '', category: 'Women', stock: '', description: '', tag: '' });
  
  // Images States
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);

  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const { formatPrice } = useCurrency(); // 🔥 Hook

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  useEffect(() => {
    if (isModalOpen || deleteId) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isModalOpen, deleteId]);

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleAddNew = () => {
    setEditingProduct(null);
    setFormData({ name: '', price: '', category: 'Women', stock: '', description: '', tag: '' });
    setImage1(null); setImage2(null); setImage3(null); setImage4(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock,
      description: product.description || '',
      tag: product.tag || '',
    });
    setImage1(null); setImage2(null); setImage3(null); setImage4(null);
    setIsModalOpen(true);
  };

  const uploadImage = async (file) => {
    if (!file) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
    const { error } = await supabase.storage.from('payment_screenshots').upload(fileName, file);
    if (error) throw error;
    const { data } = supabase.storage.from('payment_screenshots').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let urls = {
        image_url: editingProduct ? editingProduct.image_url : 'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=800',
        image_2: editingProduct ? editingProduct.image_2 : null,
        image_3: editingProduct ? editingProduct.image_3 : null,
        image_4: editingProduct ? editingProduct.image_4 : null,
      };

      if (image1) urls.image_url = await uploadImage(image1);
      if (image2) urls.image_2 = await uploadImage(image2);
      if (image3) urls.image_3 = await uploadImage(image3);
      if (image4) urls.image_4 = await uploadImage(image4);

      const productData = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        ...urls,
      };

      if (editingProduct) {
        const { error } = await supabase.from('products').update(productData).eq('id', editingProduct.id);
        if (error) throw error;
        showToast('Product updated successfully!');
      } else {
        const { error } = await supabase.from('products').insert([productData]);
        if (error) throw error;
        showToast('Product added successfully!');
      }
      
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase.from('products').delete().eq('id', deleteId);
      if (error) throw error;
      setDeleteId(null);
      fetchProducts();
      showToast('Product deleted successfully!');
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const LocalPreview = ({ file }) => {
    const [url, setUrl] = useState(null);
    useEffect(() => {
      if (file) {
        const objectUrl = URL.createObjectURL(file);
        setUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
      }
    }, [file]);
    if (!url) return null;
    return <img src={url} alt="preview" className="w-16 h-16 object-cover rounded-md mt-2 border border-green-200" />;
  };

  return (
    <div className="space-y-8 relative">
      
      <AnimatePresence>
        {toast.show && (
          <motion.div initial={{ opacity: 0, y: -20, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: -20, x: '-50%' }} className={`fixed top-6 left-1/2 z-[400] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-medium ${toast.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#A18A70] font-bold mb-2">Inventory</p>
          <h1 className="font-heading text-4xl text-[#111110]">Products</h1>
        </div>
        <button onClick={handleAddNew} className="btn-primary flex items-center gap-2 py-3 px-6">
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white border border-[#F5F1E9] pl-12 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#A18A70] shadow-sm" />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#A18A70]" size={40} /></div>
      ) : (
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#F5F1E9] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F5F1E9]/50 border-b border-[#F5F1E9] text-[10px] uppercase tracking-[0.15em] text-gray-500">
                <tr>
                  <th className="p-6 font-bold">Product</th>
                  <th className="p-6 font-bold">Category</th>
                  <th className="p-6 font-bold">Price</th>
                  <th className="p-6 font-bold">Stock</th>
                  <th className="p-6 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F1E9]">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F5F1E9]/30 transition-colors group">
                    <td className="p-6 flex items-center gap-4">
                      <div className="w-12 h-16 rounded-md overflow-hidden bg-gray-100 shrink-0">
                        <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-[#111110] text-base">{p.name}</p>
                        {p.tag && <span className="text-[9px] uppercase tracking-wider bg-[#A18A70] text-white px-2 py-0.5 rounded-full">{p.tag}</span>}
                      </div>
                    </td>
                    <td className="p-6 text-gray-500 font-medium">{p.category}</td>
                    {/* 🔥 FORMATTED PRICE */}
                    <td className="p-6 font-bold text-[#111110]">{formatPrice(p.price)}</td>
                    <td className="p-6 text-gray-500">{p.stock} units</td>
                    <td className="p-6 text-right space-x-3">
                      <button onClick={() => handleEdit(p)} className="p-2 text-gray-400 hover:text-[#A18A70] hover:bg-[#A18A70]/10 rounded-lg transition-all" title="Edit">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => setDeleteId(p.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD/EDIT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
              
              <div className="flex justify-between items-center p-6 border-b border-[#F5F1E9] bg-white rounded-t-2xl z-10 shrink-0">
                <div><h2 className="font-heading text-3xl text-[#111110]">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2></div>
                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 bg-[#F5F1E9] rounded-full flex items-center justify-center text-gray-500 hover:text-[#111110] hover:bg-[#A18A70] hover:text-white transition-all"><X size={20} /></button>
              </div>

              <div className="p-6 overflow-y-auto overscroll-contain">
                <form onSubmit={handleSaveProduct} className="space-y-5">
                  <div className="grid grid-cols-2 gap-5">
                    <div className="col-span-2">
                      <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2 block">Product Name</label>
                      <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#F5F1E9]/50 border border-[#F5F1E9] p-4 rounded-xl text-sm focus:outline-none focus:border-[#A18A70] focus:bg-white transition-all" placeholder="e.g. Cashmere Wrap Coat" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2 block">Price ($)</label>
                      <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-[#F5F1E9]/50 border border-[#F5F1E9] p-4 rounded-xl text-sm focus:outline-none focus:border-[#A18A70] focus:bg-white transition-all" placeholder="890" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2 block">Stock</label>
                      <input type="number" required value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full bg-[#F5F1E9]/50 border border-[#F5F1E9] p-4 rounded-xl text-sm focus:outline-none focus:border-[#A18A70] focus:bg-white transition-all" placeholder="10" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2 block">Category</label>
                      <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-[#F5F1E9]/50 border border-[#F5F1E9] p-4 rounded-xl text-sm focus:outline-none focus:border-[#A18A70] focus:bg-white transition-all">
                        <option>Women</option><option>Men</option><option>Accessories</option><option>Home</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2 block">Tag (Optional)</label>
                      <input value={formData.tag} onChange={e => setFormData({...formData, tag: e.target.value})} placeholder="e.g. New, Bestseller" className="w-full bg-[#F5F1E9]/50 border border-[#F5F1E9] p-4 rounded-xl text-sm focus:outline-none focus:border-[#A18A70] focus:bg-white transition-all" />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2 block">Description</label>
                      <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-[#F5F1E9]/50 border border-[#F5F1E9] p-4 rounded-xl text-sm focus:outline-none focus:border-[#A18A70] focus:bg-white transition-all" placeholder="Crafted from the finest materials..." />
                    </div>
                    
                    <div className="col-span-2">
                      <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2 block">Main Image</label>
                      {editingProduct && editingProduct.image_url && !image1 && (
                        <div className="mb-3 w-20 h-24 rounded-md overflow-hidden bg-gray-100">
                          <img src={editingProduct.image_url} alt="Current" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="w-full bg-[#F5F1E9]/50 border border-dashed border-[#A18A70]/50 p-6 rounded-xl flex flex-col items-center justify-center relative hover:bg-[#F5F1E9] transition-colors">
                        <Upload size={24} className="text-[#A18A70] mb-2" />
                        <p className="text-sm text-gray-600 font-medium">{editingProduct ? 'Change main image' : 'Click to upload main image'}</p>
                        <input type="file" accept="image/*" onChange={e => setImage1(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      </div>
                      {image1 && (<div className="flex items-center gap-3 mt-2"><LocalPreview file={image1} /><p className="text-green-600 text-xs flex items-center gap-1"><CheckCircle2 size={12} /> {image1.name}</p></div>)}
                    </div>

                    <div className="col-span-2 mt-4 pt-4 border-t border-[#F5F1E9]">
                      <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-4 block">Gallery Images (3 Extra)</label>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          {editingProduct?.image_2 && !image2 && (<div className="mb-2 w-full h-20 rounded-md overflow-hidden bg-gray-100"><img src={editingProduct.image_2} alt="" className="w-full h-full object-cover" /></div>)}
                          <div className="w-full aspect-square bg-[#F5F1E9]/50 border border-dashed border-[#A18A70]/50 p-2 rounded-xl flex flex-col items-center justify-center relative hover:bg-[#F5F1E9] transition-colors">
                            <ImageIcon size={18} className="text-[#A18A70] mb-1" /><p className="text-[10px] text-gray-500 font-medium">Image 2</p>
                            <input type="file" accept="image/*" onChange={e => setImage2(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                          </div>
                          {image2 && <LocalPreview file={image2} />}
                        </div>
                        <div>
                          {editingProduct?.image_3 && !image3 && (<div className="mb-2 w-full h-20 rounded-md overflow-hidden bg-gray-100"><img src={editingProduct.image_3} alt="" className="w-full h-full object-cover" /></div>)}
                          <div className="w-full aspect-square bg-[#F5F1E9]/50 border border-dashed border-[#A18A70]/50 p-2 rounded-xl flex flex-col items-center justify-center relative hover:bg-[#F5F1E9] transition-colors">
                            <ImageIcon size={18} className="text-[#A18A70] mb-1" /><p className="text-[10px] text-gray-500 font-medium">Image 3</p>
                            <input type="file" accept="image/*" onChange={e => setImage3(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                          </div>
                          {image3 && <LocalPreview file={image3} />}
                        </div>
                        <div>
                          {editingProduct?.image_4 && !image4 && (<div className="mb-2 w-full h-20 rounded-md overflow-hidden bg-gray-100"><img src={editingProduct.image_4} alt="" className="w-full h-full object-cover" /></div>)}
                          <div className="w-full aspect-square bg-[#F5F1E9]/50 border border-dashed border-[#A18A70]/50 p-2 rounded-xl flex flex-col items-center justify-center relative hover:bg-[#F5F1E9] transition-colors">
                            <ImageIcon size={18} className="text-[#A18A70] mb-1" /><p className="text-[10px] text-gray-500 font-medium">Image 4</p>
                            <input type="file" accept="image/*" onChange={e => setImage4(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                          </div>
                          {image4 && <LocalPreview file={image4} />}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#F5F1E9]">
                    <button type="submit" disabled={isSaving} className="w-full btn-primary py-4 flex justify-center items-center gap-2 text-sm">
                      {isSaving ? <Loader2 className="animate-spin" size={18} /> : (editingProduct ? 'Update Product' : 'Publish Product')}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteId(null)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-sm bg-white rounded-2xl p-8 shadow-2xl text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"><AlertCircle size={32} className="text-red-500" /></div>
              <h2 className="font-heading text-2xl text-[#111110] mb-3">Delete Product?</h2>
              <div className="flex gap-3 mt-8">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-3 border border-gray-300 text-gray-600 text-xs uppercase font-bold tracking-wider rounded-xl hover:bg-gray-50 transition-all">Cancel</button>
                <button onClick={handleDeleteConfirm} disabled={isDeleting} className="flex-1 py-3 bg-red-500 text-white text-xs uppercase font-bold tracking-wider rounded-xl hover:bg-red-600 transition-all flex items-center justify-center">
                  {isDeleting ? <Loader2 className="animate-spin" size={16} /> : 'Yes, Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}