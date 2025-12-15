export interface Zone {
  id: string;
  ianaName: string;
  label: string;
}

export interface AppState {
  zones: Zone[];
  homeZoneId: string;
  timeFormat: '12' | '24';
  isPlanning: boolean;
  planningTime: number | null; // Timestamp
}
