import React, { useRef, useEffect } from 'react';

const Canvas = ({ data, setData }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw something (example: a rectangle)
    ctx.fillStyle = 'blue';
    ctx.fillRect(50, 50, 100, 100);

    // You can add more drawing logic here based on the `data` prop
  }, [data]);

  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setData({ x, y });
    // You can add more logic here to draw on the canvas or update the data
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2">Canvas</h2>
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        onClick={handleCanvasClick}
        className="border border-gray-300 rounded"
      />
    </div>
  );
};

export default Canvas;
