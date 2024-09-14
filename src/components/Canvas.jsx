import React, { useState, useEffect, useRef } from 'react';

const SkillHierarchy = ({ onNodeClick, selectedNode }) => {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const svgRef = useRef(null);

  const skillLibrary = [
    {
      name: 'Skill 1',
      children: [
        { name: 'Skill 1.1' },
        { name: 'Skill 1.2' },
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
  ];

  useEffect(() => {
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const buildDendrogram = (skills, x, y, level) => {
      const newNodes = [];
      const newLinks = [];

      const skillSpacing = width / (skills.length + 1);
      skills.forEach((skill, index) => {
        const skillX = (index + 1) * skillSpacing;
        const skillY = y;

        newNodes.push({ id: skill.name, x: skillX, y: skillY, name: skill.name, level });

        if (skill.children) {
          const [childNodes, childLinks] = buildDendrogram(skill.children, skillX, skillY + 100, level + 1);
          newNodes.push(...childNodes);
          newLinks.push(...childLinks);

          skill.children.forEach(child => {
            const childNode = childNodes.find(node => node.name === child.name);
            if (childNode) {
              newLinks.push({ source: { x: skillX, y: skillY }, target: { x: childNode.x, y: childNode.y } });
            }
          });
        }
      });

      return [newNodes, newLinks];
    };

    const [newNodes, newLinks] = buildDendrogram(skillLibrary, 0, 50, 0);
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
