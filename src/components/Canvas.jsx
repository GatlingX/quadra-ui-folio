import React from 'react';
import { Image } from 'lucide-react';

const HierarchyNode = ({ title, children }) => (
  <div className="flex flex-col items-center">
    <div className="flex flex-col items-center mb-2">
      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
        <Image className="w-6 h-6 text-gray-600" />
      </div>
      <span className="mt-1 text-sm font-medium">{title}</span>
    </div>
    {children && (
      <>
        <div className="w-px h-4 bg-gray-300"></div>
        <div className="flex space-x-8">
          {React.Children.map(children, (child, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-px h-4 bg-gray-300"></div>
              {child}
            </div>
          ))}
        </div>
      </>
    )}
  </div>
);

const HierarchicalDiagram = () => (
  <div className="bg-white p-4 rounded-lg shadow-md overflow-auto">
    <h2 className="text-xl font-bold mb-4">Hierarchical Diagram</h2>
    <div className="flex justify-center">
      <div className="flex space-x-8">
        <HierarchyNode title="Node 1.1">
          <HierarchyNode title="Node 2.1">
            <HierarchyNode title="Node 3.1">
              <HierarchyNode title="Node 4.1" />
            </HierarchyNode>
            <HierarchyNode title="Node 3.2" />
          </HierarchyNode>
          <HierarchyNode title="Node 2.2" />
        </HierarchyNode>
        <HierarchyNode title="Node 1.2">
          <HierarchyNode title="Node 2.3" />
          <HierarchyNode title="Node 2.4" />
        </HierarchyNode>
        <HierarchyNode title="Node 1.3" />
        <HierarchyNode title="Node 1.4" />
        <HierarchyNode title="Node 1.5" />
        <HierarchyNode title="Node 1.6" />
      </div>
    </div>
  </div>
);

export default HierarchicalDiagram;
