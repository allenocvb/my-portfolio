// src/components/MainContent.jsx
import React from 'react';

const MainContent = () => {
  return (
    <div className="whitespace-normal flex-col text-xl bg-gray-900 text-white font-normal transition motion-reduce:transition-none min-h-screen">
      <div className="p-8 md:p-16 md:pb-0 max-w-full md:w-[55rem] space-y-5">
        <h1 className="text-4xl font-bold">Welcome to My Portfolio</h1>
        <p>This is where you'll find information about my projects, skills, and experience.</p>
        <section>
          <h2 className="text-2xl font-semibold">Projects</h2>
          <ul>
            <li>Project 1</li>
            <li>Project 2</li>
            <li>Project 3</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default MainContent;
