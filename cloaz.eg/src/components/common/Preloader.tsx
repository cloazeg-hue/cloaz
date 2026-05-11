import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../../context/ThemeContext';

interface PreloaderProps {
  isLoading?: boolean;
  onComplete?: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ isLoading = false, onComplete }) => {
  const { theme } = useTheme();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!isVisible) return;

    // Prevent scrolling while loading
    document.body.style.overflow = 'hidden';

    // Mock progress until isLoading becomes false
    let currentProgress = 0;
    const interval = setInterval(() => {
      if (currentProgress < 90) {
        currentProgress += Math.random() * 15;
        setProgress(Math.min(Math.floor(currentProgress), 90));
      }
    }, 200);

    if (!isLoading) {
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        setIsVisible(false);
        document.body.style.overflow = '';
        if (onComplete) onComplete();
      }, 800);
    }

    return () => {
      clearInterval(interval);
      document.body.style.overflow = '';
    };
  }, [isVisible, isLoading, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '-100%', filter: 'blur(10px)' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className={`fixed inset-0 z-[99999] flex items-center justify-center pointer-events-none transition-colors duration-default overflow-hidden bg-cover bg-center bg-no-repeat bg-background-white text-text-dark-blue`}
          style={{ 
            backgroundImage: `url('${theme === 'dark' ? '/assets/images/banners/background dark.jpg' : '/assets/images/banners/background.jpg'}')`,
            filter: theme === 'dark' ? 'brightness(1.15)' : 'none'
          }}
        >
          {/* Subtle noise/grain overlay for premium feel */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

          <motion.div 
            // Position bottom right, smaller size, moved up ~80px
            className="absolute bottom-28 right-8 md:bottom-32 md:right-12 w-[115px] h-[65px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          >
            {/* The SVG O */}
            <svg width="192" height="109" viewBox="0 0 192 109" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
              <path d="M0 84.0389V24.9589C0 8.31964 18.3997 0 55.1992 0H136.767C173.567 0 191.967 8.31964 191.967 24.9589V84.0389C191.967 100.678 173.567 108.998 136.767 108.998H55.1992C18.3997 108.998 0 100.678 0 84.0389ZM35.5103 85.6185C35.5103 91.516 42.1905 94.4647 55.5508 94.4647H136.416C149.776 94.4647 156.456 91.516 156.456 85.6185V23.3792C156.456 17.4818 149.776 14.533 136.416 14.533H55.5508C42.1905 14.533 35.5103 17.4818 35.5103 23.3792V85.6185Z" fill={theme === 'dark' ? '#0069A8' : '#00558a'} />
              <path d="M55.1992 0.5H136.768C155.145 0.500012 168.859 2.57983 177.961 6.69531C182.506 8.7503 185.878 11.3028 188.114 14.3359C190.346 17.3634 191.467 20.8976 191.467 24.959V84.0391C191.467 88.1003 190.346 91.6347 188.114 94.6621C185.878 97.6952 182.506 100.248 177.961 102.303C168.859 106.418 155.145 108.498 136.768 108.498H55.1992C36.8217 108.498 23.1077 106.418 14.0059 102.303C9.46117 100.248 6.08861 97.6951 3.85254 94.6621C1.62072 91.6347 0.500038 88.1003 0.5 84.0391V24.959C0.5 20.8976 1.62068 17.3634 3.85254 14.3359C6.08861 11.3028 9.46108 8.75029 14.0059 6.69531C23.1077 2.57983 36.8216 0.5 55.1992 0.5ZM55.5508 14.0332C48.8493 14.0332 43.7549 14.7702 40.3184 16.2871C38.5944 17.0481 37.2643 18.0161 36.3643 19.208C35.4594 20.4062 35.0108 21.8033 35.0107 23.3789V85.6182C35.0107 87.1939 35.4594 88.5917 36.3643 89.79C37.2644 90.9819 38.5944 91.95 40.3184 92.7109C43.7549 94.2279 48.8493 94.9648 55.5508 94.9648H136.416C143.117 94.9648 148.212 94.2279 151.648 92.7109C153.372 91.95 154.702 90.9819 155.603 89.79C156.507 88.5917 156.956 87.1939 156.956 85.6182V23.3789C156.956 21.8034 156.507 20.4062 155.603 19.208C154.702 18.0161 153.372 17.0481 151.648 16.2871C148.212 14.7702 143.117 14.0332 136.416 14.0332H55.5508Z" stroke={theme === 'dark' ? '#0069A8' : '#00558a'} />
            </svg>

            {/* Percentage Text inside the SVG O */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`font-science text-[13px] md:text-sm font-semibold text-text-dark-blue`}>
                {progress}%
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
