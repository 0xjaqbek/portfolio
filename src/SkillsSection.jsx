// BioSection.jsx
// eslint-disable-next-line no-unused-vars
import React from 'react';
import SectionTransition from './SectionTransition';
import { TextElement } from './PageTransition';

const SkillsSection = () => {
  const skillsContent = (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-green-400">
      <h1 className="text-4xl md:text-6xl mb-8">Skills</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl">
        <div className="bg-black bg-opacity-50 p-6 rounded-lg">
          <h2 className="text-2xl mb-4">Frontend</h2>
          <ul className="space-y-2">
            <li>React</li>
            <li>TypeScript</li>
            <li>Tailwind CSS</li>
          </ul>
        </div>
        <div className="bg-black bg-opacity-50 p-6 rounded-lg">
          <h2 className="text-2xl mb-4">Backend</h2>
          <ul className="space-y-2">
            <li>Node.js</li>
            <li>Python</li>
            <li>SQL</li>
          </ul>
        </div>
        {/* Add more skill categories as needed */}
      </div>
    </div>
  );

  return (
    <SectionTransition title={<TextElement text="Skills" />}>
      {skillsContent}
    </SectionTransition>
  );
};

export default SkillsSection;