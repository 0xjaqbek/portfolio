// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import mobileImg from './mobile11.jpg';
import laptopImg from './laptop11.jpg';
import SectionModal from './SectionModal';

const PageTransition = ({ onReturnToMatrix }) => {
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

  const useGlitchText = (originalText, active, isHovered) => {
    const [text, setText] = useState(originalText);
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';
    
    const runGlitchSequence = useCallback(() => {
      let iterations = 0;
      const maxIterations = isHovered ? 5 : 3;
      const interval = setInterval(() => {
        setText(current => {
          if (iterations >= maxIterations) {
            clearInterval(interval);
            return originalText;
          }
          
          return current
            .split('')
            .map((char, index) => {
              if (char === ' ') return char;
              const threshold = isHovered ? 0.7 : 0.85;
              if (Math.random() < threshold) return originalText[index];
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('');
        });
        iterations++;
      }, isHovered ? 50 : 100);
  
      return interval;
    }, [originalText, chars, isHovered]);
  
    useEffect(() => {
      if (!active) {
        setText(originalText);
        return;
      }
  
      let currentInterval = runGlitchSequence();
  
      const randomRepeat = () => {
        const timeout = setTimeout(() => {
          const threshold = isHovered ? 0.4 : 0.15;
          if (Math.random() < threshold) {
            clearInterval(currentInterval);
            currentInterval = runGlitchSequence();
          }
          randomRepeat();
        }, isHovered ? (1000 + Math.random() * 2000) : (2000 + Math.random() * 4000));
  
        return timeout;
      };
  
      const repeatTimeout = randomRepeat();
  
      return () => {
        clearInterval(currentInterval);
        clearTimeout(repeatTimeout);
      };
    }, [originalText, active, runGlitchSequence, isHovered]);
  
    return text;
  };

  const [isVisible, setIsVisible] = useState(false);
  const [showNewPage, setShowNewPage] = useState(false);
  const [showText, setShowText] = useState(false);
  const { isMobile } = useResponsive();
  const clickCountRef = useRef(0);


  const [isReturning, setIsReturning] = useState(false);

  const TextElement = ({ 
    text, 
    className = '',
    isContact = false
  }) => {
    const [startGlitch, setStartGlitch] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const glitchedText = useGlitchText(text, startGlitch, isHovered);
    const [isShapeGlitching, setIsShapeGlitching] = useState(false);
    const [textColor, setTextColor] = useState(isContact ? 'black' : 'white');
    const [fontFamily, setFontFamily] = useState('Consolas');

    useEffect(() => {
      if (showText) {
        const timer = setTimeout(() => {
          setStartGlitch(true);
          
          const glitch = () => {
            if (!isHovered) {
              setIsShapeGlitching(true);
            }
            
            const colors = isContact
              ? (isHovered 
                  ? ['#000000', '#202020', '#404040']
                  : ['#000000'])
              : (isHovered 
                  ? ['#FFFFFF', '#E0E0E0', '#CCCCCC', '#F0F0F0', '#FFE0E0', '#E0FFE0', '#E0E0FF']
                  : ['#FFFFFF', '#E0E0E0', '#CCCCCC', '#F0F0F0']);
            setTextColor(colors[Math.floor(Math.random() * colors.length)]);
            
            const fonts = isHovered
            ? ['Share Tech Mono', 'Press Start 2P', 'IBM Plex Mono', 'Major Mono Display', 'DotGothic16', 'Pixelify Sans', 'Xanh Mono', 'monospace']
            : ['Share Tech Mono', 'Press Start 2P', 'IBM Plex Mono', 'monospace'];
            setFontFamily(fonts[Math.floor(Math.random() * fonts.length)]);
            
            const duration = isHovered ? 200 : 300;
            setTimeout(() => {
              if (!isHovered) {
                setIsShapeGlitching(false);
              }
              setTextColor(isContact ? 'black' : 'white');
              setFontFamily('Consolas');
              
              const threshold = isHovered ? 0.5 : 0.3;
              const minDelay = isHovered ? 1000 : 2000;
              const maxDelay = isHovered ? 2000 : 3000;
              
              if (Math.random() < threshold) {
                setTimeout(glitch, minDelay + Math.random() * maxDelay);
              } else {
                setTimeout(glitch, maxDelay + Math.random() * 2000);
              }
            }, duration);

            const fontChanges = isHovered ? 3 : 2;
            for(let i = 0; i < fontChanges; i++) {
              setTimeout(() => {
                const randomFont = fonts[Math.floor(Math.random() * fonts.length)];
                setFontFamily(randomFont);
              }, Math.random() * (isHovered ? 1000 : 2000));
            }
          };
          
          setTimeout(glitch, 12000);
        }, 200);
        return () => clearTimeout(timer);
      }
    }, [showText, isHovered, isContact]);

    const getGlitchShape = () => {
      if (!isShapeGlitching || isHovered) return { 
        className: 'rounded-lg w-full h-full', 
        clipPath: 'none',
        transform: 'none'
      };
      
      const shapes = [
        { 
          className: 'rounded-lg w-full h-full scale-100', 
          clipPath: 'none',
          transform: 'rotate(-1deg) scale(1.05)'
        },
        { 
          className: 'rounded-none w-full h-full', 
          clipPath: 'none',
          transform: 'rotate(1deg) scale(0.95)'
        },
        { 
          className: 'rounded-full w-full h-full',
          clipPath: 'circle(50% at 50% 50%)',
          transform: 'rotate(-1deg) scale(1.02)'
        },
        { 
          className: 'rounded-full w-full h-full',
          clipPath: 'circle(48% at 52% 48%)',
          transform: 'scale(1.05)'
        },
        { 
          className: 'w-full h-full',
          clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
          transform: 'rotate(1deg) scale(0.98)'
        },
        { 
          className: 'w-full h-full',
          clipPath: 'polygon(50% 100%, 100% 0%, 0% 0%)',
          transform: 'rotate(-2deg) scale(1.03)'
        },
        { 
          className: 'w-full h-full',
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          transform: 'rotate(2deg) scale(0.97)'
        },
        { 
          className: 'w-full h-full',
          clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
          transform: 'rotate(-1deg) scale(1.04)'
        },
        { 
          className: 'w-full h-full',
          clipPath: 'polygon(0% 20%, 60% 20%, 100% 0%, 100% 80%, 40% 80%, 0% 100%)',
          transform: 'rotate(1deg) scale(1.01)'
        }
      ];
      
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const offset = {
        x: (Math.random() - 0.5) * 4,
        y: (Math.random() - 0.5) * 4
      };
      
      return {
        ...shape,
        transform: `${shape.transform} translate(${offset.x}px, ${offset.y}px)`
      };
    };

    const shape = getGlitchShape();

    const getBackgroundStyles = () => {
      if (isHovered) {
        return {
          animation: `backgroundGlitch${isContact ? 'Contact' : ''} 4s infinite`
        };
      }
      return {};
    };

    return (
      <>
        <div 
          className={`relative ${showText ? 'slide-in-bck-center text-follow' : 'opacity-0'} cursor-pointer`} 
          style={{ width: '250px', height: '80px' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative overflow-visible w-full h-full flex items-center justify-center">
              <div 
                className={`absolute transition-all duration-20 
                  ${shape.className} 
                  ${isHovered ? 'background-glitch' : ''} 
                  ${isContact ? 'bg-white bg-opacity-40' : 'bg-black bg-opacity-40'}`}
                style={{ 
                  clipPath: shape.clipPath,
                  transform: shape.transform,
                  minWidth: '100%',
                  minHeight: '100%',
                  left: '0',
                  right: '0',
                  top: '0',
                  bottom: '0',
                  ...getBackgroundStyles()
                }}
              />
              
              <div className="relative z-10 px-10 py-5">
                <h1 
                  className={`font-bold transition-all duration-20
                    ${isMobile ? 'text-4xl' : 'text-6xl'} ${className}`}
                  style={{ 
                    color: textColor,
                    fontFamily: fontFamily,
                  }}
                >
                  {glitchedText}
                </h1>
              </div>
            </div>
          </div>
        </div>

        <SectionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          section={text}
        />
      </>
    );
  };

  TextElement.propTypes = {
    text: PropTypes.string.isRequired,
    className: PropTypes.string,
    isContact: PropTypes.bool
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes cameraFlash {
        0% { opacity: 0; }
        15% { opacity: 0.7; }
        100% { opacity: 0; }
      }

      .flash-animation {
        animation: cameraFlash 0.3s ease-out forwards;
      }

      @keyframes slide-in-bck-center {
        0% {
          transform: translateZ(400px);
          opacity: 0;
        }
        100% {
          transform: translateZ(0);
          opacity: 1;
        }
      }

      @keyframes backgroundMove {
        0% {
          transform: scale(1.02) translate(0, 0);
        }
        25% {
          transform: scale(1.02) translate(-1%, 0.5%);
        }
        50% {
          transform: scale(1.02) translate(-1%, -0.5%);
        }
        75% {
          transform: scale(1.02) translate(1%, -0.5%);
        }
        100% {
          transform: scale(1.02) translate(0, 0);
        }
      }

      @keyframes elementMove {
        0% {
          transform: translate(0, 0);
        }
        25% {
          transform: translate(-10px, 5px);
        }
        50% {
          transform: translate(-10px, -5px);
        }
        75% {
          transform: translate(10px, -5px);
        }
        100% {
          transform: translate(0, 0);
        }
      }

      @keyframes quickZoomOutMobile {
        0% { 
          transform: scale(10);
          transform-origin: 50% 57%;
        }
        100% { 
          transform: scale(1.02);
          transform-origin: 50% 57%;
        }
      }

      @keyframes quickZoomOut {
        0% { 
          transform: scale(10);
          transform-origin: 50% 50%;
        }
        100% { 
          transform: scale(1.02);
          transform-origin: 50% 50%;
        }
      }

      @keyframes zoom-out-reverse {
        0% { 
          transform: scale(1);
          opacity: 1;
        }
        100% { 
          transform: scale(0.1);
          opacity: 0;
        }
      }

      .zoom-out-animation-mobile {
        animation: quickZoomOutMobile 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards,
                   backgroundMove 30s ease-in-out infinite 0.8s;
      }

.zoom-out-animation-desktop {
        animation: quickZoomOut 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards,
                   backgroundMove 30s ease-in-out infinite 0.8s;
      }

      .animate-zoom-out-reverse {
        animation: zoom-out-reverse 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      }

      .slide-in-bck-center {
        animation: slide-in-bck-center 0.8s cubic-bezier(0.250, 0.460, 0.450, 0.940) forwards;
      }

      .text-follow {
        animation: elementMove 30s ease-in-out infinite;
        animation-delay: 1.2s;
      }

      .slide-in-bck-center.text-follow {
        animation: 
          slide-in-bck-center 0.8s cubic-bezier(0.250, 0.460, 0.450, 0.940) forwards,
          elementMove 30s ease-in-out infinite 2s;
      }

      .background-glitch {
        animation: backgroundGlitch 4s infinite;
      }

      @keyframes backgroundGlitch {
        0% {
          background-color: rgba(0, 0, 0, 0.4);
          transform: scale(1);
        }
        15% {
          background-color: rgba(50, 0, 0, 0.4);
          transform: scale(1.02);
        }
        25% {
          background-color: rgba(0, 0, 0, 0.4);
          transform: scale(1);
        }
        35% {
          background-color: rgba(0, 30, 50, 0.4);
          transform: scale(1.02);
        }
        45% {
          background-color: rgba(0, 0, 0, 0.4);
          transform: scale(1);
        }
        55% {
          background-color: rgba(50, 0, 50, 0.4);
          transform: scale(1.02);
        }
        65% {
          background-color: rgba(0, 0, 0, 0.4);
          transform: scale(1);
        }
        75% {
          background-color: rgba(0, 50, 0, 0.4);
          transform: scale(1.02);
        }
        85% {
          background-color: rgba(0, 0, 0, 0.4);
          transform: scale(1);
        }
        95% {
          background-color: rgba(50, 50, 0, 0.4);
          transform: scale(1.02);
        }
        100% {
          background-color: rgba(0, 0, 0, 0.4);
          transform: scale(1);
        }
      }

      @keyframes backgroundGlitchContact {
        0% {
          background-color: rgba(255, 255, 255, 0.4);
          transform: scale(1);
        }
        15% {
          background-color: rgba(255, 235, 235, 0.4);
          transform: scale(1.02);
        }
        25% {
          background-color: rgba(255, 255, 255, 0.4);
          transform: scale(1);
        }
        35% {
          background-color: rgba(235, 255, 255, 0.4);
          transform: scale(1.02);
        }
        45% {
          background-color: rgba(255, 255, 255, 0.4);
          transform: scale(1);
        }
        55% {
          background-color: rgba(255, 235, 255, 0.4);
          transform: scale(1.02);
        }
        65% {
          background-color: rgba(255, 255, 255, 0.4);
          transform: scale(1);
        }
        75% {
          background-color: rgba(235, 255, 235, 0.4);
          transform: scale(1.02);
        }
        85% {
          background-color: rgba(255, 255, 255, 0.4);
          transform: scale(1);
        }
        95% {
          background-color: rgba(255, 255, 235, 0.4);
          transform: scale(1.02);
        }
        100% {
          background-color: rgba(255, 255, 255, 0.4);
          transform: scale(1);
        }
      }

      .background-glitch::before {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        background: inherit;
        filter: blur(4px);
        opacity: 0;
        animation: glowPulse 4s infinite;
      }

      @keyframes glowPulse {
        0%, 100% {
          opacity: 0;
        }
        50% {
          opacity: 0.3;
        }
      }

      .background-glitch::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
          to bottom,
          transparent 50%,
          rgba(0, 0, 0, 0.05) 51%,
          transparent 51%
        );
        background-size: 100% 4px;
        opacity: 0;
        animation: scanlines 4s infinite;
      }

      @keyframes scanlines {
        0%, 100% {
          opacity: 0;
        }
        50% {
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleCenterClick = useCallback((e) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const clickRadius = 100;
  
    if (Math.abs(e.clientX - centerX) < clickRadius && 
        Math.abs(e.clientY - centerY) < clickRadius) {
      clickCountRef.current += 1;
      
      if (clickCountRef.current === 5) {
        setIsReturning(true);
        // Add flash effect
        const flash = document.createElement('div');
        flash.className = 'absolute inset-0 bg-white flash-animation';
        flash.style.zIndex = '60';
        document.body.appendChild(flash);
  
        // Remove flash and trigger return
        setTimeout(() => {
          document.body.removeChild(flash);
          setShowNewPage(false);
          setShowText(false);
          setIsVisible(false);
          // Signal to parent to show matrix rain and remove other elements
          onReturnToMatrix({
            hideText: true,
            hideTerminal: true,
            showFractals: true
          });
        }, 300);
      }
    }
  }, [onReturnToMatrix]);

  const handleTransition = useCallback(() => {
    if (!isVisible) return;
    setTimeout(() => {
      setShowNewPage(true);
      setTimeout(() => {
        setShowText(true);
      }, 1200);
    }, 200);
  }, [isVisible]);

  useEffect(() => {
    const handleClick = () => {
      if (!isVisible && !isReturning) {
        setIsVisible(true);
      }
    };
    
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, [isVisible, isReturning]);

  useEffect(() => {
    if (isVisible) {
      handleTransition();
    }
  }, [isVisible, handleTransition]);

  if (showNewPage) {
    return (
      <div 
        className="fixed inset-0 z-50 overflow-hidden"
        onClick={handleCenterClick}
      >
        <img
          src={isMobile ? mobileImg : laptopImg}
          alt="Background"
          className={`w-full h-full object-cover ${
            isReturning ? 'animate-zoom-out-reverse' :
            isMobile ? 'zoom-out-animation-mobile' : 'zoom-out-animation-desktop'
          }`}
        />
        
        {/* Desktop Layout */}
        <div className={`absolute inset-0 ${isMobile ? 'hidden' : 'flex'}`}>
          <div className="w-full h-full flex flex-col">
            <div className="flex-1 flex justify-around pt-10">
              <div className="flex items-end" style={{ width: '250px' }}> 
                <TextElement text="Bio" />
              </div>
              <div className="flex items-start" style={{ width: '250px' }}> 
                <TextElement text="Projects" />
              </div>
              <div className="flex items-end" style={{ width: '250px' }}> 
                <TextElement text="Skills" />
              </div>
            </div>
            <div className="flex-1 flex justify-center items-center">
              <TextElement text="Contact" isContact={true} />
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className={`absolute inset-0 ${isMobile ? 'block' : 'hidden'}`}>
          <div className="h-full flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-evenly">
              <TextElement text="Bio" />
              <TextElement text="Projects" />
              <TextElement text="Skills" />
            </div>
            <div className="flex-1 flex items-center justify-center">
              <TextElement text="Contact" isContact={true} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      {isVisible && (
        <div 
          className="absolute inset-0 bg-white flash-animation"
          style={{ zIndex: 60 }}
        />
      )}
    </div>
  );
};

PageTransition.propTypes = {
  onReturnToMatrix: PropTypes.func.isRequired
};

export default PageTransition;