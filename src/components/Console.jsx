import React, { useState, useRef, useEffect } from 'react';
import { hackRepo, pingBackend, pingExampleGraph } from '../services/api';
import Convert from 'ansi-to-html';

const convert = new Convert();

const Console = ({ output, setOutput, setMessages, handleBugReport, setSkillLibrary }) => {
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

  const colorText = (text, color) => {
    const colorCodes = {
      red: '\x1b[31m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      magenta: '\x1b[35m',
      cyan: '\x1b[36m',
      white: '\x1b[37m',
    };
    return `${colorCodes[color]}${text}\x1b[0m`;
  };

  const executeCommand = async (command) => {
    if (command.toLowerCase().startsWith('hack ')) {
      const repoUrl = command.slice(5).trim();
      setOutput(prev => `${prev}\n${colorText(`Attempting to hack: ${repoUrl}`, 'white')}`);
      await handleHackRepo(repoUrl);
    } else {
      switch (command.toLowerCase()) {
        case 'clear':
          setOutput('');
          break;
        case 'count':
          await countWithLoadingBar();
          break;
        case 'date':
          setOutput(prev => `${prev}\n${colorText(new Date().toString(), 'white')}`);
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
        case 'graph':
          await handleGraphSkills();
          break;
        default:
          setOutput(prev => `${prev}\nCommand not found: ${command}`);
      }
    }
  };

  // Update the progress bar
  const updateProgressBar = (current, total, message = '') => {
    const barLength = 20;
    const progress = Math.floor((current / total) * barLength);
    const bar = '█'.repeat(progress) + '░'.repeat(barLength - progress);
    const progressLine = `\r${colorText(`[${bar}] ${current}/${total}${message ? ' - ' + message : ''}`, 'cyan')}`;
    setOutput(prev => prev.replace(/\r.*$/, '') + progressLine);
  };

  // Handle the 'count' command
  const countWithLoadingBar = async () => {
    const totalSteps = 8;
    
    setOutput(prev => `${prev}\n${colorText('Counting...', 'white')}`);
    
    for (let i = 1; i <= totalSteps; i++) {
      updateProgressBar(i, totalSteps);
      if (i < totalSteps) {
        await new Promise(resolve => setTimeout(resolve, 500)); // 500ms delay between counts
      }
    }
    
    setOutput(prev => `${prev}\n${colorText('Counting complete!', 'green')}`);
  };

  const handleHackRepo = async (repoUrl) => {
    setOutput(prev => `${prev}\n${colorText('Sending hack request to backend...', 'white')}`);
    try {
      const stream = await hackRepo(repoUrl);
      // Handling the stream of data from the backend
      for await (const data of stream) {
        if (data.message) {
          // Handle the message from the backend to print to the console
            setOutput(prev => `${prev}\n${colorText(data.message, 'cyan')}`);
        } else if (data.bug_id >= 0 && data.bug_title && data.bug_description) {
          // Handle the sending of a new bug report
          console.log('data.bug_id', data.bug_id);
          setMessages(prev => [...prev, 
            { 
              sender: 'ai', 
              text: `🐛(${data.bug_id}): [${data.bug_title}](bug_${data.bug_id}.md)`,
              bug_id: data.bug_id,
              bug_title: data.bug_title,
              bug_description: data.bug_description
            }
          ]);
          handleBugReport(data);
        } else if (data.progress) {
          // Handle the progress bar update
          updateProgressBar(data.progress.current, data.progress.total, data.progress.message);
        } else if (data.skill_library) {
          // Handle the skill library update
          console.log("data.skill_library", data.skill_library);
          const skill_lib_data = data.skill_library
          setSkillLibrary(skill_lib_data);
        }
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setOutput(prev => `${prev}\n${colorText(`Error: ${error.message}`, 'red')}`);
      setOutput(prev => `${prev}\n${colorText('Check browser console for more details.', 'yellow')}`);
    }
  };

  const handlePingBackend = async () => {
    setOutput(prev => `${prev}\n${colorText('Pinging backend...', 'white')}`);
    try {
      const { status, ok, responseData, latency } = await pingBackend();
      
      console.log('Response status:', status);
      console.log('Response data:', responseData);
      
      if (ok) {
        try {
          const data = JSON.parse(responseData);
          const responseMessage = `Backend responded: ${data.message}\nLatency: ${latency}ms`;
          setOutput(prev => `${prev}\n${colorText(responseMessage, 'white')}`);
          
          // Add the ping response to the chat messages
          setMessages(prev => [...prev, 
            { sender: 'user', text: 'ping' },
            { sender: 'ai', text: 'pong' }
          ]);
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

  const handleGraphSkills = async () => {
    setOutput(prev => `${prev}\n${colorText('Generating skill graph...', 'white')}`);
    try {
      const response = await pingExampleGraph();
      if (response.ok) {
        const data = await response.json();
        setSkillLibrary(data);
        setOutput(prev => `${prev}\n${colorText('Skill graph generated and updated successfully!', 'green')}`);
      } else {
        setOutput(prev => `${prev}\n${colorText(`Error: Backend responded with status ${response.status}`, 'red')}`);
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
      <div ref={outputRef} className="flex-1 overflow-auto font-mono text-sm whitespace-pre-wrap">
        <div dangerouslySetInnerHTML={{ __html: convert.toHtml(output) }}></div>
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
