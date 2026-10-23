const relativeTime = new Intl.RelativeTimeFormat("en", { numeric: "always" });

// unit thresholds (same as dayjs relativeTime): [unit, max rounded value, ms per unit]
const thresholds: [Intl.RelativeTimeFormatUnit, number, number][] = [
  ["second", 44, 1000],
  ["minute", 44, 60 * 1000],
  ["hour", 21, 60 * 60 * 1000],
  ["day", 25, 24 * 60 * 60 * 1000],
  ["month", 10, 30.4375 * 24 * 60 * 60 * 1000],
  ["year", Number.POSITIVE_INFINITY, 365.25 * 24 * 60 * 60 * 1000],
];

// e.g. "2 hours ago"
export function formatTimeAgo(date: Date, now: Date = new Date()): string {
  const diffMs = date.getTime() - now.getTime();
  const sign = diffMs > 0 ? 1 : -1; // 0 => "0 seconds ago"

  for (let i = 0; i < thresholds.length; i++) {
    const [unit, max, unitMs] = thresholds[i];
    const value = Math.round(Math.abs(diffMs) / unitMs);

    if (value <= max) {
      return relativeTime.format(sign * value, unit);
    }

    // between a unit and the next one, e.g. 45-89 seconds => "1 minute"
    const [nextUnit, , nextUnitMs] = thresholds[i + 1];
    if (Math.round(Math.abs(diffMs) / unitMs) <= nextUnitBoundary(unit)) {
      const nextValue = Math.max(1, Math.round(Math.abs(diffMs) / nextUnitMs));
      return relativeTime.format(sign * nextValue, nextUnit);
    }
  }

  return "";
}

// dayjs: 45-89s => a minute, 45-89m => an hour, 22-35h => a day, 26-45d => a month, 11-17M => a year
function nextUnitBoundary(unit: Intl.RelativeTimeFormatUnit): number {
  return { second: 89, minute: 89, hour: 35, day: 45, month: 17 }[
    unit as "second" | "minute" | "hour" | "day" | "month"
  ];
}

// e.g. "2026-10-23 13:37" (local time)
export function formatLocalDateTime(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export const Timestamp = ({ timestamp }: { timestamp: string | null }) => {
  if (null === timestamp) {
    return null;
  }

  const date = new Date(timestamp);

  return <span title={formatLocalDateTime(date)}>{formatTimeAgo(date)}</span>;
};
