// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef, useState } from 'react';
import PageTransition from './PageTransition';

const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { isMobile };
};

const MatrixRain = () => {
    const canvasRef = useRef(null);
    const { isMobile } = useResponsive();
    const [showOverlay, setShowOverlay] = useState(true);
    const [overlayOpacity, setOverlayOpacity] = useState(1);
    const [textProgress, setTextProgress] = useState(0);
    const [showText, setShowText] = useState(false);
    
    useEffect(() => {
      // Initial black overlay timing
      setTimeout(() => {
        setOverlayOpacity(0);  // Start fade out after 0.5s
        setTimeout(() => {
          setShowOverlay(false);  // Remove overlay from DOM after fade completes
          setShowText(true); // Show the text after overlay disappears
          
          // Start text animation
          const startTime = Date.now();
          const duration = 2000; // 2 seconds
          
          const animateText = () => {
            const currentTime = Date.now();
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth transition
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            setTextProgress(easeOutQuart);
            
            if (progress < 1) {
              requestAnimationFrame(animateText);
            }
          };
          
          requestAnimationFrame(animateText);
        }, 1500);  // Remove after fade duration (0.5s)
      }, 1000);  // Start fade after 0.5s
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      
      const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}';
      const fontSize = isMobile ? 12 : 16;
      const columns = canvas.width / fontSize;
      const drops = Array(Math.floor(columns)).fill(1);
      
      const draw = () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#0F0';
        ctx.font = `${fontSize}px monospace`;
        
        drops.forEach((y, i) => {
          const char = chars[Math.floor(Math.random() * chars.length)];
          const x = i * fontSize;
          ctx.fillText(char, x, y * fontSize);
          
          if (y * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        });
      };
      
      const interval = setInterval(draw, isMobile ? 50 : 33);
      
      return () => {
        clearInterval(interval);
        window.removeEventListener('resize', resizeCanvas);
      };
    }, [isMobile]);

    const Text = () => {
      const letters = 'jaqbek'.split('');
      const startSpacing = isMobile ? 5000 : 10000; // Reduced spacing for mobile
      const endSpacing = isMobile ? 30 : 70; // Reduced end spacing for mobile
      const currentSpacing = startSpacing + (endSpacing - startSpacing) * textProgress;
      
      return (
        <div className="relative whitespace-nowrap">
          {letters.map((letter, index) => {
            const position = (index - (letters.length - 1) / 2) * currentSpacing;
            return (
              <span
                key={index}
                className="text-[#0F0] font-mono absolute"
                style={{
                  fontSize: isMobile ? '40px' : '80px', // Smaller font size for mobile
                  transform: `translateX(${position}px)`,
                  opacity: textProgress,
                  transition: 'transform 0.1s linear',
                  textShadow: isMobile ? 
                    '0 0 5px #0F0, 0 0 8px #0F0' : // Smaller glow for mobile
                    '0 0 10px #0F0, 0 0 15px #0F0',
                  left: '50%',
                }}
              >
                {letter}
              </span>
            );
          })}
        </div>
      );
    };
  
    return (
        <div className="relative w-full h-screen bg-black overflow-hidden">
          <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
          
          {/* Centered Text - positioned 25% from bottom */}
          {showText && (
            <div className="absolute inset-0 flex items-end pb-[25vh] justify-center z-10">
              <Text />
            </div>
          )}
          
          {showOverlay && (
            <div 
              className="absolute top-0 left-0 w-full h-full bg-black" 
              style={{ opacity: overlayOpacity, transition: 'opacity 3s ease-out', zIndex: 50 }}
            />
          )}
          <PageTransition />
        </div>
    );
};

export default MatrixRain;