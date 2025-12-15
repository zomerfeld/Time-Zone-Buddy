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
      className="relative group h-full min-w-[320px] flex-1 border-r border-white/10 last:border-r-0"
    >
      <div 
        className={cn(
          "h-full flex flex-col justify-between p-8 transition-all duration-300 select-none grain-texture",
          "hover:brightness-105"
        )}
        style={gradientStyle}
      >
        {/* Top Controls (Drag + Actions) */}
        <div className="flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <div 
            className="cursor-grab active:cursor-grabbing p-2 hover:bg-white/10 rounded-md"
            onPointerDown={(e) => controls.start(e)}
          >
            <GripHorizontal className="w-5 h-5 opacity-70" />
          </div>
          
          <div className="flex gap-1">
            {!isHome && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setHomeZone(zone.id)}
                className="text-white/70 hover:text-white hover:bg-white/20 h-8 w-8"
                title="Set as Home"
              >
                <Home className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeZone(zone.id)}
              className="text-white/70 hover:text-red-200 hover:bg-red-500/20 h-8 w-8"
              title="Remove Zone"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content Centered */}
        <div className="flex flex-col items-center justify-center gap-12 z-10 my-auto text-center">
          
          {/* City Name */}
          <h2 className="text-5xl font-bold tracking-tight text-white/95 drop-shadow-sm leading-tight">
            {zone.label}
          </h2>

          {/* Time */}
          <div className="text-5xl font-mono font-medium text-white drop-shadow-md tracking-tighter tabular-nums">
            {formatTimeDisplay(localTime, timeFormat === '24')}
          </div>

        </div>

        {/* Footer Info */}
        <div className="flex flex-col items-center gap-2 z-10 opacity-80">
          <div className="text-lg font-medium">
            {formatDateDisplay(localTime)}
          </div>
          {!isHome && (
            <div className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
              {offset}
            </div>
          )}
        </div>
      </div>
    </Reorder.Item>
  );
};
