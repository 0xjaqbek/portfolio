// BioSection.jsx
// eslint-disable-next-line no-unused-vars
import React from 'react';
import MatrixRain from './MatrixRain';
import SectionTransition from './SectionTransition';

const ContactSection = () => {
  return (
    <SectionTransition>
      <div className="relative min-h-screen">
        {/* Matrix Rain Background */}
        <div className="fixed inset-0">
          <MatrixRain />
        </div>
        
        {/* Content Overlay */}
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="max-w-4xl mx-auto p-8 bg-black bg-opacity-80 text-green-500 rounded-lg">
            <h1 className="text-4xl md:text-6xl font-mono mb-8">Bio</h1>
            {/* Add your bio content here */}
            <p className="text-lg md:text-xl font-mono">
              Your bio content goes here...
            </p>
          </div>
        </div>
      </div>
    </SectionTransition>
  );
};

export default ContactSection;