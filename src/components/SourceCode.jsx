import React, { useState, useEffect } from 'react';
import { FileIcon, FileCode, FileJson, FileType, X } from 'lucide-react';
import { FileSol } from './FileSol';

const SourceCode = ({ files, setFiles }) => {
  const [activeFile, setActiveFile] = useState(0);

  useEffect(() => {
    if (files.length > 0) {
      setActiveFile(files.length - 1);
    } else {
      setActiveFile(0);
    }
  }, [files.length]);

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'js':
      case 'jsx':
        return <FileCode size={16} />;
      case 'py':
        return <FileType size={16} />;
      case 'sol':
        return <FileSol size={16} />;
      default:
        return <FileIcon size={16} />;
    }
  };

  const handleChange = (e) => {
    const updatedFiles = [...files];
    updatedFiles[activeFile].content = e.target.value;
    setFiles(updatedFiles);
  };

  const handleTabClick = (index) => {
    setActiveFile(index);
  };

  const handleCloseTab = (index, event) => {
    event.stopPropagation();
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    if (activeFile >= newFiles.length) {
      setActiveFile(newFiles.length - 1);
    }
  };

  return (
    <div className="bg-[#1e1e1e] text-white p-4 rounded-lg flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex overflow-x-auto">
          {files.map((file, index) => (
            <div
              key={index}
              className={`px-3 py-1 mr-1 cursor-pointer rounded-t-lg flex items-center ${
                index === activeFile ? 'bg-[#2d2d2d] text-white' : 'bg-[#252526] text-gray-400'
              }`}
              onClick={() => handleTabClick(index)}
            >
              <span className="mr-2">{getFileIcon(file.name)}</span>
              {file.name}
              <X
                size={14}
                className="ml-2 cursor-pointer"
                onClick={(e) => handleCloseTab(index, e)}
              />
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
        {files.length > 0 && files[activeFile] ? (
          <textarea
            value={files[activeFile].content || ''}
            onChange={handleChange}
            className="w-full h-full bg-[#1e1e1e] text-white p-2 font-mono text-sm resize-none focus:outline-none"
            placeholder="Enter your code here..."
            spellCheck="false"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            No file selected. Click on a skill to view its code.
          </div>
        )}
      </div>
    </div>
  );
};

export default SourceCode;
