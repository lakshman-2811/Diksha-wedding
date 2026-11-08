import type { wedding } from '../config';
export type WeddingDate = typeof wedding.date;
export type Countdown = { days: number; hours: number; minutes: number; seconds: number; complete: boolean };

// Convert a wall-clock date in an IANA timezone to an absolute timestamp.
export function zonedDateToUtc(date: WeddingDate, timeZone: string): number {
  const { year, month, day, hour, minute, second } = date;
  const desired = Date.UTC(year, month - 1, day, hour, minute, second);
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
  }).formatToParts(new Date(desired));
  const values = Object.fromEntries(parts.map(p => [p.type, p.value]));
  const represented = Date.UTC(+values.year, +values.month - 1, +values.day, +values.hour, +values.minute, +values.second);
  const firstGuess = desired - (represented - desired);
  const check = new Intl.DateTimeFormat('en-GB', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).formatToParts(new Date(firstGuess));
  const checked = Object.fromEntries(check.map(p => [p.type, p.value]));
  const representedAgain = Date.UTC(+checked.year, +checked.month - 1, +checked.day, +checked.hour, +checked.minute, +checked.second);
  return firstGuess + (desired - representedAgain);
}

export function getCountdown(target: number, now = Date.now()): Countdown {
  const remaining = Math.max(0, target - now);
  const totalSeconds = Math.floor(remaining / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    complete: remaining === 0,
  };
}

export function validateWeddingDate(date: WeddingDate, timezone: string): string | null {
  const values = Object.values(date);
  if (values.some(value => !Number.isInteger(value)) || date.month < 1 || date.month > 12 || date.day < 1 || date.day > 31 || date.hour < 0 || date.hour > 23 || date.minute < 0 || date.minute > 59 || date.second < 0 || date.second > 59) return 'Please check the wedding date and time in src/config.ts.';
  const parsed = new Date(Date.UTC(date.year, date.month - 1, date.day));
  if (parsed.getUTCFullYear() !== date.year || parsed.getUTCMonth() !== date.month - 1 || parsed.getUTCDate() !== date.day) return 'The configured wedding date is not a valid calendar date.';
  try { new Intl.DateTimeFormat('en', { timeZone: timezone }).format(); } catch { return `“${timezone}” is not a recognized timezone. Use an IANA timezone such as Asia/Kolkata.`; }
  return null;
}
