import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 selection:bg-[#0069A8] selection:text-white">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm flex flex-col gap-6 bg-[#0E0E12]/80 backdrop-blur-xl p-8 rounded-2xl border border-white/5 shadow-2xl"
      >
        <div className="flex flex-col items-center justify-center mb-4 gap-4">
           <div className="w-16 h-16 rounded-full bg-[#0069A8]/10 flex items-center justify-center">
             <ShieldAlert className="w-8 h-8 text-[#0069A8]" />
           </div>
           <h1 className="text-2xl font-black text-white uppercase tracking-widest">Admin Portal</h1>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs uppercase tracking-wider font-bold p-3 rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest px-1">Email Address</label>
            <input 
              type="email" 
              placeholder="admin@cloaz.com" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-white/10 text-white px-4 py-3.5 outline-none focus:border-[#0069A8] transition-colors rounded-xl font-mono text-sm tracking-wider placeholder:text-white/20"
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest px-1">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/10 text-white px-4 py-3.5 outline-none focus:border-[#0069A8] transition-colors rounded-xl font-mono text-sm tracking-widest placeholder:text-white/20"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#0069A8] text-white font-black py-4 mt-2 rounded-xl hover:bg-[#00558a] disabled:opacity-50 transition-all tracking-[0.2em] uppercase relative overflow-hidden group"
          >
            <span className={`transition-opacity ${loading ? 'opacity-0' : 'opacity-100'}`}>Sign In</span>
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
