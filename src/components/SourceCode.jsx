import React from 'react';

const SourceCode = ({ code, setCode }) => {
  const handleChange = (e) => {
    setCode(e.target.value);
  };

  return (
    <div className="bg-[#1e1e1e] text-white p-2 rounded-lg overflow-hidden flex flex-col h-full">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-bold">Source Code</h2>
        <div className="flex space-x-1">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <textarea
          value={code}
          onChange={handleChange}
          className="w-full h-full bg-[#1e1e1e] text-white p-1 font-mono text-xs resize-none focus:outline-none"
          placeholder="Enter your code here..."
          spellCheck="false"
        />
      </div>
    </div>
  );
};

export default SourceCode;
