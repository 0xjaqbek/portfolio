// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef, useState } from 'react';
import PageTransition from './PageTransition';

const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { isMobile, screenWidth };
};

const DroppingName = () => {
    const [displayChars, setDisplayChars] = useState([]);
    const [fadeOut, setFadeOut] = useState(false);
    const [finalChars, setFinalChars] = useState([]);
    const [shadowIntensity, setShadowIntensity] = useState(1);
    const name = 'jaqbek';
    const { isMobile, screenWidth } = useResponsive();
    
    const totalRows = isMobile ? 16 : 20;
    const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    
    // Add shadow pulse effect
    useEffect(() => {
      let ascending = false;
      const shadowInterval = setInterval(() => {
        setShadowIntensity(prev => {
          if (prev <= 0.3) ascending = true;
          if (prev >= 1) ascending = false;
          return ascending ? prev + 0.1 : prev - 0.1;
        });
      }, 500);
  
      return () => clearInterval(shadowInterval);
    }, []);
  
    const getFontSize = () => {
      if (screenWidth < 380) return 'text-3xl';
      if (screenWidth < 768) return 'text-4xl';
      return 'text-6xl';
    };
    
    const getSpacing = () => {
      if (screenWidth < 380) return 'space-x-4';
      if (screenWidth < 768) return 'space-x-6';
      return 'space-x-8';
    };
  
    const getRandomChar = () => chars[Math.floor(Math.random() * chars.length)];
  
    useEffect(() => {
      setDisplayChars(Array(name.length).fill([]));
      setFinalChars(Array(name.length).fill(false));
      setFadeOut(false);
      
      setTimeout(() => {
        let letterIntervals = name.split('').map((letter, letterIndex) => {
          let rowCount = 0;
          
          return setInterval(() => {
            setDisplayChars(prev => {
              const newChars = [...prev];
              let currentColumn = newChars[letterIndex] || [];
              
              if (rowCount < totalRows) {
                currentColumn = [...currentColumn, getRandomChar()];
                rowCount++;
              } else {
                currentColumn = [...currentColumn.slice(1), getRandomChar()];
              }
              
              newChars[letterIndex] = currentColumn;
              return newChars;
            });
          }, isMobile ? 45 : 35);
        });
  
        setTimeout(() => {
          letterIntervals.forEach(interval => clearInterval(interval));
          
          letterIntervals = name.split('').map((letter, letterIndex) => {
            return setInterval(() => {
              setDisplayChars(prev => {
                const newChars = [...prev];
                let currentColumn = [...newChars[letterIndex]];
                
                if (!finalChars[letterIndex]) {
                  currentColumn[currentColumn.length - 1] = letter;
                  setFinalChars(prev => {
                    const newFinal = [...prev];
                    newFinal[letterIndex] = true;
                    return newFinal;
                  });
                } else {
                  currentColumn = currentColumn.map((char, idx) => 
                    idx === currentColumn.length - 1 ? letter : getRandomChar()
                  );
                }
                
                newChars[letterIndex] = currentColumn;
                return newChars;
              });
            }, isMobile ? 35 : 35);
          });
  
          setTimeout(() => {
            setFadeOut(true);
            letterIntervals.forEach(interval => clearInterval(interval));
          }, 500);
        }, totalRows * (isMobile ? 9 : 12) + 150);
  
        return () => letterIntervals.forEach(interval => clearInterval(interval));
      }, 3300);
  
      return () => setDisplayChars(Array(name.length).fill([]));
    }, [isMobile]);
  
    return (
      <div className={`flex ${getSpacing()}`}>
        {displayChars.map((column, i) => (
          <div 
            key={i} 
            className="flex flex-col" 
            style={{ 
              height: isMobile ? '40vh' : '75vh',
              marginTop: isMobile ? '-40vh' : '-75vh',
              transition: 'opacity 1s ease-out'
            }}
          >
            {column.map((char, j) => {
              const isLastChar = j === column.length - 1;
              const opacity = fadeOut 
                ? (isLastChar ? 1 : 0)
                : (isLastChar ? 1 : 0.3);
              
              return (
                <span 
                  key={j} 
                  className={`text-[#0F0] ${getFontSize()} font-mono`}
                  style={{
                    opacity,
                    textShadow: isLastChar 
                      ? `0 0 ${10 * shadowIntensity}px #0F0, 0 0 ${15 * shadowIntensity}px #0F0` 
                      : 'none',
                    height: '1em',
                    transition: 'opacity 1s ease-out'
                  }}
                >
                  {char}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    );
  };
  

const MatrixRain = () => {
    const canvasRef = useRef(null);
    const { isMobile } = useResponsive();
    const [showOverlay, setShowOverlay] = useState(true);
    const [overlayOpacity, setOverlayOpacity] = useState(1);
    
    useEffect(() => {
      // Initial black overlay timing
      setTimeout(() => {
        setOverlayOpacity(0);  // Start fade out after 0.5s
        setTimeout(() => {
          setShowOverlay(false);  // Remove overlay from DOM after fade completes
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
  
    return (
        <div className="relative w-full h-screen bg-black overflow-hidden">
          <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
          <div className="absolute w-full h-full flex items-center justify-center">
            <div style={{ position: 'absolute', width: '100%', top: 0, display: 'flex', justifyContent: 'center' }}>
              <DroppingName />
            </div>
          </div>
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