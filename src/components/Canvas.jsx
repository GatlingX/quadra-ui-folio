import React, { useState, useEffect, useRef } from 'react';

const SkillHierarchy = ({ onNodeClick, selectedNode, skillLibrary }) => {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [isPanning, setIsPanning] = useState(false);
  const svgRef = useRef(null);
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, width: 3000, height: 1500 }); // Increased initial width and height

  const MIN_ZOOM = 0.5;
  const MAX_ZOOM = 5;
  const ZOOM_SPEED = 0.1;

  useEffect(() => {
    if (!svgRef.current) return;

    const width = svgRef.current.clientWidth * 3; // Triple the width
    const height = svgRef.current.clientHeight * 1.5; // Increase height by 50%

    const buildDendrogram = (skills, x, y, level) => {
      if (!Array.isArray(skills)) {
        console.error("Skills is not an array:", skills);
        return [[], []];
      }

      const newNodes = [];
      const newLinks = [];

      const skillSpacing = width / (skills.length + 1);
      skills.forEach((skill, index) => {
        const skillX = (index + 1) * skillSpacing;
        const skillY = y;

        newNodes.push({ id: skill.name, x: skillX, y: skillY, name: skill.name, level });

        if (skill.children) {
          const [childNodes, childLinks] = buildDendrogram(skill.children, skillX, skillY + 200, level + 1); // Increased vertical spacing
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

    if (Array.isArray(skillLibrary)) {
      const [newNodes, newLinks] = buildDendrogram(skillLibrary, 0, 50, 0);
      setNodes(newNodes);
      setLinks(newLinks);
    } else {
      console.error("skillLibrary is not an array:", skillLibrary);
      setNodes([]);
      setLinks([]);
    }
  }, [skillLibrary]);

  useEffect(() => {
    const svg = svgRef.current;
    if (svg) {
      svg.addEventListener('wheel', handleWheel, { passive: false });
      return () => {
        svg.removeEventListener('wheel', handleWheel);
      };
    }
  }, []);

  const handleWheel = (e) => {
    e.preventDefault();
    const { deltaY } = e;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomFactor = deltaY > 0 ? 1 + ZOOM_SPEED : 1 - ZOOM_SPEED;

    const newWidth = viewBox.width * zoomFactor;
    const newHeight = viewBox.height * zoomFactor;

    if (newWidth / 2000 >= MIN_ZOOM && newWidth / 2000 <= MAX_ZOOM) {
      const mouseXRatio = mouseX / rect.width;
      const mouseYRatio = mouseY / rect.height;

      const newX = viewBox.x + (viewBox.width - newWidth) * mouseXRatio;
      const newY = viewBox.y + (viewBox.height - newHeight) * mouseYRatio;

      setViewBox({ x: newX, y: newY, width: newWidth, height: newHeight });
    }
  };

  const handleMouseDown = (e) => {
    setIsPanning(true);
  };

  const handleMouseMove = (e) => {
    if (isPanning) {
      const dx = e.movementX * (viewBox.width / svgRef.current.clientWidth);
      const dy = e.movementY * (viewBox.height / svgRef.current.clientHeight);
      setViewBox(prev => ({
        ...prev,
        x: prev.x - dx,
        y: prev.y - dy
      }));
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handlePan = (e) => {
    if (isPanning) {
      const dx = e.movementX * (viewBox.width / svgRef.current.clientWidth);
      const dy = e.movementY * (viewBox.height / svgRef.current.clientHeight);
      setViewBox(prev => ({
        ...prev,
        x: prev.x - dx,
        y: prev.y - dy
      }));
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4">Skill Hierarchy</h2>
      <div className="flex-1 overflow-hidden">
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {links.map((link, index) => (
            <path
              key={index}
              d={`M${link.source.x},${link.source.y} C${link.source.x},${(link.source.y + link.target.y) / 2} ${link.target.x},${(link.source.y + link.target.y) / 2} ${link.target.x},${link.target.y}`}
              fill="none"
              stroke="#999"
              strokeWidth={2}
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
                r={15} // Increased circle size
                fill={selectedNode && selectedNode.name === node.name ? 'red' : `hsl(${node.level * 30}, 70%, 60%)`} 
              />
              <text
                textAnchor="middle"
                dy=".3em"
                fontSize={16} // Increased font size
                fill="black"
                transform={`translate(0, 25)`} // Adjusted text position
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
