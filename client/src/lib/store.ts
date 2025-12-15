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
  { id: '3', ianaName: 'America/Toronto', label: 'Toronto' },
  { id: '4', ianaName: 'America/Sao_Paulo', label: 'São Paulo' },
  { id: '5', ianaName: 'Europe/London', label: 'London' },
  { id: '6', ianaName: 'Europe/Paris', label: 'Paris' },
  { id: '7', ianaName: 'Europe/Berlin', label: 'Berlin' },
  { id: '8', ianaName: 'Asia/Dubai', label: 'Dubai' },
  { id: '9', ianaName: 'Asia/Jerusalem', label: 'Tel Aviv' },
  { id: '10', ianaName: 'Asia/Kolkata', label: 'Bangalore' },
  { id: '11', ianaName: 'Asia/Singapore', label: 'Singapore' },
  { id: '12', ianaName: 'Asia/Hong_Kong', label: 'Hong Kong' },
  { id: '13', ianaName: 'Asia/Tokyo', label: 'Tokyo' },
  { id: '14', ianaName: 'Australia/Sydney', label: 'Sydney' },
];

export const useStore = create<AppState & Actions>()(
  persist(
    (set) => ({
      zones: DEFAULT_ZONES,
      homeZoneId: '1',
      timeFormat: '12',
      isPlanning: false,
      planningTime: null,

      addZone: (ianaName, label) => set((state) => ({
        zones: [...state.zones, { id: nanoid(), ianaName, label }]
      })),

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
