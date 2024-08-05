import React, { useState, useEffect, useRef } from 'react';
import { Folder, File } from 'lucide-react';

const HierarchicalDiagram = () => {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const svgRef = useRef(null);

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

  useEffect(() => {
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const centerX = width / 2;
    const centerY = height / 2;

    const buildTree = (node, x, y, angle, radius) => {
      const newNodes = [];
      const newLinks = [];

      newNodes.push({ id: node.name, x, y, name: node.name });

      if (node.children) {
        const childAngle = angle / node.children.length;
        node.children.forEach((child, index) => {
          const childRadius = radius * 0.8;
          const childX = x + Math.cos((index * childAngle) - (angle / 2)) * childRadius;
          const childY = y + Math.sin((index * childAngle) - (angle / 2)) * childRadius;

          newLinks.push({ source: node.name, target: child.name });

          const [childNodes, childLinks] = buildTree(child, childX, childY, childAngle, childRadius);
          newNodes.push(...childNodes);
          newLinks.push(...childLinks);
        });
      }

      return [newNodes, newLinks];
    };

    const [newNodes, newLinks] = buildTree(treeData, centerX, centerY, Math.PI * 2, Math.min(width, height) / 3);
    setNodes(newNodes);
    setLinks(newLinks);
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4">Project Structure</h2>
      <div className="flex-1 overflow-hidden">
        <svg ref={svgRef} width="100%" height="100%">
          {links.map((link, index) => (
            <line
              key={index}
              x1={nodes.find(n => n.id === link.source)?.x}
              y1={nodes.find(n => n.id === link.source)?.y}
              x2={nodes.find(n => n.id === link.target)?.x}
              y2={nodes.find(n => n.id === link.target)?.y}
              stroke="#999"
              strokeWidth="1"
            />
          ))}
          {nodes.map((node) => (
            <g key={node.id} transform={`translate(${node.x},${node.y})`}>
              {node.name.includes('.') ? (
                <File className="w-6 h-6 text-gray-500" />
              ) : (
                <Folder className="w-6 h-6 text-yellow-500" />
              )}
              <text x="10" y="4" fontSize="12">{node.name}</text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

export default HierarchicalDiagram;
