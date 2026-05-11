import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Minus, Plus, ChevronDown, Truck, RefreshCw } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useCart } from "../context/CartContext";
import { fetchProductById, fetchFeaturedProducts } from "../services/productService";
import { Product } from "../types";
import ProductCard from "../components/products/ProductCard";
import { useTheme } from "../context/ThemeContext";

const BRANDING_IMAGES: Record<string, string> = {
  'ALL': '/assets/images/banners/branding store.svg',
  'MAN': '/assets/images/banners/branding store.svg',
  'MEN': '/assets/images/banners/branding store.svg',
  'WOMEN': '/assets/images/banners/branding store.svg',
  'WOMAN': '/assets/images/banners/branding store.svg',
  'SHOES AND BAG': '/assets/images/banners/branding store.svg',
  'ACCESSORIES': '/assets/images/banners/branding store.svg',
  'PERFUME': '/assets/images/banners/branding store.svg'
};

export default function ProductPage() {
  const { theme } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (id) {
          const p = await fetchProductById(id);
          setProduct(p);
          if (p?.colors && p.colors.length > 0) {
            setSelectedColor(p.colors[0]);
          }
          if (p?.sizes && p.sizes.length > 0) {
            setSelectedSize(p.sizes[0]);
          }

          // Fetch only products in the same category if available
          const featured = await fetchFeaturedProducts();
          if (p?.category) {
            const similar = featured.filter(prod => prod.category === p.category && prod.id !== p.id);
            setFeaturedProducts(similar.length > 0 ? similar : featured.filter(prod => prod.id !== p.id));
          } else {
            setFeaturedProducts(featured.filter(prod => prod.id !== p.id));
          }
        } else {
          const featured = await fetchFeaturedProducts();
          setFeaturedProducts(featured);
        }
      } catch (error) {
        console.error("Error loading product data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const isOutOfStock = product?.stock === 0;
  const hasDiscount = product && product.oldPrice && product.oldPrice > product.price;

  const handleAddToCart = () => {
    if (!product || isOutOfStock) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      oldPrice: product.oldPrice,
      image: product.mainImage,
      size: selectedSize,
      color: selectedColor || undefined,
      quantity: quantity
    }, false);
  };

  const handleBuyNow = () => {
    if (!product || isOutOfStock) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      oldPrice: product.oldPrice,
      image: product.mainImage,
      size: selectedSize,
      color: selectedColor || undefined,
      quantity: quantity
    }, false);
    navigate('/checkout');
  };

  const handleCollectAddToBag = (e: React.MouseEvent, p: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: p.id,
      name: p.name,
      price: p.price,
      oldPrice: p.oldPrice,
      image: p.mainImage,
      size: 'M',
      quantity: 1
    }, false);
  };

  // مساعد لجلب طول الموديل المقترح (Model Height calculation)
  const getModelHeight = () => {
    const category = product?.category?.toLowerCase();
    const isWoman = category === 'woman' || category === 'women';
    
    if (isWoman) {
      switch(selectedSize) {
        case 'S': return 'Height: 155-160 cm';
        case 'M': return 'Height: 160-165 cm';
        case 'L': return 'Height: 165-170 cm';
        case 'XL': return 'Height: 170-175 cm';
        default: return 'Height: 160 cm';
      }
    } else {
      switch(selectedSize) {
        case 'S': return 'Height: 165-170 cm';
        case 'M': return 'Height: 170-175 cm';
        case 'L': return 'Height: 175-180 cm';
        case 'XL': return 'Height: 180-185 cm';
        default: return 'Height: 175 cm';
      }
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-500`}>
        <div className="w-12 h-12 border-4 border-[#0069A8] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-8 text-center transition-colors duration-500 ${theme === 'dark' ? 'text-white' : 'text-[#010520]'}`}>
        <h1 className="text-4xl font-black mb-4 uppercase tracking-tighter">Product Not Found</h1>
        <p className="opacity-60 mb-8">The product you are looking for does not exist or has been removed.</p>
        <Link to="/store" className="bg-[#0069A8] text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:opacity-90 transition-opacity">
          Back to Store
        </Link>
      </div>
    );
  }

  return (
    <div 
      className="relative min-h-screen w-full overflow-x-hidden font-sans transition-all duration-500" 
      dir="ltr" 
    >
      {/* Top Banner Marquee */}
      <div className="w-full bg-[#0069A8] py-1 overflow-hidden border-b border-white/10 relative z-[60]">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
          className="flex whitespace-nowrap"
        >
          {[...Array(15)].map((_, i) => (
            <span key={i} className="text-white font-bold tracking-[0.2em] text-[9px] md:text-[10px] px-3 uppercase">
              CLOAZ.68 - LOCAL CODE URBAN VIBE
            </span>
          ))}
        </motion.div>
      </div>

      <Navbar />

      <main className="pt-[80px] md:pt-[120px] pb-32 relative">
        {/* Sticky Bottom Bar for Mobile Only */}
        <div className={`md:hidden fixed bottom-1.5 left-1/2 -translate-x-1/2 w-[95%] backdrop-blur-md px-3 py-4 z-50 flex items-center gap-4 rounded-xl border shadow-[0_-4px_20px_rgba(0,0,0,0.08)] transition-all duration-500 bg-[var(--background-white)]/95 ${theme === 'dark' ? 'border-white/10' : 'border-[#0069A8]/10'}`}>
          <div className={`flex items-center rounded-lg overflow-hidden h-14 w-24 border transition-all duration-500 ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-[#0069A8]/10'} ${isOutOfStock ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={isOutOfStock}
              className={`flex-1 h-full flex items-center justify-center transition-colors ${theme === 'dark' ? 'text-white' : 'text-[#0069A8]'}`}
            >
              <Minus size={16} strokeWidth={3} />
            </button>
            <div className={`w-8 h-full flex items-center justify-center font-black text-2xl transition-colors ${theme === 'dark' ? 'text-white' : 'text-[#0069A8]'}`}>
              {isOutOfStock ? 0 : quantity}
            </div>
            <button 
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              disabled={isOutOfStock}
              className={`flex-1 h-full flex items-center justify-center transition-colors ${theme === 'dark' ? 'text-white' : 'text-[#0069A8]'}`}
            >
              <Plus size={16} strokeWidth={3} />
            </button>
          </div>

          <div className="flex-1 flex flex-col gap-1.5 h-14 justify-center">
            <button 
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full h-7 rounded-md font-black text-[10px] tracking-widest uppercase flex items-center justify-center transition-all ${isOutOfStock ? (theme === 'dark' ? 'opacity-40 cursor-not-allowed border-white/20 text-white/50' : 'opacity-40 cursor-not-allowed border-gray-300 text-gray-400') : (theme === 'dark' ? 'bg-transparent text-white border border-white/30 active:bg-white/10' : 'bg-white text-[#0069A8] border border-[#0069A8] active:bg-[#0069A8] active:text-white')}`}
            >
              {isOutOfStock ? 'OUT OF STOCK' : 'ADD TO CART'}
            </button>
            <button 
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className={`w-full h-7 rounded-md font-black text-[10px] tracking-widest uppercase flex items-center justify-center transition-all ${isOutOfStock ? (theme === 'dark' ? 'bg-white/10 text-white/40 cursor-not-allowed border border-white/10' : 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-200') : 'bg-[#0069A8] text-white active:opacity-90 border border-[#0069A8]'}`}
            >
              {isOutOfStock ? 'SOLD OUT' : 'BUY NOW'}
            </button>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block max-w-[1600px] mx-auto px-8 mb-16 md:mb-24 relative z-10">
          <div className="flex flex-row gap-12 lg:gap-16 items-start">
            {/* Left Column - Product Details */}
            <div className="w-full md:w-[35%] lg:w-[30%] text-left shrink-0">
              <div className="md:sticky md:top-[120px] space-y-6">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className={`font-black text-3xl md:text-5xl uppercase tracking-tighter leading-[0.9] text-left transition-colors ${theme === 'dark' ? 'text-white' : 'text-[#010520]'}`}>
                      {product.name}
                    </h1>
                    {isOutOfStock && (
                      <span className="bg-black text-white text-[10px] font-black px-3 py-1 rounded-full tracking-widest">SOLD OUT</span>
                    )}
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="flex items-baseline gap-3">
                      <span className={`font-bold text-xl md:text-3xl transition-colors ${theme === 'dark' ? 'text-white' : 'text-[#010520]'}`}>LE {product.price.toFixed(2)}</span>
                      {hasDiscount && (
                        <div className="flex flex-col">
                          <span className={`opacity-40 line-through text-sm md:text-lg transition-colors ${theme === 'dark' ? 'text-white' : 'text-[#010520]'}`}>LE {product.oldPrice?.toFixed(2)}</span>
                          <span className="text-[10px] font-black text-[#0069A8] uppercase tracking-tighter">
                            YOU SAVE LE {(product.oldPrice! - product.price).toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                    <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-right opacity-60 transition-colors ${theme === 'dark' ? 'text-white' : 'text-[#010520]'}`}>
                      <span className="underline decoration-1 underline-offset-4">SHIPPING</span> NOT CALCULATED.
                    </span>
                  </div>
                </div>

                <div className="pt-0">
                  <p className={`font-light text-xs md:text-[14px] leading-[1.8] opacity-90 uppercase tracking-normal transition-colors ${theme === 'dark' ? 'text-white' : 'text-[#010520]/80'}`}>
                    {product.description || "Premium heavyweight quality. Designed for daily comfort and street presence."}
                  </p>
                </div>

                {/* Product Options: Sizes, Colors, Quantity */}
                <div className="flex flex-col gap-8 pt-2">
                  {/* Sizes Selection */}
                  {product.sizes && product.sizes.length > 0 && (
                    <div className="space-y-4 pt-1 text-left">
                      <div className="flex items-center gap-4">
                        <span className={`font-black text-[10px] uppercase tracking-widest block font-sans transition-colors ${theme === 'dark' ? 'text-white/40' : 'text-[#010520]/50'}`}>SELECT SIZE</span>
                        
                        {/* Size Suggestion Box - Restored to original style */}
                        <AnimatePresence mode="wait">
                          <motion.div 
                            key={selectedSize}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className={`rounded-lg py-1.5 px-3 border transition-colors duration-500 scale-90 origin-left ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-[#010520]/[0.05] border-[#010520]/20'}`}
                          >
                            <p className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-3 transition-colors ${theme === 'dark' ? 'text-white' : 'text-[#010520]'}`}>
                              <span className="opacity-60 text-[8px]">Suggestion: {selectedSize}</span>
                              <span className="opacity-100">{getModelHeight()}</span>
                            </p>
                          </motion.div>
                        </AnimatePresence>
                      </div>
                      
                      <div className="flex gap-3 justify-start">
                        {product.sizes.map((size) => {
                          const isSelected = selectedSize === size;
                          return (
                            <button
                              key={size}
                              onClick={() => setSelectedSize(size)}
                              className={`
                                w-14 h-14 flex items-center justify-center border-2 font-black transition-all duration-300 rounded-lg text-base
                                ${isSelected 
                                  ? 'border-[#0069A8] bg-[#0069A8] text-white shadow-lg shadow-[#0069A8]/20 scale-105'
                                  : (theme === 'dark' ? 'border-white/10 text-white hover:border-white/40' : 'border-black/10 text-[#010520] hover:border-[#0069A8]')} 
                              `}
                            >
                              {size}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap items-end gap-10">
                    {/* Colors Selection */}
                    {product.colors && product.colors.length > 0 && (
                      <div className="flex flex-col gap-3 text-left">
                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${theme === 'dark' ? 'text-white/40' : 'text-[#010520]/50'}`}>Color</span>
                        <div className="flex flex-wrap gap-3">
                          {product.colors.map((color) => (
                            <button
                              key={color}
                              onClick={() => setSelectedColor(color)}
                              className={`w-8 h-8 rounded-full border-2 transition-all duration-300 flex items-center justify-center p-0.5
                                ${selectedColor === color 
                                  ? 'border-[#0069A8]'
                                  : 'border-transparent'
                                }
                              `}
                            >
                              <div 
                                className="w-full h-full rounded-full border border-black/5 shadow-sm" 
                                style={{ backgroundColor: color }} 
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quantity Selector */}
                    <div className="flex flex-col gap-3 text-left">
                      <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${theme === 'dark' ? 'text-white/40' : 'text-[#010520]/50'}`}>Quantity</span>
                      <div className={`flex items-center h-10 border-[1.5px] rounded-sm transition-all overflow-hidden ${theme === 'dark' ? 'border-white/20' : 'border-[#0069A8]/20'}`}>
                        <button 
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          disabled={isOutOfStock}
                          className={`w-9 h-full flex items-center justify-center transition-colors hover:bg-black/5 ${theme === 'dark' ? 'text-white' : 'text-[#010520]'} ${isOutOfStock ? 'opacity-20' : ''}`}
                        >
                          <Minus size={16} />
                        </button>
                        <div className={`w-11 h-full flex items-center justify-center font-black text-sm ${theme === 'dark' ? 'bg-white text-black' : 'bg-[#0069A8] text-white'}`}>
                          {isOutOfStock ? 0 : quantity}
                        </div>
                        <button 
                          onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                          disabled={isOutOfStock || quantity >= product.stock}
                          className={`w-9 h-full flex items-center justify-center transition-colors hover:bg-black/5 ${theme === 'dark' ? 'text-white' : 'text-[#010520]'} ${isOutOfStock ? 'opacity-20' : ''}`}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Delivery & Returns Info - Minimal Icons Row */}
                  <div className={`pt-2 flex flex-wrap gap-6 transition-colors ${theme === 'dark' ? 'text-white/40' : 'text-[#010520]/50'}`}>
                    <div className="flex items-center gap-2 font-bold text-[9px] uppercase tracking-widest">
                      <Truck size={14} strokeWidth={2.5} />
                      <span>3-4 Days Delivery</span>
                    </div>
                    <div className="flex items-center gap-2 font-bold text-[9px] uppercase tracking-widest">
                      <RefreshCw size={14} strokeWidth={2.5} />
                      <span>2 Days Return</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 pt-2">
                  <button 
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`w-full rounded-full py-3 font-black text-[11px] md:text-[13px] tracking-[0.2em] uppercase transition-all duration-300 ${isOutOfStock ? (theme === 'dark' ? 'bg-white/5 text-white/40 border-white/10 cursor-not-allowed' : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed') : (theme === 'dark' ? 'border border-white text-white hover:bg-white hover:text-black' : 'border border-[#0069A8] text-[#0069A8] hover:bg-[#0069A8] hover:text-white')}`}
                  >
                    {isOutOfStock ? 'OUT OF STOCK' : 'ADD TO CART'}
                  </button>
                  
                  <button 
                    onClick={handleBuyNow}
                    disabled={isOutOfStock}
                    className={`w-full border rounded-full py-3.5 flex items-center justify-center gap-2 group transition-all duration-300 shadow-lg ${isOutOfStock ? 'opacity-40 grayscale cursor-not-allowed' : 'active:opacity-90'} bg-[#0069A8] border-[#0069A8] text-white shadow-[#0069A8]/10 hover:bg-[#0069A8]/90`}
                  >
                    <span className={`font-black tracking-widest italic text-base md:text-lg uppercase text-white`}>
                      {isOutOfStock ? 'SOLD OUT' : 'DIRECTLY BUY'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Large Main Image */}
            <div className="w-full md:flex-1">
              <div className="w-full overflow-hidden flex items-center justify-center">
                <img 
                  src={product.mainImage} 
                  alt={product.name} 
                  className="w-full h-auto object-cover transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>

          <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 pt-16">
            {/* 2 - 2 Layout for Desktop (Skipping the first redundant image) */}
            <div className="grid grid-cols-2 gap-8 md:gap-16 lg:gap-20">
              {product.detailImages && product.detailImages.slice(1).map((img, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="w-full overflow-hidden flex items-center justify-center bg-transparent col-span-1"
                >
                  <img 
                    src={img} 
                    alt={`${product.name} detail ${index + 2}`} 
                    className="w-full h-auto object-contain rounded-2xl"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

    {/* Branding Banner Section (Restored) */}
    <section className="hidden">
      {/* Intentionally removed as per user request */}
    </section>

        {/* Mobile Layout */}
        <div className="md:hidden px-4 space-y-8 relative z-10">
            <div className="space-y-2">
            <h1 className={`font-black text-3xl uppercase tracking-tighter leading-tight transition-colors ${theme === 'dark' ? 'text-white' : 'text-[#010520]'}`}>
              {product.name}
            </h1>
            <div className="flex items-center gap-3">
              <span className={`font-bold text-xl md:text-2xl transition-colors ${theme === 'dark' ? 'text-white' : 'text-[#010520]'}`}>LE {product.price.toFixed(2)}</span>
              {hasDiscount && (
                <span className={`line-through text-sm opacity-40 transition-colors ${theme === 'dark' ? 'text-white' : 'text-[#010520]'}`}>LE {product.oldPrice?.toFixed(2)}</span>
              )}
              {isOutOfStock && (
                <span className="bg-black text-white text-[8px] font-black px-2 py-0.5 rounded-full tracking-widest uppercase">SOLD OUT</span>
              )}
            </div>
          </div>

          {/* Product Options for Mobile */}
          <div className="flex flex-col gap-6 pt-2">
            {/* Sizes Selection Mobile */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="flex flex-col gap-4 text-left">
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${theme === 'dark' ? 'text-white/40' : 'text-[#010520]/50'}`}>Size</span>
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={selectedSize}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`rounded-lg py-1 px-3 border scale-90 origin-left transition-colors duration-500 ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-[#010520]/5 border-[#010520]/20'}`}
                    >
                      <div className={`font-black text-[9px] uppercase tracking-widest flex items-center gap-3 transition-colors ${theme === 'dark' ? 'text-white' : 'text-[#010520]'}`}>
                        <span className="opacity-70 text-[8px]">Suggestion: {selectedSize}</span>
                        <span className="font-black">{getModelHeight()}</span>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="flex flex-wrap gap-2.5 focus:outline-none">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 flex items-center justify-center border-2 transition-all duration-300 font-bold text-[14px] rounded-lg
                        ${selectedSize === size 
                          ? 'border-[#0069A8] bg-[#0069A8] text-white shadow-xl shadow-[#0069A8]/20'
                          : (theme === 'dark' ? 'border-white/10 text-white' : 'border-black/10 text-[#010520]')
                        }
                      `}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-x-4 gap-y-6">
              {/* Colors Selection Mobile */}
              {product.colors && product.colors.length > 0 && (
                <div className="flex flex-col gap-2.5 text-left">
                  <span className={`text-[9px] font-black uppercase tracking-[0.2em] transition-colors ${theme === 'dark' ? 'text-white/40' : 'text-[#010520]/50'}`}>Color</span>
                  <div className="flex flex-wrap gap-2.5 focus:outline-none">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all duration-300 flex items-center justify-center p-0.5
                          ${selectedColor === color 
                            ? 'border-[#0069A8]'
                            : 'border-transparent'
                          }
                        `}
                      >
                        <div 
                          className="w-full h-full rounded-full border border-black/5" 
                          style={{ backgroundColor: color }} 
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Delivery Info row for mobile */}
            <div className={`flex items-center gap-4 py-2 transition-colors ${theme === 'dark' ? 'text-white/40' : 'text-[#010520]/50'}`}>
               <div className="flex items-center gap-1.5 font-bold text-[8px] uppercase tracking-widest">
                  <Truck size={12} strokeWidth={3} />
                  <span>3-4 Days</span>
               </div>
               <div className="flex items-center gap-1.5 font-bold text-[8px] uppercase tracking-widest">
                  <RefreshCw size={12} strokeWidth={3} />
                  <span>2 Days Return</span>
               </div>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <button 
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className={`flex-1 h-12 flex items-center justify-center uppercase font-black text-[12px] tracking-[0.2em] transition-all rounded-xl ${isOutOfStock ? (theme === 'dark' ? 'bg-[#1A1A24] text-white/30 border border-white/5 cursor-not-allowed' : 'bg-[#F2F2F2] text-gray-400 border border-gray-200 cursor-not-allowed shadow-none') : 'bg-[#0069A8] text-white shadow-lg shadow-[#0069A8]/20 active:scale-95'}`}
            >
              {isOutOfStock ? 'SOLD OUT' : 'BUY NOW'}
            </button>
          </div>

          <div className="w-full overflow-hidden flex items-center justify-center py-4">
            <img 
              src={product.mainImage} 
              alt={product.name} 
              className="w-full h-auto object-contain scale-110"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="space-y-4">
            <span className={`font-black text-[11px] uppercase tracking-[0.3em] block border-b pb-3 transition-colors ${theme === 'dark' ? 'text-white border-white/10' : 'text-[#010520] border-[#010520]/10'}`}>PRODUCT DESCRIPTION</span>
            <p className={`font-medium text-[15px] leading-[1.8] text-right tracking-[0.02em] opacity-95 transition-colors ${theme === 'dark' ? 'text-white' : 'text-[#010520]'}`} style={{ direction: 'rtl' }}>
              {product.description}
            </p>

            {/* Delivery & Returns Info Mobile - Moved under description */}
            <div className={`grid grid-cols-2 gap-3 pt-2 transition-colors ${theme === 'dark' ? 'text-white' : 'text-[#010520]'}`}>
              <div className={`flex flex-col gap-1 items-center justify-center border rounded-xl py-3.5 px-2 bg-white/5 text-center transition-all active:scale-95 duration-500 ${theme === 'dark' ? 'border-white/10' : 'border-[#0069A8]/10'}`}>
                <Truck size={16} strokeWidth={2.5} />
                <span className="font-black text-[8px] uppercase tracking-widest leading-tight">Delivery in<br/>3 to 4 days</span>
              </div>
              <div className={`flex flex-col gap-1 items-center justify-center border rounded-xl py-3.5 px-2 bg-white/5 text-center transition-all active:scale-95 duration-500 ${theme === 'dark' ? 'border-white/10' : 'border-[#0069A8]/10'}`}>
                <RefreshCw size={16} strokeWidth={2.5} />
                <span className="font-black text-[8px] uppercase tracking-widest leading-tight">Returns within<br/>two days only</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8 pt-6 pb-12">
            {product.detailImages && product.detailImages.slice(1).map((img, index) => (
              <div 
                key={index} 
                className="w-full overflow-hidden flex items-center justify-center rounded-[24px] bg-transparent"
              >
                <img 
                  src={img} 
                  alt={`${product.name} detail ${index + 2}`} 
                  className="w-full h-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Collect For You Section */}
      <section className={`w-full py-4 md:py-8 border-t transition-colors duration-500 ${theme === 'dark' ? 'border-white/10' : 'border-[#0069A8]/10'}`}>
        <div className="w-full px-3 md:px-8">
          <div className="mb-4 md:mb-6">
            <Link to="/store" className="inline-block group">
              <h3 className={`font-semibold text-xl md:text-3xl lg:text-4xl tracking-[0.05em] uppercase transition-colors ${theme === 'dark' ? 'text-white hover:text-[#0069A8]' : 'text-[#010520] hover:text-[#007BC4]'}`}>
                / Collect For You
              </h3>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            {featuredProducts.length > 0 && featuredProducts.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
