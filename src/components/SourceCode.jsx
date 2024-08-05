import React from 'react';

const SourceCode = ({ code, setCode }) => {
  const handleChange = (e) => {
    setCode(e.target.value);
  };

  return (
    <div className="bg-[#1e1e1e] text-white p-4 rounded-lg flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold">Source Code</h2>
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <textarea
          value={code}
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
