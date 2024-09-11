import React, { useState, useRef, useEffect } from 'react';
import { hackRepo, pingBackend } from '../services/api';

const Console = ({ output, setOutput }) => {
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);
  const outputRef = useRef(null);
  const consoleRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [output]);

  const handleConsoleClick = () => {
    inputRef.current.focus();
  };

  const handleInput = async (e) => {
    if (e.key === 'Enter') {
      const command = e.target.value.trim();
      if (command) {
        setOutput(prev => `${prev}\n$ ${command}`);
        setHistory(prev => [...prev, command]);
        setHistoryIndex(-1);
        setInputValue('');
        await executeCommand(command);
      }
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

  const colorText = (text, color) => `<span class="text-${color}-400">${text}</span>`;

  const executeCommand = async (command) => {
    if (command.toLowerCase().startsWith('hack ')) {
      const repoUrl = command.slice(5).trim();
      setOutput(prev => `${prev}\n${colorText(`Attempting to hack: ${repoUrl}`, 'yellow')}`);
      await handleHackRepo(repoUrl);
    } else {
      switch (command.toLowerCase()) {
        case 'clear':
          setOutput('');
          break;
        case 'date':
          setOutput(prev => `${prev}\n${new Date().toString()}`);
          break;
        case 'help':
          setOutput(prev => `${prev}\nAvailable commands: clear, date, help, stream, hack <link>`);
          break;
        case 'stream':
          await simulateStreamingData();
          break;
        case 'ping':
          await handlePingBackend();
          break;
        default:
          setOutput(prev => `${prev}\nCommand not found: ${command}`);
      }
    }
  };

  const handleHackRepo = async (repoUrl) => {
    setOutput(prev => `${prev}\n${colorText('Sending hack request to backend...', 'yellow')}`);
    try {
      const data = await hackRepo(repoUrl);
      if (data.message) {
        setOutput(prev => `${prev}\n${colorText(`Backend response: ${data.message}`, 'green')}`);
        setOutput(prev => `${prev}\n${colorText(`Analyzed repo: ${data.repo}`, 'cyan')}`);
      } else {
        setOutput(prev => `${prev}\n${colorText(`Error: ${data.error || 'Unknown error occurred'}`, 'red')}`);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setOutput(prev => `${prev}\n${colorText(`Error: ${error.message}`, 'red')}`);
      setOutput(prev => `${prev}\n${colorText('Check browser console for more details.', 'yellow')}`);
    }
  };

  const handlePingBackend = async () => {
    setOutput(prev => `${prev}\n${colorText('Pinging backend...', 'yellow')}`);
    try {
      const { status, ok, responseData, latency } = await pingBackend();
      
      console.log('Response status:', status);
      console.log('Response data:', responseData);
      
      if (ok) {
        try {
          const data = JSON.parse(responseData);
          setOutput(prev => `${prev}\n${colorText(`Backend responded: ${data.message}`, 'green')}`);
          setOutput(prev => `${prev}\n${colorText(`Latency: ${latency}ms`, 'cyan')}`);
        } catch (parseError) {
          console.error('Error parsing JSON:', parseError);
          setOutput(prev => `${prev}\n${colorText(`Error parsing response: ${parseError.message}`, 'red')}`);
        }
      } else {
        setOutput(prev => `${prev}\n${colorText(`Error: Backend responded with status ${status}`, 'red')}`);
        setOutput(prev => `${prev}\n${colorText(`Response: ${responseData}`, 'red')}`);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setOutput(prev => `${prev}\n${colorText(`Error: ${error.message}`, 'red')}`);
      setOutput(prev => `${prev}\n${colorText('Check browser console for more details.', 'yellow')}`);
    }
  };

  const simulateStreamingData = async () => {
    const data = "Simulating streaming data from backend server...";
    for (let char of data) {
      await new Promise(resolve => setTimeout(resolve, 50));
      setOutput(prev => prev + char);
    }
  };

  return (
    <div 
      ref={consoleRef}
      className="bg-black text-green-400 p-4 rounded-lg flex flex-col h-full"
      onClick={handleConsoleClick}
    >
      <h2 className="text-xl font-bold mb-2">Console</h2>
      <div ref={outputRef} className="flex-1 overflow-auto font-mono text-sm">
        <pre className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: output }}></pre>
      </div>
      <div className="flex items-center mt-2">
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
