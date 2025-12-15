import React, { useEffect, useState, useRef } from 'react';
import { Reorder } from 'framer-motion';
import { useStore } from '@/lib/store';
import { ZoneRow } from '@/components/ZoneRow';
import { AddZone } from '@/components/AddZone';
import { Settings } from '@/components/Settings';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { addMinutes, setHours, setMinutes } from 'date-fns';

export function NewTab() {
  const zones = useStore((state) => state.zones);
  const reorderZones = useStore((state) => state.reorderZones);
  const homeZoneId = useStore((state) => state.homeZoneId);
  const timeFormat = useStore((state) => state.timeFormat);
  const isPlanning = useStore((state) => state.isPlanning);
  const togglePlanning = useStore((state) => state.togglePlanning);
  const planningTime = useStore((state) => state.planningTime);
  const setPlanningTime = useStore((state) => state.setPlanningTime);
  const resetPlanning = useStore((state) => state.resetPlanning);

  const [now, setNow] = useState(new Date());
  
  // Timer for "Now" mode
  useEffect(() => {
    if (isPlanning) return;
    
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isPlanning]);

  // Handle planning time
  const referenceTime = isPlanning && planningTime ? new Date(planningTime) : now;
  
  // Slider logic (minutes from start of day)
  const [sliderValue, setSliderValue] = useState([referenceTime.getHours() * 60 + referenceTime.getMinutes()]);

  const handleSliderChange = (val: number[]) => {
    if (!isPlanning) {
      togglePlanning(true);
    }
    const minutes = val[0];
    const newDate = new Date(now); // Base it on "today"
    newDate.setHours(Math.floor(minutes / 60));
    newDate.setMinutes(minutes % 60);
    setPlanningTime(newDate.getTime());
    setSliderValue(val);
  };

  const handleReset = () => {
    resetPlanning();
    setNow(new Date());
    setSliderValue([new Date().getHours() * 60 + new Date().getMinutes()]);
  };

  return (
    <div className="h-screen bg-slate-950 flex flex-col overflow-hidden">
      {/* Main Content Area - Horizontal Flex for Columns */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar">
        <Reorder.Group 
          axis="x" 
          values={zones} 
          onReorder={reorderZones} 
          className="flex h-full min-w-full w-fit gap-6 px-6 py-6"
        >
          {zones.map((zone) => (
            <ZoneRow
              key={zone.id}
              zone={zone}
              referenceTime={referenceTime}
              isHome={zone.id === homeZoneId}
              isPlanning={isPlanning}
              timeFormat={timeFormat}
            />
          ))}
          
          {zones.length === 0 && (
            <div className="flex flex-col items-center justify-center w-screen h-full text-slate-500">
              <p className="mb-4">No time zones added yet.</p>
            </div>
          )}
        </Reorder.Group>
      </div>

      {/* Floating Action Controls */}
      <div className="fixed bottom-24 right-8 flex flex-col gap-4 z-50">
        <AddZone />
      </div>

      <div className="fixed top-8 right-8 z-50">
        <Settings />
      </div>

      {/* Planning Slider Footer */}
      <div className="sticky bottom-0 bg-slate-900/90 backdrop-blur-md border-t border-white/10 p-6 z-40">
        <div className="max-w-4xl mx-auto flex items-center gap-6">
          <div className="flex-1">
             <Slider
              value={sliderValue}
              min={0}
              max={1440} // 24 * 60
              step={15}
              onValueChange={handleSliderChange}
              className="cursor-pointer"
            />
          </div>
          
          {isPlanning && (
             <Button 
               variant="outline" 
               size="sm"
               onClick={handleReset}
               className="gap-2 bg-blue-600 border-transparent hover:bg-blue-500 text-white"
             >
               <RotateCcw className="w-4 h-4" />
               Reset
             </Button>
          )}
          
          <div className="w-24 text-right font-mono text-slate-400 text-sm">
             {isPlanning ? 'Planning' : 'Live'}
          </div>
        </div>
      </div>
    </div>
  );
}
