import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { useTheme } from '../context/ThemeContext';

export default function AuthPage() {
  const { theme } = useTheme();
  const [isLogin, setIsLogin] = useState(window.location.pathname !== '/signup');

  return (
    <div 
      className={`min-h-screen flex flex-col pt-[120px] md:pt-[140px] pb-12 font-sans relative overflow-x-hidden transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-black'}`}
      dir="ltr"
    >
      <Navbar />

      <div className="flex-1 w-full max-w-[1200px] mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-16 z-10 pt-8 lg:pt-16">
        
        {/* Left Side: Auth Form (Now visually on Left) */}
        <div className="w-full lg:w-[45%] max-w-md mx-auto lg:mx-0">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`p-8 md:p-10 rounded-3xl transition-colors duration-300 backdrop-blur-md ${theme === 'dark' ? 'bg-[#010520]/80 border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.5)]' : 'bg-white shadow-[0_8px_40px_rgba(0,18,255,0.08)]'}`}
          >
            <div className={`flex gap-8 border-b mb-8 ${theme === 'dark' ? 'border-white/20' : 'border-gray-200'}`}>
              <button 
                onClick={() => setIsLogin(true)}
                className="relative pb-4 text-sm md:text-base font-semibold tracking-wide uppercase transition-colors"
              >
                <span className={isLogin ? (theme === 'dark' ? 'text-white' : 'text-[#0012FF]') : 'text-gray-400 hover:text-gray-600'}>Log In</span>
                {isLogin && <motion.div layoutId="auth-tab-indicator" className={`absolute bottom-0 left-0 right-0 h-0.5 ${theme === 'dark' ? 'bg-white' : 'bg-[#0012FF]'}`} />}
              </button>
              <button 
                onClick={() => setIsLogin(false)}
                className="relative pb-4 text-sm md:text-base font-semibold tracking-wide uppercase transition-colors"
              >
                <span className={!isLogin ? (theme === 'dark' ? 'text-white' : 'text-[#0012FF]') : 'text-gray-400 hover:text-gray-600'}>Sign Up</span>
                {!isLogin && <motion.div layoutId="auth-tab-indicator" className={`absolute bottom-0 left-0 right-0 h-0.5 ${theme === 'dark' ? 'bg-white' : 'bg-[#0012FF]'}`} />}
              </button>
            </div>

            <form className="flex flex-col gap-5">
              {!isLogin && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-col gap-1.5"
                >
                  <label className={`text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'}`}>Full Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors ${theme === 'dark' ? 'bg-white/10 border border-white/20 text-white focus:border-white focus:bg-white/20 placeholder:text-white/30' : 'bg-gray-50 border border-gray-200 text-black focus:border-[#0012FF] focus:bg-white placeholder:text-gray-400'}`}
                  />
                </motion.div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className={`text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'}`}>Email Address</label>
                <input 
                  type="email" 
                  placeholder="hello@example.com"
                  className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors ${theme === 'dark' ? 'bg-white/10 border border-white/20 text-white focus:border-white focus:bg-white/20 placeholder:text-white/30' : 'bg-gray-50 border border-gray-200 text-black focus:border-[#0012FF] focus:bg-white placeholder:text-gray-400'}`}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className={`text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'}`}>Password</label>
                  {isLogin && <a href="#" className={`text-xs hover:underline ${theme === 'dark' ? 'text-white/80' : 'text-[#0012FF]'}`}>Forgot?</a>}
                </div>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors ${theme === 'dark' ? 'bg-white/10 border border-white/20 text-white focus:border-white focus:bg-white/20 placeholder:text-white/30' : 'bg-gray-50 border border-gray-200 text-black focus:border-[#0012FF] focus:bg-white placeholder:text-gray-400'}`}
                />
              </div>

              <button 
                type="submit" 
                className={`w-full rounded-xl py-3.5 mt-2 font-medium tracking-wide border transition-colors ${theme === 'dark' ? 'bg-white text-black border-white hover:bg-transparent hover:text-white' : 'bg-[#0012FF] text-white border-[#0012FF] hover:bg-white hover:text-[#0012FF]'}`}
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="flex items-center gap-4 my-8">
              <div className={`flex-1 h-px ${theme === 'dark' ? 'bg-white/20' : 'bg-gray-200'}`}></div>
              <span className={`text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-white/40' : 'text-gray-400'}`}>Or continue with</span>
              <div className={`flex-1 h-px ${theme === 'dark' ? 'bg-white/20' : 'bg-gray-200'}`}></div>
            </div>

            <button 
              type="button" 
              className={`w-full border rounded-xl py-3.5 font-medium flex items-center justify-center gap-3 transition-colors ${theme === 'dark' ? 'bg-transparent border-white/20 text-white hover:bg-white/10' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>{isLogin ? 'Sign in with Google' : 'Sign up with Google'}</span>
            </button>
          </motion.div>
        </div>

        {/* Right Side: Brand & Promise (Now visually on Right) */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full lg:w-[45%] flex flex-col items-center lg:items-end text-center lg:text-right pt-8 lg:pt-0"
        >
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="w-full flex justify-center lg:justify-end"
          >
            <Link to="/" className="w-48 md:w-56 mb-8 md:mb-12 block hover:opacity-80 transition-opacity">
              <svg viewBox="0 0 174 29" fill="none" xmlns="http://www.w3.org/2000/svg" className={`w-full h-auto fill-current ${theme === 'dark' ? 'text-white' : 'text-[#0012FF]'}`}>
                <path d="M147.158 28.9999V25.0071L165.427 4.6652H147.678V0H173.442V3.99274L155.173 24.3347H173.962V28.9999H147.158Z" fill="currentColor"/>
                <path d="M111.281 27.9912L122.367 0H132.256L143.29 27.9912L142.509 28.9999H137.148L134.702 22.6115H119.868L117.37 28.9999H112.113L111.281 27.9912ZM121.638 17.9463H132.984L127.78 4.6652H126.791L121.638 17.9463Z" fill="currentColor"/>
                <path d="M59.5291 22.7619V7.99517C59.5291 3.83628 64.128 1.75684 73.3258 1.75684H93.7134C102.911 1.75684 107.51 3.83628 107.51 7.99517V22.7619C107.51 26.9207 102.911 29.0002 93.7134 29.0002H73.3258C64.128 29.0002 59.5291 26.9207 59.5291 22.7619ZM68.4047 23.1567C68.4047 24.6307 70.0744 25.3677 73.4137 25.3677H93.6256C96.9649 25.3677 98.6346 24.6307 98.6346 23.1567V7.60034C98.6346 6.1263 96.9649 5.38928 93.6256 5.38928H73.4137C70.0744 5.38928 68.4047 6.1263 68.4047 7.60034V23.1567Z" fill="currentColor"/>
                <path d="M33.2656 28.9999V0H39.6154V24.3347H55.8542V28.9999H33.2656Z" fill="currentColor"/>
                <path d="M0 22.1492V6.8507C0 2.28357 2.82791 0 8.48372 0H22.6406L25.7114 1.93333V4.6652H8.63986C7.11314 4.6652 6.34978 5.26761 6.34978 6.47244V22.5274C6.34978 23.7323 7.11314 24.3347 8.63986 24.3347H25.7114V27.0666L22.6406 28.9999H8.48372C2.82791 28.9999 0 26.7163 0 22.1492Z" fill="currentColor"/>
              </svg>
            </Link>
          </motion.div>

          <h1 className={`text-4xl md:text-5xl lg:text-7xl font-serif tracking-tight leading-[1.05] mb-6 whitespace-nowrap transition-colors ${theme === 'dark' ? 'text-white' : 'text-[#0012FF]'}`}>
            Created for you
          </h1>
          <p className={`text-base md:text-lg max-w-sm mx-auto lg:mx-0 transition-colors ${theme === 'dark' ? 'text-white/60' : 'text-black/60'}`}>
            Join the community and discover a new way of shopping. Exclusively yours.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
