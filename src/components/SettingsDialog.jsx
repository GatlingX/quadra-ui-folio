import React from 'react';
import { Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useTheme } from 'next-themes';

const SettingsDialog = () => {
  const { theme, setTheme } = useTheme();

  const handleDarkModeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Settings className="w-6 h-6 cursor-pointer" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="dark-mode">Dark Mode</Label>
            <Switch 
              id="dark-mode" 
              checked={theme === 'dark'}
              onCheckedChange={handleDarkModeToggle}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="font-size">Font Size</Label>
            <Slider id="font-size" min={12} max={24} step={1} defaultValue={[16]} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications">Notifications</Label>
            <Switch id="notifications" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-save">Auto Save</Label>
            <Switch id="auto-save" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;