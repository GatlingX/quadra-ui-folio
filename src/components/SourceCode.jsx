import React, { useState, useRef, useEffect } from 'react';
import { FileIcon, FileCode, FileJson, FileType, X } from 'lucide-react';
import { FileSol } from './FileSol';

const SourceCode = ({ files, setFiles, activeFile, setActiveFile }) => {
  
  const tabContainerRef = useRef(null);
  const activeTabRef = useRef(null);

  const getFileIcon = (fileName) => {
    if (!fileName) return null;
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'js':
      case 'jsx':
        return <FileCode size={16} />;
      case 'md':
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
    if (activeFile === index) {
      setActiveFile(Math.min(activeFile, newFiles.length - 1));
    } else if (activeFile > index) {
      setActiveFile(activeFile - 1);
    }
  };

  useEffect(() => {
    const tabContainer = tabContainerRef.current;
    if (tabContainer) {
      const handleWheel = (e) => {
        e.preventDefault();
        tabContainer.scrollLeft += e.deltaY;
      };
      tabContainer.addEventListener('wheel', handleWheel, { passive: false });
      return () => tabContainer.removeEventListener('wheel', handleWheel);
    }
  }, []);

  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }
  }, [activeFile]);

  return (
    <div className="bg-[#1e1e1e] text-white p-4 rounded-lg flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <div 
          ref={tabContainerRef}
          className="flex overflow-x-auto scrollbar-hide"
        >
          {files.map((file, index) => (
            <div
              key={index}
              ref={index === activeFile ? activeTabRef : null}
              className={`px-3 py-1 mr-1 cursor-pointer rounded-t-lg flex items-center ${
                index === activeFile ? 'bg-[#2d2d2d] text-white' : 'bg-[#252526] text-gray-400'
              }`}
              onClick={() => handleTabClick(index)}
            >
              <span className="mr-2">{getFileIcon(file.name)}</span>
              {file.file_name}
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
            No file selected.
          </div>
        )}
      </div>
    </div>
  );
};

export default SourceCode;
