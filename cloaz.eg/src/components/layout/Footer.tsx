import React from 'react';
import { useTheme } from "../../context/ThemeContext";

// ==========================================
// تذييل الصفحة (Footer Component)
// يحتوي على الروابط والمعلومات في أسفل الموقع
// ==========================================
export default function Footer() {
  const { theme } = useTheme();
  
  return (
    <footer className={`w-full text-white pt-10 md:pt-14 pb-8 px-3 md:px-8 mt-8 font-sans transition-colors duration-500 ${theme === 'dark' ? 'bg-[#031526]' : 'bg-[#0069A8]'} border-t border-white/10`}>
      <div className="w-full mx-auto flex flex-col gap-10 md:gap-14">
        
        {/* ============================================================== */}
        {/* DESKTOP VERSION (Hidden on Mobile)                             */}
        {/* ============================================================== */}
        <div className="hidden md:flex flex-col gap-10 md:gap-16 w-full">
          {/* Top Section */}
          <div className="flex flex-row justify-between items-start gap-4 xl:gap-20 w-full mb-2 xl:mb-8">
            {/* Big Logo */}
            <div className="w-[45%] md:w-[55%] xl:w-[60%] pt-1 xl:pt-0">
              <svg viewBox="0 0 174 29" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto text-white fill-current" preserveAspectRatio="xMinYMin meet">
                <path d="M147.158 28.9999V25.0071L165.427 4.6652H147.678V0H173.442V3.99274L155.173 24.3347H173.962V28.9999H147.158Z" fill="currentColor"/>
                <path d="M111.281 27.9912L122.367 0H132.256L143.29 27.9912L142.509 28.9999H137.148L134.702 22.6115H119.868L117.37 28.9999H112.113L111.281 27.9912ZM121.638 17.9463H132.984L127.78 4.6652H126.791L121.638 17.9463Z" fill="currentColor"/>
                <path d="M59.5291 22.7619V7.99517C59.5291 3.83628 64.128 1.75684 73.3258 1.75684H93.7134C102.911 1.75684 107.51 3.83628 107.51 7.99517V22.7619C107.51 26.9207 102.911 29.0002 93.7134 29.0002H73.4137C64.128 29.0002 59.5291 26.9207 59.5291 22.7619ZM68.4047 23.1567C68.4047 24.6307 70.0744 25.3677 73.4137 25.3677H93.6256C96.9649 25.3677 98.6346 24.6307 98.6346 23.1567V7.60034C98.6346 6.1263 96.9649 5.38928 93.6256 5.38928H73.4137C70.0744 5.38928 68.4047 6.1263 68.4047 7.60034V23.1567Z" fill="currentColor"/>
                <path d="M33.2656 28.9999V0H39.6154V24.3347H55.8542V28.9999H33.2656Z" fill="currentColor"/>
                <path d="M0 22.1492V6.8507C0 2.28357 2.82791 0 8.48372 0H22.6406L25.7114 1.93333V4.6652H8.63986C7.11314 4.6652 6.34978 5.26761 6.34978 6.47244V22.5274C6.34978 23.7323 7.11314 24.3347 8.63986 24.3347H25.7114V27.0666L22.6406 28.9999H8.48372C2.82791 28.9999 0 26.7163 0 22.1492Z" fill="currentColor"/>
              </svg>
            </div>

            {/* Created for you */}
            <div className="w-[38%] xl:w-[35%] pt-0 xl:pt-2 flex justify-start pl-2 xl:pl-4">
               <h2 className="text-[24px] sm:text-[32px] md:text-5xl xl:text-[68px] font-science leading-[1.0] tracking-tight text-white m-0">
                 Created for you
               </h2>
            </div>
          </div>

          {/* Desktop Columns Region */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12 xl:gap-12 w-full">
             
            {/* Column 1: CONTACT */}
            <div className="flex flex-col gap-5">
              <h3 className="text-[14px] md:text-[15px] uppercase mb-1 font-science tracking-normal text-white">CONTACT</h3>
              <div className="flex flex-col gap-1 text-[17px] md:text-[19px] opacity-100 font-normal leading-relaxed text-white">
                <p>Cloaz</p>
                <a href="mailto:cloaz.eg@gmail.com" className="hover:opacity-75 transition-opacity">cloaz.eg@gmail.com</a>
                <a href="tel:01033424667" className="hover:opacity-75 transition-opacity">010 3342 4667</a>
              </div>
            </div>

            {/* Column 2: FOLLOW US */}
            <div className="flex flex-col gap-5">
              <h3 className="text-[14px] md:text-[15px] uppercase mb-1 font-science tracking-normal text-white">FOLLOW US</h3>
              <div className="flex flex-col gap-1 text-[17px] md:text-[19px] opacity-100 font-normal leading-relaxed text-white">
                <a href="#" className="hover:opacity-75 transition-opacity">Instagram</a>
                <a href="#" className="hover:opacity-75 transition-opacity">TikTok</a>
              </div>
            </div>

            {/* Column 3: CATEGORIES */}
            <div className="flex flex-col gap-5">
              <h3 className="text-[14px] md:text-[15px] uppercase mb-1 font-science tracking-normal text-white">CATEGORIES</h3>
              <div className="flex flex-col gap-1 text-[17px] md:text-[19px] opacity-100 font-normal leading-relaxed text-white">
                <a href="#" className="hover:opacity-75 transition-opacity">Men</a>
                <a href="#" className="hover:opacity-75 transition-opacity">Women</a>
                <a href="#" className="hover:opacity-75 transition-opacity">Shoes and Bag</a>
                <a href="#" className="hover:opacity-75 transition-opacity">Perfume and Accessory</a>
              </div>
            </div>

            {/* Column 4: NEWSLETTER */}
            <div className="flex flex-col gap-5 xl:pl-4">
              <h3 className="text-[14px] md:text-[15px] uppercase mb-1 font-science tracking-normal text-white">NEWSLETTER</h3>
              <div className="flex flex-col gap-2 opacity-100 text-white">
                <p className="font-normal text-[17px] md:text-[19px]">Subscribe to our newsletter</p>
                <form className="flex border-b border-white pb-1.5 mt-2 md:mt-3 relative">
                  <input 
                    type="email" 
                    placeholder="Email" 
                    className="bg-transparent border-none outline-none text-2xl md:text-3xl font-science placeholder:text-white/70 w-full pb-0.5"
                  />
                  <button type="submit" className="absolute right-0 bottom-2.5 hover:opacity-75 transition-opacity group">
                    <svg className="w-8 h-8 transform group-hover:translate-x-1 transition-transform stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Desktop Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 w-full text-[13px] md:text-[14px] opacity-100 font-normal pt-6 md:py-6 px-0 transition-colors duration-500 mt-8 mb-[-2rem] md:mb-[-2rem] text-white">
            <div className="flex items-center gap-3">
              <span className="text-[10px] md:text-[11px] font-science font-bold tracking-[0.2em] uppercase opacity-70">DESIGNED FOR THE STREETS</span>
              <div className="w-1 h-1 rounded-full bg-white/30" />
              <span className="text-[10px] md:text-[11px] font-science font-bold tracking-[0.2em] uppercase opacity-70">LOCAL CODE URBAN VIBE</span>
            </div>
            
            <div className="flex flex-row items-center gap-6 md:gap-12 text-[10px] md:text-[11px] font-science tracking-[0.1em] uppercase">
              <p className="opacity-60">Copyright 2022 All Created Reserved by <a href="https://www.linkedin.com/in/abdallah-wahby-09b7252b1/" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-100 opacity-100">WAHBY</a></p>
              <a href="#" className="hover:opacity-100 transition-opacity opacity-60">Privacy Policy</a>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* MOBILE VERSION (Hidden on Desktop)                             */}
        {/* ============================================================== */}
        <div className="md:hidden flex flex-col gap-10 w-full">
          {/* Top Section */}
          <div className="flex flex-col items-start gap-4 w-full">
            {/* Logo */}
            <div className="w-[120px]">
              <svg viewBox="0 0 174 29" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto text-white fill-current" preserveAspectRatio="xMinYMin meet">
                <path d="M147.158 28.9999V25.0071L165.427 4.6652H147.678V0H173.442V3.99274L155.173 24.3347H173.962V28.9999H147.158Z" fill="currentColor"/>
                <path d="M111.281 27.9912L122.367 0H132.256L143.29 27.9912L142.509 28.9999H137.148L134.702 22.6115H119.868L117.37 28.9999H112.113L111.281 27.9912ZM121.638 17.9463H132.984L127.78 4.6652H126.791L121.638 17.9463Z" fill="currentColor"/>
                <path d="M59.5291 22.7619V7.99517C59.5291 3.83628 64.128 1.75684 73.3258 1.75684H93.7134C102.911 1.75684 107.51 3.83628 107.51 7.99517V22.7619C107.51 26.9207 102.911 29.0002 93.7134 29.0002H73.4137C64.128 29.0002 59.5291 26.9207 59.5291 22.7619ZM68.4047 23.1567C68.4047 24.6307 70.0744 25.3677 73.4137 25.3677H93.6256C96.9649 25.3677 98.6346 24.6307 98.6346 23.1567V7.60034C98.6346 6.1263 96.9649 5.38928 93.6256 5.38928H73.4137C70.0744 5.38928 68.4047 6.1263 68.4047 7.60034V23.1567Z" fill="currentColor"/>
                <path d="M33.2656 28.9999V0H39.6154V24.3347H55.8542V28.9999H33.2656Z" fill="currentColor"/>
                <path d="M0 22.1492V6.8507C0 2.28357 2.82791 0 8.48372 0H22.6406L25.7114 1.93333V4.6652H8.63986C7.11314 4.6652 6.34978 5.26761 6.34978 6.47244V22.5274C6.34978 23.7323 7.11314 24.3347 8.63986 24.3347H25.7114V27.0666L22.6406 28.9999H8.48372C2.82791 28.9999 0 26.7163 0 22.1492Z" fill="currentColor"/>
              </svg>
            </div>
            
            <p className="text-[14px] font-science tracking-wide mt-2 opacity-90">
              Local Code URBAN VIBE
            </p>

            <div className="flex items-center gap-5 mt-3">
              <a href="#" className="hover:opacity-75 transition-opacity" aria-label="TikTok">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M19.589 6.686a4.793 4.793 0 0 1-3.97-1.53c-.389-.42-.647-.97-.735-1.562V3h-3.696v11.905c0 1.954-1.585 3.54-3.54 3.54s-3.54-1.586-3.54-3.54 1.585-3.54 3.54-3.54c.264 0 .524.03.774.086V7.493a7.228 7.228 0 0 0-.774-.042c-3.992 0-7.236 3.243-7.236 7.235S6.425 21.921 10.417 21.921s7.236-3.243 7.236-7.235v-4.851a8.47 8.47 0 0 0 5.485 2V8.14a4.802 4.802 0 0 1-3.549-1.454z"/>
                </svg>
              </a>
              <a href="#" className="hover:opacity-75 transition-opacity" aria-label="Instagram">
                <svg className="w-6 h-6 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>

          {/* Columns Region */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 w-full mb-4">
             
            {/* Column 1: Category */}
            <div className="flex flex-col gap-4">
              <h3 className="text-[16px] font-science font-bold border-b border-white/20 pb-3 uppercase">Category</h3>
              <div className="flex flex-col gap-3 text-[14px] opacity-90 font-medium">
                <a href="#" className="hover:opacity-60 transition-opacity">Men</a>
                <a href="#" className="hover:opacity-60 transition-opacity">Women</a>
                <a href="#" className="hover:opacity-60 transition-opacity">Kids</a>
              </div>
            </div>

            {/* Column 2: Explore */}
            <div className="flex flex-col gap-4">
              <h3 className="text-[16px] font-science font-bold border-b border-white/20 pb-3 uppercase">Explore</h3>
              <div className="flex flex-col gap-3 text-[14px] opacity-90 font-medium">
                <a href="#" className="hover:opacity-60 transition-opacity">Brands</a>
                <a href="#" className="hover:opacity-60 transition-opacity">New In</a>
                <a href="#" className="hover:opacity-60 transition-opacity">Best Sellers</a>
              </div>
            </div>

            {/* Column 3: Help & Support */}
            <div className="flex flex-col gap-4">
              <h3 className="text-[16px] font-science font-bold border-b border-white/20 pb-3 uppercase">Help & Support</h3>
              <div className="flex flex-col gap-3 text-[14px] opacity-90 font-medium">
                <a href="#" className="hover:opacity-60 transition-opacity">Orders & Shipping</a>
                <a href="#" className="hover:opacity-60 transition-opacity">Returns & Refunds</a>
                <a href="#" className="hover:opacity-60 transition-opacity">FAQs</a>
                <a href="#" className="hover:opacity-60 transition-opacity">Policies</a>
              </div>
            </div>

            {/* Column 4: About CLOAZ */}
            <div className="flex flex-col gap-4">
              <h3 className="text-[16px] font-science font-bold border-b border-white/20 pb-3 uppercase">About CLOAZ</h3>
              <div className="flex flex-col gap-3 text-[14px] opacity-90 font-medium">
                <a href="#" className="hover:opacity-60 transition-opacity">About Us</a>
                <a href="#" className="hover:opacity-60 transition-opacity">Contact Us</a>
                <a href="#" className="hover:opacity-60 transition-opacity">Our Stores</a>
                <a href="#" className="hover:opacity-60 transition-opacity">Weekly Look</a>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col items-center justify-center pt-8 border-t border-white/20 text-[12px] opacity-80 font-normal text-center">
            <p>Copyright 2022 All Created Reserved by <a href="https://www.linkedin.com/in/abdallah-wahby-09b7252b1/" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-100 opacity-100">WAHBY</a></p>
          </div>
        </div>

      </div>
    </footer>
  );
}
