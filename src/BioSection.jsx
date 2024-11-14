// eslint-disable-next-line no-unused-vars
import React from 'react';
import SectionTransition from './SectionTransition';
import { TextElement } from './PageTransition'; // Import your existing TextElement

const BioSection = () => {
  const bioContent = (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-green-400">
      <h1 className="text-4xl md:text-6xl mb-8">Biography</h1>
      <div className="max-w-2xl text-lg md:text-xl space-y-4">
        <p>Your bio content goes here...</p>
        <p>More paragraphs...</p>
      </div>
    </div>
  );

  return (
    <SectionTransition title={<TextElement text="Bio" />}>
      {bioContent}
    </SectionTransition>
  );
};

export default BioSection;