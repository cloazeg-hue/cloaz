import React, { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ProductCard from "../components/products/ProductCard";
import { subscribeToProducts, subscribeToUnderVideoByGender } from "../services/productService";
import { Product } from "../types";
import { useTheme } from "../context/ThemeContext";

// ==========================================
// قسم شريط المنتجات المميزة (Featured Carousel)
// ==========================================
const FeaturedCarousel = ({ title, subtitle, items, autoPlay = true }: { title?: string, subtitle: string, items: any[], autoPlay?: boolean }) => {
  const { theme } = useTheme();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isInteracting, setIsInteracting] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const totalItems = items.length;

  const handleScroll = () => {
    if (scrollRef.current && scrollRef.current.children.length > 0) {
      const el = scrollRef.current;
      const scrollPos = el.scrollLeft;
      const firstChild = el.children[0] as HTMLElement;
      
      let closestIndex = 1;
      let minDiff = Infinity;
      
      Array.from(el.children).forEach((child, index) => {
        const node = child as HTMLElement;
        const relativeLeft = node.offsetLeft - firstChild.offsetLeft;
        const diff = Math.abs(relativeLeft - scrollPos);
        
        if (diff < minDiff) {
          minDiff = diff;
          closestIndex = index;
        }
      });
      
      setCurrentIndex((closestIndex % totalItems) + 1);

      // Handle seamless infinite loop
      if (el.children.length >= totalItems * 2) {
        const setWidth = (el.children[totalItems] as HTMLElement).offsetLeft - firstChild.offsetLeft;
        
        if (scrollPos >= setWidth * 2) {
          el.scrollLeft -= setWidth;
        } else if (scrollPos < setWidth * 0.5) {
          el.scrollLeft += setWidth;
        }
      }
    }
  };

  // Initialize scroll position to the second set to allow immediate left scrolling
  useEffect(() => {
    if (scrollRef.current && scrollRef.current.children.length >= totalItems) {
      const el = scrollRef.current;
      const firstChild = el.children[0] as HTMLElement;
      const setWidth = (el.children[totalItems] as HTMLElement).offsetLeft - firstChild.offsetLeft;
      // Wrap it in setTimeout to ensure browser has painted layout
      setTimeout(() => {
        if (el.scrollLeft < 10) {
          el.scrollLeft = setWidth;
        }
      }, 50);
    }
  }, [items]);

  const scrollLeft = () => {
    if (scrollRef.current && scrollRef.current.children.length > 0) {
      const itemWidth = (scrollRef.current.children[0] as HTMLElement).offsetWidth;
      const gap = parseInt(window.getComputedStyle(scrollRef.current).gap) || 0;
      scrollRef.current.scrollBy({ left: -(itemWidth + gap), behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current && scrollRef.current.children.length > 0) {
      const itemWidth = (scrollRef.current.children[0] as HTMLElement).offsetWidth;
      const gap = parseInt(window.getComputedStyle(scrollRef.current).gap) || 0;
      scrollRef.current.scrollBy({ left: itemWidth + gap, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (!autoPlay || isInteracting) return;
    
    let animationFrameId: number;
    let lastTime = performance.now();
    const speed = 0.5; // pixels per frame
    
    const scroll = (time: number) => {
      const deltaTime = time - lastTime;
      if (deltaTime > 16) { 
        if (scrollRef.current) {
          scrollRef.current.scrollLeft += speed;
        }
        lastTime = time;
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, [autoPlay, isInteracting]);

  // Handle click for mobile interactions (double tap)
  const handleItemClick = (e: React.MouseEvent, idx: number, dest: string) => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      if (hoveredIndex === idx) {
        // Second click, navigation proceeds naturally
      } else {
        // First click, show hover state and prevent default
        e.preventDefault();
        setHoveredIndex(idx);
      }
    }
  };

  // Duplicate items for infinite scroll
  const extendedItems = [...items, ...items, ...items, ...items];

  return (
    <div 
      className="w-full relative"
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => setIsInteracting(false)}
      onTouchStart={() => setIsInteracting(true)}
      onTouchEnd={() => setIsInteracting(false)}
    >
      <div className="flex flex-col gap-1 md:gap-2 mb-4 md:mb-5 relative z-40 px-3 md:px-8 w-full">
        {title && (
          <h3 className="text-[var(--text-dark-blue)] opacity-95 font-science font-semibold text-base sm:text-lg md:text-3xl lg:text-4xl tracking-[0.02em] md:tracking-[0.05em] uppercase transition-colors break-words py-1">
            {title}
          </h3>
        )}
        <div className="flex justify-between items-center w-full">
          <h4 className="text-[#0069A8] font-science font-black text-xs sm:text-sm md:text-lg lg:text-xl tracking-[0.1em] uppercase transition-colors">
            {subtitle}
          </h4>

          <div className="flex items-center gap-2 md:gap-3 text-[var(--text-dark-blue)] transition-all">
            <button onClick={scrollLeft} className="opacity-70 hover:opacity-100 transition-transform active:scale-95 p-1">
            <ChevronLeft size={20} strokeWidth={2} className="md:w-[26px] md:h-[26px]" />
          </button>
          <div className="font-science flex items-baseline gap-0.5 justify-center min-w-[3.5ch] md:min-w-[4ch]">
            <span className="text-xl md:text-3xl font-black tracking-tighter">
              {currentIndex}
            </span>
            <span className="opacity-40 text-xs md:text-base font-bold tracking-tighter ml-0.5">
              /{totalItems}
            </span>
          </div>
          <button onClick={scrollRight} className="opacity-70 hover:opacity-100 transition-transform active:scale-95 p-1">
            <ChevronRight size={20} strokeWidth={2} className="md:w-[26px] md:h-[26px]" />
          </button>
        </div>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto gap-2.5 pb-8 no-scrollbar snap-x snap-mandatory px-3 md:px-8 relative"
      >
        {extendedItems.map((item, idx) => (
          <Link 
            key={idx} 
            to={`/product/${item.id || '1'}`} 
            onClick={(e) => handleItemClick(e, idx, `/product/${item.id || '1'}`)}
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="shrink-0 w-[47%] sm:w-[31%] md:w-[28%] lg:w-[23%] group snap-start flex flex-col gap-2 md:gap-3 cursor-pointer"
          >
            <div className="aspect-[4/5] rounded-xl md:rounded-2xl overflow-hidden relative">
              {item.isSale && (
                <div className="absolute top-2 left-1 z-30">
                  <span className="text-[#0069A8] font-science font-black text-[14px] md:text-[18px] tracking-widest uppercase">
                    SALE
                  </span>
                </div>
              )}
              {/* Main Image */}
              <img 
                src={item.src} 
                alt={item.title} 
                loading="lazy"
                decoding="async"
                className={`w-full h-full absolute inset-0 object-cover object-[center_30%] transition-opacity duration-500 ${hoveredIndex === idx ? 'opacity-0' : 'group-hover:opacity-0'} ${theme === 'dark' ? 'brightness-110 contrast-125' : ''}`}
                referrerPolicy="no-referrer"
              />
              {/* Hover Image */}
              <div className={`absolute inset-0 transition-opacity duration-500 ${hoveredIndex === idx ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                <img 
                  src={item.hoverSrc || item.src} 
                  alt={item.title} 
                  loading="lazy"
                  decoding="async"
                  className={`w-full h-full object-cover object-[center_30%] transition-transform duration-700 ${hoveredIndex === idx ? 'scale-105' : 'group-hover:scale-105'} ${theme === 'dark' ? 'brightness-110 contrast-125' : ''}`}
                  referrerPolicy="no-referrer"
                />
              </div>
              
              {item.isSoldOut && (
                <div className="absolute top-2 left-2 z-30 flex items-center justify-center pointer-events-none">
                  <div className="bg-black/80 text-white font-science font-black text-[10px] md:text-xs tracking-[0.2em] uppercase py-1.5 px-3 rounded-full shadow-lg">
                    SOLD OUT
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col text-left px-1 md:mt-2">
              <span className="text-[12px] md:text-sm font-bold uppercase tracking-wider truncate text-[var(--text-dark-blue)] opacity-95 mb-0.5 transition-colors">
                {item.title}
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="text-[13px] md:text-[15px] font-bold text-[var(--text-dark-blue)] transition-colors">
                  LE {item.price.toFixed(2)} EGP
                </span>
                {item.isSale && item.oldPrice && (
                  <span className="text-[11px] md:text-[13px] font-normal line-through opacity-60 text-[var(--text-dark-blue)] transition-colors leading-none">
                    LE {item.oldPrice.toFixed(2)} EGP
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// الصفحة الرئيسية (HomePage)
// ==========================================
export default function HomePage() {
  const { theme } = useTheme();
  const [bestForYou, setBestForYou] = useState<Product[]>([]);
  const [menProducts, setMenProducts] = useState<any[]>([]);
  const [womenProducts, setWomenProducts] = useState<any[]>([]);
  const [unisexProducts, setUnisexProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 2. جلب المنتجات المميزة (Boolean=true) للقسم السفلي
    const unsubAll = subscribeToProducts((all) => {
      const filtered = all.filter(p => p.isFeatured === true);
      setBestForYou(filtered);
      setLoading(false);
    });

    const formatCarouselItem = (p: Product) => ({
      id: p.id,
      src: p.mainImage,
      hoverSrc: p.hovering || p.mainImage,
      title: p.name,
      price: p.price,
      oldPrice: p.oldPrice,
      isSale: !!p.oldPrice && p.oldPrice > p.price,
      isSoldOut: p.stock === 0
    });

    const unsubMen = subscribeToUnderVideoByGender("men", (data) => {
      setMenProducts(data.map(formatCarouselItem));
    });

    const unsubWomen = subscribeToUnderVideoByGender("women", (data) => {
      setWomenProducts(data.map(formatCarouselItem));
    });

    const unsubUnisex = subscribeToUnderVideoByGender("unisex", (data) => {
      setUnisexProducts(data.map(formatCarouselItem));
    });

    return () => {
      unsubAll();
      unsubMen();
      unsubWomen();
      unsubUnisex();
    };
  }, []);

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

      {/* 2. قسم الترحيب الرئيسي (Hero Section) */}
      <div className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="/assets/images/banners/vidheader.png"
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          >
            <source src="/assets/videos/vidhead.mp4" type="video/mp4" />
            <img
              src="/assets/images/banners/vidheader.png"
              alt="Hero Background"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-center"
            />
          </video>
        </div>

        <div className="relative flex flex-col h-full w-full">
          <motion.section 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="w-full shrink-0 flex justify-center items-center h-[140px] sm:h-[200px] md:h-[300px] lg:h-[380px] mt-0 sm:mt-2 md:-mt-8 lg:-mt-10 relative z-10 px-0"
          >
            <Link to="/" className="w-full h-full block">
               <img 
                 src={theme === 'dark' ? "/assets/images/icons/Exclude dark.svg" : "/assets/images/icons/Exclude.svg"} 
                 alt="CLOAZ Branding" 
                 loading="lazy"
                 decoding="async"
                 className="w-full h-full object-fill transition-all duration-1000 hover:scale-[1.02] active:scale-95" 
                 referrerPolicy="no-referrer"
               />
            </Link>
          </motion.section>

          <div className="flex-1 w-full"></div>
        </div>
      </div>
      
      {/* 3. قسم مجموعة المنتجات (Product Collection Section) */}
      <section className="w-full pt-6 pb-4 md:pt-8 md:pb-6 overflow-hidden">
        <div className="w-full space-y-8 md:space-y-12">
          {menProducts.length > 0 && (
            <FeaturedCarousel 
              title="/ Featured Collection"
              subtitle="Vur Man"
              autoPlay={true}
              items={menProducts}
            />
          )}

          {womenProducts.length > 0 && (
            <FeaturedCarousel 
              subtitle="Vur Girls"
              autoPlay={true}
              items={womenProducts}
            />
          )}

          {unisexProducts.length > 0 && (
            <FeaturedCarousel 
              subtitle="Unisix"
              autoPlay={true}
              items={unisexProducts}
            />
          )}
        </div>
      </section>

      {/* 4. قسم التصنيفات (Category Section) */}
      <section id="category" className="w-full py-2 md:py-4">
        <div className="w-full px-3 md:px-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-4 md:mb-6 relative z-40"
          >
            <Link to="/categories" className="inline-block group overflow-hidden max-w-full">
              <h3 className="text-[var(--text-dark-blue)] opacity-95 font-science font-semibold text-lg md:text-3xl lg:text-4xl tracking-[0.02em] md:tracking-[0.05em] uppercase hover:text-[#0069A8] transition-colors whitespace-nowrap truncate py-1">
                / Categories
              </h3>
            </Link>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-12 gap-3 md:gap-6">
            <Link to="/store?cat=MEN" className="col-span-1 md:col-span-6 relative group overflow-hidden aspect-[3/4] md:aspect-[3/2] lg:aspect-[2/1] cursor-pointer rounded-xl lg:rounded-2xl shadow-md">
              <div className="absolute inset-0 bg-transparent group-hover:bg-black/10 transition-colors duration-700 z-10 pointer-events-none"></div>
              <img 
                src="/assets/images/categories/man.png" 
                alt="Men Category" 
                loading="lazy"
                decoding="async"
                className={`w-full h-full object-cover object-center transition-all duration-700 scale-[1.02] group-hover:scale-[1.08] ${theme === 'dark' ? 'brightness-110 contrast-125' : 'brightness-90 group-hover:brightness-105'}`}
                referrerPolicy="no-referrer"
              />
              <button className={`absolute bottom-3 right-3 md:bottom-5 md:right-5 ${theme === 'dark' ? 'bg-[#061423]/80 border-white/20 text-white' : 'bg-white/90 border-[#0069A8]/40 text-[#0069A8]'} backdrop-blur-md border-[2px] hover:bg-[#0069A8] hover:text-white transition-all duration-300 px-5 md:px-8 py-2 md:py-2.5 rounded-full z-20 group-hover:-translate-y-1 ${theme === 'dark' ? 'shadow-sm shadow-black/20' : 'shadow-lg shadow-[#0069A8]/10 hover:shadow-[#0069A8]/30'}`}>
                <span className="font-sans font-black text-[11px] sm:text-xs md:text-sm tracking-[0.1em] uppercase">MEN</span>
              </button>
            </Link>
            
            <Link to="/store?cat=WOMEN" className="col-span-1 md:col-span-6 relative group overflow-hidden aspect-[3/4] md:aspect-[3/2] lg:aspect-[2/1] cursor-pointer rounded-xl lg:rounded-2xl shadow-md">
              <div className="absolute inset-0 bg-transparent group-hover:bg-black/10 transition-colors duration-700 z-10 pointer-events-none"></div>
              <img 
                 src="/assets/images/categories/women.png" 
                 alt="Women Category" 
                 loading="lazy"
                 decoding="async"
                 className={`w-full h-full object-cover object-center transition-all duration-700 scale-[1.02] group-hover:scale-[1.08] ${theme === 'dark' ? 'brightness-110 contrast-125' : 'brightness-90 group-hover:brightness-105'}`}
                 referrerPolicy="no-referrer"
               />
              <button className={`absolute bottom-3 right-3 md:bottom-5 md:right-5 ${theme === 'dark' ? 'bg-[#061423]/80 border-white/20 text-white' : 'bg-white/90 border-[#0069A8]/40 text-[#0069A8]'} backdrop-blur-md border-[2px] hover:bg-[#0069A8] hover:text-white transition-all duration-300 px-5 md:px-8 py-2 md:py-2.5 rounded-full z-20 group-hover:-translate-y-1 ${theme === 'dark' ? 'shadow-sm shadow-black/20' : 'shadow-lg shadow-[#0069A8]/10 hover:shadow-[#0069A8]/30'}`}>
                <span className="font-sans font-black text-[11px] sm:text-xs md:text-sm tracking-[0.1em] uppercase">WOMEN</span>
              </button>
            </Link>
            
            <Link to="/store?cat=SHOES & BAGS" className="col-span-2 md:col-span-6 relative group overflow-hidden aspect-[2/1] cursor-pointer rounded-xl lg:rounded-2xl shadow-md">
              <div className="absolute inset-0 bg-transparent group-hover:bg-black/10 transition-colors duration-700 z-10 pointer-events-none"></div>
              <img 
                src="/assets/images/categories/bag.png" 
                alt="Bag & Shoes Category" 
                loading="lazy"
                decoding="async"
                className={`w-full h-full object-cover object-bottom transition-all duration-700 scale-[1.02] group-hover:scale-[1.08] ${theme === 'dark' ? 'brightness-110 contrast-125' : 'brightness-90 group-hover:brightness-105'}`}
                referrerPolicy="no-referrer"
              />
              <button className={`absolute bottom-3 right-3 md:bottom-5 md:right-5 ${theme === 'dark' ? 'bg-[#061423]/80 border-white/20 text-white' : 'bg-white/90 border-[#0069A8]/40 text-[#0069A8]'} backdrop-blur-md border-[2px] hover:bg-[#0069A8] hover:text-white transition-all duration-300 px-5 md:px-8 py-2 md:py-2.5 rounded-full z-20 group-hover:-translate-y-1 ${theme === 'dark' ? 'shadow-sm shadow-black/20' : 'shadow-lg shadow-[#0069A8]/10 hover:shadow-[#0069A8]/30'}`}>
                <span className="font-sans font-black text-[11px] sm:text-xs md:text-sm tracking-[0.1em] uppercase">BAG & SHOES</span>
              </button>
            </Link>
            
            <Link to="/store?cat=ACCESSORIES" className="col-span-1 md:col-span-3 relative group overflow-hidden aspect-square cursor-pointer rounded-xl lg:rounded-2xl shadow-md">
              <div className="absolute inset-0 bg-transparent group-hover:bg-black/10 transition-colors duration-700 z-10 pointer-events-none"></div>
              <img 
                src="/assets/images/categories/acseerios.png" 
                alt="Accessories" 
                loading="lazy"
                decoding="async"
                className={`w-full h-full object-cover object-center transition-all duration-700 scale-[1.02] group-hover:scale-[1.08] ${theme === 'dark' ? 'brightness-110 contrast-125' : 'brightness-90 group-hover:brightness-105'}`}
                referrerPolicy="no-referrer"
              />
              <button className={`absolute bottom-3 right-3 md:bottom-5 md:right-5 ${theme === 'dark' ? 'bg-[#061423]/80 border-white/20 text-white' : 'bg-white/90 border-[#0069A8]/40 text-[#0069A8]'} backdrop-blur-md border-[2px] hover:bg-[#0069A8] hover:text-white transition-all duration-300 px-4 md:px-6 py-1.5 md:py-2 rounded-full z-20 group-hover:-translate-y-1 ${theme === 'dark' ? 'shadow-sm shadow-black/20' : 'shadow-lg shadow-[#0069A8]/10 hover:shadow-[#0069A8]/30'}`}>
                <span className="font-sans font-black text-[9px] sm:text-[10px] md:text-xs tracking-[0.1em] uppercase">ACCESSORIES</span>
              </button>
            </Link>
            
            <Link to="/store?cat=PERFUME" className="col-span-1 md:col-span-3 relative group overflow-hidden aspect-square cursor-pointer rounded-xl lg:rounded-2xl shadow-md">
              <div className="absolute inset-0 bg-transparent group-hover:bg-black/10 transition-colors duration-700 z-10 pointer-events-none"></div>
              <img 
                src="/assets/images/categories/perfum.png" 
                alt="Perfumes" 
                loading="lazy"
                decoding="async"
                className={`w-full h-full object-cover object-center transition-all duration-700 scale-[1.02] group-hover:scale-[1.08] ${theme === 'dark' ? 'brightness-110 contrast-125' : 'brightness-90 group-hover:brightness-105'}`}
                referrerPolicy="no-referrer"
              />
              <button className={`absolute bottom-3 right-3 md:bottom-5 md:right-5 ${theme === 'dark' ? 'bg-[#061423]/80 border-white/20 text-white' : 'bg-white/90 border-[#0069A8]/40 text-[#0069A8]'} backdrop-blur-md border-[2px] hover:bg-[#0069A8] hover:text-white transition-all duration-300 px-4 md:px-6 py-1.5 md:py-2 rounded-full z-20 group-hover:-translate-y-1 ${theme === 'dark' ? 'shadow-sm shadow-black/20' : 'shadow-lg shadow-[#0069A8]/10 hover:shadow-[#0069A8]/30'}`}>
                <span className="font-sans font-black text-[9px] sm:text-[10px] md:text-xs tracking-[0.1em] uppercase">PERFUMES</span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. قسم "الأفضل لك" (Best For You Section) */}
      <section className="w-full py-4 md:py-8">
        <div className="w-full px-3 md:px-8">
          <div className="mb-5 md:mb-8 relative z-40 overflow-hidden max-w-full">
            <Link to="/store" className="inline-block group max-w-full">
              <h3 className="text-[var(--text-dark-blue)] opacity-95 font-science font-semibold text-lg md:text-3xl lg:text-4xl tracking-[0.02em] md:tracking-[0.05em] uppercase hover:text-[#0069A8] transition-colors whitespace-nowrap truncate">
                / Best For You
              </h3>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
             {loading ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-100 dark:bg-white/5 animate-pulse rounded-xl" />
                ))
             ) : (
                bestForYou.length > 0 ? bestForYou.slice(0, 8).map((product) => (
                  <ProductCard key={product.id} product={product} />
                )) : (
                  <div className="col-span-full border-2 border-dashed border-[var(--text-dark-blue)]/10 rounded-2xl p-8 flex flex-col items-center justify-center opacity-40">
                     <p className="font-bold text-sm">SET ISFEATURED=TRUE IN FIREBASE</p>
                  </div>
                )
             )}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
