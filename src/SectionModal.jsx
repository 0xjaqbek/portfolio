// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';
import mobileImg from './mobile11.jpg';
import laptopImg from './laptop11.jpg';
import emailjs from 'emailjs-com';
emailjs.init("i4S-o_htYOvZA6Vxf"); 

const SectionModal = ({ isOpen, onClose, section }) => {
    const [isZooming, setIsZooming] = useState(false);
    const [showContent, setShowContent] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    
    useEffect(() => {
        if (isOpen) {
          setIsZooming(true);
          setTimeout(() => {
            setShowContent(true);
          }, 800);
        } else {
          setShowContent(false);
          setIsZooming(false);
        }
      }, [isOpen]);
  
    const handleClose = () => {
      setShowContent(false);
      setIsClosing(true);
      setTimeout(() => {
        setIsZooming(false);
        setIsClosing(false);
        onClose();
      }, 800);
    };

  const modalContent = {
    Bio: (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-green-400">About Me</h2>
        <p className="text-green-300">
        I am a passionate self-taught developer specializing in building websites and web applications using HTML, CSS, JavaScript, TypeScript, Tailwind CSS, React, Vite, SCSS, and Node.js. My expertise extends to creating Telegram bots, games, and smart contracts for EVM-compatible blockchains, along with developing dApps and web3 solutions. I have experience working with NoSQL databases like Firebase. <br></br><br></br>

Driven by a strong desire to learn and grow, I have leveraged artificial intelligence to rapidly expand my skill set. Although my primary interest lies in web3 development, I am eager to take on projects in any area that offers opportunities for growth. Coding has been a passion since elementary school, and over the past three years, I have dedicated myself intensively to mastering this field.<br></br><br></br>

I am ready to take on any challenge, always open to new learning experiences and eager to contribute.
        </p>
      </div>
    ),
    Projects: (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-green-400">Featured Projects</h2>
        <div className="space-y-4">
          <div className="border border-green-400 p-4 rounded-lg">
            <h3 className="text-xl text-green-400">Matrix Portfolio</h3>
            <p className="text-green-300">An interactive portfolio inspired by The Matrix</p>
          </div>
          <div className="border border-green-400 p-4 rounded-lg">
            <h3 className="text-xl text-green-400">Project Beta</h3>
            <p className="text-green-300">Description of another awesome project</p>
          </div>
        </div>
      </div>
    ),
    Skills: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-green-400">Technical Skills</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Frontend Skills */}
            <div className="border border-green-400 p-4 rounded-lg">
              <h3 className="text-xl text-green-400">Frontend</h3>
              <ul className="text-green-300 space-y-1">
                <li>HTML & Tailwind CSS</li>
                <li>JavaScript (ES6+)</li>
                <li>React / Vite</li>
              </ul>
            </div>
      
            {/* Backend Skills */}
            <div className="border border-green-400 p-4 rounded-lg">
              <h3 className="text-xl text-green-400">Backend</h3>
              <ul className="text-green-300 space-y-1">
                <li>Node.js</li>
                <li>Express.js</li>
                <li>NoSQL (Firebase, MongoDB)</li>
              </ul>
            </div>
      
            {/* Web3 & Blockchain Skills */}
            <div className="border border-green-400 p-4 rounded-lg">
              <h3 className="text-xl text-green-400">Web3 & Blockchain</h3>
              <ul className="text-green-300 space-y-1">
                <li>Smart Contracts (Solidity)</li>
                <li>dApps Development</li>
                <li>Wagmi, Ethers.js</li>
              </ul>
            </div>
      
            {/* Additional Skills */}
            <div className="border border-green-400 p-4 rounded-lg">
              <h3 className="text-xl text-green-400">Additional Skills</h3>
              <ul className="text-green-300 space-y-1">
                <li>Version Control (Git, GitHub)</li>
                <li>Telegram Bot and Game Development</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      
      Contact: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-green-400">Get in Touch</h2>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              const message = e.target.elements.message.value;
       
              if (message) {
                emailjs
                  .send(
                    'service_1usjzjk',
                    'template_m3pfymc',
                    { message },
                    'i4S-o_htYOvZA6Vxf'
                  )
                  .then(
                    // eslint-disable-next-line no-unused-vars
                    (result) => {
                      alert('Message sent successfully!');
                      e.target.reset();
                      handleClose(); // Add this line to close modal
                    },
                    (error) => {
                      alert('Failed to send message, please try again later.');
                      console.error('EmailJS error:', error);
                    }
                  );
              } else {
                alert('Please enter a message.');
              }
            }}
          >
            {/* Message Input */}
            <div>
              <textarea
                id="message"
                name="message"
                placeholder="Write your message here..."
                className="w-full p-3 text-green-300 bg-transparent border border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                rows="5"
                required
              />
            </div>
      
            {/* Send Button */}
            <button
              type="submit"
              className="px-4 py-2 font-semibold text-green-400 border border-green-400 rounded-lg hover:bg-green-400 hover:text-black transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      )
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes modal-zoom-in {
        0% { 
          transform: scale(1) translateY(+10%);
          transform-origin: center center;
        }
        100% { 
          transform: scale(10) translateY(-6%);
          transform-origin: center center;
        }
      }

      @keyframes modal-zoom-out {
        0% { 
          transform: scale(10) translateY(-10%);
          transform-origin: center center;
        }
        100% { 
          transform: scale(1) translateY(0);
          transform-origin: center center;
        }
      }

      .modal-animate-zoom-in {
        animation: modal-zoom-in 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      }

      .modal-animate-zoom-out {
        animation: modal-zoom-out 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (!isOpen && !isClosing) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden">
      <div 
        className={`absolute inset-0 bg-black bg-opacity-90 transition-opacity duration-500
          ${showContent ? 'opacity-100' : 'opacity-0'}`}
      />
      
      <div 
        className="absolute inset-0 overflow-hidden"
      >
        <div className={`w-full h-full
          ${isZooming && !isClosing ? 'modal-animate-zoom-in' : ''}
          ${isClosing ? 'modal-animate-zoom-out' : ''}
          ${showContent ? 'scale-100' : 'scale-10'}`}>
          <img
            src={window.innerWidth < 768 ? mobileImg : laptopImg}
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {showContent && (
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="bg-black bg-opacity-80 border border-green-400 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <button
                onClick={handleClose}
                className="text-green-400 hover:text-green-300 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            {modalContent[section]}
          </div>
        </div>
      )}
    </div>
  );
};

SectionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  section: PropTypes.oneOf(['Bio', 'Projects', 'Skills', 'Contact']).isRequired
};

export default SectionModal;