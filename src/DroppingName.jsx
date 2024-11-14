// DroppingName.js
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';

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

export default DroppingName;