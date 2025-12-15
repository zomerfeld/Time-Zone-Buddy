import { format, toZonedTime } from 'date-fns-tz';
import { differenceInMinutes, getHours } from 'date-fns';

export function getLocalTime(ianaName: string, referenceTime: Date = new Date()) {
  try {
    return toZonedTime(referenceTime, ianaName);
  } catch (e) {
    console.error(`Invalid time zone: ${ianaName}`, e);
    return new Date();
  }
}

export function formatTimeDisplay(date: Date, format24: boolean) {
  return format(date, format24 ? 'HH:mm' : 'h:mm aa');
}

export function formatDateDisplay(date: Date) {
  return format(date, 'EEE, MMM d');
}

export function getTimeOffset(homeTime: Date, zoneTime: Date) {
  const diffMinutes = differenceInMinutes(zoneTime, homeTime);
  const hours = Math.floor(Math.abs(diffMinutes) / 60);
  const minutes = Math.abs(diffMinutes) % 60;
  
  if (diffMinutes === 0) return 'Same time';
  
  const sign = diffMinutes > 0 ? '+' : '-';
  if (minutes === 0) return `${sign}${hours}h`;
  return `${sign}${hours}h ${minutes}m`;
}

export function getGradientStyle(date: Date) {
  const hour = getHours(date);
  
  // Original Vibrant Scheme (Rotated 180deg for columns)
  
  // Night: 22-5
  if (hour >= 22 || hour < 5) {
    return { background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)', color: '#e2e8f0' };
  }
  // Dawn: 5-8
  if (hour >= 5 && hour < 8) {
    return { background: 'linear-gradient(180deg, #312e81 0%, #4c1d95 100%)', color: '#e0e7ff' };
  }
  // Morning: 8-12
  if (hour >= 8 && hour < 12) {
    return { background: 'linear-gradient(180deg, #0369a1 0%, #0ea5e9 100%)', color: '#f0f9ff' };
  }
  // Day: 12-17
  if (hour >= 12 && hour < 17) {
    return { background: 'linear-gradient(180deg, #0284c7 0%, #22d3ee 100%)', color: '#f0f9ff' };
  }
  // Dusk: 17-20
  if (hour >= 17 && hour < 20) {
    return { background: 'linear-gradient(180deg, #ea580c 0%, #db2777 100%)', color: '#fff7ed' };
  }
  // Evening: 20-22
  if (hour >= 20 && hour < 22) {
    return { background: 'linear-gradient(180deg, #4c1d95 0%, #312e81 100%)', color: '#f3e8ff' };
  }

  return { background: '#1e293b', color: '#fff' };
}
