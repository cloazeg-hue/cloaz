import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ProductCard from "../components/products/ProductCard";
import { fetchAllProducts, subscribeToProducts } from "../services/productService";
import { Product } from "../types";
import { useTheme } from "../context/ThemeContext";

const CATEGORIES = [
  'ALL',
  'MAN',
  'WOMEN',
  'SHOES & BAGS',
  'ACCESSORIES',
  'PERFUME'
];

const BRANDING_IMAGES: Record<string, string> = {
  'ALL': '/assets/images/banners/branding store.svg',
  'MAN': '/assets/images/banners/branding store.svg',
  'WOMEN': '/assets/images/banners/branding store.svg',
  'SHOES & BAGS': '/assets/images/banners/branding store.svg',
  'ACCESSORIES': '/assets/images/banners/branding store.svg',
  'PERFUME': '/assets/images/banners/branding store.svg'
};

export default function StorePage() {
  const { theme } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cat = searchParams.get('cat')?.toUpperCase();
    if (cat) {
      if (cat === 'MEN' || cat === 'MAN') {
        setActiveCategory('MAN');
      } else if (cat === 'SHOES AND BAG' || cat === 'SHOES&BAG' || cat === 'SHOES & BAGS' || cat === 'SHOES_BAGS') {
        setActiveCategory('SHOES & BAGS');
      } else if (CATEGORIES.includes(cat) || (cat === 'PERFUM' && CATEGORIES.includes('PERFUME'))) {
        setActiveCategory(cat === 'PERFUM' ? 'PERFUME' : cat);
      } else {
        setActiveCategory('ALL');
      }
    } else {
      setActiveCategory('ALL');
    }
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    let catFormatted = activeCategory;
    const unsubscribe = subscribeToProducts((data) => {
      // The service already filters the data based on activeCategory
      setFilteredProducts(data);
      // We also store it in allProducts just so everything remains compatible, but we mainly rely on filteredProducts
      setAllProducts(data); 
      setLoading(false);
    }, catFormatted);

    return () => unsubscribe();
  }, [activeCategory]);

  const handleCategoryClick = (cat: string) => {
    setSearchParams({ cat });
  };

  return (
    <div 
      className="relative min-h-screen w-full overflow-x-hidden font-sans transition-all duration-500" 
      dir="ltr" 
    >
      {/* 1. شريط الإعلانات العلوي (Top Marquee) */}
      <div className={`w-full py-1 overflow-hidden relative z-[60] bg-[#0069A8]`}>
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
          className="flex whitespace-nowrap"
        >
          {[...Array(15)].map((_, i) => (
            <span key={i} className="text-white font-science font-bold tracking-[0.2em] text-[9px] md:text-[10px] px-3 uppercase">
              CLOAZ.68 - LOCAL CODE URBAN VIBE
            </span>
          ))}
        </motion.div>
      </div>

      <Navbar />

      <main className="pt-[100px] md:pt-[140px] px-3 md:px-8">
        {/* Branding Section */}
        <section className="w-full mb-12 md:mb-20 px-3 md:px-8 relative z-40">
          {/* The Large Branding Image */}
          <div className="w-full relative mb-8">
            <img 
              src={BRANDING_IMAGES[activeCategory]} 
              alt="CLOAZ Store Branding" 
              className={`w-full h-auto object-contain transition-all duration-500 opacity-100 ${theme === 'dark' ? 'brightness-0 invert' : ''}`}
              referrerPolicy="no-referrer"
              fetchPriority="high"
              loading="eager"
            />
          </div>
          
          {/* Category Filter Sub-nav */}
          <div className="w-full mt-8 md:mt-12 py-2">
            <div className="grid grid-cols-3 md:flex md:flex-row md:justify-center gap-2 md:gap-x-6 lg:gap-x-16">
              {CATEGORIES.map((cat) => (
                <button 
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`text-base md:text-lg lg:text-3xl tracking-tighter transition-all py-1 flex items-center justify-center md:justify-start
                    ${activeCategory === cat 
                      ? (theme === 'dark' ? 'text-[#0069A8]' : 'text-[#010520]')
                      : (theme === 'dark' ? 'text-white' : 'text-[#1a1a1a]')}`}
                >
                  /{cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Product Grid */}
        <section className="mb-20">
          {loading ? (
             <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-100 animate-pulse rounded-xl" />
                ))}
             </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 px-0">
               {filteredProducts.length > 0 ? (
                 filteredProducts.map((product) => (
                   <ProductCard key={product.id} product={product} />
                 ))
               ) : (
                 <div className="col-span-full py-20 text-center">
                   <p className="text-[var(--text-dark-blue)] opacity-40 italic">No items found in this section.</p>
                 </div>
               )}
            </div>
          )}
        </section>
      </main>

      <Footer />

      {/* Connection Status Indicator */}
      <div className={`fixed bottom-4 left-4 z-[9999] backdrop-blur-sm px-3 py-1 rounded-full border flex items-center gap-2 shadow-sm pointer-events-none transition-colors duration-500 ${theme === 'dark' ? 'bg-black/40 border-white/10' : 'bg-white/80 border-[#0069A8]/20'}`}>
        <div className={`w-2 h-2 rounded-full ${allProducts.length > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
        <span className="text-[10px] font-bold text-[#0069A8] uppercase tracking-widest">
          {allProducts.length > 0 ? `${allProducts.length} ITEMS READY` : 'DB SYNCING...'}
        </span>
      </div>
    </div>
  );
}
