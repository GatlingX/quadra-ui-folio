import React, { useState, useRef, useEffect } from 'react';

const Console = ({ output, setOutput }) => {
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);
  const outputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [output]);

  const handleInput = (e) => {
    if (e.key === 'Enter') {
      const command = e.target.value.trim();
      if (command) {
        setOutput(prev => `${prev}\n$ ${command}\n${executeCommand(command)}`);
        setHistory(prev => [...prev, command]);
        setHistoryIndex(-1);
      }
      setInputValue('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInputValue(history[history.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInputValue(history[history.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputValue('');
      }
    }
  };

  const executeCommand = (command) => {
    // Implement basic command execution logic here
    switch (command.toLowerCase()) {
      case 'clear':
        setOutput('');
        return '';
      case 'date':
        return new Date().toString();
      case 'help':
        return 'Available commands: clear, date, help';
      default:
        return `Command not found: ${command}`;
    }
  };

  return (
    <div className="bg-black text-green-400 p-2 rounded-lg overflow-hidden flex flex-col h-full">
      <h2 className="text-lg font-bold mb-1">Console</h2>
      <div ref={outputRef} className="flex-1 overflow-auto font-mono text-xs">
        <pre className="whitespace-pre-wrap">{output}</pre>
      </div>
      <div className="flex items-center mt-1">
        <span className="mr-2">$</span>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleInput}
          className="flex-1 bg-transparent text-green-400 outline-none"
        />
      </div>
    </div>
  );
};

export default Console;
