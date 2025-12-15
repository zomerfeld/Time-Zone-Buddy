import React, { useState } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useStore } from '@/lib/store';

const COMMON_CITIES: { ianaName: string; label: string }[] = [
  // Americas
  { ianaName: "America/Los_Angeles", label: "San Francisco" },
  { ianaName: "America/Los_Angeles", label: "Los Angeles" },
  { ianaName: "America/Denver", label: "Denver" },
  { ianaName: "America/Chicago", label: "Chicago" },
  { ianaName: "America/New_York", label: "New York" },
  { ianaName: "America/New_York", label: "Philadelphia" },
  { ianaName: "America/Toronto", label: "Toronto" },
  { ianaName: "America/Sao_Paulo", label: "São Paulo" },
  // Europe
  { ianaName: "Europe/London", label: "London" },
  { ianaName: "Europe/Paris", label: "Paris" },
  { ianaName: "Europe/Berlin", label: "Berlin" },
  { ianaName: "Europe/Moscow", label: "Moscow" },
  // Middle East
  { ianaName: "Asia/Dubai", label: "Dubai" },
  { ianaName: "Asia/Jerusalem", label: "Tel Aviv" },
  // Asia
  { ianaName: "Asia/Kolkata", label: "Bangalore" },
  { ianaName: "Asia/Kolkata", label: "Mumbai" },
  { ianaName: "Asia/Singapore", label: "Singapore" },
  { ianaName: "Asia/Hong_Kong", label: "Hong Kong" },
  { ianaName: "Asia/Shanghai", label: "Shanghai" },
  { ianaName: "Asia/Tokyo", label: "Tokyo" },
  // Oceania
  { ianaName: "Australia/Sydney", label: "Sydney" },
  { ianaName: "Pacific/Auckland", label: "Auckland" },
].sort((a, b) => a.label.localeCompare(b.label));

// A more complete list could be imported from Intl.supportedValuesOf('timeZone')
const ALL_ZONES = Intl.supportedValuesOf('timeZone');

export const AddZone = () => {
  const [open, setOpen] = useState(false);
  const addZone = useStore((state) => state.addZone);

  const handleSelectCity = (ianaName: string, label: string) => {
    addZone(ianaName, label);
    setOpen(false);
  };

  const handleSelectZone = (ianaName: string) => {
    const city = ianaName.split('/')[1]?.replace(/_/g, ' ') || ianaName;
    addZone(ianaName, city);
    setOpen(false);
  };

  const commonIanaNames = COMMON_CITIES.map(c => c.ianaName);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full w-12 h-12 bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:text-white transition-all backdrop-blur-sm"
          data-testid="button-add-zone"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[300px] bg-slate-900 border-slate-700 text-slate-100" align="end">
        <Command className="bg-slate-900">
          <CommandInput placeholder="Search city or time zone..." className="text-white" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Popular Cities">
              {COMMON_CITIES.map((city) => (
                <CommandItem
                  key={`${city.ianaName}-${city.label}`}
                  onSelect={() => handleSelectCity(city.ianaName, city.label)}
                  className="cursor-pointer aria-selected:bg-slate-800 aria-selected:text-white"
                  data-testid={`option-city-${city.label.toLowerCase().replace(/\s/g, '-')}`}
                >
                  {city.label}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="All Time Zones">
               {ALL_ZONES.filter(z => !commonIanaNames.includes(z)).map((zone) => (
                <CommandItem
                  key={zone}
                  onSelect={() => handleSelectZone(zone)}
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
