import React from 'react';

const SourceCode = ({ code, setCode }) => {
  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg overflow-hidden flex flex-col">
      <h2 className="text-xl font-bold mb-2">Source Code</h2>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="flex-1 bg-gray-800 text-white p-2 rounded font-mono"
        placeholder="Enter your code here..."
      />
    </div>
  );
};

export default SourceCode;
