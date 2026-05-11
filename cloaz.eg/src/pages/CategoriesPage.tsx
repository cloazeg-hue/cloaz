import { motion } from "motion/react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { ChevronRight } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

// ==========================================
// بيانات التصنيفات الثابتة
// ==========================================
const CATEGORIES_DATA = [
  { id: 1, name: 'MAN', image: '/assets/images/categories/man.png', description: 'Premium Streetwear & Urban Essentials', path: '/store?cat=MAN' },
  { id: 2, name: 'WOMEN', image: '/assets/images/categories/women.png', description: 'Curated Outfits for Modern Living', path: '/store?cat=WOMEN' },
  { id: 4, name: 'SHOES & BAGS', image: '/assets/images/categories/bag.png', description: 'Functional Gear & Footwear', path: '/store?cat=SHOES & BAGS' },
  { id: 5, name: 'ACCESSORIES', image: '/assets/images/categories/acseerios.png', description: 'Final Touches for the Perfect Vibe', path: '/store?cat=ACCESSORIES' },
  { id: 6, name: 'PERFUME', image: '/assets/images/categories/perfum.png', description: 'Signature Scents of the City', path: '/store?cat=PERFUME' },
];

// ==========================================
// صفحة التصنيفات (Categories Page)
// ==========================================
export default function CategoriesPage() {
  const { theme } = useTheme();
  return (
    <div 
      className="relative min-h-screen w-full overflow-x-hidden font-sans transition-all duration-500" 
      dir="ltr" 
    >
      {/* Top Marquee */}
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

      <main className="pt-[100px] md:pt-[140px] px-3 md:px-8 pb-20">
        <header className="mb-12 md:mb-20 relative z-40">
            <div className="w-full relative mb-8">
            <img 
              src="/assets/images/banners/branding catogry.svg" 
              alt="CLOAZ Categories Branding" 
              className={`w-full h-auto object-contain transition-all duration-500 opacity-100 ${theme === 'dark' ? 'brightness-0 invert' : ''}`}
              referrerPolicy="no-referrer"
              fetchPriority="high"
              loading="eager"
            />
          </div>
          <p className="text-[var(--text-dark-blue)] opacity-60 text-sm md:text-lg max-w-2xl font-light transition-colors">
            Explore our diverse ranges. From core apparel to signature scents, find the pieces that define your urban identity.
          </p>
        </header>

        <section className="flex flex-col gap-4 md:gap-8">
          {/* Row 1: 2 Items (Man, Woman) */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-6">
            {CATEGORIES_DATA.slice(0, 2).map((cat) => (
              <Link 
                to={cat.path} 
                key={cat.id}
                className={`group relative overflow-hidden rounded-[20px] aspect-[4/5] md:aspect-[16/9] transition-all duration-500 ${theme === 'dark' ? 'bg-white/20' : 'bg-white border border-[#010520]/5'}`}
              >
                <div className="absolute inset-0 z-0">
                  <img src={cat.image} alt={cat.name} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#010520]/60 via-[#010520]/10 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                </div>
                {/* Content Panel - Anchored Bottom, Stable Hover */}
                <div className="absolute inset-0 p-4 md:p-8 z-10 flex flex-col justify-end transition-all duration-500">
                  <div className="relative z-10">
                    <h2 className="text-white font-bold text-lg md:text-3xl lg:text-4xl uppercase tracking-tight mb-0 group-hover:mb-2 transition-all duration-500">
                      {cat.name}
                    </h2>
                    <div className="max-h-0 opacity-0 group-hover:max-h-[150px] group-hover:opacity-100 transition-all duration-500 ease-in-out overflow-hidden">
                      <p className="text-white/90 text-[10px] md:text-sm lg:text-base font-light mb-4 max-w-[150px] md:max-w-[400px] leading-tight">
                        {cat.description}
                      </p>
                      <div className="flex items-center gap-2 px-3 md:px-5 py-1.5 md:py-2.5 bg-white text-[#0069A8] rounded-full font-bold text-[8px] md:text-xs tracking-widest uppercase shadow-xl w-fit mb-2">
                        Shop Collection <ChevronRight size={12} className="md:w-3.5 md:h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Row 2: 1 Large Item (Shoes and Bag) */}
          <div className="grid grid-cols-1">
            {CATEGORIES_DATA.slice(2, 3).map((cat) => (
              <Link 
                to={cat.path} 
                key={cat.id}
                className={`group relative overflow-hidden rounded-[20px] aspect-[2/1] md:aspect-[3/1] transition-all duration-500 ${theme === 'dark' ? 'bg-white/20' : 'bg-white border border-[#010520]/5'}`}
              >
                <div className="absolute inset-0 z-0">
                  <img src={cat.image} alt={cat.name} loading="lazy" decoding="async" className="w-full h-full object-cover object-bottom transition-transform duration-1000 group-hover:scale-105" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                </div>
                {/* Content Panel - Anchored Bottom, Stable Hover */}
                <div className="absolute inset-0 p-6 md:p-12 z-10 flex flex-col justify-end transition-all duration-500">
                  <div className="relative z-10">
                    <h2 className="text-white font-bold text-2xl md:text-6xl lg:text-8xl uppercase tracking-tighter mb-0 group-hover:mb-4 transition-all duration-500">
                      {cat.name}
                    </h2>
                    <div className="max-h-0 opacity-0 group-hover:max-h-[200px] group-hover:opacity-100 transition-all duration-500 ease-in-out overflow-hidden">
                      <p className="text-white/90 text-sm md:text-lg lg:text-xl font-light mb-6 md:mb-8 max-w-xs md:max-w-xl leading-snug">
                        {cat.description}
                      </p>
                      <div className="flex items-center gap-2 px-6 md:px-10 py-2 md:py-4 bg-white text-[#0069A8] rounded-full font-bold text-[10px] md:text-sm tracking-widest uppercase shadow-xl w-fit mb-4">
                        View Collection <ChevronRight size={18} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Row 3: 2 Items (Accessories, Perfume) */}
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {CATEGORIES_DATA.slice(3, 5).map((cat) => (
              <Link 
                to={cat.path} 
                key={cat.id}
                className={`group relative overflow-hidden rounded-[20px] aspect-[4/5] md:aspect-[16/9] transition-all duration-500 ${theme === 'dark' ? 'bg-white/20' : 'bg-white border border-[#010520]/5'}`}
              >
                <div className="absolute inset-0 z-0">
                  <img src={cat.image} alt={cat.name} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" referrerPolicy="no-referrer" />
                  {/* Natural shading: using a subtle gradient overlay instead of a solid dark block */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent group-hover:from-black/60 transition-all duration-500" />
                </div>
                {/* Content Panel - Anchored Bottom, Stable Hover */}
                <div className="absolute inset-0 p-4 md:p-10 z-10 flex flex-col justify-end transition-all duration-500">
                  <div className="relative z-10">
                    <h2 className="text-white font-bold text-lg md:text-3xl lg:text-4xl uppercase tracking-tight mb-0 group-hover:mb-3 transition-all duration-500">
                      {cat.name}
                    </h2>
                    <div className="max-h-0 opacity-0 group-hover:max-h-[150px] group-hover:opacity-100 transition-all duration-500 ease-in-out overflow-hidden">
                      <p className="text-white/90 text-[10px] md:text-sm lg:text-lg font-light mb-4 md:mb-6 max-w-[150px] md:max-w-md leading-tight md:leading-normal">
                        {cat.description}
                      </p>
                      <div className="flex items-center gap-2 px-3 md:px-7 py-1.5 md:py-3 bg-white text-[#0069A8] rounded-full font-bold text-[8px] md:text-xs tracking-widest uppercase shadow-xl w-fit mb-3">
                        Shop Collection <ChevronRight size={14} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
