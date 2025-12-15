import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Zone, AppState } from './types';
import { nanoid } from 'nanoid';

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
  { id: '2', ianaName: 'America/New_York', label: 'New York' },
  { id: '3', ianaName: 'Europe/London', label: 'London' },
  { id: '4', ianaName: 'Asia/Tokyo', label: 'Tokyo' },
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
      partialize: (state) => ({
        zones: state.zones,
        homeZoneId: state.homeZoneId,
        timeFormat: state.timeFormat,
      }),
    }
  )
);
