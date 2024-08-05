import { useState } from 'react';
import Console from '../components/Console';
import ChatUI from '../components/ChatUI';
import SourceCode from '../components/SourceCode';
import Canvas from '../components/Canvas';

const Index = () => {
  const [consoleOutput, setConsoleOutput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [sourceCode, setSourceCode] = useState('// Your code here');
  const [canvasData, setCanvasData] = useState(null);

  return (
    <div className="h-screen flex flex-col">
      <h1 className="text-2xl font-bold p-4 bg-gray-800 text-white">Devin-like Interface</h1>
      <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-2 p-2 bg-gray-100">
        <Console output={consoleOutput} setOutput={setConsoleOutput} />
        <ChatUI messages={chatMessages} setMessages={setChatMessages} />
        <SourceCode code={sourceCode} setCode={setSourceCode} />
        <Canvas data={canvasData} setData={setCanvasData} />
      </div>
    </div>
  );
};

export default Index;
