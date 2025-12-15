import React, { useEffect, useState, useRef } from 'react';
import { Reorder } from 'framer-motion';
import { useStore } from '@/lib/store';
import { ZoneRow } from '@/components/ZoneRow';
import { AddZone } from '@/components/AddZone';
import { Settings } from '@/components/Settings';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { addMinutes } from 'date-fns';

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

  const handleReset = () => {
    resetPlanning();
    setNow(new Date());
  };

  // Scroll to plan logic with accumulated delta for slower response
  const scrollAccumulator = useRef(0);
  const SCROLL_THRESHOLD = 60; // Higher = slower (pixels of scroll needed per minute change)
  
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      scrollAccumulator.current += e.deltaY;
      
      // Only change time when accumulated scroll exceeds threshold
      if (Math.abs(scrollAccumulator.current) >= SCROLL_THRESHOLD) {
        const deltaMinutes = scrollAccumulator.current > 0 ? 1 : -1;
        scrollAccumulator.current = 0; // Reset accumulator
        
        if (!isPlanning) {
          togglePlanning(true);
          const currentRef = now.getTime();
          setPlanningTime(addMinutes(new Date(currentRef), deltaMinutes).getTime());
        } else if (planningTime) {
          setPlanningTime(addMinutes(new Date(planningTime), deltaMinutes).getTime());
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [isPlanning, planningTime, now, togglePlanning, setPlanningTime]);


  return (
    <div className="h-screen bg-slate-950 flex flex-col overflow-hidden relative">
      {/* Main Content Area - Full viewport flex container */}
      <div className="flex-1 min-h-0 w-full p-6">
        <Reorder.Group 
          axis="x" 
          values={zones} 
          onReorder={reorderZones} 
          className="flex h-full w-full gap-4"
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
            <div className="flex flex-col items-center justify-center w-full h-full text-slate-500">
              <p className="mb-4">No time zones added yet.</p>
            </div>
          )}
        </Reorder.Group>
      </div>

      {/* Reset Button - Centered */}
      {isPlanning && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
          <Button 
            variant="default" 
            size="sm"
            onClick={handleReset}
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium border-0 shadow-none animate-in fade-in duration-300"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Now
          </Button>
        </div>
      )}
      
      {/* Add Button - Right Side */}
      <div className="fixed bottom-8 right-8 z-50">
        <AddZone />
      </div>

      <div className="fixed top-8 right-8 z-50">
        <Settings />
      </div>
    </div>
  );
}
