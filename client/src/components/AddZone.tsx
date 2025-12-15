import React, { useState } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useStore } from '@/lib/store';

const COMMON_TIMEZONES = [
  "America/New_York", "America/Los_Angeles", "America/Chicago", "America/Denver",
  "Europe/London", "Europe/Paris", "Europe/Berlin", "Europe/Moscow",
  "Asia/Tokyo", "Asia/Shanghai", "Asia/Singapore", "Asia/Dubai",
  "Australia/Sydney", "Pacific/Auckland", "UTC"
].sort();

// A more complete list could be imported from Intl.supportedValuesOf('timeZone')
const ALL_ZONES = Intl.supportedValuesOf('timeZone');

export const AddZone = () => {
  const [open, setOpen] = useState(false);
  const addZone = useStore((state) => state.addZone);

  const handleSelect = (ianaName: string) => {
    const city = ianaName.split('/')[1]?.replace(/_/g, ' ') || ianaName;
    addZone(ianaName, city);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full w-12 h-12 bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:text-white transition-all backdrop-blur-sm"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[300px] bg-slate-900 border-slate-700 text-slate-100" align="end">
        <Command className="bg-slate-900">
          <CommandInput placeholder="Search city or time zone..." className="text-white" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Common Zones">
              {COMMON_TIMEZONES.map((zone) => (
                <CommandItem
                  key={zone}
                  onSelect={() => handleSelect(zone)}
                  className="cursor-pointer aria-selected:bg-slate-800 aria-selected:text-white"
                >
                  {zone}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="All Zones">
               {ALL_ZONES.filter(z => !COMMON_TIMEZONES.includes(z)).map((zone) => (
                <CommandItem
                  key={zone}
                  onSelect={() => handleSelect(zone)}
                  className="cursor-pointer aria-selected:bg-slate-800 aria-selected:text-white"
                >
                  {zone}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
