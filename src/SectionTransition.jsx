// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import MatrixRain from './MatrixRain';

const SectionTransition = ({ children, title }) => {
  const [isZoomingIn, setIsZoomingIn] = useState(false);
  const [showContent, setShowContent] = useState(false);
  
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes zoomIn {
        0% {
          transform: scale(1);
          transform-origin: center center;
        }
        100% {
          transform: scale(10);
          transform-origin: center center;
        }
      }

      @keyframes cameraFlash {
        0% { opacity: 0; }
        15% { opacity: 0.7; }
        100% { opacity: 0; }
      }

      .zoom-in-animation {
        animation: zoomIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      }

      .flash-animation {
        animation: cameraFlash 0.3s ease-out forwards;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleTransition = useCallback(() => {
    setIsZoomingIn(true);
    setTimeout(() => {
      const flash = document.createElement('div');
      flash.className = 'fixed inset-0 bg-white flash-animation';
      flash.style.zIndex = '9999';
      document.body.appendChild(flash);
      
      setTimeout(() => {
        document.body.removeChild(flash);
        setShowContent(true);
      }, 300);
    }, 800);
  }, []);

  if (showContent) {
    return (
      <div className="fixed inset-0 z-50 overflow-hidden bg-black">
        <MatrixRain />
        <div className="relative z-10 w-full h-full">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`w-full h-full ${isZoomingIn ? 'zoom-in-animation' : ''}`}
      onClick={handleTransition}
    >
      {title}
    </div>
  );
};

SectionTransition.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.node.isRequired
};

export default SectionTransition;