import React, { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
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
      <div className="space-y-4 col-span-full">
        <p className="text-green-300">
        I am a passionate self-taught developer specializing in building websites and web applications using HTML, CSS, JavaScript, TypeScript, Tailwind CSS, React, Vite, SCSS, and Node.js. My expertise extends to creating Telegram bots, games, and smart contracts for EVM-compatible blockchains, along with developing dApps and web3 solutions. I have experience working with NoSQL databases like Firebase.
        <br></br><br></br>
Driven by a strong desire to learn and grow, I have leveraged artificial intelligence to rapidly expand my skill set. Although my primary interest lies in web3 development, I am eager to take on projects in any area that offers opportunities for growth. Coding has been a passion since elementary school, and over the past three years, I have dedicated myself intensively to mastering this field.
<br></br><br></br>
I am ready to take on any challenge, always open to new learning experiences and eager to contribute.
        </p>
      </div>
    ),
    Projects: [
        {
          element: (
            <div key="1" className="relative">
              <div className="group cursor-pointer" onClick={() => {
                const content = document.getElementById('project-1-content');
                content.style.maxHeight = content.style.maxHeight ? null : content.scrollHeight + 'px';
              }}>
                <div className="flex justify-between items-center">
                  <h3 className="text-xl text-green-400 mb-2">Audit Document Management System</h3>
                  <ChevronDown className="h-5 w-5 text-green-400 group-hover:text-green-300 transition-transform duration-300 ease-in-out group-[.expanded]:rotate-180" />
                </div>
                <p className="text-green-300 mb-2">A web application for managing audit documentation with validation workflow</p>
                
                <div id="project-1-content" className="overflow-hidden max-h-0 transition-all duration-500 ease-in-out">
                  <div className="space-y-4 mt-4 border-t border-green-400/30 pt-4">
                    <div>
                      <h4 className="text-green-400 text-sm font-semibold mb-2">Tech Stack</h4>
                      <div className="text-green-300 text-sm grid grid-cols-1 gap-2">
                        <div>Frontend: HTML5, CSS3, JavaScript (ES6+)</div>
                        <div>Backend: Firebase (Firestore)</div>
                        <div>Authentication: Firebase Auth</div>
                        <div>UI Framework: Bootstrap 5</div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-green-400 text-sm font-semibold mb-2">Key Features</h4>
                      <ul className="text-green-300 text-sm space-y-1 list-disc list-inside">
                        <li>Document creation and management</li>
                        <li>Multi-step validation process</li>
                        <li>Real-time updates</li>
                        <li>PDF report generation</li>
                        <li>Mobile-responsive design</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-green-400 text-sm font-semibold mb-2">Technical Highlights</h4>
                      <ul className="text-green-300 text-sm space-y-1 list-disc list-inside">
                        <li>Firebase real-time database integration</li>
                        <li>Component-based architecture</li>
                        <li>State management system</li>
                        <li>Responsive UI/UX design</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        },
        {
          element: (
            <div key="2" className="relative">
              <div className="group cursor-pointer" onClick={() => {
                const content = document.getElementById('project-2-content');
                content.style.maxHeight = content.style.maxHeight ? null : content.scrollHeight + 'px';
              }}>
                <div className="flex justify-between items-center">
                  <h3 className="text-xl text-green-400 mb-2">Medical Consent Form System</h3>
                  <ChevronDown className="h-5 w-5 text-green-400 group-hover:text-green-300 transition-transform duration-300 ease-in-out group-[.expanded]:rotate-180" />
                </div>
                <p className="text-green-300 mb-2">A web application for collecting and managing medical consent forms with digital signature capabilities</p>
                
                <div id="project-2-content" className="overflow-hidden max-h-0 transition-all duration-500 ease-in-out">
                  <div className="space-y-4 mt-4 border-t border-green-400/30 pt-4">
                    <div>
                      <h4 className="text-green-400 text-sm font-semibold mb-2">Tech Stack</h4>
                      <div className="text-green-300 text-sm grid grid-cols-1 gap-2">
                        <div>Frontend: HTML5, CSS3, JavaScript (ES6+)</div>
                        <div>UI Components: Custom CSS with CSS Variables</div>
                        <div>PDF Generation: jsPDF</div>
                        <div>Digital Signature: SignaturePad</div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-green-400 text-sm font-semibold mb-2">Key Features</h4>
                      <ul className="text-green-300 text-sm space-y-1 list-disc list-inside">
                        <li>Digital consent form creation</li>
                        <li>Electronic signature capture</li>
                        <li>PDF document generation</li>
                        <li>Mobile-responsive design</li>
                        <li>Polish language support</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-green-400 text-sm font-semibold mb-2">Technical Highlights</h4>
                      <ul className="text-green-300 text-sm space-y-1 list-disc list-inside">
                        <li>Modular JavaScript architecture</li>
                        <li>Component-based styling system</li>
                        <li>Canvas-based image processing</li>
                        <li>Mobile-first responsive design</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      ].map(({ element }) => element),
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
        <div className="space-y-4 col-span-full">
          <form className="space-y-4" onSubmit={(e) => {
            e.preventDefault();
            const message = e.target.elements.message.value;
            const email = e.target.elements.email.value;
            if (message && email) {
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
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <input
                type="email"
                name="email"
                placeholder="Your email address"
                className="flex-1 p-3 text-green-300 bg-transparent border border-green-400 
                  rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
              <button type="submit" className="px-4 py-2 font-semibold text-green-400 
                border border-green-400 rounded-lg hover:bg-green-400 whitespace-nowrap
                hover:text-black transition-colors">
                Send Message
              </button>
            </div>
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
      <div className={`absolute inset-0 transition-opacity duration-300
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

            <div className={`grid ${section === 'Bio' || section === 'Contact' ? 'grid-cols-1' : window.innerWidth >= 768 ? 'grid-cols-2 gap-6' : 'grid-cols-1 gap-4'}`}>
              {currentItems.map((item, index) => (
                <div key={index} className={`${section !== 'Contact' ? 'border border-green-400' : ''} p-4 rounded-lg ${(section === 'Bio' || section === 'Contact') ? 'col-span-full' : ''}`}>
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