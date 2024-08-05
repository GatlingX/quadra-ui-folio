import React, { useRef, useEffect } from 'react';

const Canvas = ({ sourceCode }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set font and color
    ctx.font = '14px monospace';
    ctx.fillStyle = 'black';

    // Render source code
    const lines = sourceCode.split('\n');
    lines.forEach((line, index) => {
      ctx.fillText(line, 10, 20 + (index * 20));
    });
  }, [sourceCode]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2">Canvas</h2>
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        className="border border-gray-300 rounded"
      />
    </div>
  );
};

export default Canvas;
