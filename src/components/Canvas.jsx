import React, { useState, useEffect, useRef } from 'react';

const SkillHierarchy = () => {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const svgRef = useRef(null);

  const skillData = {
    name: 'Programming',
    children: [
      {
        name: 'Frontend',
        children: [
          {
            name: 'JavaScript',
            children: [
              { name: 'React' },
              { name: 'Vue' },
              { name: 'Angular' },
            ],
          },
          {
            name: 'CSS',
            children: [
              { name: 'Sass' },
              { name: 'Tailwind' },
              { name: 'Bootstrap' },
            ],
          },
          { name: 'HTML' },
        ],
      },
      {
        name: 'Backend',
        children: [
          {
            name: 'Python',
            children: [
              { name: 'Django' },
              { name: 'Flask' },
              { name: 'FastAPI' },
            ],
          },
          {
            name: 'Java',
            children: [
              { name: 'Spring' },
              { name: 'Hibernate' },
            ],
          },
          {
            name: 'Node.js',
            children: [
              { name: 'Express' },
              { name: 'Nest.js' },
            ],
          },
        ],
      },
      {
        name: 'Database',
        children: [
          { name: 'SQL' },
          { name: 'NoSQL' },
          { name: 'GraphQL' },
        ],
      },
      {
        name: 'DevOps',
        children: [
          { name: 'Docker' },
          { name: 'Kubernetes' },
          { name: 'CI/CD' },
        ],
      },
    ],
  };

  useEffect(() => {
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const buildDendrogram = (node, x, y, level, maxWidth) => {
      const newNodes = [];
      const newLinks = [];

      newNodes.push({ id: node.name, x, y, name: node.name, level });

      if (node.children) {
        const childSpacing = maxWidth / (node.children.length + 1);
        node.children.forEach((child, index) => {
          const childX = x - maxWidth / 2 + (index + 1) * childSpacing;
          const childY = y + 80;

          newLinks.push({ source: { x, y }, target: { x: childX, y: childY } });

          const childMaxWidth = maxWidth / node.children.length;
          const [childNodes, childLinks] = buildDendrogram(child, childX, childY, level + 1, childMaxWidth);
          newNodes.push(...childNodes);
          newLinks.push(...childLinks);
        });
      }

      return [newNodes, newLinks];
    };

    const [newNodes, newLinks] = buildDendrogram(skillData, width / 2, 50, 0, width * 0.9);
    setNodes(newNodes);
    setLinks(newLinks);
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4">Skill Hierarchy</h2>
      <div className="flex-1 overflow-auto">
        <svg ref={svgRef} width="100%" height="1200">
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
              <circle r="4" fill={`hsl(${node.level * 30}, 70%, 60%)`} />
              <text
                textAnchor="middle"
                dy=".3em"
                fontSize="10"
                fill="black"
                transform={`rotate(${node.level % 2 ? 45 : -45}) translate(0, ${node.level % 2 ? 12 : -12})`}
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
