import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { useTheme } from '../context/ThemeContext';

export default function ContactPage() {
  const { theme } = useTheme();
  return (
    <div 
      className={`min-h-screen flex flex-col pt-[140px] md:pt-[160px] pb-12 font-sans relative overflow-x-hidden transition-colors duration-500`}
      dir="ltr"
    >
      <Navbar />

      <div className="flex-1 w-full max-w-[1200px] mx-auto px-6 md:px-12 flex flex-col-reverse lg:flex-row items-start justify-between gap-8 lg:gap-16 z-10 pt-8 lg:pt-16 w-full">
        
        {/* Left Side: Contact Form */}
        <div className="w-full lg:w-[50%]">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`p-8 md:p-10 rounded-[32px] shadow-xl border transition-all duration-500 ${theme === 'dark' ? 'bg-[#010520] border-white/10 shadow-black/40' : 'bg-white border-gray-100 shadow-[0_8px_40px_rgba(0,18,255,0.08)]'}`}
          >
            <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className={`text-sm font-semibold transition-colors ${theme === 'dark' ? 'text-white/80' : 'text-[#010520]'}`}>Name</label>
                  <input 
                    type="text" 
                    placeholder="Your name"
                    className={`w-full border rounded-2xl px-5 py-4 text-sm transition-all focus:outline-none focus:border-[#0069A8] placeholder:text-gray-400 ${theme === 'dark' ? 'bg-white/[0.03] border-white/5 text-white focus:bg-white/[0.05]' : 'bg-gray-50 border-gray-100 focus:bg-white'}`}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className={`text-sm font-semibold transition-colors ${theme === 'dark' ? 'text-white/80' : 'text-[#010520]'}`}>Email</label>
                  <input 
                    type="email" 
                    placeholder="Your email"
                    className={`w-full border rounded-2xl px-5 py-4 text-sm transition-all focus:outline-none focus:border-[#0069A8] placeholder:text-gray-400 ${theme === 'dark' ? 'bg-white/[0.03] border-white/5 text-white focus:bg-white/[0.05]' : 'bg-gray-50 border-gray-100 focus:bg-white'}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className={`text-sm font-semibold transition-colors ${theme === 'dark' ? 'text-white/80' : 'text-[#010520]'}`}>Phone</label>
                  <input 
                    type="tel" 
                    placeholder="Your phone"
                    className={`w-full border rounded-2xl px-5 py-4 text-sm transition-all focus:outline-none focus:border-[#0069A8] placeholder:text-gray-400 ${theme === 'dark' ? 'bg-white/[0.03] border-white/5 text-white focus:bg-white/[0.05]' : 'bg-gray-50 border-gray-100 focus:bg-white'}`}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className={`text-sm font-semibold transition-colors ${theme === 'dark' ? 'text-white/80' : 'text-[#010520]'}`}>Company</label>
                  <input 
                    type="text" 
                    placeholder="Your company"
                    className={`w-full border rounded-2xl px-5 py-4 text-sm transition-all focus:outline-none focus:border-[#0069A8] placeholder:text-gray-400 ${theme === 'dark' ? 'bg-white/[0.03] border-white/5 text-white focus:bg-white/[0.05]' : 'bg-gray-50 border-gray-100 focus:bg-white'}`}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className={`text-sm font-semibold transition-colors ${theme === 'dark' ? 'text-white/80' : 'text-[#010520]'}`}>Message</label>
                <textarea 
                  placeholder="Enter your message"
                  rows={4}
                  className={`w-full border rounded-2xl px-5 py-4 text-sm transition-all focus:outline-none focus:border-[#0069A8] placeholder:text-gray-400 resize-none ${theme === 'dark' ? 'bg-white/[0.03] border-white/5 text-white focus:bg-white/[0.05]' : 'bg-gray-50 border-gray-100 focus:bg-white'}`}
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-[#0069A8] text-white rounded-[20px] py-4 mt-2 font-semibold tracking-wide hover:bg-[#00558a] transition-all transform active:scale-[0.98]"
              >
                Send message
              </button>
            </form>
          </motion.div>
        </div>

        {/* Right Side: Info */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full lg:w-[45%] flex flex-col items-start text-start pt-8 lg:pt-0"
        >
          <h1 className={`text-4xl md:text-5xl lg:text-7xl font-serif tracking-tight leading-[1.05] mb-4 transition-colors ${theme === 'dark' ? 'text-white' : 'text-[#010520]'}`}>
            Contact us!
          </h1>
          <p className={`text-base md:text-lg max-w-md mb-10 text-start opacity-70 transition-colors ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
            Have a question or need assistance? Reach out to our team and we'll get back to you as soon as possible.
          </p>

          <div className="flex flex-col gap-6 w-full">
            {/* Email Card */}
            <div className={`p-6 md:p-8 rounded-[24px] border flex flex-col sm:flex-row items-start sm:items-center gap-6 text-left w-full transition-all duration-500 ${theme === 'dark' ? 'bg-[#010520]/40 border-white/10 shadow-xl' : 'bg-white border-gray-50 shadow-[0_8px_40px_rgba(0,105,168,0.08)]'}`}>
              <div className="bg-[#0069A8] p-4 rounded-2xl shrink-0">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className={`font-semibold text-lg transition-colors ${theme === 'dark' ? 'text-white' : 'text-[#010520]'}`}>Send us an email</h3>
                <p className={`text-sm leading-relaxed opacity-60 transition-colors ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                  Drop us a message for general inquiries or support requests.
                </p>
                <a href="mailto:contact@cloaz.com" className={`font-bold transition-colors ${theme === 'dark' ? 'text-[#0069A8]' : 'text-[#010520] hover:text-[#00558a]'}`}>
                  contact@cloaz.com
                </a>
              </div>
            </div>

            {/* Phone Card */}
            <div className={`p-6 md:p-8 rounded-[24px] border flex flex-col sm:flex-row items-start sm:items-center gap-6 text-left w-full transition-all duration-500 ${theme === 'dark' ? 'bg-[#010520]/40 border-white/10 shadow-xl' : 'bg-white border-gray-50 shadow-[0_8px_40px_rgba(0,105,168,0.08)]'}`}>
              <div className="bg-[#0069A8] p-4 rounded-2xl shrink-0">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className={`font-semibold text-lg transition-colors ${theme === 'dark' ? 'text-white' : 'text-[#010520]'}`}>Give us a call</h3>
                <p className={`text-sm leading-relaxed opacity-60 transition-colors ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                  Call our customer service team directly for immediate assistance.
                </p>
                <a href="tel:01033424667" className={`font-bold transition-colors ${theme === 'dark' ? 'text-[#0069A8]' : 'text-[#010520] hover:text-[#00558a]'}`}>
                  010 3342 4667
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
