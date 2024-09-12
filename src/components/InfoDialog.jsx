import React from 'react';
import { Info } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const InfoDialog = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <Info className="w-6 h-6 cursor-pointer" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>About Hackbot</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Hackbot is an AI-powered coding assistant designed to help developers write, debug, and optimize code efficiently.</p>
          <h3 className="font-semibold">Key Features:</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Interactive Console: Run commands and see real-time output</li>
            <li>AI Chat: Get instant coding help and explanations</li>
            <li>Source Code Editor: Write and edit code with syntax highlighting</li>
            <li>Skill Hierarchy: Visualize and navigate through coding skills</li>
          </ul>
          <p>Version: 1.0.0</p>
          <p>Created by: AI Development Team</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InfoDialog;