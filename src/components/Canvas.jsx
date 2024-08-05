import React, { useState, useEffect, useRef } from 'react';

const SkillHierarchy = () => {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const svgRef = useRef(null);

  const skillData = {
    name: 'Root Skill',
    level: 0,
    children: [
      {
        name: 'Skill 1',
        level: 1,
        children: [
          { name: 'Skill 1.1', level: 2 },
          { name: 'Skill 1.2', level: 2 },
        ],
      },
      {
        name: 'Skill 2',
        level: 1,
        children: [
          { name: 'Skill 2.1', level: 2 },
          { name: 'Skill 2.2', level: 2 },
        ],
      },
      { name: 'Skill 3', level: 1 },
      { name: 'Skill 4', level: 1 },
    ],
  };

  useEffect(() => {
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const centerX = width / 2;
    const centerY = height / 4;

    const buildHierarchy = (node, x, y, angle, radius, level) => {
      const newNodes = [];
      const newLinks = [];

      newNodes.push({ id: node.name, x, y, name: node.name, level });

      if (node.children) {
        const childAngle = angle / node.children.length;
        node.children.forEach((child, index) => {
          const childRadius = radius * 0.8;
          const childX = x + Math.cos((index * childAngle) - (angle / 2)) * childRadius;
          const childY = y + Math.sin((index * childAngle) - (angle / 2)) * childRadius + (level * 100);

          newLinks.push({ source: node.name, target: child.name });

          const [childNodes, childLinks] = buildHierarchy(child, childX, childY, childAngle, childRadius, level + 1);
          newNodes.push(...childNodes);
          newLinks.push(...childLinks);
        });
      }

      return [newNodes, newLinks];
    };

    const [newNodes, newLinks] = buildHierarchy(skillData, centerX, centerY, Math.PI, Math.min(width, height) / 3, 0);
    setNodes(newNodes);
    setLinks(newLinks);
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4">Skill Hierarchy</h2>
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
              <circle r="20" fill={`hsl(${node.level * 30}, 70%, 60%)`} />
              <text textAnchor="middle" dy=".3em" fontSize="12" fill="white">{node.name}</text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

export default SkillHierarchy;
