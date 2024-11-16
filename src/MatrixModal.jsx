// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MatrixRain from './MatrixRain';

const MatrixModal = ({ isOpen, onClose, content, section }) => {
  const [isZooming, setIsZooming] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = window.innerWidth >= 768 ? 4 : 2;
  const totalPages = Math.ceil((content?.length || 0) / itemsPerPage);

  useEffect(() => {
    if (isOpen) {
      setIsZooming(true);
      setTimeout(() => {
        setShowContent(true);
      }, 800);
    } else {
      setShowContent(false);
      setIsZooming(false);
      setCurrentPage(1);
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

  const getCurrentItems = () => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return content?.slice(start, end) || [];
  };

  if (!isOpen && !isClosing) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden">
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-500
          ${showContent ? 'bg-opacity-90' : 'bg-opacity-0'}`}
      />
      
      <div className="absolute inset-0">
        <div className={`w-full h-full transform transition-transform duration-800
          ${isZooming && !isClosing ? 'scale-150' : ''}
          ${isClosing ? 'scale-0' : ''}`}>
          <MatrixRain />
        </div>
      </div>

      {showContent && (
        <div className={`absolute inset-0 flex items-center justify-center p-4 
          transition-opacity duration-500 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
          <div className="bg-black bg-opacity-80 border border-green-400 rounded-lg p-6 w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-green-400">{section}</h2>
              <button onClick={handleClose} className="text-green-400 hover:text-green-300">
                &times;
              </button>
            </div>

            <div className={`grid ${window.innerWidth >= 768 ? 'grid-cols-2 gap-6' : 'grid-cols-1 gap-4'}`}>
              {getCurrentItems().map((item, index) => (
                <div key={index} className="border border-green-400 p-4 rounded-lg">
                  {item}
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-6 space-x-4">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="text-green-400 disabled:opacity-50"
                >
                  <ChevronLeft />
                </button>
                <span className="text-green-400">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="text-green-400 disabled:opacity-50"
                >
                  <ChevronRight />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

MatrixModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  content: PropTypes.array,
  section: PropTypes.string.isRequired
};

export default MatrixModal;