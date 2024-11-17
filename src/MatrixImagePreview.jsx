// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

// Replace defaultProps with default parameter
const MatrixImagePreview = ({ images = [], onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black bg-opacity-95 flex items-center justify-center">
      <div className="relative w-full h-full max-w-4xl mx-auto p-4">
        {/* Navigation Buttons */}
        <button
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-400 hover:text-green-300 z-10"
        >
          <ChevronLeft size={40} className="matrix-header" />
        </button>
        
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-400 hover:text-green-300 z-10"
        >
          <ChevronRight size={40} className="matrix-header" />
        </button>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-green-400 hover:text-green-300 z-10"
        >
          <X size={30} className="matrix-header" />
        </button>

        {/* Image Container */}
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src={images[currentIndex]}
            alt={`Preview ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain"
          />
          
          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-green-400 matrix-header">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      </div>
    </div>
  );
};

MatrixImagePreview.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClose: PropTypes.func.isRequired,
};

// Add runtime validation
const validateProps = ({ images }) => {
  if (!images || images.length === 0) {
    throw new Error('MatrixImagePreview: images array cannot be empty');
  }
};

// Wrapper component with validation
const WrappedMatrixImagePreview = (props) => {
  validateProps(props);
  return <MatrixImagePreview {...props} />;
};

WrappedMatrixImagePreview.propTypes = MatrixImagePreview.propTypes;

export default WrappedMatrixImagePreview;