import React, { useState, useEffect, useRef } from 'react';

const SkillHierarchy = ({ onNodeClick, selectedNode }) => {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const svgRef = useRef(null);

  const skillData = {
    name: 'Root Skill',
    content: '// Root skill code\nconsole.log("This is the root skill");',
    children: [
      {
        name: 'Skill 1',
        content: '// Skill 1 code\nfunction skill1() {\n  console.log("This is skill 1");\n}',
        children: [
          { name: 'Skill 1.1', content: '// Skill 1.1 code\nconst skill1_1 = () => {\n  console.log("This is skill 1.1");\n};' },
          { name: 'Skill 1.2', content: '// Skill 1.2 code\nclass Skill1_2 {\n  constructor() {\n    console.log("This is skill 1.2");\n  }\n}' },
        ],
      },
      {
        name: 'Skill 2',
        content: '// Skill 2 code\nasync function skill2() {\n  console.log("This is skill 2");\n}',
        children: [
          { name: 'Skill 2.1', content: '// Skill 2.1 code\nconst skill2_1 = async () => {\n  await new Promise(resolve => setTimeout(resolve, 1000));\n  console.log("This is skill 2.1");\n};' },
          { name: 'Skill 2.2', content: '// Skill 2.2 code\nfunction* skill2_2() {\n  yield "This is skill 2.2";\n}' },
        ],
      },
      { name: 'Skill 3', content: '// Skill 3 code\nconst skill3 = {\n  execute: () => console.log("This is skill 3")\n};' },
      { name: 'Skill 4', content: '// Skill 4 code\nimport { useState } from "react";\n\nconst Skill4 = () => {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(count + 1)}>Skill 4 Count: {count}</button>;\n};' },
    ],
  };

  useEffect(() => {
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const buildDendrogram = (node, x, y, level) => {
      const newNodes = [];
      const newLinks = [];

      newNodes.push({ id: node.name, x, y, name: node.name, level });

      if (node.children) {
        const childSpacing = width / (node.children.length + 1);
        node.children.forEach((child, index) => {
          const childX = (index + 1) * childSpacing;
          const childY = y + 100;

          newLinks.push({ source: { x, y }, target: { x: childX, y: childY } });

          const [childNodes, childLinks] = buildDendrogram(child, childX, childY, level + 1);
          newNodes.push(...childNodes);
          newLinks.push(...childLinks);
        });
      }

      return [newNodes, newLinks];
    };

    const [newNodes, newLinks] = buildDendrogram(skillData, width / 2, 50, 0);
    setNodes(newNodes);
    setLinks(newLinks);
  }, []);

  const handleMouseDown = (e) => {
    setIsPanning(true);
  };

  const handleMouseMove = (e) => {
    if (isPanning) {
      setPan(prevPan => ({
        x: prevPan.x + e.movementX / zoom,
        y: prevPan.y + e.movementY / zoom
      }));
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const scaleFactor = 0.05;
    const delta = e.deltaY > 0 ? -scaleFactor : scaleFactor;
    const newZoom = Math.max(0.1, Math.min(zoom + delta, 5));

    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const newPan = {
      x: mouseX - (mouseX - pan.x) * (newZoom / zoom),
      y: mouseY - (mouseY - pan.y) * (newZoom / zoom)
    };

    setZoom(newZoom);
    setPan(newPan);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4">Skill Hierarchy</h2>
      <div className="flex-1 overflow-hidden">
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {links.map((link, index) => (
              <path
                key={index}
                d={`M${link.source.x},${link.source.y} C${link.source.x},${(link.source.y + link.target.y) / 2} ${link.target.x},${(link.source.y + link.target.y) / 2} ${link.target.x},${link.target.y}`}
                fill="none"
                stroke="#999"
                strokeWidth={1 / zoom}
              />
            ))}
            {nodes.map((node) => (
              <g
                key={node.id}
                transform={`translate(${node.x},${node.y})`}
                onClick={() => onNodeClick({ name: node.name, content: node.content })}
                style={{ cursor: 'pointer' }}
              >
                <circle 
                  r={5 / zoom} 
                  fill={selectedNode && selectedNode.name === node.name ? 'red' : `hsl(${node.level * 30}, 70%, 60%)`} 
                />
                <text
                  textAnchor="middle"
                  dy=".3em"
                  fontSize={12 / zoom}
                  fill="black"
                  transform={`translate(0, ${15 / zoom})`}
                >
                  {node.name}
                </text>
              </g>
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
};

export default SkillHierarchy;
