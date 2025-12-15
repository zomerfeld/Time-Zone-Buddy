import { create } from 'zustand';
import { persist, createJSONStorage, PersistStorage, StorageValue } from 'zustand/middleware';
import { Zone, AppState } from './types';
import { nanoid } from 'nanoid';

// Helper functions for cookie operations
const getCookie = (name: string): string | null => {
  const matches = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)')
  );
  return matches ? decodeURIComponent(matches[1]) : null;
};

const setCookie = (name: string, value: string): void => {
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 10);
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
};

const removeCookie = (name: string): void => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
};

// Custom cookie storage adapter for Zustand using createJSONStorage
const cookieStorage = createJSONStorage<any>(() => ({
  getItem: getCookie,
  setItem: setCookie,
  removeItem: removeCookie,
}));

interface Actions {
  addZone: (ianaName: string, label: string) => void;
  removeZone: (id: string) => void;
  reorderZones: (zones: Zone[]) => void;
  setHomeZone: (id: string) => void;
  setTimeFormat: (format: '12' | '24') => void;
  setPlanningTime: (time: number | null) => void;
  togglePlanning: (isPlanning: boolean) => void;
  resetPlanning: () => void;
}

const DEFAULT_ZONES: Zone[] = [
  { id: '1', ianaName: 'America/Los_Angeles', label: 'San Francisco' },
  { id: '2', ianaName: 'America/New_York', label: 'Philadelphia' },
  { id: '3', ianaName: 'America/Sao_Paulo', label: 'São Paulo' },
  { id: '4', ianaName: 'Asia/Shanghai', label: 'Shanghai' },
];

// Get UTC offset in minutes for a timezone
const getUtcOffset = (ianaName: string): number => {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: ianaName,
    timeZoneName: 'shortOffset',
  });
  const parts = formatter.formatToParts(now);
  const offsetPart = parts.find(p => p.type === 'timeZoneName')?.value || '';
  // Parse offset like "GMT+5:30" or "GMT-8"
  const match = offsetPart.match(/GMT([+-])?(\d+)?(?::(\d+))?/);
  if (!match) return 0;
  const sign = match[1] === '-' ? -1 : 1;
  const hours = parseInt(match[2] || '0', 10);
  const minutes = parseInt(match[3] || '0', 10);
  return sign * (hours * 60 + minutes);
};

export const useStore = create<AppState & Actions>()(
  persist(
    (set) => ({
      zones: DEFAULT_ZONES,
      homeZoneId: '1',
      timeFormat: '24',
      isPlanning: false,
      planningTime: null,

      addZone: (ianaName, label) => set((state) => {
        const newZone = { id: nanoid(), ianaName, label };
        const newOffset = getUtcOffset(ianaName);
        
        // Find the right position to insert (sorted by UTC offset, west to east)
        const zonesWithOffsets = state.zones.map(z => ({
          zone: z,
          offset: getUtcOffset(z.ianaName)
        }));
        
        let insertIndex = zonesWithOffsets.findIndex(z => z.offset > newOffset);
        if (insertIndex === -1) insertIndex = state.zones.length;
        
        const newZones = [...state.zones];
        newZones.splice(insertIndex, 0, newZone);
        
        return { zones: newZones };
      }),

      removeZone: (id) => set((state) => ({
        zones: state.zones.filter((z) => z.id !== id)
      })),

      reorderZones: (zones) => set({ zones }),

      setHomeZone: (id) => set({ homeZoneId: id }),

      setTimeFormat: (format) => set({ timeFormat: format }),

      setPlanningTime: (time) => set({ planningTime: time }),

      togglePlanning: (isPlanning) => set({ isPlanning }),

      resetPlanning: () => set({ isPlanning: false, planningTime: null }),
    }),
    {
      name: 'fio-clone-storage',
      storage: cookieStorage,
      partialize: (state) => ({
        zones: state.zones,
        homeZoneId: state.homeZoneId,
        timeFormat: state.timeFormat,
      }),
    }
  )
);
