import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Folder, File } from 'lucide-react';

const TreeNode = ({ node, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="select-none">
      <div
        className={`flex items-center py-1 px-2 hover:bg-gray-100 cursor-pointer`}
        style={{ paddingLeft: `${level * 20}px` }}
        onClick={toggleOpen}
      >
        {hasChildren ? (
          isOpen ? (
            <ChevronDown className="w-4 h-4 mr-1" />
          ) : (
            <ChevronRight className="w-4 h-4 mr-1" />
          )
        ) : (
          <span className="w-4 h-4 mr-1"></span>
        )}
        {hasChildren ? (
          <Folder className="w-4 h-4 mr-2 text-yellow-500" />
        ) : (
          <File className="w-4 h-4 mr-2 text-gray-500" />
        )}
        <span>{node.name}</span>
      </div>
      {isOpen && hasChildren && (
        <div>
          {node.children.map((childNode, index) => (
            <TreeNode key={index} node={childNode} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const HierarchicalDiagram = () => {
  const treeData = {
    name: 'Root',
    children: [
      {
        name: 'src',
        children: [
          { name: 'components', children: [{ name: 'Button.jsx' }, { name: 'Input.jsx' }] },
          { name: 'pages', children: [{ name: 'Home.jsx' }, { name: 'About.jsx' }] },
          { name: 'App.jsx' },
          { name: 'index.js' },
        ],
      },
      {
        name: 'public',
        children: [{ name: 'index.html' }, { name: 'favicon.ico' }],
      },
      { name: 'package.json' },
      { name: 'README.md' },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4">Project Structure</h2>
      <div className="flex-1 overflow-auto">
        <TreeNode node={treeData} />
      </div>
    </div>
  );
};

export default HierarchicalDiagram;
