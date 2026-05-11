import React from 'react';
import { motion } from 'motion/react';

const Preloader: React.FC = () => {
    return (
        <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[9999] bg-background-white flex flex-col items-center justify-center"
        >
            <div className="relative flex flex-col items-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                        duration: 0.8, 
                        repeat: Infinity, 
                        repeatType: "reverse" 
                    }}
                    className="mb-8"
                >
                    <img 
                        src="/assets/logo black.svg" 
                        alt="Logo" 
                        className="h-16 md:h-20 w-auto"
                    />
                </motion.div>
                
                <div className="w-48 h-1 bg-gray-100 rounded-full overflow-hidden relative">
                    <motion.div 
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ 
                            repeat: Infinity, 
                            duration: 1.5,
                            ease: "easeInOut"
                        }}
                        className="absolute inset-0 bg-[#0069A8]"
                    />
                </div>
                
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 text-[13px] font-science font-bold text-gray-400 tracking-[0.2em] uppercase"
                >
                    Loading Experience
                </motion.p>
            </div>
        </motion.div>
    );
};

export default Preloader;
