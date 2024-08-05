import React from 'react';

const Console = ({ output, setOutput }) => {
  const handleInput = (e) => {
    if (e.key === 'Enter') {
      setOutput(prev => prev + '\n> ' + e.target.value);
      e.target.value = '';
    }
  };

  return (
    <div className="bg-black text-green-400 p-4 rounded-lg overflow-hidden flex flex-col">
      <h2 className="text-xl font-bold mb-2">Console</h2>
      <div className="flex-1 overflow-auto">
        <pre className="whitespace-pre-wrap">{output}</pre>
      </div>
      <input
        type="text"
        onKeyPress={handleInput}
        className="bg-gray-800 text-green-400 p-2 mt-2 rounded"
        placeholder="Enter command..."
      />
    </div>
  );
};

export default Console;
