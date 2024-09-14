import { useState } from 'react';
import { Settings, GitBranch, Bot } from 'lucide-react';
import Console from '../components/Console';
import ChatUI from '../components/ChatUI';
import SourceCode from '../components/SourceCode';
import SkillHierarchy from '../components/Canvas';
import SettingsDialog from '../components/SettingsDialog';
import ShareDialog from '../components/ShareDialog';
import InfoDialog from '../components/InfoDialog';

const Index = () => {
  
  // Console component state
  const [consoleOutput, setConsoleOutput] = useState('Welcome to Hackerbot Console!\nType "help" for available commands.');

  // ChatUI component state
  const [chatMessages, setChatMessages] = useState([]);

  // SourceCode component state
  const [sourceFiles, setSourceFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(0);

  // SkillHierarchy (Canvas) component state
  const [selectedNode, setSelectedNode] = useState(null);
  const [skillLibrary, setSkillLibrary] = useState([]);

  const handleBugReport = (data) => {
    // Handle a new bug report data entry
    setSourceFiles(prevFiles => {
      const fileIndex = prevFiles.findIndex(file => file.id === data.bug_id);
      if (fileIndex !== -1) {
        // Create a new array with all the previous files
        const updatedFiles = [...prevFiles];
        // Update the file at the found index
        if (data.bug_description) {
          updatedFiles[fileIndex] = { 
            ...updatedFiles[fileIndex],
            content: `${data.bug_description}` 
          };
        }
        return updatedFiles;
      } else {
        const file_name = `bug_${data.bug_id}.md`;
        // If the file doesn't exist, add a new file to the array
        return [...prevFiles, { 
          file_name: file_name, 
          content: `${data.bug_description}`,
          id: data.bug_id
        }];
      }
    });
  }

  const handleNodeClick = (node) => {
    const fileName = `${node.name}.js`;
    setSourceFiles(prevFiles => {
      const fileIndex = prevFiles.findIndex(file => file.name === fileName);
      if (fileIndex !== -1) {
        // Update existing file
        const updatedFiles = [...prevFiles];
        updatedFiles[fileIndex] = { ...updatedFiles[fileIndex], content: node.content };
        return updatedFiles;
      } else {
        // Add new file
        return [...prevFiles, { name: fileName, content: node.content }];
      }
    });
    setSelectedNode(node);
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
        <div className="flex items-center space-x-2">
          <Bot className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Gatling Hackbot</h1>
        </div>
        <div className="flex space-x-4">
          <ShareDialog />
          <SettingsDialog />
          <GitBranch className="w-6 h-6 cursor-pointer" />
          <InfoDialog />
        </div>
      </header>
      <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-2 p-2 bg-gray-100">
        <div className="h-[calc(50vh-4rem)] overflow-hidden">
          <Console
            output={consoleOutput}
            setOutput={setConsoleOutput}
            messages={chatMessages}
            setMessages={setChatMessages}
            handleBugReport={handleBugReport}
            setSkillLibrary={setSkillLibrary}
          />
        </div>
        <div className="h-[calc(50vh-4rem)] overflow-hidden">
          <ChatUI 
            messages={chatMessages} 
            setMessages={setChatMessages} 
            setSourceFiles={setSourceFiles}
            handleBugReport={handleBugReport}
            setActiveFile={setActiveFile}
          />
        </div>
        <div className="h-[calc(50vh-4rem)] overflow-hidden">
          <SourceCode 
            files={sourceFiles} 
            setFiles={setSourceFiles} 
            activeFile={activeFile} 
            setActiveFile={setActiveFile} 
          />
        </div>
        <div className="h-[calc(50vh-4rem)] overflow-hidden">
          <SkillHierarchy 
            onNodeClick={handleNodeClick} 
            selectedNode={selectedNode} 
            skillLibrary={skillLibrary}
          />
        </div> 
      </div>
    </div>
  );
};

export default Index;
