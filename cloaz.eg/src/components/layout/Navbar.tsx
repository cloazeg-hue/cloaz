import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon, ArrowLeft, ShoppingBag, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useTheme } from "../../context/ThemeContext";

import { ThemeToggle } from "../ui/curtain-theme-toggle";

// ==========================================
// الملاحة الرئيسية للتطبيق (Navbar Component)
// يدير القائمة العلوية وحالة السلة والتنقل
// ==========================================
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { setIsCartOpen, cartItems } = useCart();
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === "/";
  const isDarkNavbar = theme === 'dark';

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header 
      className={`fixed ${isScrolled ? 'top-0' : 'top-[17px] md:top-[22px]'} left-0 w-full z-[10000] h-[54px] md:h-[64px] flex items-center px-3 md:px-8 transition-all duration-300 ${isMenuOpen ? 'bg-[var(--background-white)]' : ''}`}
    >
      <div 
        className={`absolute inset-0 z-[-1] transition-all duration-500 ${isScrolled ? 'backdrop-blur-[6px]' : ''}`}
        style={
          isHome
            ? {
                backgroundColor: isScrolled 
                  ? (theme === 'dark' ? 'rgba(11, 22, 32, 0.5)' : 'rgba(235, 245, 250, 0.01)') 
                  : 'var(--background-white)',
                opacity: 1
              }
            : { 
                backgroundImage: isScrolled ? 'none' : 'var(--background-image)',
                backgroundColor: theme === 'dark' 
                  ? (isScrolled ? 'rgba(11, 22, 32, 0.5)' : 'var(--background-white)') 
                  : (isScrolled ? 'rgba(235, 245, 250, 0.01)' : 'var(--background-white)'),
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 1
              }
        }
      />
      
      <nav className="w-full flex justify-between items-center flex-nowrap gap-2 sm:gap-4 h-full relative">
        <div className="flex items-center gap-3 w-auto lg:w-[20%] shrink-0">
          {!isHome && (
            <button 
              onClick={() => navigate(-1)}
              className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full border transition-all duration-300 shrink-0 ${isDarkNavbar ? 'border-white/10 text-white hover:bg-[#0069A8] active:bg-[#0069A8]' : 'border-[#0069A8]/20 text-[#0069A8] hover:bg-[#0069A8] hover:text-white'}`}
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <Link to="/" className="block">
            <img 
              src="/assets/images/icons/CLOAZ.svg" 
              alt="CLOAZ Logo" 
              className={`h-4 sm:h-5 md:h-6 w-auto transition-all duration-500 ${isDarkNavbar ? 'filter brightness-125' : ''}`} 
              referrerPolicy="no-referrer" 
            />
          </Link>
        </div>

        <div className="hidden md:flex flex-1 justify-center px-1 lg:px-4">
          <ul className="flex items-center gap-4 lg:gap-8 m-0 p-0 list-none">
            {[
              { name: 'Store', path: '/store' },
              { name: 'Category', path: '/categories' },
              { name: 'About Us', path: '/about' },
              { name: 'Contact', path: '/contact' }
            ].map((link) => (
              <li key={link.name}>
                <Link 
                  to={link.path}
                  className={`inline-block whitespace-nowrap font-sans font-bold text-[12px] lg:text-[13px] tracking-[0.15em] uppercase transition-all duration-300 relative group py-2 ${isDarkNavbar ? 'text-white' : 'text-[#010520]'}`}
                >
                  {link.name}
                  <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1.5px] transition-all duration-300 group-hover:w-full ${isDarkNavbar ? 'bg-white' : 'bg-[#0069A8]'}`} />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden md:flex flex-none justify-end gap-2 lg:gap-3 items-center w-auto lg:w-[30%] shrink-0">
          <ul className="flex items-center gap-2 lg:gap-3 m-0 p-0 list-none">
            <li>
              <ThemeToggle 
                buttonSize={40} 
                className={`border transition-all duration-300 ${isDarkNavbar ? 'border-white/20' : 'border-[#010520]/20'}`}
              />
            </li>
            <li>
              <button 
                onClick={() => setIsCartOpen(true)}
                className={`inline-block px-3 lg:px-5 py-2 border-[1.5px] rounded-full font-medium text-[14px] lg:text-[15px] transition-all duration-200 ${isDarkNavbar ? 'border-white text-white hover:bg-white hover:text-black bg-transparent' : 'border-[#010520] text-[#010520] bg-transparent hover:bg-[#010520] hover:text-white'}`}
              >
                BAG-{cartCount}
              </button>
            </li>
            <li>
              <Link 
                to="/login"
                className={`inline-block px-3 lg:px-5 py-2 border-[1.5px] rounded-full font-medium text-[14px] lg:text-[15px] transition-all duration-200 ${isDarkNavbar ? 'border-white text-white hover:bg-white hover:text-black bg-transparent' : 'border-[#010520] text-[#010520] bg-transparent hover:bg-[#010520] hover:text-white'}`}
              >
                LOGIN
              </Link>
            </li>
          </ul>
        </div>

        <div className="md:hidden flex items-center gap-2 w-1/3 justify-end">
          {/* Mobile Theme Toggle */}
          <ThemeToggle 
            buttonSize={32}
            iconSize={16}
            className={`border transition-all duration-300 shrink-0 ${isDarkNavbar ? 'border-white/20' : 'border-[#010520]/20'}`}
          />
          
          {/* Mobile Cart Count Button */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className={`h-[32px] px-4 flex items-center justify-center rounded-full shrink-0 border transition-all duration-300 ${isDarkNavbar ? 'border-white text-white bg-transparent' : 'border-[#010520] text-[#010520] bg-transparent'}`}
          >
            <span className="font-medium text-[12px]">BAG-{cartCount}</span>
          </button>
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="flex items-center gap-2 bg-transparent p-0 border-none outline-none"
          >
            {isMenuOpen ? (
              <div className="flex items-center gap-2">
                <X className={`w-6 h-6 text-[#0069A8]`} />
              </div>
            ) : (
              <div className="flex flex-col items-end gap-[5px]">
                <span className={`w-6 h-[3px] rounded-full text-[#0069A8] bg-[#0069A8]`} />
                <span className={`w-4 h-[2px] rounded-full text-[#0069A8] bg-[#0069A8]`} />
              </div>
            )}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute top-[54px] left-0 w-full backdrop-blur-md shadow-xl lg:hidden z-40 py-8 px-4 flex flex-col gap-5 items-center transition-all duration-500 overflow-hidden bg-[var(--background-white)]/95 border-b border-[#0069A8]/10`}
          >
            {/* Background Image for Mobile Menu in Dark Mode */}
            {theme === 'dark' && (
              <div 
                className="absolute inset-0 z-[-1] bg-cover bg-center bg-no-repeat opacity-40"
                style={{ backgroundImage: 'var(--background-image)' }}
              />
            )}
            {[
              { name: 'Store', path: '/store' },
              { name: 'Category', path: '/categories' },
              { name: 'About Us', path: '/about' },
              { name: 'Contact', path: '/contact' },
              { name: 'Login', path: '/login' },
              { name: `BAG-${cartCount}`, onClick: () => setIsCartOpen(true) }
            ].map((item) => (
              item.onClick ? (
                <button 
                  key={item.name} 
                  onClick={item.onClick}
                  className={`font-sans font-bold text-[14px] tracking-[0.15em] uppercase transition-colors ${isDarkNavbar ? 'text-white hover:text-[#0069A8]' : 'text-[#010520] hover:text-[#007BC4]'}`}
                >
                  {item.name}
                </button>
              ) : item.path?.startsWith('/#') ? (
                <a key={item.name} href={item.path} className={`font-sans font-bold text-[14px] tracking-[0.15em] uppercase transition-colors ${isDarkNavbar ? 'text-white hover:text-[#0069A8]' : 'text-[#010520] hover:text-[#007BC4]'}`}>
                  {item.name}
                </a>
              ) : (
                <Link key={item.name} to={item.path || '/'} className={`font-sans font-bold text-[14px] tracking-[0.15em] uppercase transition-colors ${isDarkNavbar ? 'text-white hover:text-[#0069A8]' : 'text-[#010520] hover:text-[#007BC4]'}`}>
                  {item.name}
                </Link>
              )
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
