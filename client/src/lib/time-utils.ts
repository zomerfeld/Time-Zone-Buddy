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

export function getTimezoneAbbreviation(ianaName: string, referenceTime: Date = new Date()): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: ianaName,
      timeZoneName: 'short'
    });
    const parts = formatter.formatToParts(referenceTime);
    const tzPart = parts.find(p => p.type === 'timeZoneName');
    return tzPart?.value || '';
  } catch {
    return '';
  }
}

export function getTimezoneOffsetMinutes(ianaName: string, referenceTime: Date = new Date()): number {
  // Get the UTC offset for a timezone in minutes
  const utcDate = new Date(referenceTime.toLocaleString('en-US', { timeZone: 'UTC' }));
  const tzDate = new Date(referenceTime.toLocaleString('en-US', { timeZone: ianaName }));
  return Math.round((tzDate.getTime() - utcDate.getTime()) / 60000);
}

export function getTimeOffset(homeIana: string, zoneIana: string, referenceTime: Date = new Date()) {
  // Calculate static offset between two timezones based on their UTC offsets
  const homeOffset = getTimezoneOffsetMinutes(homeIana, referenceTime);
  const zoneOffset = getTimezoneOffsetMinutes(zoneIana, referenceTime);
  const diffMinutes = zoneOffset - homeOffset;
  
  const hours = Math.floor(Math.abs(diffMinutes) / 60);
  const minutes = Math.abs(diffMinutes) % 60;
  
  if (diffMinutes === 0) return 'Same';
  
  const sign = diffMinutes > 0 ? '+' : '-';
  if (minutes === 0) return `${sign}${hours}h`;
  return `${sign}${hours}h${minutes}m`;
}

export function getGradientStyle(date: Date) {
  const hour = getHours(date);
  
  // Unique gradient for each hour to create visual distinction
  const hourGradients: Record<number, { background: string; color: string }> = {
    // Night: 22-5 (dark blues/blacks)
    0: { background: 'linear-gradient(180deg, #0a0f1a 0%, #1a1f2e 100%)', color: '#e2e8f0' },
    1: { background: 'linear-gradient(180deg, #0d1117 0%, #161b22 100%)', color: '#e2e8f0' },
    2: { background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)', color: '#e2e8f0' },
    3: { background: 'linear-gradient(180deg, #111827 0%, #1f2937 100%)', color: '#e2e8f0' },
    4: { background: 'linear-gradient(180deg, #18181b 0%, #27272a 100%)', color: '#e2e8f0' },
    // Dawn: 5-8 (purples/indigos)
    5: { background: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 100%)', color: '#e0e7ff' },
    6: { background: 'linear-gradient(180deg, #312e81 0%, #4c1d95 100%)', color: '#e0e7ff' },
    7: { background: 'linear-gradient(180deg, #4c1d95 0%, #6d28d9 100%)', color: '#e0e7ff' },
    // Morning: 8-12 (sky blues)
    8: { background: 'linear-gradient(180deg, #075985 0%, #0284c7 100%)', color: '#f0f9ff' },
    9: { background: 'linear-gradient(180deg, #0369a1 0%, #0ea5e9 100%)', color: '#f0f9ff' },
    10: { background: 'linear-gradient(180deg, #0284c7 0%, #38bdf8 100%)', color: '#f0f9ff' },
    11: { background: 'linear-gradient(180deg, #0891b2 0%, #22d3ee 100%)', color: '#f0f9ff' },
    // Day: 12-17 (bright cyans/teals)
    12: { background: 'linear-gradient(180deg, #0d9488 0%, #2dd4bf 100%)', color: '#f0f9ff' },
    13: { background: 'linear-gradient(180deg, #0284c7 0%, #22d3ee 100%)', color: '#f0f9ff' },
    14: { background: 'linear-gradient(180deg, #0891b2 0%, #67e8f9 100%)', color: '#0c4a6e' },
    15: { background: 'linear-gradient(180deg, #0e7490 0%, #06b6d4 100%)', color: '#f0f9ff' },
    16: { background: 'linear-gradient(180deg, #0369a1 0%, #0ea5e9 100%)', color: '#f0f9ff' },
    // Dusk: 17-20 (oranges/pinks)
    17: { background: 'linear-gradient(180deg, #c2410c 0%, #ea580c 100%)', color: '#fff7ed' },
    18: { background: 'linear-gradient(180deg, #ea580c 0%, #db2777 100%)', color: '#fff7ed' },
    19: { background: 'linear-gradient(180deg, #be185d 0%, #9333ea 100%)', color: '#fdf4ff' },
    // Evening: 20-22 (deep purples)
    20: { background: 'linear-gradient(180deg, #6b21a8 0%, #4c1d95 100%)', color: '#f3e8ff' },
    21: { background: 'linear-gradient(180deg, #4c1d95 0%, #312e81 100%)', color: '#f3e8ff' },
    // Late Night
    22: { background: 'linear-gradient(180deg, #1e1b4b 0%, #0f172a 100%)', color: '#e2e8f0' },
    23: { background: 'linear-gradient(180deg, #0c0a1d 0%, #1e1b4b 100%)', color: '#e2e8f0' },
  };

  return hourGradients[hour] || { background: '#1e293b', color: '#fff' };
}
