import clsx from "clsx";

type PingLevel = { bars: 1 | 2 | 3 | 4 };

// < 38: 4 bars, < 64: 3 bars, < 150: 2 bars, else 1 bar
export function pingLevel(ms: number): PingLevel {
  if (ms < 38) {
    return { bars: 4 };
  }
  if (ms < 64) {
    return { bars: 3 };
  }
  if (ms < 150) {
    return { bars: 2 };
  }
  return { bars: 1 };
}

// ms => rgb, dark green > green > yellow > orange > red > dark red
// (stops on 12 ms steps)
const colorStops: [number, [number, number, number]][] = [
  [0, [21, 128, 61]], // dark green
  [36, [34, 197, 94]], // green
  [60, [250, 204, 21]], // yellow
  [96, [249, 115, 22]], // orange
  [144, [239, 68, 68]], // red
  [240, [153, 27, 27]], // dark red
];
const COLOR_STEP_MS = 12;

// gradient color in steps of 12 ms
export function pingColor(ms: number): string {
  const stepped = Math.floor(Math.max(0, ms) / COLOR_STEP_MS) * COLOR_STEP_MS;
  const last = colorStops[colorStops.length - 1];

  if (stepped >= last[0]) {
    return `rgb(${last[1].join(", ")})`;
  }

  const index = colorStops.findIndex(([stop]) => stop > stepped);
  const [fromMs, from] = colorStops[index - 1];
  const [toMs, to] = colorStops[index];
  const t = (stepped - fromMs) / (toMs - fromMs);
  const rgb = from.map((c, i) => Math.round(c + (to[i] - c) * t));
  return `rgb(${rgb.join(", ")})`;
}

const bars = [1, 2, 3, 4] as const;

// signal strength bars (4 = best), unlit bars are dimmed
export const PingBars = ({ ms }: { ms: number }) => {
  const level = pingLevel(ms);

  return (
    <svg
      viewBox="0 0 16 12"
      width="16"
      height="12"
      aria-hidden="true"
      className="inline-block shrink-0"
      style={{ color: pingColor(ms) }}
    >
      {bars.map((bar) => {
        const height = bar * 3;
        return (
          <rect
            key={bar}
            x={(bar - 1) * 4}
            y={12 - height}
            width="3"
            height={height}
            rx="0.5"
            fill="currentColor"
            className={clsx({ "opacity-20": bar > level.bars })}
          />
        );
      })}
    </svg>
  );
};

// signal bars + "23" (ms)
export const PingIndicator = ({
  ms,
  showUnit = false,
  className = "",
}: {
  ms: number;
  showUnit?: boolean;
  className?: string;
}) => (
  <span
    className={`inline-flex items-center gap-1.5 text-xs text-gray-300 tabular-nums whitespace-nowrap ${className}`}
  >
    <PingBars ms={ms} />
    {ms}
    {showUnit && " ms"}
  </span>
);

if (import.meta.vitest) {
  const { expect, test } = import.meta.vitest;

  test("pingLevel", () => {
    expect(pingLevel(0).bars).toBe(4);
    expect(pingLevel(37).bars).toBe(4);
    expect(pingLevel(38).bars).toBe(3);
    expect(pingLevel(63).bars).toBe(3);
    expect(pingLevel(64).bars).toBe(2);
    expect(pingLevel(149).bars).toBe(2);
    expect(pingLevel(150).bars).toBe(1);
  });

  test("pingColor", () => {
    expect(pingColor(0)).toBe("rgb(21, 128, 61)");
    expect(pingColor(11)).toBe(pingColor(0)); // same 12 ms step
    expect(pingColor(12)).not.toBe(pingColor(0));
    expect(pingColor(150)).toBe("rgb(239, 68, 68)");
    expect(pingColor(999)).toBe("rgb(153, 27, 27)");
    expect(pingColor(-5)).toBe(pingColor(0));
  });
}
