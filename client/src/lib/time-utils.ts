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

// Pastel & Muted Palette for columns
export function getGradientStyle(date: Date) {
  const hour = getHours(date);
  
  // Night: 22-5 (Muted Navy/Charcoal)
  if (hour >= 22 || hour < 5) {
    return { background: 'linear-gradient(180deg, #1e293b 0%, #334155 100%)', color: '#cbd5e1' };
  }
  // Dawn: 5-8 (Soft Lavender/Periwinkle)
  if (hour >= 5 && hour < 8) {
    return { background: 'linear-gradient(180deg, #6366f1 0%, #818cf8 100%)', color: '#eef2ff' };
  }
  // Morning: 8-12 (Pastel Blue)
  if (hour >= 8 && hour < 12) {
    return { background: 'linear-gradient(180deg, #38bdf8 0%, #7dd3fc 100%)', color: '#f0f9ff' };
  }
  // Day: 12-17 (Soft Cyan/Teal)
  if (hour >= 12 && hour < 17) {
    return { background: 'linear-gradient(180deg, #2dd4bf 0%, #5eead4 100%)', color: '#f0fdfa' };
  }
  // Dusk: 17-20 (Muted Peach/Coral)
  if (hour >= 17 && hour < 20) {
    return { background: 'linear-gradient(180deg, #fb923c 0%, #fdba74 100%)', color: '#fff7ed' };
  }
  // Evening: 20-22 (Muted Purple/Indigo)
  if (hour >= 20 && hour < 22) {
    return { background: 'linear-gradient(180deg, #4f46e5 0%, #6366f1 100%)', color: '#e0e7ff' };
  }

  return { background: '#334155', color: '#e2e8f0' };
}
