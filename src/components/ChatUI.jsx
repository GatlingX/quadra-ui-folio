import React, { useState } from 'react';

const ChatUI = ({ messages, setMessages }) => {
  const [input, setInput] = useState('');

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

  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col">
      <h2 className="text-xl font-bold mb-2">Chat</h2>
      <div className="flex-1 overflow-auto mb-4">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded-l"
          placeholder="Type a message..."
        />
        <button onClick={handleSend} className="bg-blue-500 text-white p-2 rounded-r">Send</button>
      </div>
    </div>
  );
};

export default ChatUI;
