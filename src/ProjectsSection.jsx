// BioSection.jsx
// eslint-disable-next-line no-unused-vars
import React from 'react';
import SectionTransition from './SectionTransition';
import { TextElement } from './PageTransition';

const ProjectsSection = () => {
  const projectsContent = (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-green-400">
      <h1 className="text-4xl md:text-6xl mb-8">Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
        <div className="bg-black bg-opacity-50 p-6 rounded-lg">
          <h2 className="text-2xl mb-4">Project 1</h2>
          <p>Project description...</p>
        </div>
        <div className="bg-black bg-opacity-50 p-6 rounded-lg">
          <h2 className="text-2xl mb-4">Project 2</h2>
          <p>Project description...</p>
        </div>
        {/* Add more project cards as needed */}
      </div>
    </div>
  );

  return (
    <SectionTransition title={<TextElement text="Projects" />}>
      {projectsContent}
    </SectionTransition>
  );
};

export default ProjectsSection;