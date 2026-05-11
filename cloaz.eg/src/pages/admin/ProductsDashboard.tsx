import React, { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, doc, updateDoc, addDoc, deleteDoc, query } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import { Search, Plus, Trash2, Edit2, Filter, Package, Save, Check, X, UploadCloud, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const COLLECTION_NAME = 'collection id';

const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl text-white font-bold tracking-wide flex items-center gap-3 shadow-2xl z-50 
      ${type === 'success' ? 'bg-[#0069A8]' : 'bg-red-600'}`}
    >
      {type === 'success' ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
      {message}
    </motion.div>
  );
};

export default function ProductsDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [schema, setSchema] = useState<Record<string, 'string'|'number'|'boolean'|'array'>>({});
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('all');
  const [priceOrder, setPriceOrder] = useState('all');
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  
  const [toast, setToast] = useState<{message: string, type: 'success'|'error'} | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const showToast = (msg: string, type: 'success' | 'error') => setToast({ message: msg, type });

  useEffect(() => {
    const q = query(collection(db, COLLECTION_NAME));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setProducts(docs);

      const newSchema: Record<string, 'string'|'number'|'boolean'|'array'> = {
        name: 'string', price: 'number', oldPrice: 'number', stock: 'number',
        category: 'string', category2: 'string', gender: 'string', gender2: 'string', mainImage: 'string', hovering: 'string', sizes: 'array', colors: 'array', description: 'string'
      };

      docs.forEach(doc => {
        Object.entries(doc).forEach(([key, val]) => {
          if (key === 'id') return;
          if (Array.isArray(val)) newSchema[key] = 'array';
          else if (typeof val === 'number') newSchema[key] = 'number';
          else if (typeof val === 'boolean') newSchema[key] = 'boolean';
          else newSchema[key] = 'string';
        });
      });
      setSchema(newSchema);
      setLoading(false);
    }, () => {
      showToast('Error fetching data', 'error');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
       const matchesSearch = p.name?.toLowerCase().includes(search.toLowerCase()) || 
                             p.id.includes(search) || 
                             p.category?.toLowerCase().includes(search.toLowerCase());
       
       const matchesCategory = categoryFilter === 'ALL' || 
                              p.category?.toUpperCase() === categoryFilter;

       // Date Filter
       let matchesDate = true;
       if (dateFilter !== 'all') {
         const createdAt = p.createdAt?.toDate ? p.createdAt.toDate() : (p.createdAt ? new Date(p.createdAt) : null);
         if (createdAt) {
           const now = new Date();
           if (dateFilter === 'today') {
             matchesDate = createdAt.toDateString() === now.toDateString();
           } else if (dateFilter === 'week') {
             const weekAgo = new Date();
             weekAgo.setDate(now.getDate() - 7);
             matchesDate = createdAt >= weekAgo;
           }
         } else {
           matchesDate = false; // If no date, only show on 'all'
         }
       }

       return matchesSearch && matchesCategory && matchesDate;
    });

    // Price Sort
    if (priceOrder === 'high') {
      result.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    } else if (priceOrder === 'low') {
      result.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else {
      // Default: show newest first if createdAt exists
      result.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : (a.createdAt ? new Date(a.createdAt) : 0);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : (b.createdAt ? new Date(b.createdAt) : 0);
        return Number(dateB) - Number(dateA);
      });
    }

    return result;
  }, [products, search, categoryFilter, dateFilter, priceOrder]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
       showToast('Must be an image file', 'error');
       return;
    }
    setUploading(true);
    setUploadProgress(0);
    
    const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => setUploadProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100), 
      () => {
        setUploading(false);
        showToast('Image upload failed', 'error');
      }, 
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setFormData(prev => ({ ...prev, [fieldName]: downloadURL }));
        setUploading(false);
        setUploadProgress(0);
        showToast('Image uploaded successfully', 'success');
      }
    );
  };

  const handleSaveFull = async () => {
    try {
      // Clean up arrays
      const cleanedData = { ...formData };
      ['sizes', 'colors', 'detailImages'].forEach(key => {
         if (Array.isArray(cleanedData[key])) {
           cleanedData[key] = cleanedData[key].filter((x: string) => typeof x === 'string' && x.trim() !== '');
         }
      });
      // Set defaults for specific fields so they don't corrupt the list component
      cleanedData.price = Number(cleanedData.price) || 0;
      cleanedData.stock = Number(cleanedData.stock) || 0;
      if (cleanedData.oldPrice) cleanedData.oldPrice = Number(cleanedData.oldPrice);

      if (editingId) {
        await updateDoc(doc(db, COLLECTION_NAME, editingId), {
           ...cleanedData,
           updatedAt: new Date()
        });
        showToast('Product updated', 'success');
      } else {
        await addDoc(collection(db, COLLECTION_NAME), {
           ...cleanedData,
           createdAt: new Date(),
           updatedAt: new Date()
        });
        showToast('Product created', 'success');
      }
      setIsAdding(false);
      setEditingId(null);
    } catch (e) {
      showToast('Save failed', 'error');
    }
  };

  const handleDelete = async (id: string) => {
     // Removed window.confirm to ensure it works without getting blocked
     await deleteDoc(doc(db, COLLECTION_NAME, id));
     showToast('Product deleted', 'success');
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto w-full font-sans text-gray-800 bg-[#F8F9FA] min-h-screen">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
         <h1 className="text-xl md:text-2xl font-bold text-gray-900">Dashboard</h1>
         <button 
           onClick={() => { setFormData({}); setEditingId(null); setIsAdding(true); }}
           className="bg-[#0069A8] hover:bg-[#00558a] active:scale-95 transition-all text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 text-sm shadow-md shadow-[#0069A8]/20"
         >
           <Plus className="w-5 h-5" />
           <span className="hidden sm:inline">Add Product</span>
         </button>
      </div>

      {/* Filter Bar exactly like image */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-2 border border-gray-100 rounded-lg shadow-sm w-fit max-w-full overflow-x-auto overflow-y-hidden no-scrollbar">
        <div className="p-2 border-r border-gray-100">
           <Filter className="w-5 h-5 text-gray-600" />
        </div>
        <span className="font-semibold text-gray-700 mx-2 text-sm lg:block hidden">Filter By</span>
        
        <select 
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="bg-white text-gray-700 text-sm px-3 py-2 outline-none cursor-pointer appearance-none min-w-[120px] font-semibold"
        >
           <option value="ALL">category</option>
           <option value="WOMEN">Women</option>
           <option value="MAN">Man</option>
           <option value="SHOES & BAGS">Shoes & Bags</option>
           <option value="PERFUME">Perfume</option>
           <option value="ACCESSORIES">Accessories</option>
        </select>

        <select 
          value={dateFilter}
          onChange={e => setDateFilter(e.target.value)}
          className="bg-white text-gray-700 text-sm px-3 py-2 outline-none cursor-pointer appearance-none min-w-[120px] font-semibold border-l border-gray-100 pl-4"
        >
           <option value="all">our date</option>
           <option value="today">Today</option>
           <option value="week">This Week</option>
        </select>

        <select 
          value={priceOrder}
          onChange={e => setPriceOrder(e.target.value)}
          className="bg-white text-gray-700 text-sm px-3 py-2 outline-none cursor-pointer appearance-none min-w-[120px] font-semibold border-l border-gray-100 pl-4"
        >
           <option value="all">prices</option>
           <option value="high">High to Low</option>
           <option value="low">Low to High</option>
        </select>

        <button 
          onClick={() => {
            setCategoryFilter('ALL');
            setDateFilter('all');
            setPriceOrder('all');
          }}
          className="flex items-center gap-2 text-red-500 font-semibold text-sm px-4 py-2 hover:bg-red-50 rounded-lg transition-colors border-l border-gray-100 pl-4"
        >
           <RotateCcw className="w-4 h-4" />
           Reset Filter
        </button>
      </div>

      {loading ? (
        <div className="p-8 space-y-4 animate-pulse bg-white rounded-xl">
          {[1,2,3,4,5].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl w-full" />)}
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 text-[13px] text-gray-900 bg-white">
                  <th className="py-4 px-6 font-bold">Image</th>
                  <th className="py-4 px-6 font-bold">Product Name</th>
                  <th className="py-4 px-6 font-bold">Category</th>
                  <th className="py-4 px-6 font-bold">Price</th>
                  <th className="py-4 px-6 font-bold">Date Added</th>
                  <th className="py-4 px-6 font-bold">Piece</th>
                  <th className="py-4 px-6 font-bold">Available Color</th>
                  <th className="py-4 px-6 font-bold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-[13px] text-gray-600">
                <AnimatePresence>
                  {filteredProducts.map(product => (
                    <motion.tr 
                      layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      key={product.id} className="hover:bg-gray-50 transition-colors bg-white font-medium"
                    >
                      <td className="py-3 px-6">
                         <div className="w-12 h-12 bg-gray-100 rounded-[10px] overflow-hidden border border-gray-100">
                            {product.mainImage ? (
                              <img src={product.mainImage} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Package className="w-5 h-5 text-gray-400 m-auto mt-3.5" />
                            )}
                         </div>
                      </td>
                      <td className="py-3 px-6 text-gray-900 font-semibold">{product.name || 'Untitled'}</td>
                      <td className="py-3 px-6">{product.category || 'N/A'}</td>
                      <td className="py-3 px-6 font-semibold">${Number(product.price || 0).toFixed(2)}</td>
                      <td className="py-3 px-6 text-[11px] text-gray-400">
                        {product.createdAt ? (
                          product.createdAt.toDate ? product.createdAt.toDate().toLocaleDateString() : new Date(product.createdAt).toLocaleDateString()
                        ) : 'N/A'}
                      </td>
                      <td className="py-3 px-6">{product.stock || 0}</td>
                      <td className="py-3 px-6">
                         <div className="flex items-center gap-1.5 flex-wrap">
                            {product.colors && Array.isArray(product.colors) ? product.colors.map((c: string, i: number) => (
                               <div key={i} className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: c }} title={c} />
                            )) : '-'}
                         </div>
                      </td>
                      <td className="py-3 px-6">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => { setFormData(product); setEditingId(product.id); setIsAdding(true); }}
                            className="p-1.5 text-gray-400 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(product.id)}
                            className="p-1.5 text-red-400 border border-red-100 rounded-md hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {filteredProducts.length === 0 && (
                  <tr><td colSpan={7} className="py-10 text-center text-gray-400 font-medium">No Products Found</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="lg:hidden space-y-4">
             <AnimatePresence>
                {filteredProducts.map(product => (
                  <motion.div 
                    layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    key={product.id} className="bg-white border border-gray-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-2xl p-4 flex gap-4 relative items-center"
                  >
                     <div className="w-[84px] h-[84px] shrink-0 bg-gray-100 rounded-xl overflow-hidden border border-gray-100">
                        {product.mainImage ? (
                          <img src={product.mainImage} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-8 h-8 text-gray-300 m-auto mt-[26px]" />
                        )}
                     </div>
                     <div className="flex-1 min-w-0 pr-12">
                        <h3 className="font-semibold text-gray-700 text-[15px] truncate">{product.name || 'Untitled'}</h3>
                        <p className="text-gray-400 text-[13px] mt-0.5 truncate">Category: {product.category || 'N/A'}</p>
                        <p className="text-gray-400 text-[11px]">
                          Added: {product.createdAt ? (
                            product.createdAt.toDate ? product.createdAt.toDate().toLocaleDateString() : new Date(product.createdAt).toLocaleDateString()
                          ) : 'N/A'}
                        </p>
                        <div className="font-bold text-gray-900 text-[17px] mt-1">${Number(product.price || 0).toFixed(2)}</div>
                        <div className="flex items-center gap-2 flex-wrap mt-2">
                            {product.colors && Array.isArray(product.colors) && product.colors.map((c: string, i: number) => (
                               <div key={i} className="w-4 h-4 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: c }} title={c} />
                            ))}
                        </div>
                     </div>
                     
                     <div className="absolute right-4 top-4 flex flex-col gap-2">
                        <button 
                          onClick={() => { setFormData(product); setEditingId(product.id); setIsAdding(true); }}
                          className="p-1.5 bg-gray-50 border border-gray-200 text-gray-500 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-1.5 bg-red-50 border border-red-100 text-red-500 rounded-lg hover:bg-red-100 transition-colors mt-[14px]"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                     </div>
                  </motion.div>
                ))}
             </AnimatePresence>
             {filteredProducts.length === 0 && (
                <div className="text-center py-10 text-gray-400">No products found.</div>
             )}
          </div>
        </>
      )}

      {/* Editor Modal Drawer */}
      <AnimatePresence>
        {(isAdding || editingId) && (
          <div className="fixed inset-0 z-50 flex items-stretch justify-end">
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" 
               onClick={() => { setIsAdding(false); setEditingId(null); }} 
            />
            
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-3xl bg-white h-full shadow-2xl flex flex-col z-10"
             >
              <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingId ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar relative">
                <div className="space-y-8 pb-10">
                   {/* Data Fields */}
                   <div className="space-y-4">
                      <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2 text-lg">Basic Info</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <label className="text-sm font-medium text-gray-600 block mb-1.5">Product Name</label>
                          <input type="text" value={formData.name || ''} onChange={e => setFormData(prev => ({...prev, name: e.target.value}))} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 text-sm outline-none focus:border-[#0069A8] transition-all shadow-sm" />
                        </div>
                        <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-600 block mb-1.5">Category</label>
                            <select value={formData.category || ''} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 text-sm outline-none focus:border-[#0069A8] transition-all shadow-sm cursor-pointer appearance-none">
                              <option value="">Select Primary Category</option>
                              <option value="WOMEN">Women</option>
                              <option value="MAN">Man</option>
                              <option value="SHOES & BAGS">Shoes & Bags</option>
                              <option value="PERFUME">Perfume</option>
                              <option value="ACCESSORIES">Accessories</option>
                            </select>
                          </div>
                          <div>
                             <label className="text-sm font-medium text-gray-600 block mb-1.5 flex justify-between items-center">
                               <span>Secondary Category</span>
                               <span className="text-[10px] text-gray-400 font-normal">(Optional)</span>
                             </label>
                             <select value={formData.category2 || ''} onChange={e => setFormData({ ...formData, category2: e.target.value })} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 text-sm outline-none focus:border-[#0069A8] transition-all shadow-sm cursor-pointer appearance-none">
                              <option value="">None</option>
                              <option value="WOMEN">Women</option>
                              <option value="MAN">Man</option>
                              <option value="SHOES & BAGS">Shoes & Bags</option>
                              <option value="PERFUME">Perfume</option>
                              <option value="ACCESSORIES">Accessories</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600 block mb-1.5 flex justify-between items-center">
                            <span>Primary Gender</span>
                          </label>
                          <div className="flex bg-gray-50 border border-gray-200 rounded-lg p-1">
                            {['MEN', 'WOMEN'].map(g => (
                               <button key={g} type="button" onClick={() => setFormData({...formData, gender: g})} className={`flex-1 text-[10px] sm:text-xs font-semibold py-1.5 rounded-md transition-colors ${formData.gender === g ? 'bg-white shadow-sm text-[#0069A8] border border-gray-200/50' : 'text-gray-500 hover:text-gray-700'}`}>{g}</button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600 block mb-1.5 flex justify-between items-center">
                            <span>Secondary Gender</span>
                            <span className="text-[10px] text-gray-400 font-normal">(Optional)</span>
                          </label>
                          <div className="flex bg-gray-50 border border-gray-200 rounded-lg p-1">
                            <button type="button" onClick={() => setFormData({...formData, gender2: ''})} className={`flex-1 text-[10px] sm:text-xs font-semibold py-1.5 rounded-md transition-colors ${!formData.gender2 ? 'bg-white shadow-sm text-[#0069A8] border border-gray-200/50' : 'text-gray-500 hover:text-gray-700'}`}>NONE</button>
                            {['MEN', 'WOMEN'].map(g => (
                               <button key={g} type="button" onClick={() => setFormData({...formData, gender2: g})} className={`flex-1 text-[10px] sm:text-xs font-semibold py-1.5 rounded-md transition-colors ${formData.gender2 === g ? 'bg-white shadow-sm text-[#0069A8] border border-gray-200/50' : 'text-gray-500 hover:text-gray-700'}`}>{g}</button>
                            ))}
                          </div>
                        </div>
                        <div className="sm:col-span-2 text-[11px] text-gray-400 flex items-center gap-1.5 bg-blue-50/50 p-2 rounded-lg border border-blue-100/50">
                           <div className="w-1.5 h-1.5 bg-[#0069A8] rounded-full"></div>
                           <span>يمكنك اختيار جنسين للمنتج ليظهر في كلا القسمين (مثال: MEN + WOMEN)</span>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600 block mb-1.5">Price ($)</label>
                          <input type="number" value={formData.price ?? 0} onChange={e => setFormData(prev => ({...prev, price: e.target.value}))} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 text-sm outline-none focus:border-[#0069A8] transition-all shadow-sm" />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600 block mb-1.5">Old Price ($) <span className="text-gray-400 font-normal">- Optional</span></label>
                          <input type="number" value={formData.oldPrice ?? ''} onChange={e => setFormData(prev => ({...prev, oldPrice: e.target.value}))} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 text-sm outline-none focus:border-[#0069A8] transition-all shadow-sm" />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600 block mb-1.5">Stock / Pieces</label>
                          <input type="number" value={formData.stock ?? 0} onChange={e => setFormData(prev => ({...prev, stock: e.target.value}))} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 text-sm outline-none focus:border-[#0069A8] transition-all shadow-sm" />
                        </div>
                        <div className="flex gap-8 py-2">
                          <div className="flex items-center gap-3">
                            <label className="text-sm font-medium text-gray-600">Featured</label>
                            <button
                               onClick={() => setFormData(prev => ({...prev, isFeatured: !prev.isFeatured}))}
                               className={`w-11 h-6 rounded-full transition-colors relative flex items-center focus:outline-none ${formData.isFeatured ? 'bg-[#0069A8]' : 'bg-gray-200'}`}
                             >
                               <div className={`w-4 h-4 bg-white rounded-full absolute shadow-sm transition-all ${formData.isFeatured ? 'left-[24px]' : 'left-1'}`} />
                            </button>
                          </div>
                          <div className="flex items-center gap-3">
                            <label className="text-sm font-medium text-gray-600">Under Video</label>
                            <button
                               onClick={() => setFormData(prev => ({...prev, underVideo: !prev.underVideo}))}
                               className={`w-11 h-6 rounded-full transition-colors relative flex items-center focus:outline-none ${formData.underVideo ? 'bg-[#0069A8]' : 'bg-gray-200'}`}
                             >
                               <div className={`w-4 h-4 bg-white rounded-full absolute shadow-sm transition-all ${formData.underVideo ? 'left-[24px]' : 'left-1'}`} />
                            </button>
                          </div>
                        </div>
                        <div className="sm:col-span-2">
                          <label className="text-sm font-medium text-gray-600 block mb-1.5">Description</label>
                          <textarea value={formData.description || ''} onChange={e => setFormData(prev => ({...prev, description: e.target.value}))} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 text-sm outline-none focus:border-[#0069A8] transition-all shadow-sm min-h-[100px]" />
                        </div>
                      </div>
                   </div>

                   {/* URLs */}
                   <div className="space-y-4">
                      <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2 text-lg">Media URLs</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600 block mb-1.5">Main Image URL</label>
                          <input type="text" value={formData.mainImage || ''} onChange={e => setFormData({ ...formData, mainImage: e.target.value })} placeholder="https://..." className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:border-[#0069A8] shadow-sm" />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600 block mb-1.5">Hover Image URL</label>
                          <input type="text" value={formData.hovering || ''} onChange={e => setFormData({ ...formData, hovering: e.target.value })} placeholder="https://..." className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:border-[#0069A8] shadow-sm" />
                        </div>
                        <div className="sm:col-span-2 pt-2">
                          <label className="text-sm font-medium text-gray-600 block mb-2">Detail Images URLs</label>
                          <div className="space-y-3">
                            {Array.from({ length: Math.max(5, (formData.detailImages || []).length) }).map((_, i) => (
                               <input key={`di-${i}`} type="text" value={(formData.detailImages || [])[i] || ''} onChange={e => {
                                  const arr = [...(formData.detailImages || [])];
                                  arr[i] = e.target.value;
                                  setFormData({...formData, detailImages: arr});
                               }} placeholder={`Detail Image URL ${i+1}`} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:border-[#0069A8] shadow-sm" />
                            ))}
                          </div>
                        </div>
                      </div>
                   </div>

                   {/* Variations */}
                   <div className="space-y-4">
                      <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2 text-lg">Variations</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Colors */}
                        <div>
                          <label className="text-sm font-medium text-gray-600 block mb-2">Colors (Hex Code or Name)</label>
                          <div className="space-y-3">
                            {Array.from({ length: Math.max(5, (formData.colors || []).length) }).map((_, i) => (
                               <div key={`col-${i}`} className="flex gap-2 items-center">
                                 <input 
                                   type="color" 
                                   value={(formData.colors || [])[i]?.startsWith('#') ? (formData.colors || [])[i] : '#000000'} 
                                   onChange={e => {
                                      const arr = [...(formData.colors || [])];
                                      arr[i] = e.target.value;
                                      setFormData({...formData, colors: arr});
                                   }}
                                   className="w-9 h-9 p-0.5 bg-white border border-gray-300 rounded-lg cursor-pointer"
                                 />
                                 <input type="text" value={(formData.colors || [])[i] || ''} onChange={e => {
                                    const arr = [...(formData.colors || [])];
                                    arr[i] = e.target.value;
                                    setFormData({...formData, colors: arr});
                                 }} placeholder={`#000000`} className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#0069A8] shadow-sm" />
                               </div>
                            ))}
                          </div>
                        </div>

                        {/* Sizes */}
                        <div>
                          <label className="text-sm font-medium text-gray-600 block mb-2">Sizes (S, M, L, XL...)</label>
                          <div className="space-y-3">
                            {Array.from({ length: Math.max(5, (formData.sizes || []).length) }).map((_, i) => (
                               <input key={`sz-${i}`} type="text" value={(formData.sizes || [])[i] || ''} onChange={e => {
                                  const arr = [...(formData.sizes || [])];
                                  arr[i] = e.target.value;
                                  setFormData({...formData, sizes: arr});
                               }} placeholder={`Size ${i+1} (e.g. XL)`} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#0069A8] shadow-sm" />
                            ))}
                          </div>
                        </div>
                      </div>
                   </div>
                </div>
              </div>

              <div className="p-5 border-t border-gray-100 bg-white shrink-0 flex gap-4">
                <button 
                  onClick={() => { setIsAdding(false); setEditingId(null); }}
                  className="flex-1 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 py-3 rounded-xl font-bold text-sm transition-colors shadow-sm"
                >Cancel</button>
                <button 
                  onClick={handleSaveFull} disabled={uploading}
                  className="flex-[2] bg-[#0069A8] hover:bg-[#00558a] disabled:opacity-50 active:scale-[0.98] transition-all text-white py-3 rounded-xl font-bold text-sm shadow-md shadow-[#0069A8]/20 flex justify-center items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
}
