import React, { useState, useEffect } from 'react';
import { motion, Reorder, useDragControls } from 'framer-motion';
import { GripVertical, Home, Trash2 } from 'lucide-react';
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
      className="relative group overflow-hidden"
    >
      <div 
        className={cn(
          "flex items-center justify-between px-6 py-8 transition-all duration-300 select-none",
          "hover:brightness-110"
        )}
        style={gradientStyle}
      >
        <div className="flex items-center gap-4 z-10">
          <div 
            className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-50 transition-opacity"
            onPointerDown={(e) => controls.start(e)}
          >
            <GripVertical className="w-5 h-5" />
          </div>
          
          <div className="flex flex-col">
            <h2 className="text-3xl font-bold tracking-tight text-white/90 drop-shadow-sm">
              {zone.label}
            </h2>
            <div className="flex items-center gap-2 text-white/70 font-medium mt-1">
              <span>{formatDateDisplay(localTime)}</span>
              {!isHome && (
                <>
                  <span className="w-1 h-1 rounded-full bg-white/50" />
                  <span>{offset}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8 z-10">
          <div className="text-right">
             <div className="text-6xl font-mono font-medium text-white drop-shadow-md tracking-tighter tabular-nums">
              {formatTimeDisplay(localTime, timeFormat === '24')}
            </div>
            <div className="text-sm font-medium text-white/60 uppercase tracking-widest mt-1">
              {zone.ianaName.split('/')[1]?.replace(/_/g, ' ') || zone.ianaName}
            </div>
          </div>
          
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0 duration-300">
            {!isHome && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setHomeZone(zone.id)}
                className="text-white/60 hover:text-white hover:bg-white/10"
                title="Set as Home"
              >
                <Home className="w-5 h-5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeZone(zone.id)}
              className="text-white/60 hover:text-red-300 hover:bg-red-500/20"
              title="Remove Zone"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </Reorder.Item>
  );
};
