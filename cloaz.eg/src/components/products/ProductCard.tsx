import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';

interface ProductCardProps {
  product: Product;
  hideCartButton?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, hideCartButton = false }) => {
  const { theme } = useTheme();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [mobileImageIndex, setMobileImageIndex] = useState(0);
  const lastTap = useRef<number>(0);

  const isOutOfStock = product.stock === 0;
  const hasDiscount = product.oldPrice && product.oldPrice > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.oldPrice! - product.price) / product.oldPrice!) * 100) 
    : 0;

  const handleAddToBag = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      oldPrice: product.oldPrice,
      image: product.mainImage,
      size: 'M',
      quantity: 1
    }, false);
  };

  const handleCardInteraction = (e: React.MouseEvent) => {
    // On mobile, just navigate directly on click
    if (window.innerWidth < 768) {
      navigate(`/product/${product.id}`);
    }
  };

  return (
    <div
      onClick={handleCardInteraction}
      className="w-full"
    >
      <Link 
        to={`/product/${product.id}`}
        className={`flex flex-col group cursor-pointer w-full mb-8 rounded-[16px] transition-all duration-300 md:hover:border-[#0069A8]/30 ${theme === 'dark' ? '' : ''}`}
      >
      <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden mb-4">
        {/* SALE label - plain text, our color */}
        {hasDiscount && !isOutOfStock && (
          <div className="absolute top-2 left-1 z-30">
            <span className="text-[#0069A8] font-science font-black text-[14px] md:text-[18px] tracking-widest uppercase">
              SALE
            </span>
          </div>
        )}

        {/* SOLD OUT Overlay */}
        {isOutOfStock && (
          <div className="absolute top-2 left-2 z-30 flex items-center justify-center pointer-events-none">
            <div className="bg-black/80 text-white font-science font-black text-[10px] md:text-xs tracking-[0.2em] uppercase py-1.5 px-3 rounded-full shadow-lg">
              SOLD OUT
            </div>
          </div>
        )}

        {/* Discount Badge - REMOVED, replaced by SALE text above */}

        {/* Desktop/Tablet Hover Implementation (Hidden on mobile) */}
        <div className={`hidden md:block w-full h-full ${isOutOfStock ? 'opacity-60' : ''}`}>
            <img 
            src={product.mainImage} 
            alt={product.name} 
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-opacity duration-500 absolute inset-0 group-hover:opacity-0"
            referrerPolicy="no-referrer"
          />
          <div className="w-full h-full absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <img 
              src={product.hovering || product.mainImage} 
              alt={`${product.name} alternate`} 
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover absolute inset-0"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Mobile Swipe/Scroll Implementation (Only visible on mobile) */}
        <div className={`md:hidden w-full h-full relative group/mobile overflow-hidden ${isOutOfStock ? 'opacity-60' : ''}`}>
           <motion.div 
             className="w-full h-full"
             drag="x"
             dragDirectionLock
             dragConstraints={{ left: 0, right: 0 }}
             dragElastic={0.2}
             onDragEnd={(_, info) => {
               const threshold = 30;
               if (info.offset.x < -threshold) {
                 setMobileImageIndex(1);
               } else if (info.offset.x > threshold) {
                 setMobileImageIndex(0);
               }
             }}
           >
              <AnimatePresence mode="wait">
                <motion.img
                  key={mobileImageIndex}
                  src={mobileImageIndex === 0 ? product.mainImage : (product.hovering || product.mainImage)}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover absolute inset-0 pointer-events-none"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>
           </motion.div>
           
           {/* Mobile indicator dots */}
           <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10 pointer-events-none">
              <div className={`h-1 rounded-full transition-all duration-300 ${mobileImageIndex === 0 ? 'bg-[#0069A8] w-4' : 'bg-gray-300 w-1'}`}></div>
              <div className={`h-1 rounded-full transition-all duration-300 ${mobileImageIndex === 1 ? 'bg-[#0069A8] w-4' : 'bg-gray-300 w-1'}`}></div>
           </div>
        </div>

        {/* Floating Add to Bag Icon */}
        {!hideCartButton && (
          <button 
            onClick={handleAddToBag}
            disabled={isOutOfStock}
            className={`absolute bottom-2 right-2 md:bottom-3 md:right-3 w-10 h-10 md:w-12 md:h-12 rounded-full flex flex-col items-center justify-center overflow-hidden z-20 group/btn transition-all bg-background-white ${theme === 'dark' ? 'text-white' : 'text-black'} ${isOutOfStock ? 'opacity-40 cursor-not-allowed grayscale' : 'hover:scale-105 active:scale-95'}`}
            aria-label="Add to bag"
          >
            <div className={`relative w-full h-full flex items-center justify-center rounded-full group-hover/btn:bg-[#0069A8]/5`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 md:w-6 md:h-6 -ml-0.5">
                 <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                 <line x1="3" y1="6" x2="21" y2="6"/>
                 <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {!isOutOfStock && (
                <div className={`absolute bottom-[6px] right-[6px] md:bottom-[8px] md:right-[8px] rounded-full bg-background-white`}>
                   <Plus className={`w-3 h-3 md:w-3.5 md:h-3.5 stroke-[3px] ${isOutOfStock ? 'text-gray-400' : 'text-[#0069A8]'}`} />
                </div>
              )}
            </div>
          </button>
        )}
      </div>

      {/* Text Area */}
      <div className="flex flex-col flex-1 px-1 text-left items-start justify-start w-full overflow-hidden mb-2">
        <h3 className="text-[var(--text-dark-blue)] opacity-95 font-bold text-[14px] md:text-[17px] uppercase tracking-wider leading-snug mb-1 w-full truncate transition-all">
          {product.name}
        </h3>
        <div className="flex flex-col gap-0.5">
          <span className="font-bold text-[13px] md:text-[16px] text-[#0069A8]">
            LE {product.price.toFixed(2)} EGP
          </span>
          {hasDiscount && (
            <span className="text-[var(--text-dark-blue)] opacity-60 line-through text-[11px] md:text-[13px] transition-colors leading-none">
              LE {product.oldPrice?.toFixed(2)} EGP
            </span>
          )}
        </div>
      </div>
    </Link>
    </div>
  );
};

export default ProductCard;
