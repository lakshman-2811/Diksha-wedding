import { useEffect, useMemo, useState } from 'react';
import { wedding } from '../config';
import { getCountdown, validateWeddingDate, zonedDateToUtc } from '../lib/countdown';
import Reveal from './Reveal';
const units = [{ key: 'days', label: 'Days' }, { key: 'hours', label: 'Hours' }, { key: 'minutes', label: 'Minutes' }, { key: 'seconds', label: 'Seconds' }] as const;
export default function Countdown() {
  const error = validateWeddingDate(wedding.date, wedding.timezone);
  const target = useMemo(() => error ? null : zonedDateToUtc(wedding.date, wedding.timezone), [error]);
  const [now, setNow] = useState(Date.now());
  const calendarDate = new Date(Date.UTC(wedding.date.year, wedding.date.month - 1, wedding.date.day, 12));
  const monthName = new Intl.DateTimeFormat('en', { month: 'long', timeZone: 'UTC' }).format(calendarDate);
  const dateStamp = `${String(wedding.date.day).padStart(2, '0')} ${monthName.toUpperCase()}`;
  const formattedTime = new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'UTC' }).format(new Date(Date.UTC(2020, 0, 1, wedding.date.hour, wedding.date.minute)));
  useEffect(() => { if (target === null) return; const timer = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(timer); }, [target]);
  if (error || target === null) return <p className="countdown-error" role="alert">{error ?? 'The wedding date could not be loaded.'}</p>;
  const time = getCountdown(target, now);
  return <Reveal className="countdown-wrap"><p className="eyebrow">THE MOMENT WE’VE BEEN WAITING FOR</p>{time.complete ? <h3 className="celebration">Today, two hearts become one. Let the celebration begin.</h3> : <div className="countdown-grid" aria-label="Time remaining until the wedding">{units.map(({ key, label }) => <div className="count-unit" key={key}><span className="count-number" aria-live={key === 'seconds' ? 'off' : 'polite'}>{String(time[key]).padStart(2, '0')}</span><span className="count-label">{label}</span></div>)}</div>}<p className="count-note">{dateStamp} · {formattedTime} · {wedding.timezone.toUpperCase()}</p></Reveal>;
}
