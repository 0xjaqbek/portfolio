import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import PropTypes from 'prop-types';
import mobileImg from './mobile11.jpg';
import laptopImg from './laptop11.jpg';

const SectionModal = ({ isOpen, onClose, section }) => {
  const [showContent, setShowContent] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isClosing, setIsClosing] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);
  const itemsPerPage = 6;
  const canvasRef = React.useRef(null);
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes zoom-in {
        0% { 
          transform: scale(1);
          transform-origin: center center;
        }
        100% { 
          transform: scale(10) translateY(-5%);
          transform-origin: center center;
        }
      }

      @keyframes zoom-out {
        0% { 
          transform: scale(10) translateY(-5%);
          transform-origin: center center;
        }
        100% { 
          transform: scale(1);
          transform-origin: center center;
        }
      }

      .animate-zoom-in {
        animation: zoom-in 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      }

      .animate-zoom-out {
        animation: zoom-out 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setShowContent(true);
        setShowMatrix(true);
      }, 100);
    } else {
      setShowContent(false);
      setShowMatrix(false);
      setCurrentPage(1);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!showContent || !showMatrix || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';
    const fontSize = 16;
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
    
    const interval = setInterval(draw, 33);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [showContent, showMatrix]);

  const handleClose = () => {
    setShowContent(false);
    setShowMatrix(false);
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 800);
  };

  if (!isOpen && !isClosing) return null;

  const content = {
    Bio: (
      <div className="space-y-4">
        <p className="text-green-300">
          I am a passionate self-taught developer specializing in building websites 
          and web applications using HTML, CSS, JavaScript, TypeScript, Tailwind CSS, 
          React, Vite, SCSS, and Node.js. My expertise extends to creating Telegram 
          bots, games, and smart contracts for EVM-compatible blockchains, along with 
          developing dApps and web3 solutions.
        </p>
      </div>
    ),
    Projects: [
      <div key="1">
        <h3 className="text-xl text-green-400 mb-2">Matrix Portfolio</h3>
        <p className="text-green-300">An interactive portfolio inspired by The Matrix</p>
      </div>,
      <div key="2">
        <h3 className="text-xl text-green-400 mb-2">Project Beta</h3>
        <p className="text-green-300">Description of another awesome project</p>
      </div>
    ],
    Skills: [
      <div key="1">
        <h3 className="text-xl text-green-400 mb-2">Frontend</h3>
        <ul className="text-green-300 space-y-1">
          <li>HTML & Tailwind CSS</li>
          <li>JavaScript (ES6+)</li>
          <li>React / Vite</li>
        </ul>
      </div>,
      <div key="2">
        <h3 className="text-xl text-green-400 mb-2">Backend</h3>
        <ul className="text-green-300 space-y-1">
          <li>Node.js</li>
          <li>Express.js</li>
          <li>NoSQL (Firebase, MongoDB)</li>
        </ul>
      </div>
    ],
    Contact: (
      <div className="space-y-4">
        <form className="space-y-4" onSubmit={(e) => {
          e.preventDefault();
          const message = e.target.elements.message.value;
          if (message) {
            alert('Message sent!');
            handleClose();
          }
        }}>
          <textarea
            name="message"
            placeholder="Write your message here..."
            className="w-full p-3 text-green-300 bg-transparent border border-green-400 
              rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            rows="5"
            required
          />
          <button type="submit" className="px-4 py-2 font-semibold text-green-400 
            border border-green-400 rounded-lg hover:bg-green-400 
            hover:text-black transition-colors">
            Send Message
          </button>
        </form>
      </div>
    )
  };

  const currentContent = content[section];
  const items = Array.isArray(currentContent) ? currentContent : [currentContent];
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const currentItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Background Image with Zoom Effect */}
      <div className="absolute inset-0">
        <img
          src={isMobile ? mobileImg : laptopImg}
          alt="Background"
          className={`w-full h-full object-cover
            ${isClosing ? 'animate-zoom-out' : 'animate-zoom-in'}
          `}
        />
      </div>

      {/* Matrix Rain Effect */}
      {showMatrix && <canvas ref={canvasRef} className="absolute inset-0" />}
      
      {/* Content */}
      <div className={`absolute inset-0 transition-opacity duration-500
        ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="bg-black bg-opacity-80 border border-green-400 rounded-lg 
            p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-green-400">{section}</h2>
              <button onClick={handleClose} className="text-green-400 hover:text-green-300">
                <X size={24} />
              </button>
            </div>

            <div className={`grid ${window.innerWidth >= 768 ? 'grid-cols-2 gap-6' : 'grid-cols-1 gap-4'}`}>
              {currentItems.map((item, index) => (
                <div key={index} className="border border-green-400 p-4 rounded-lg">
                  {item}
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-6 flex justify-center space-x-4">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-green-400 border border-green-400 
                    rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-green-400 flex items-center">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-green-400 border border-green-400 
                    rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

SectionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  section: PropTypes.oneOf(['Bio', 'Projects', 'Skills', 'Contact']).isRequired
};

export default SectionModal;