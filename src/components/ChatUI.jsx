import React, { useState, useRef, useEffect } from 'react';

const commands = [
  { name: '/help', description: 'Show available commands' },
  { name: '/clear', description: 'Clear chat history' },
  { name: '/code', description: 'Insert code snippet' },
  { name: '/image', description: 'Upload an image' },
  { name: '/run', description: 'Run code in console' },
];

const ChatUI = ({ messages, setMessages, setSourceFiles, handleBugReport, setActiveFile }) => {
  const [input, setInput] = useState('');
  const [showCommands, setShowCommands] = useState(false);
  const [filteredCommands, setFilteredCommands] = useState(commands);
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput('');
      // Simulate AI response
      setTimeout(() => {
        setMessages(prev => [...prev, { text: 'AI response to: ' + input, sender: 'ai' }]);
      }, 1000);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    if (value.startsWith('/')) {
      const searchTerm = value.slice(1).toLowerCase();
      setFilteredCommands(commands.filter(cmd => cmd.name.toLowerCase().includes(searchTerm)));
      setShowCommands(true);
      setSelectedCommandIndex(0);
    } else {
      setShowCommands(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else if (e.key === 'Tab' && showCommands) {
      e.preventDefault();
      const selectedCommand = filteredCommands[selectedCommandIndex];
      setInput(selectedCommand.name + ' ');
      setShowCommands(false);
    } else if (e.key === 'ArrowDown' && showCommands) {
      e.preventDefault();
      setSelectedCommandIndex((prevIndex) => 
        (prevIndex + 1) % filteredCommands.length
      );
    } else if (e.key === 'ArrowUp' && showCommands) {
      e.preventDefault();
      setSelectedCommandIndex((prevIndex) => 
        (prevIndex - 1 + filteredCommands.length) % filteredCommands.length
      );
    }
  };

  const handleFileClick = (data) => {
    console.log('handleFileClick', data.bug_id);
    handleBugReport(data);
    setActiveFile(data.bug_id);
  };

  const renderMessage = (msg) => {
    const match = msg.text.match(/^(.*?): \[(.*?)\]\((.*?)\)$/);
    // Important not to use bug_id as it fails on bug_id = 0
    const data = msg.bug_title ? {
      bug_id: msg.bug_id,
      bug_title: msg.bug_title,
      bug_description: msg.bug_description
    } : {};

    // Render the message in md format
    if (match) {
      const [, prefix, displayText, embed_content] = match;
      return {
        prefix,
        displayText,
        embed_content,
        ...data
      };
    }
    return { text: msg.text };
  };

  useEffect(() => {
    const newSourceFiles = messages
      .map(msg => renderMessage(msg))
      .filter(result => result.filePath)
      .map(result => result.filePath);
    
  }, [messages, setSourceFiles]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col h-full">
      <h2 className="text-xl font-bold mb-2">Chat</h2>
      <div className="flex-1 overflow-auto mb-4 pr-2">
        {messages.map((msg, index) => {
          const renderedMessage = renderMessage(msg);
          return (
            <div key={index} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
              <span className={`inline-block p-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                {renderedMessage.prefix ? (
                  <>
                    {renderedMessage.prefix}:{' '}
                    <span 
                      className="underline cursor-pointer"
                      onClick={() => handleFileClick(renderedMessage)}
                    >
                      {renderedMessage.displayText}
                    </span>
                  </>
                ) : renderedMessage.text}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex items-end">
        <div className="flex-grow relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="w-full p-1 pr-16 border rounded resize-none text-sm"
            placeholder="Type a message or / for commands..."
            rows="1"
          />
          {showCommands && (
            <div className="absolute bottom-full left-0 w-full bg-white border rounded shadow-lg">
              {filteredCommands.map((cmd, index) => (
                <div
                  key={cmd.name}
                  className={`p-2 hover:bg-gray-100 cursor-pointer ${index === selectedCommandIndex ? 'bg-gray-200' : ''}`}
                  onClick={() => {
                    setInput(cmd.name + ' ');
                    setShowCommands(false);
                    inputRef.current.focus();
                  }}
                >
                  <span className="font-bold">{cmd.name}</span> - {cmd.description}
                </div>
              ))}
            </div>
          )}
        </div>
        <button onClick={handleSend} className="ml-2 bg-blue-500 text-white p-2 rounded h-10">Send</button>
      </div>
    </div>
  );
};

export default ChatUI;
