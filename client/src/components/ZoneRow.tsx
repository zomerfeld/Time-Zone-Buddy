import React, { useState, useEffect, useRef } from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import { GripHorizontal, Home, Trash2 } from 'lucide-react';
import { Zone } from '@/lib/types';
import { getLocalTime, formatTimeDisplay, formatDateDisplay, getTimeOffset, getGradientStyle, getTimezoneAbbreviation } from '@/lib/time-utils';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ZoneRowProps {
  zone: Zone;
  referenceTime: Date;
  isHome: boolean;
  isPlanning: boolean;
  timeFormat: '12' | '24';
  onTimeChange?: (newTime: Date) => void;
}

export const ZoneRow = ({ zone, referenceTime, isHome, isPlanning, timeFormat, onTimeChange }: ZoneRowProps) => {
  const controls = useDragControls();
  const removeZone = useStore((state) => state.removeZone);
  const setHomeZone = useStore((state) => state.setHomeZone);
  const homeZoneId = useStore((state) => state.homeZoneId);
  const [localTime, setLocalTime] = useState(getLocalTime(zone.ianaName, referenceTime));
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalTime(getLocalTime(zone.ianaName, referenceTime));
  }, [referenceTime, zone.ianaName]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleTimeClick = () => {
    const hours = localTime.getHours();
    const mins = localTime.getMinutes();
    if (timeFormat === '24') {
      setEditValue(`${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`);
    } else {
      const h12 = hours % 12 || 12;
      const period = hours >= 12 ? 'PM' : 'AM';
      setEditValue(`${h12}:${mins.toString().padStart(2, '0')} ${period}`);
    }
    setIsEditing(true);
  };

  const handleTimeSubmit = () => {
    setIsEditing(false);
    if (!onTimeChange) return;

    // Parse the input value
    let hours: number | null = null;
    let minutes = 0;

    const trimmed = editValue.trim().toUpperCase();
    
    // Try parsing 24h format (e.g., "14:30" or "14")
    const match24 = trimmed.match(/^(\d{1,2})(?::(\d{2}))?$/);
    if (match24) {
      hours = parseInt(match24[1], 10);
      minutes = match24[2] ? parseInt(match24[2], 10) : 0;
    }

    // Try parsing 12h format (e.g., "2:30 PM" or "2 PM")
    const match12 = trimmed.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/);
    if (match12) {
      hours = parseInt(match12[1], 10);
      minutes = match12[2] ? parseInt(match12[2], 10) : 0;
      const period = match12[3];
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
    }

    if (hours === null || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      return; // Invalid input, do nothing
    }

    // Calculate the time difference and create new reference time
    const currentHours = localTime.getHours();
    const currentMinutes = localTime.getMinutes();
    const diffMinutes = (hours * 60 + minutes) - (currentHours * 60 + currentMinutes);
    
    const newTime = new Date(referenceTime.getTime() + diffMinutes * 60 * 1000);
    onTimeChange(newTime);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTimeSubmit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const gradientStyle = getGradientStyle(localTime);
  const homeZone = useStore((state) => state.zones.find(z => z.id === homeZoneId));
  const homeIana = homeZone?.ianaName || zone.ianaName;
  const offset = getTimeOffset(homeIana, zone.ianaName, referenceTime);

  return (
    <Reorder.Item
      value={zone}
      dragListener={false}
      dragControls={controls}
      className="relative group h-full flex-1 min-w-0"
    >
      <div 
        className={cn(
          "h-full relative transition-all duration-300 select-none frosted-glass overflow-hidden",
          "hover:brightness-110 hover:shadow-xl"
        )}
        style={gradientStyle}
      >
        {/* Top Controls (Drag + Actions) */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-30">
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

        {/* Content: Time (Absolute Center) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center -translate-y-8 md:-translate-y-12 z-10">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleTimeSubmit}
              onKeyDown={handleKeyDown}
              className="text-3xl md:text-5xl lg:text-6xl font-mono font-medium text-white bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 text-center outline-none border-2 border-white/40 focus:border-white/60 w-48 md:w-64"
              data-testid="input-time-edit"
            />
          ) : (
            <div 
              className="flex items-baseline gap-1.5 text-white/75 drop-shadow-md tracking-tighter tabular-nums text-center cursor-pointer hover:bg-white/10 rounded-lg px-2 py-1 transition-colors pointer-events-auto"
              onClick={handleTimeClick}
              data-testid="button-time-display"
            >
              {(() => {
                const timeStr = formatTimeDisplay(localTime, timeFormat === '24');
                if (timeFormat === '24') {
                  return <span className="text-3xl md:text-5xl lg:text-6xl font-mono font-extrabold">{timeStr}</span>;
                }
                const [time, period] = timeStr.split(' ');
                return (
                  <>
                    <span className="text-3xl md:text-5xl lg:text-6xl font-mono font-medium">{time}</span>
                    <span className="text-lg md:text-2xl font-medium opacity-60 uppercase">{period}</span>
                  </>
                );
              })()}
            </div>
          )}
           {!isHome && (
            <div className="absolute top-1/2 mt-10 md:mt-14 text-xs md:text-sm font-semibold bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm pointer-events-none min-w-[3rem] text-center">
              {offset}
            </div>
          )}
        </div>

        {/* Footer: City Name & Date (Absolute Bottom) */}
        <div className="absolute bottom-0 left-0 right-0 p-6 pb-8 flex flex-col items-center text-center space-y-0.5 z-20 pointer-events-none">
          <div className="flex items-center gap-1.5">
            {isHome && <Home className="w-4 h-4 text-white/90" />}
            <h2 className="text-lg md:text-xl font-bold tracking-tight text-white/95 leading-tight px-2 line-clamp-2">
              {zone.label}
            </h2>
          </div>
          <div className="text-xs font-medium text-white/50 uppercase">
            {getTimezoneAbbreviation(zone.ianaName, referenceTime)}
          </div>
          <div className="text-xs md:text-sm font-medium text-white/80">
            {formatDateDisplay(localTime)}
          </div>
        </div>

      </div>
    </Reorder.Item>
  );
};
