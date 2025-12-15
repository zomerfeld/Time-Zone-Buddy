import React, { useState, useEffect } from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import { GripHorizontal, Home, Trash2 } from 'lucide-react';
import { Zone } from '@/lib/types';
import { getLocalTime, formatTimeDisplay, formatDateDisplay, getTimeOffset, getGradientStyle } from '@/lib/time-utils';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ZoneRowProps {
  zone: Zone;
  referenceTime: Date;
  isHome: boolean;
  isPlanning: boolean;
  timeFormat: '12' | '24';
}

export const ZoneRow = ({ zone, referenceTime, isHome, isPlanning, timeFormat }: ZoneRowProps) => {
  const controls = useDragControls();
  const removeZone = useStore((state) => state.removeZone);
  const setHomeZone = useStore((state) => state.setHomeZone);
  const homeZoneId = useStore((state) => state.homeZoneId);
  const [localTime, setLocalTime] = useState(getLocalTime(zone.ianaName, referenceTime));

  useEffect(() => {
    setLocalTime(getLocalTime(zone.ianaName, referenceTime));
  }, [referenceTime, zone.ianaName]);

  const gradientStyle = getGradientStyle(localTime);
  const homeZone = useStore((state) => state.zones.find(z => z.id === homeZoneId));
  const homeTime = homeZone ? getLocalTime(homeZone.ianaName, referenceTime) : referenceTime;
  const offset = getTimeOffset(homeTime, localTime);

  return (
    <Reorder.Item
      value={zone}
      dragListener={false}
      dragControls={controls}
      className="relative group h-full flex-1 min-w-0"
    >
      <div 
        className={cn(
          "h-full flex flex-col p-4 transition-all duration-300 select-none grain-texture rounded-xl shadow-lg",
          "hover:brightness-110 hover:shadow-xl"
        )}
        style={gradientStyle}
      >
        {/* Top Controls (Drag + Actions) */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
            {!isHome && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setHomeZone(zone.id)}
                className="text-white/70 hover:text-white hover:bg-white/20 h-6 w-6"
                title="Set as Home"
              >
                <Home className="w-3 h-3" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeZone(zone.id)}
              className="text-white/70 hover:text-red-200 hover:bg-red-500/20 h-6 w-6"
              title="Remove Zone"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
            <div 
              className="cursor-grab active:cursor-grabbing p-1 hover:bg-white/10 rounded-md"
              onPointerDown={(e) => controls.start(e)}
            >
              <GripHorizontal className="w-4 h-4 opacity-70" />
            </div>
        </div>

        {/* Content: Time (Centered, with Offset floating below) */}
        <div className="flex-1 flex flex-col items-center justify-center z-10 relative">
          <div className="text-3xl md:text-5xl lg:text-6xl font-mono font-medium text-white drop-shadow-md tracking-tighter tabular-nums text-center">
            {formatTimeDisplay(localTime, timeFormat === '24')}
          </div>
           {!isHome && (
            <div className="absolute top-1/2 mt-10 md:mt-14 text-xs md:text-sm font-semibold bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
              {offset}
            </div>
          )}
        </div>

        {/* Footer: City Name & Date (Bottom Aligned) */}
        <div className="flex flex-col items-center text-center mt-2 space-y-1">
          <h2 className="text-lg md:text-xl font-bold tracking-tight text-white/95 leading-tight truncate w-full px-2">
            {zone.label}
          </h2>
          <div className="text-xs md:text-sm font-medium text-white/80">
            {formatDateDisplay(localTime)}
          </div>
        </div>

      </div>
    </Reorder.Item>
  );
};
