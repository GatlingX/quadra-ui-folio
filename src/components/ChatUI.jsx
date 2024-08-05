import React, { useState, useRef, useEffect } from 'react';

const ChatUI = ({ messages, setMessages }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white p-2 rounded-lg shadow-md flex flex-col h-full">
      <h2 className="text-lg font-bold mb-1">Chat</h2>
      <div className="flex-1 overflow-auto mb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-1 rounded-lg text-sm ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              {msg.text}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 p-1 border rounded-l text-sm"
          placeholder="Type a message..."
        />
        <button onClick={handleSend} className="bg-blue-500 text-white px-2 py-1 rounded-r text-sm">Send</button>
      </div>
    </div>
  );
};

export default ChatUI;
