import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SourceCode = ({ targetCode, setTargetCode, attackCode, setAttackCode }) => {
  const [activeTab, setActiveTab] = useState("target");

  const handleTargetChange = (e) => {
    setTargetCode(e.target.value);
  };

  const handleAttackChange = (e) => {
    setAttackCode(e.target.value);
  };

  return (
    <div className="bg-[#1e1e1e] text-white p-4 rounded-lg flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold">Source Code</h2>
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="target">Target Code</TabsTrigger>
          <TabsTrigger value="attack">Attack Code</TabsTrigger>
        </TabsList>
        <div className="flex-1 overflow-hidden flex">
          <TabsContent value="target" className="flex-1 h-full">
            <textarea
              value={targetCode}
              onChange={handleTargetChange}
              className="w-full h-full bg-[#1e1e1e] text-white p-2 font-mono text-sm resize-none focus:outline-none"
              placeholder="Enter target code here..."
              spellCheck="false"
            />
          </TabsContent>
          <TabsContent value="attack" className="flex-1 h-full">
            <textarea
              value={attackCode}
              onChange={handleAttackChange}
              className="w-full h-full bg-[#1e1e1e] text-white p-2 font-mono text-sm resize-none focus:outline-none"
              placeholder="Enter attack code here..."
              spellCheck="false"
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default SourceCode;
