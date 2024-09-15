import React, { useState, useEffect, useRef } from 'react';
import { useSpring, animated } from 'react-spring';

// Improved custom hook for dynamic text sizing
const useDynamicTextSize = (text, maxWidth) => {
  const [fontSize, setFontSize] = useState(14);
  const spanRef = useRef(null);

  useEffect(() => {
    if (spanRef.current && text) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      let size = 14;

      do {
        context.font = `${size}px sans-serif`;
        const metrics = context.measureText(text);
        if (metrics.width <= maxWidth || size <= 8) {
          break;
        }
        size--;
      } while (size > 8);

      setFontSize(size);
    }
  }, [text, maxWidth]);

  return { fontSize, spanRef };
};

const SkillHierarchy = ({ onNodeClick, selectedNode, skillLibrary }) => {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [isPanning, setIsPanning] = useState(false);
  const svgRef = useRef(null);
  const [springs, api] = useSpring(() => ({ scale: 1, x: 0, y: 0, config: { mass: 1, tension: 170, friction: 26 } }));

  const MIN_SCALE = 0.1;
  const MAX_SCALE = 10;
  const ZOOM_SENSITIVITY = 0.2;
  const PAN_SENSITIVITY = 1;

  const [startPanPosition, setStartPanPosition] = useState({ x: 0, y: 0 });
  const [hoveredScaleName, setHoveredScaleName] = useState('');
  const [pinnedScaleName, setPinnedScaleName] = useState('');
  const [scaleFontSize, setScaleFontSize] = useState(14);
  const scaleNameRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const buildDendrogram = (skills, x, y, level) => {
      const newNodes = [];
      const newLinks = [];

      // Reduce the spacing between nodes
      const skillSpacing = Math.max(30, height / (skills.length + 2));
      
      skills.forEach((skill, index) => {
        const skillX = x;
        // Place the first node much higher and reduce spacing between subsequent nodes
        const skillY = y + (index * skillSpacing);

        newNodes.push({ id: skill.id, x: skillX, y: skillY, name: skill.name, level });

        if (skill.children) {
          const [childNodes, childLinks] = buildDendrogram(skill.children, skillX + 200, y, level + 1);
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

    // Calculate the bounding box of all nodes
    const minX = Math.min(...newNodes.map(node => node.x));
    const maxX = Math.max(...newNodes.map(node => node.x));
    const minY = Math.min(...newNodes.map(node => node.y));
    const maxY = Math.max(...newNodes.map(node => node.y));

    // Calculate the scale factor to fit all nodes within the SVG
    const scaleX = width / (maxX - minX + 100); // Add padding
    const scaleY = height / (maxY - minY + 100); // Add padding
    const scale = Math.min(scaleX, scaleY);

    // Apply the scale to all nodes and links
    const scaledNodes = newNodes.map(node => ({
      ...node,
      x: (node.x - minX) * scale + 50,
      y: (node.y - minY) * scale + 50
    }));

    const scaledLinks = newLinks.map(link => ({
      source: {
        x: (link.source.x - minX) * scale + 50,
        y: (link.source.y - minY) * scale + 50
      },
      target: {
        x: (link.target.x - minX) * scale + 50,
        y: (link.target.y - minY) * scale + 50
      }
    }));

    setNodes(scaledNodes);
    setLinks(scaledLinks);

    // Reset the view to fit all nodes
    api.start({ scale: 1, x: 0, y: 0, immediate: true });

    const svg = svgRef.current;
    svg.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      svg.removeEventListener('wheel', handleWheel);
    };
  }, [skillLibrary]);

  useEffect(() => {
    if (scaleNameRef.current && containerRef.current && (hoveredScaleName || pinnedScaleName)) {
      const containerWidth = containerRef.current.offsetWidth;
      const titleWidth = containerRef.current.querySelector('span:first-child').offsetWidth;
      const availableWidth = containerWidth - titleWidth - 16;

      const displayedName = hoveredScaleName || pinnedScaleName;
      let fontSize = 14;
      scaleNameRef.current.style.fontSize = `${fontSize}px`;

      if (scaleNameRef.current.scrollWidth > availableWidth) {
        while (scaleNameRef.current.scrollWidth > availableWidth && fontSize > 8) {
          fontSize--;
          scaleNameRef.current.style.fontSize = `${fontSize}px`;
        }
      } else {
        while (fontSize < 14 && scaleNameRef.current.scrollWidth <= availableWidth) {
          fontSize++;
          scaleNameRef.current.style.fontSize = `${fontSize}px`;
        }
        if (scaleNameRef.current.scrollWidth > availableWidth) {
          fontSize--;
        }
      }

      setScaleFontSize(fontSize);
    }
  }, [hoveredScaleName, pinnedScaleName]);

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

    api.start({ scale: newScale, x: newX, y: newY, immediate: true });
  };

  const handleNodeClick = (node) => {
    setPinnedScaleName(node.name);
    onNodeClick(node);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md h-full flex flex-col">
      <h2 ref={containerRef} className="text-xl font-bold mb-4 flex items-center">
        <span className="whitespace-nowrap mr-2 flex-shrink-0">Skill Hierarchy</span>
        {(hoveredScaleName || pinnedScaleName) && (
          <span 
            ref={scaleNameRef}
            className="text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis flex-grow min-w-0"
            style={{ 
              fontSize: `${scaleFontSize}px`,
              lineHeight: '1.2',
            }}
          >
            {hoveredScaleName || pinnedScaleName}
          </span>
        )}
      </h2>
      <div className="flex-1 overflow-hidden">
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ userSelect: 'none' }}
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
                onClick={() => handleNodeClick({ id: node.id, name: node.name, content: node.content })}
                onMouseEnter={() => setHoveredScaleName(node.name)}
                onMouseLeave={() => setHoveredScaleName('')}
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
              </g>
            ))}
          </animated.g>
        </svg>
      </div>
    </div>
  );
};

export default SkillHierarchy;