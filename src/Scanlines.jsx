// Scanlines.jsx
import { useState, useEffect } from 'react';

const Scanlines = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Function to randomly show scanlines
    const flashScanlines = () => {
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 200); // Hide after 200ms
    };

    // Listen for route/page changes
    const handleRouteChange = () => {
      flashScanlines();
    };

    // Add event listener for page visibility changes
    document.addEventListener('visibilitychange', handleRouteChange);
    
    // Set up periodic random flashes
    const interval = setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance to show scanlines
        flashScanlines();
      }
    }, 2000); // Check every 2 seconds

    return () => {
      document.removeEventListener('visibilitychange', handleRouteChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <div 
      className={`scanlines fixed inset-0 pointer-events-none transition-opacity duration-200`} 
      style={{ 
        zIndex: 9999,
        opacity: isVisible ? 0.8 : 0.1
      }}
    >
      <style>{`
        .scanlines::before {
          content: '';
          position: fixed;
          inset: 0;
          background: repeating-linear-gradient(
            to bottom,
            rgba(0, 255, 0, 0) 0%,
            rgba(0, 255, 0, 0) 50%,
            rgba(0, 255, 0, 0.05) 50%,
            rgba(0, 255, 0, 0.05) 100%
          );
          background-size: 100% 4px;
          pointer-events: none;
        }
        
        .scanlines::after {
          content: '';
          position: fixed;
          inset: 0;
          background: linear-gradient(
            rgba(0, 255, 0, 0.15) 50%,
            rgba(0, 0, 0, 0.3) 50%
          );
          background-size: 100% 4px;
          animation: scanline 1s linear infinite;
          pointer-events: none;
        }
        
        @keyframes scanline {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(4px);
          }
        }

        @keyframes flicker {
          0% { opacity: 0.8; }
          5% { opacity: 0.85; }
          10% { opacity: 0.8; }
          15% { opacity: 0.9; }
          20% { opacity: 0.8; }
          25% { opacity: 0.85; }
          30% { opacity: 0.8; }
          35% { opacity: 0.9; }
          40% { opacity: 0.8; }
          45% { opacity: 0.85; }
          50% { opacity: 0.8; }
          55% { opacity: 0.9; }
          60% { opacity: 0.8; }
          65% { opacity: 0.85; }
          70% { opacity: 0.8; }
          75% { opacity: 0.9; }
          80% { opacity: 0.8; }
          85% { opacity: 0.85; }
          90% { opacity: 0.8; }
          95% { opacity: 0.85; }
          100% { opacity: 0.8; }
        }

        .scanlines.visible {
          animation: flicker 0.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default Scanlines;