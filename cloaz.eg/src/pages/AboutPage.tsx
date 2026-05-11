import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useTheme } from '../context/ThemeContext';

export default function AboutPage() {
  const { theme } = useTheme();
  return (
    <div 
      className="relative min-h-screen w-full overflow-x-hidden font-sans flex flex-col transition-all duration-500" 
      dir="ltr"
    >
      <Navbar />

      <main className="flex-1 w-full mx-auto px-3 md:px-8 mt-[120px] md:mt-[180px] pb-16 md:pb-24 z-10 relative">
        
        {/* HEADER / HERO SECTION */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full flex flex-col gap-8 md:gap-14 mb-20 md:mb-40"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex flex-col gap-4">
               <img 
                 src="/assets/images/icons/CLOAZ.svg" 
                 alt="CLOAZ Logo" 
                 loading="lazy"
                 decoding="async"
                 className={`h-[60px] sm:h-[80px] md:h-[120px] lg:h-[160px] w-auto transition-all duration-500 brightness-0 ${theme === 'dark' ? 'invert' : ''}`} 
                 referrerPolicy="no-referrer"
               />
               <h1 className="sr-only">CLOAZ</h1>
            </div>
            
            <div className="flex flex-col items-start md:items-end gap-6 md:pb-4">
              <p className="text-[var(--text-dark-blue)] text-xl md:text-3xl font-serif italic tracking-tight max-w-[400px] md:text-right leading-tight transition-colors">
                Local code. Urban vibe. <span className="text-[#0069A8]">Your signature style.</span>
              </p>
              <Link 
                to="/store"
                className="inline-flex items-center gap-3 bg-[#0069A8] text-white px-5 py-2 border-[1.5px] border-[#0069A8] rounded-full font-medium text-[15px] hover:bg-[#00558a] transition-all uppercase tracking-wider"
              >
                EXPLORE COLLECTION
              </Link>
            </div>
          </div>
          
          <div className="w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-[32px] relative group">
            <img 
              src="/assets/images/about/1-imgabout.jpeg" 
              alt="CLOAZ Urban Lifestyle" 
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-center transition-all duration-[1200ms] ease-in-out scale-105 md:group-hover:scale-100" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0069A8]/5 to-transparent pointer-events-none"></div>
          </div>
        </motion.section>

        {/* ABOUT SECTION - Improved Proportions */}
        <motion.section 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="w-full grid grid-cols-1 lg:grid-cols-[0.8fr_1.6fr_0.8fr] gap-6 md:gap-10 mb-24 md:mb-48 items-stretch"
        >
            {/* Left Image - Slimmer aspect */}
            <div className="hidden lg:block w-full h-[550px] overflow-hidden rounded-[32px] self-end">
                <img 
                  src="/assets/images/about/2-imagabout.jpeg" 
                  alt="CLOAZ Style" 
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center transition-all duration-1000" 
                />
            </div>

            {/* Middle Content */}
            <div className={`flex flex-col justify-center px-4 md:px-12 py-12 rounded-[40px] border relative z-10 overflow-hidden h-[550px] transition-all duration-500 ${theme === 'dark' ? 'bg-[#010520]/40 border-white/10' : 'bg-white border-[#010520]/5'}`}>
                <div className="absolute top-0 left-0 w-32 h-32 bg-[#0069A8]/5 rounded-br-full -ml-16 -mt-16"></div>
                
                <div className="flex items-center gap-3 mb-8 justify-center md:justify-start">
                    <span className="w-8 h-[2px] bg-[#0069A8]"></span>
                    <span className="text-[#0069A8] text-[11px] font-black uppercase tracking-[0.4em]">
                        WHO WE ARE
                    </span>
                </div>
                <h2 className="text-5xl sm:text-6xl lg:text-7xl font-serif text-[var(--text-dark-blue)] leading-[0.95] mb-10 tracking-tighter text-center md:text-left transition-colors">
                    Quality for <br className="hidden md:block" /><span className="text-[#0069A8]">the Streets.</span>
                </h2>
                <div className="space-y-6 text-[var(--text-dark-blue)] opacity-80 text-lg lg:text-xl leading-relaxed mb-12 font-medium text-center md:text-left transition-colors">
                    <p>We make clothes that look good and feel even better. Every piece is made with care, using strong fabrics that last.</p>
                    <p>Our style is simple but bold. We focus on the fit and the feel, so you always look your best without trying too hard.</p>
                </div>
                <Link 
                    to="/store"
                    className="inline-flex items-center mx-auto md:mx-0 gap-3 border-b-2 border-[#0069A8] pb-2 text-[#0069A8] font-black text-xs hover:text-[#010520] hover:border-[#010520] transition-all uppercase tracking-[0.2em] transform hover:translate-x-2"
                >
                    SEE THE NEW DROP {'>'}
                </Link>
            </div>

            {/* Right Image - Matched height */}
            <div className="hidden lg:block w-full h-[550px] overflow-hidden rounded-[32px] self-end">
                <img 
                  src="/assets/images/about/3-imgabout.jpeg" 
                  alt="CLOAZ Detail" 
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center transition-all duration-1000" 
                />
            </div>

            {/* Mobile View for Images */}
            <div className="grid grid-cols-2 gap-4 lg:hidden">
               <div className="aspect-[3/4] rounded-2xl overflow-hidden">
                  <img src="/assets/images/about/2-imagabout.jpeg" alt="About 1" loading="lazy" decoding="async" className="w-full h-full object-cover" />
               </div>
               <div className="aspect-[3/4] rounded-2xl overflow-hidden">
                  <img src="/assets/images/about/3-imgabout.jpeg" alt="About 2" loading="lazy" decoding="async" className="w-full h-full object-cover" />
               </div>
            </div>
        </motion.section>

        {/* MATERIALS & QUALITY SECTION */}
        <motion.section 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full mb-32 md:mb-56"
        >
            <div className="flex items-center gap-6 mb-16">
                <h2 className="text-4xl sm:text-5xl lg:text-7xl font-serif text-[var(--text-dark-blue)] tracking-tighter transition-colors">The Details.</h2>
                <div className="flex-1 h-[2px] bg-[#0069A8]/10"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16">
                <div className={`flex flex-col gap-6 p-10 rounded-[32px] border transition-all duration-500 group ${theme === 'dark' ? 'bg-[#010520]/40 border-white/10 md:hover:border-[#0069A8]/30' : 'bg-white border-[#010520]/5 md:hover:border-[#0069A8]/20'}`}>
                    <div className="w-14 h-14 bg-[#0069A8]/5 rounded-2xl flex items-center justify-center md:group-hover:bg-[#0069A8] transition-all duration-500">
                        <img 
                            src="/assets/images/icons/CLOAZ.svg" 
                            alt="Logo Icon" 
                            className={`w-8 h-8 transition-all brightness-0 ${theme === 'dark' ? 'invert' : ''} md:group-hover:invert`} 
                        />
                    </div>
                    <h3 className="text-2xl font-serif text-[var(--text-dark-blue)] tracking-tight transition-colors">Strong Fabrics</h3>
                    <p className="text-[var(--text-dark-blue)] opacity-70 text-base md:text-lg leading-relaxed font-medium transition-colors">
                        We use high-quality thick cotton that feels amazing and keeps its shape wash after wash.
                    </p>
                </div>

                <div className={`flex flex-col gap-6 p-10 rounded-[32px] border transition-all duration-500 group ${theme === 'dark' ? 'bg-[#010520]/40 border-white/10 md:hover:border-[#0069A8]/30' : 'bg-white border-[#010520]/5 md:hover:border-[#0069A8]/20'}`}>
                    <div className="w-14 h-14 bg-[#0069A8]/5 rounded-2xl flex items-center justify-center md:group-hover:bg-[#0069A8] transition-all duration-500">
                        <img 
                            src="/assets/images/icons/CLOAZ.svg" 
                            alt="Logo Icon" 
                            className={`w-8 h-8 transition-all brightness-0 ${theme === 'dark' ? 'invert' : ''} md:group-hover:invert`} 
                        />
                    </div>
                    <h3 className="text-2xl font-serif text-[var(--text-dark-blue)] tracking-tight transition-colors">Great Packaging</h3>
                    <p className="text-[var(--text-dark-blue)] opacity-70 text-base md:text-lg leading-relaxed font-medium transition-colors">
                        Every piece comes in clean, simple packaging because getting new clothes should be an experience.
                    </p>
                </div>

                <div className={`flex flex-col gap-6 p-10 rounded-[32px] border transition-all duration-500 group ${theme === 'dark' ? 'bg-[#010520]/40 border-white/10 md:hover:border-[#0069A8]/30' : 'bg-white border-[#010520]/5 md:hover:border-[#0069A8]/20'}`}>
                    <div className="w-14 h-14 bg-[#0069A8]/5 rounded-2xl flex items-center justify-center md:group-hover:bg-[#0069A8] transition-all duration-500">
                        <img 
                            src="/assets/images/icons/CLOAZ.svg" 
                            alt="Logo Icon" 
                            className={`w-8 h-8 transition-all brightness-0 ${theme === 'dark' ? 'invert' : ''} md:group-hover:invert`} 
                        />
                    </div>
                    <h3 className="text-2xl font-serif text-[var(--text-dark-blue)] tracking-tight transition-colors">Simple & Fast</h3>
                    <p className="text-[var(--text-dark-blue)] opacity-70 text-base md:text-lg leading-relaxed font-medium transition-colors">
                        We respect your time. We get your orders out fast so you can start wearing your favorite pieces.
                    </p>
                </div>
            </div>
        </motion.section>

        {/* FINAL BRAND IMAGE SECTION - 50/50 Split */}
        <motion.section 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className={`w-full mb-32 md:mb-56 grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden rounded-[40px] border transition-colors duration-500 ${theme === 'dark' ? 'border-white/10' : 'border-[#010520]/5'}`}
        >
            <div className="h-[400px] md:h-[650px] overflow-hidden group">
                <img 
                    src="/assets/images/about/4-imgabout.jpeg" 
                    alt="CLOAZ Final Vibe" 
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-center transition-all duration-[1500ms]" 
                />
            </div>
            <div className={`flex flex-col justify-center p-12 md:p-24 relative transition-colors duration-500 ${theme === 'dark' ? 'bg-[#010520]/20 text-white' : 'bg-transparent text-[#010520]'}`}>
                <div className="flex items-center gap-3 mb-8">
                    <span className={`w-10 h-[2px] ${theme === 'dark' ? 'bg-[#0069A8]' : 'bg-[#0069A8]'}`}></span>
                    <span className={`text-[11px] font-black uppercase tracking-[0.4em] ${theme === 'dark' ? 'text-[#0069A8]' : 'text-[#0069A8]'}`}>
                        VIBE CHECK
                    </span>
                </div>
                
                <h2 className={`text-5xl md:text-7xl font-serif leading-[0.9] mb-10 tracking-tighter transition-colors ${theme === 'dark' ? 'text-white' : 'text-[#010520]'}`}>
                    Built for <br/> <span className={`${theme === 'dark' ? 'text-[#0069A8]' : 'text-[#0069A8]'}`}>You.</span>
                </h2>
                
                <p className={`text-lg md:text-xl leading-relaxed mb-12 font-medium max-w-md opacity-80 transition-colors ${theme === 'dark' ? 'text-white' : 'text-[#010520]'}`}>
                    We make clothes that look good and stay that way. CLOAZ is designed for your everyday life.
                </p>

                <div className="space-y-4">
                   <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-[#0069A8]' : 'bg-[#0069A8]'}`}></div>
                      <p className={`text-sm font-bold uppercase tracking-widest transition-colors ${theme === 'dark' ? 'text-white' : 'text-[#010520]'}`}>Simple, Clean Designs</p>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-[#0069A8]' : 'bg-[#0069A8]'}`}></div>
                      <p className={`text-sm font-bold uppercase tracking-widest transition-colors ${theme === 'dark' ? 'text-white' : 'text-[#010520]'}`}>Quality Materials</p>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-[#0069A8]' : 'bg-[#0069A8]'}`}></div>
                      <p className={`text-sm font-bold uppercase tracking-widest transition-colors ${theme === 'dark' ? 'text-white' : 'text-[#010520]'}`}>Est.2026 / Local Brand</p>
                   </div>
                </div>
            </div>
        </motion.section>

        {/* BRAND STATEMENT & EXTRA INFO */}
        <motion.section 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={`w-full flex gap-12 flex-col lg:flex-row justify-between items-start lg:items-end border-t pt-20 transition-colors duration-500 ${theme === 'dark' ? 'border-white/10' : 'border-[#010520]/10'}`}
        >
            <div className="flex-1 max-w-2xl">
                <h2 className={`text-4xl sm:text-5xl lg:text-7xl font-serif leading-[1.0] tracking-tighter mb-8 text-center md:text-left transition-colors ${theme === 'dark' ? 'text-white' : 'text-[#010520]'}`}>
                    Beyond the Brand. <br className="hidden md:block" />
                    <span className={`${theme === 'dark' ? 'text-[#0069A8]' : 'text-[#0069A8]'}`}>A signature of the city.</span>
                </h2>
                <p className={`text-lg font-medium italic text-center md:text-left uppercase opacity-60 transition-colors ${theme === 'dark' ? 'text-white' : 'text-[#010520]'}`}>CLOAZ.68 / Est. 2026</p>
            </div>
            
            <div className={`flex flex-col items-center lg:items-end text-base md:text-lg text-center lg:text-right gap-3 font-semibold uppercase tracking-wider w-full lg:w-auto transition-colors ${theme === 'dark' ? 'text-white/80' : 'text-[#010520]'}`}>
                <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-[#0069A8]' : 'bg-[#0069A8]'}`}></div>
                    <p>Premium Local Cotton Only.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-[#0069A8]' : 'bg-[#0069A8]'}`}></div>
                    <p>Next-day urban delivery.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-[#0069A8]' : 'bg-[#0069A8]'}`}></div>
                    <p>Ethical high-density fits.</p>
                </div>
            </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}
