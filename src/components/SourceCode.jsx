import React, { useState, useRef, useEffect } from 'react';
import { FileIcon, FileCode, FileType, X, Code, Eye } from 'lucide-react';
import { FileSol } from './FileSol';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const SourceCode = ({ files, setFiles, activeFile, setActiveFile }) => {
  
  const tabContainerRef = useRef(null);
  const activeTabRef = useRef(null);
  const [isSourceView, setIsSourceView] = useState(true);

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

  const handleCloseAllFiles = () => {
    setFiles([]);
    setActiveFile(null);
  };

  const toggleView = () => {
    setIsSourceView(!isSourceView);
  };

  const renderContent = () => {
    if (files.length > 0 && files[activeFile]) {
      const content = files[activeFile].content || '';
      
      if (isSourceView) {
        return (
          <textarea
            value={content}
            onChange={handleChange}
            className="w-full h-full bg-[#1e1e1e] text-white p-2 font-mono text-sm resize-none focus:outline-none"
            placeholder="Enter your code here..."
            spellCheck="false"
          />
        );
      } else {
        return (
          <div className="w-full h-full overflow-auto bg-[#1e1e1e] text-white p-4">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({node, ...props}) => <h1 className="text-2xl font-bold my-4 text-white" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-xl font-bold my-3 text-white" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-lg font-bold my-2 text-white" {...props} />,
                p: ({node, ...props}) => <p className="my-2 text-gray-300" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc list-inside my-2 text-gray-300" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal list-inside my-2 text-gray-300" {...props} />,
                code: ({node, inline, ...props}) => 
                  inline 
                    ? <code className="bg-gray-700 rounded px-1" {...props} />
                    : <pre className="bg-gray-800 rounded p-2 my-2 overflow-auto"><code {...props} /></pre>,
                a: ({node, ...props}) => <a className="text-blue-400 hover:underline" {...props} />
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        );
      }
    } else {
      return (
        <div className="w-full h-full flex items-center justify-center text-gray-500">
          No file selected.
        </div>
      );
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
          <div 
            className="w-6 h-6 flex items-center justify-center cursor-pointer text-sky-400 hover:text-sky-300 transition-colors duration-200"
            onClick={handleCloseAllFiles}
          >
            <X size={16} />
          </div>
          <div 
            className="w-6 h-6 flex items-center justify-center cursor-pointer text-sky-400 hover:text-sky-300 transition-colors duration-200"
            onClick={toggleView}
          >
            {isSourceView ? <Eye size={16} /> : <Code size={16} />}
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default SourceCode;
