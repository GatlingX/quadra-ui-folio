import React, { useState } from 'react';

const SourceCode = ({ files, setFiles }) => {
  const [activeFile, setActiveFile] = useState(0);

  const handleChange = (e) => {
    const updatedFiles = [...files];
    updatedFiles[activeFile].content = e.target.value;
    setFiles(updatedFiles);
  };

  const handleTabClick = (index) => {
    setActiveFile(index);
  };

  return (
    <div className="bg-[#1e1e1e] text-white p-4 rounded-lg flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex">
          {files.map((file, index) => (
            <div
              key={index}
              className={`px-3 py-1 mr-1 cursor-pointer rounded-t-lg ${
                index === activeFile ? 'bg-[#2d2d2d] text-white' : 'bg-[#252526] text-gray-400'
              }`}
              onClick={() => handleTabClick(index)}
            >
              {file.name}
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <textarea
          value={files[activeFile].content}
          onChange={handleChange}
          className="w-full h-full bg-[#1e1e1e] text-white p-2 font-mono text-sm resize-none focus:outline-none"
          placeholder="Enter your code here..."
          spellCheck="false"
        />
      </div>
    </div>
  );
};

export default SourceCode;
