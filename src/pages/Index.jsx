import { useState, useEffect } from 'react';
import { Settings, GitBranch } from 'lucide-react';
import Console from '../components/Console';
import ChatUI from '../components/ChatUI';
import SourceCode from '../components/SourceCode';
import SkillHierarchy from '../components/Canvas';
import SettingsDialog from '../components/SettingsDialog';
import ShareDialog from '../components/ShareDialog';

const Index = () => {
  const [consoleOutput, setConsoleOutput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [sourceFiles, setSourceFiles] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  const handleNodeClick = (node) => {
    setSourceFiles([{ name: `${node.name}.js`, content: node.content }]);
    setSelectedNode(node);
  };

  // Remove the useEffect hook that was updating the console output

  return (
    <div className="h-screen flex flex-col">
      <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
        <h1 className="text-2xl font-bold">Hackerbot</h1>
        <div className="flex space-x-4">
          <ShareDialog />
          <SettingsDialog />
          <GitBranch className="w-6 h-6 cursor-pointer" />
        </div>
      </header>
      <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-2 p-2 bg-gray-100">
        <div className="h-[calc(50vh-4rem)] overflow-hidden">
          <Console output={consoleOutput} setOutput={setConsoleOutput} />
        </div>
        <div className="h-[calc(50vh-4rem)] overflow-hidden">
          <ChatUI messages={chatMessages} setMessages={setChatMessages} />
        </div>
        <div className="h-[calc(50vh-4rem)] overflow-hidden">
          <SourceCode files={sourceFiles} setFiles={setSourceFiles} />
        </div>
        <div className="h-[calc(50vh-4rem)] overflow-hidden">
          <SkillHierarchy onNodeClick={handleNodeClick} selectedNode={selectedNode} />
        </div>
      </div>
    </div>
  );
};

export default Index;
