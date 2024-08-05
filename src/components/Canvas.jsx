import React, { useState, useEffect, useRef } from 'react';

const SkillHierarchy = () => {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const svgRef = useRef(null);

  const skillData = {
    name: 'Root Skill',
    children: [
      {
        name: 'Skill 1',
        children: [
          { name: 'Skill 1.1' },
          { name: 'Skill 1.2' },
        ],
      },
      {
        name: 'Skill 2',
        children: [
          { name: 'Skill 2.1' },
          { name: 'Skill 2.2' },
        ],
      },
      { name: 'Skill 3' },
      { name: 'Skill 4' },
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

  return (
    <div className="bg-white p-4 rounded-lg shadow-md h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4">Skill Hierarchy</h2>
      <div className="flex-1 overflow-hidden">
        <svg ref={svgRef} width="100%" height="100%">
          {links.map((link, index) => (
            <path
              key={index}
              d={`M${link.source.x},${link.source.y} C${link.source.x},${(link.source.y + link.target.y) / 2} ${link.target.x},${(link.source.y + link.target.y) / 2} ${link.target.x},${link.target.y}`}
              fill="none"
              stroke="#999"
              strokeWidth="1"
            />
          ))}
          {nodes.map((node) => (
            <g key={node.id} transform={`translate(${node.x},${node.y})`}>
              <circle r="5" fill={`hsl(${node.level * 30}, 70%, 60%)`} />
              <text
                textAnchor="middle"
                dy=".3em"
                fontSize="12"
                fill="black"
                transform="translate(0, 15)"
              >
                {node.name}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

export default SkillHierarchy;
