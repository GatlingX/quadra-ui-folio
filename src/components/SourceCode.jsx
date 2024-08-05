import React, { useState } from 'react';
import { FileIcon, FileCode, FileJson, FileType, X } from 'lucide-react';
import { FileSol } from './FileSol';

const SourceCode = ({ files }) => {
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

  return (
    <div className="bg-[#1e1e1e] text-white p-4 rounded-lg flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex overflow-x-auto">
          {files.map((file, index) => (
            <div
              key={index}
              className="px-3 py-1 mr-1 cursor-pointer rounded-t-lg flex items-center bg-[#2d2d2d] text-white"
            >
              <span className="mr-2">{getFileIcon(file.name)}</span>
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
        {files.length > 0 ? (
          <pre className="w-full h-full bg-[#1e1e1e] text-white p-2 font-mono text-sm overflow-auto">
            {files[0].content}
          </pre>
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
