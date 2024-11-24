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
  const fractalCanvasRef = useRef(null);
  const { isMobile } = useResponsive();
  const [showOverlay, setShowOverlay] = useState(true);
  const [overlayOpacity, setOverlayOpacity] = useState(1);
  const [textProgress, setTextProgress] = useState(0);
  const [showText, setShowText] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [showFractals, setShowFractals] = useState(false);
  const timeRef = useRef(0);
  const [showPageTransition, setShowPageTransition] = useState(false);
  const [showInitialAnimation, setShowInitialAnimation] = useState(true); // Add this line
    

    // Function to handle return from PageTransition
    const handleReturnToMatrix = () => {
      setShowPageTransition(false);
      setShowText(false);        // Hide jaqbek text
      setShowTerminal(false);    // Hide terminal text
      setTextProgress(0);        // Reset text animation progress
      setTimeout(() => {
        setShowFractals(true);
      }, 1000);
    };

    useEffect(() => {
      if (clickCount === 5) {
        setShowFractals(true);
      }
    }, [clickCount]);

    useEffect(() => {
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
              setTimeout(() => {
                setShowTerminal(true);
              }, 500);
            }
          };
          
          requestAnimationFrame(animateText);
        }, 1500);
      }, 1000);
      
      // Matrix rain setup
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        if (fractalCanvasRef.current) {
          fractalCanvasRef.current.width = window.innerWidth;
          fractalCanvasRef.current.height = window.innerHeight;
        }
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
      
      const matrixInterval = setInterval(draw, isMobile ? 50 : 33);
      
      // Fractal animation setup
      let fractalAnimationId;
      
      if (showFractals && fractalCanvasRef.current) {
        const fractalCtx = fractalCanvasRef.current.getContext('2d');
        const fractalColors = ['#00ff00', '#00cc00', '#009900', '#006600'];
        
        const drawFractal = () => {
          fractalCtx.fillStyle = 'rgba(0, 0, 0, 0.1)';
          fractalCtx.fillRect(0, 0, canvas.width, canvas.height);

          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;

          for (let i = 0; i < 8; i++) {
            const angle = (timeRef.current + i * Math.PI / 4) % (Math.PI * 2);
            const scale = Math.sin(timeRef.current * 0.5) * 100 + 150;
            
            fractalCtx.save();
            fractalCtx.translate(centerX, centerY);
            fractalCtx.rotate(angle);
            
            drawSierpinskiTriangle(
              fractalCtx,
              0, -scale,
              scale * Math.cos(Math.PI / 6), scale * Math.sin(Math.PI / 6),
              -scale * Math.cos(Math.PI / 6), scale * Math.sin(Math.PI / 6),
              3,
              fractalColors
            );
            
            fractalCtx.restore();
          }

          timeRef.current += 0.02;
          fractalAnimationId = requestAnimationFrame(drawFractal);
        };

        drawFractal();
      }

      return () => {
        clearInterval(matrixInterval);
        if (fractalAnimationId) {
          cancelAnimationFrame(fractalAnimationId);
        }
        window.removeEventListener('resize', resizeCanvas);
      };
    }, [isMobile, showFractals]);

    const handleScreenClick = (e) => {
      // Don't trigger if clicking a button or within modal
      if (
        e.target.tagName.toLowerCase() === 'button' || 
        e.target.closest('.modal-content') ||
        e.target.closest('a') ||  // For any links
        showPageTransition  // Don't count clicks when page transition is showing
      ) {
        return;
      }
    
      setClickCount(prev => {
        const newCount = prev + 1;
        if (newCount === 5) {
          setShowText(false);        
          setShowTerminal(false);    
          setTextProgress(0);        
          setShowInitialAnimation(false);
          
          // Show fractals after a delay
          setTimeout(() => {
            setShowFractals(true);
          }, 1000);
        }
        return newCount;
      });
    };

    const Text = () => {
      const letters = 'jaqbek'.split('');
      const startSpacing = isMobile ? 5000 : 10000;
      const endSpacing = isMobile ? 30 : 70;
      const currentSpacing = startSpacing + (endSpacing - startSpacing) * textProgress;
      
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

    // Handle initial click to show PageTransition
    useEffect(() => {
      const handleInitialClick = () => {
        if (!showPageTransition) {
          setShowPageTransition(true);
          setShowText(false);        
          setShowTerminal(false);    
          setTextProgress(0);        
          setShowInitialAnimation(false); 
        }
      };
      
      window.addEventListener('click', handleInitialClick);
      return () => {
        window.removeEventListener('click', handleInitialClick);
      };
    }, [showPageTransition]);
  
return (
  <div 
    className="relative w-full h-screen bg-black overflow-hidden"
    onClick={handleScreenClick}
  >
    <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
    {showFractals && (
      <canvas 
        ref={fractalCanvasRef} 
        className="absolute top-0 left-0 w-full h-full"
        style={{ opacity: 0.3 }}
      />
    )}
    
    {/* Only show text if showInitialAnimation is true */}
    {showInitialAnimation && showText && (
      <div className="absolute inset-0 flex items-end pb-[25vh] justify-center z-10">
        <Text />
      </div>
    )}

    {/* Only show terminal if showInitialAnimation is true */}
    {showInitialAnimation && showTerminal && (
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

    {showPageTransition && (
      <PageTransition onReturnToMatrix={handleReturnToMatrix} />
    )}
  </div>
);
};

// Helper function for drawing Sierpinski Triangle
const drawSierpinskiTriangle = (ctx, x1, y1, x2, y2, x3, y3, depth, colors) => {
  if (depth === 0) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    ctx.strokeStyle = colors[Math.floor(Math.random() * colors.length)];
    ctx.stroke();
    return;
  }

  const x12 = (x1 + x2) / 2;
  const y12 = (y1 + y2) / 2;
  const x23 = (x2 + x3) / 2;
  const y23 = (y2 + y3) / 2;
  const x31 = (x3 + x1) / 2;
  const y31 = (y3 + y1) / 2;

  drawSierpinskiTriangle(ctx, x1, y1, x12, y12, x31, y31, depth - 1, colors);
  drawSierpinskiTriangle(ctx, x12, y12, x2, y2, x23, y23, depth - 1, colors);
  drawSierpinskiTriangle(ctx, x31, y31, x23, y23, x3, y3, depth - 1, colors);
};

export default MatrixRain;