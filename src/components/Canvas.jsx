import React, { useState, useEffect, useRef } from 'react';
import { useSpring, animated } from 'react-spring';

const SkillHierarchy = ({ onNodeClick, selectedNode, skillLibrary }) => {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [isPanning, setIsPanning] = useState(false);
  const svgRef = useRef(null);
  const [springs, api] = useSpring(() => ({ scale: 1, x: 0, y: 0, config: { mass: 1, tension: 170, friction: 26 } }));

  const MIN_SCALE = 0.1;
  const MAX_SCALE = 10;
  const ZOOM_SENSITIVITY = 0.2; // Increased from 0.1
  const PAN_SENSITIVITY = 1; // Reduced from 10 to 1 for smoother panning

  const [startPanPosition, setStartPanPosition] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState(null);

  useEffect(() => {
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const buildDendrogram = (skills, x, y, level) => {
      const newNodes = [];
      const newLinks = [];

      const skillSpacing = Math.max(100, height / (skills.length + 1)); // Increased minimum spacing
      skills.forEach((skill, index) => {
        const skillX = x;
        const skillY = y + (index + 1) * skillSpacing;

        newNodes.push({ id: skill.id, x: skillX, y: skillY, name: skill.name, level });

        if (skill.children) {
          const [childNodes, childLinks] = buildDendrogram(skill.children, skillX + 200, y, level + 1); // Increased horizontal spacing
          newNodes.push(...childNodes);
          newLinks.push(...childLinks);

          skill.children.forEach(child => {
            const childNode = childNodes.find(node => node.id === child.id);
            if (childNode) {
              newLinks.push({ source: { x: skillX, y: skillY }, target: { x: childNode.x, y: childNode.y } });
            }
          });
        }
      });

      return [newNodes, newLinks];
    };

    const [newNodes, newLinks] = buildDendrogram(skillLibrary, 50, 0, 0);
    setNodes(newNodes);
    setLinks(newLinks);

    // Add non-passive wheel event listener
    const svg = svgRef.current;
    svg.addEventListener('wheel', handleWheel, { passive: false });

    // Cleanup function
    return () => {
      svg.removeEventListener('wheel', handleWheel);
    };
  }, [skillLibrary]); // Add skillLibrary to the dependency array

  const handleMouseDown = (e) => {
    setIsPanning(true);
    setStartPanPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (isPanning) {
      const dx = e.clientX - startPanPosition.x;
      const dy = e.clientY - startPanPosition.y;
      
      api.start({
        x: springs.x.get() + dx * PAN_SENSITIVITY / springs.scale.get(),
        y: springs.y.get() + dy * PAN_SENSITIVITY / springs.scale.get(),
        immediate: true
      });

      setStartPanPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = Math.exp(-e.deltaY * ZOOM_SENSITIVITY / 100);
    const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, springs.scale.get() * zoomFactor));

    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const newX = mouseX - (mouseX - springs.x.get()) * (newScale / springs.scale.get());
    const newY = mouseY - (mouseY - springs.y.get()) * (newScale / springs.scale.get());

    api.start({ scale: newScale, x: newX, y: newY, immediate: true }); // Added immediate: true
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
          style={{ userSelect: 'none' }}  // Add this line
        >
          <animated.g style={{
            transform: springs.scale.to(s => `translate(${springs.x.get()}px, ${springs.y.get()}px) scale(${s})`)
          }}>
            {links.map((link, index) => (
              <path
                key={index}
                d={`M${link.source.x},${link.source.y} C${link.source.x},${(link.source.y + link.target.y) / 2} ${link.target.x},${(link.source.y + link.target.y) / 2} ${link.target.x},${link.target.y}`}
                fill="none"
                stroke="#999"
                strokeWidth={springs.scale.to(s => 1 / s)}
              />
            ))}
            {nodes.map((node) => (
              <g
                key={node.id}
                transform={`translate(${node.x},${node.y})`}
                onClick={() => onNodeClick({ id: node.id, name: node.name, content: node.content })}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{ cursor: 'pointer' }}
              >
                <animated.circle 
                  r={springs.scale.to(s => 5 / s)}
                  fill={selectedNode && selectedNode.id === node.id ? 'blue' : `hsl(${node.level * 30}, 70%, 60%)`} 
                />
                <animated.text
                  textAnchor="middle"
                  dy=".3em"
                  fontSize={springs.scale.to(s => 12 / s)}
                  fill="black"
                  transform={springs.scale.to(s => `translate(0, ${15 / s})`)}
                >
                  {node.id}
                </animated.text>
                {hoveredNode === node && (
                  <animated.text
                    textAnchor="middle"
                    dy=".3em"
                    fontSize={springs.scale.to(s => 14 / s)}
                    fill="black"
                    transform={springs.scale.to(s => `translate(0, ${-20 / s})`)}
                  >
                    {node.name}
                  </animated.text>
                )}
              </g>
            ))}
          </animated.g>
        </svg>
      </div>
    </div>
  );
};

export default SkillHierarchy;