// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef, useState } from 'react';
import PageTransition from './PageTransition';
import TerminalText from './TerminalText';

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
    const [showTerminal, setShowTerminal] = useState(false); // New state for terminal text

    useEffect(() => {
      // Initial black overlay timing
      setTimeout(() => {
        setOverlayOpacity(0);
        setTimeout(() => {
          setShowOverlay(false);
          setShowText(true);
          
          const startTime = Date.now();
          const duration = 2000;
          
          const animateText = () => {
            const currentTime = Date.now();
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            setTextProgress(easeOutQuart);
            
            if (progress < 1) {
              requestAnimationFrame(animateText);
            } else {
              // Show terminal text after name animation completes
              setTimeout(() => {
                setShowTerminal(true);
              }, 500);
            }
          };
          
          requestAnimationFrame(animateText);
        }, 1500);
      }, 1000);
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      
      const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';
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
      const startSpacing = isMobile ? 5000 : 10000;
      const endSpacing = isMobile ? 30 : 70;
      const currentSpacing = startSpacing + (endSpacing - startSpacing) * textProgress;
      
      // Add font size animation values
      const startFontSize = isMobile ? '700px' : '9000px';
      const endFontSize = isMobile ? '40px' : '80px';
      const currentFontSize = `${
        parseInt(startFontSize) - 
        (parseInt(startFontSize) - parseInt(endFontSize)) * textProgress
      }px`;
      
      return (
        <div className="relative whitespace-nowrap">
          {letters.map((letter, index) => {
            const position = (index - (letters.length - 1) / 2) * currentSpacing;
            return (
              <span
                key={index}
                className="text-[#0F0] font-mono absolute"
                style={{
                  fontSize: currentFontSize,
                  transform: `translateX(${position}px)`,
                  opacity: textProgress,
                  transition: 'transform 0.1s linear, font-size 0.1s linear',
                  textShadow: isMobile ? 
                    '0 0 5px #0F0, 0 0 8px #0F0' :
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
          
          {/* Centered Name Text */}
          {showText && (
            <div className="absolute inset-0 flex items-end pb-[25vh] justify-center z-10">
              <Text />
            </div>
          )}

          {/* Terminal Text - positioned above the name */}
          {showTerminal && (
  <div className="absolute inset-0 flex items-end pb-[35vh] px-4 md:pl-[40vw] md:pr-4">
    <div className="text-[#0F0] font-mono" style={{
      textShadow: isMobile ? 
        '0 0 5px #0F0, 0 0 8px #0F0' :
        '0 0 10px #0F0, 0 0 15px #0F0'
    }}>
      <TerminalText speed={50} />
    </div>
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