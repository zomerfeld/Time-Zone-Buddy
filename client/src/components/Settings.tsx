import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Settings as SettingsIcon, Moon, Sun, Monitor, Clock } from 'lucide-react';
import { useStore } from '@/lib/store';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';

export const Settings = () => {
  const timeFormat = useStore((state) => state.timeFormat);
  const setTimeFormat = useStore((state) => state.setTimeFormat);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full w-10 h-10 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
        >
          <SettingsIcon className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-slate-950 border-slate-800 text-slate-200">
        <SheetHeader>
          <SheetTitle className="text-white">Settings</SheetTitle>
        </SheetHeader>
        
        <div className="py-6 space-y-8">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Time Format</h3>
            <RadioGroup 
              defaultValue={timeFormat} 
              onValueChange={(v) => setTimeFormat(v as '12' | '24')}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="12" id="r12" className="border-slate-600 text-blue-500" />
                <Label htmlFor="r12" className="cursor-pointer">12 Hour (AM/PM)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="24" id="r24" className="border-slate-600 text-blue-500" />
                <Label htmlFor="r24" className="cursor-pointer">24 Hour</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
             <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">About</h3>
             <p className="text-sm text-slate-400 leading-relaxed">
               This is a privacy-first, local-only time zone planner. No data leaves your device.
               Designed for speed and clarity.
             </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
