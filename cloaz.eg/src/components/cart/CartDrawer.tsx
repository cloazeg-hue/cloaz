import { motion, AnimatePresence } from "motion/react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useTheme } from "../../context/ThemeContext";

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cartItems, updateQuantity, total, subtotal, totalDiscount } = useCart();
  const { theme } = useTheme();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/40 z-[11000] backdrop-blur-[2px]"
          />

            {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
            className={`fixed top-0 right-0 h-full w-[100%] md:w-[500px] z-[11001] shadow-2xl flex flex-col font-sans border-l overflow-y-auto transition-colors duration-500 ${theme === 'dark' ? 'border-white/10 text-white' : 'border-[#0069A8]/20 text-[#0069A8]'}`}
            style={{ 
              backgroundImage: theme === 'dark' 
                ? 'none' 
                : 'url("/assets/background.jpg")', 
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: theme === 'dark' ? '#061323' : '#F5F5F5'
            }}
          >
            {/* Header - Button on Left, H2 on Right as per screenshot */}
            <div className={`p-6 md:p-10 flex justify-between items-center ${theme === 'dark' ? 'bg-transparent' : 'bg-transparent'}`}>
              <button 
                onClick={() => setIsCartOpen(false)}
                className={`border-[1.5px] rounded-full px-6 py-2 font-semibold text-[10px] md:text-xs tracking-widest uppercase transition-all duration-300 flex items-center justify-center ${theme === 'dark' ? 'border-white text-white hover:bg-white hover:text-black' : 'border-[#0069A8] text-[#0069A8] hover:bg-[#0069A8] hover:text-white'}`}
              >
                CLOSE
              </button>
              <h2 className={`font-bold text-3xl md:text-5xl tracking-normal uppercase select-none whitespace-nowrap transition-colors ${theme === 'dark' ? 'text-white' : 'text-[#0069A8]'}`}>
                SHOP BAG
              </h2>
            </div>

            {/* Content Area - No internal scroll, use parent scroll */}
            <div className="px-6 md:px-10 pb-10">
              <div className="space-y-12">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <p className={`font-semibold text-xl tracking-[0.2em] uppercase transition-colors ${theme === 'dark' ? 'text-white/40' : 'text-[#0069A8]/30'}`}>Bag is Empty</p>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={`${item.id}-${item.size}-${item.color || 'none'}`} className="flex flex-col">
                      {/* Product Image */}
                      <div className={`w-full mb-8 overflow-hidden rounded-[4px] transition-colors ${theme === 'dark' ? 'bg-white/5' : 'bg-[#f8f8f8]'}`}>
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className={`w-full h-auto object-contain transition-all ${theme === 'dark' ? '' : 'mix-blend-multiply'}`} 
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Separator Line */}
                      <div className={`h-[1.5px] w-full transition-colors ${theme === 'dark' ? 'bg-white' : 'bg-[#0069A8]'} mb-6`} />

                      {/* Product Info Row - Reversed: Size & Price Left, Name Right */}
                      <div className="flex justify-between items-end mb-4">
                        <div className="flex items-center gap-8 md:gap-16">
                           <div className="flex flex-col">
                             <div className="flex items-center gap-2">
                               <span className={`font-semibold text-sm md:text-base tracking-tight transition-colors ${theme === 'dark' ? 'text-white' : 'text-[#0069A8]'}`}>LE {item.price}</span>
                               {item.oldPrice && item.oldPrice > item.price && (
                                 <span className={`text-[10px] md:text-xs line-through opacity-40 transition-colors ${theme === 'dark' ? 'text-white' : 'text-[#0069A8]'}`}>LE {item.oldPrice}</span>
                               )}
                             </div>
                             {item.oldPrice && item.oldPrice > item.price && (
                               <span className="text-[8px] md:text-[9px] font-bold text-[#0069A8] uppercase tracking-widest">
                                 SAVED LE {(item.oldPrice - item.price) * item.quantity}
                               </span>
                             )}
                           </div>
                           <span className={`font-semibold text-[10px] md:text-xs uppercase whitespace-nowrap transition-colors ${theme === 'dark' ? 'text-white/80' : 'text-[#0069A8]'}`}>SIZE {item.size}</span>
                           {item.color && (
                             <div className="flex items-center gap-1.5 border-l border-white/10 pl-3 ml-3">
                               <div 
                                 className="w-2.5 h-2.5 rounded-[2px] border border-black/10 shadow-sm" 
                                 style={{ backgroundColor: item.color }} 
                               />
                               <span className={`text-[8px] font-bold uppercase transition-colors opacity-40 ${theme === 'dark' ? 'text-white' : 'text-[#0069A8]'}`}>Color</span>
                             </div>
                           )}
                        </div>
                        <h3 className={`font-semibold text-sm md:text-base uppercase tracking-tight text-right transition-colors ${theme === 'dark' ? 'text-white' : 'text-[#0069A8]'}`}>
                          {item.name}
                        </h3>
                      </div>

                      {/* Quantity Row - Reversed: Controls Left, Label Right */}
                      <div className="flex justify-between items-center">
                        <div className={`flex items-center border ${theme === 'dark' ? 'border-white' : 'border-[#0069A8]'}`}>
                          <button 
                            onClick={() => updateQuantity(item.id, item.size, item.color, -1)}
                            className={`w-7 h-7 md:w-8 md:h-8 flex items-center justify-center font-semibold text-base border-r transition-colors ${theme === 'dark' ? 'border-white text-white hover:bg-white/10' : 'border-[#0069A8] text-[#0069A8] hover:bg-[#0069A8]/10'}`}
                          >
                            -
                          </button>
                          <div className={`w-8 h-7 md:w-9 md:h-8 flex items-center justify-center font-semibold text-xs transition-colors ${theme === 'dark' ? 'text-black bg-white' : 'text-white bg-[#0069A8]'}`}>
                            {item.quantity}
                          </div>
                          <button 
                            onClick={() => updateQuantity(item.id, item.size, item.color, 1)}
                            className={`w-7 h-7 md:w-8 md:h-8 flex items-center justify-center font-semibold text-base border-l transition-colors ${theme === 'dark' ? 'border-white text-white hover:bg-white/10' : 'border-[#0069A8] text-[#0069A8] hover:bg-[#0069A8]/10'}`}
                          >
                            +
                          </button>
                        </div>
                        <span className={`font-semibold text-[10px] md:text-[11px] uppercase tracking-widest text-right transition-colors ${theme === 'dark' ? 'text-white/60' : 'text-[#0069A8]'}`}>QUANTITY</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Footer - Part of the flow for full scroll */}
            <div className={`mt-auto p-6 md:p-10 border-t transition-colors ${theme === 'dark' ? 'border-white/10' : 'border-[#0069A8]/10'}`}>
              <div className={`h-[1.5px] w-full transition-colors ${theme === 'dark' ? 'bg-white' : 'bg-[#0069A8]'} mb-6`} />
              
              {/* Product Summary List - Reversed: Price Left, Name Right */}
              <div className="space-y-2 mb-8">
                {cartItems.map((item) => (
                  <div key={`summary-${item.id}-${item.size}-${item.color || 'none'}`} className="flex justify-between items-center text-[10px] md:text-xs">
                    <div className="flex items-center gap-2">
                       <span className={`font-semibold tracking-tight opacity-70 transition-colors ${theme === 'dark' ? 'text-white' : 'text-[#0069A8]'}`}>
                         LE {item.price * item.quantity}
                       </span>
                       {item.oldPrice && item.oldPrice > item.price && (
                         <span className="text-[9px] line-through opacity-30">LE {item.oldPrice * item.quantity}</span>
                       )}
                    </div>
                    <span className={`font-semibold uppercase tracking-tight opacity-70 text-right transition-colors ${theme === 'dark' ? 'text-white' : 'text-[#0069A8]'}`}>
                      {item.name} {item.quantity > 1 ? `x${item.quantity}` : ''}
                    </span>
                  </div>
                ))}
              </div>

              {/* Subtotal & Discount Rows */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center opacity-60">
                  <span className={`font-bold text-lg md:text-xl tracking-tighter uppercase transition-colors ${theme === 'dark' ? 'text-white' : 'text-[#0069A8]'}`}>LE {subtotal}</span>
                  <span className={`font-bold text-base md:text-lg tracking-tighter uppercase transition-colors ${theme === 'dark' ? 'text-white' : 'text-[#0069A8]'}`}>ITEM SUBTOTAL</span>
                </div>
                
                {totalDiscount > 0 && (
                  <div className="flex justify-between items-center text-[#0069A8]">
                    <span className="font-bold text-lg md:text-xl tracking-tighter uppercase">- LE {totalDiscount}</span>
                    <span className="font-bold text-base md:text-lg tracking-tighter uppercase">OUR SALE</span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2">
                  <span className={`font-black text-2xl md:text-3xl tracking-tighter uppercase leading-none transition-colors ${theme === 'dark' ? 'text-white' : 'text-[#0069A8]'}`}>LE {total}</span>
                  <span className={`font-black text-2xl md:text-3xl tracking-tighter uppercase leading-none transition-colors ${theme === 'dark' ? 'text-white' : 'text-[#0069A8]'}`}>TOTAL</span>
                </div>
              </div>

              <Link 
                to="/checkout"
                onClick={() => setIsCartOpen(false)}
                className={`w-full border-[1.5px] rounded-full py-4 px-6 flex items-center justify-center font-semibold text-[11px] md:text-sm tracking-[0.2em] uppercase transition-all duration-300 ${theme === 'dark' ? 'border-white text-white hover:bg-white hover:text-black' : 'border-[#0069A8] text-[#0069A8] hover:bg-[#0069A8] hover:text-white'}`}
              >
                CHECKOUT
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
