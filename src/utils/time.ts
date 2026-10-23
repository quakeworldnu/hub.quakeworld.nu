export function secondsToMinutesAndSeconds(seconds: number): string {
  const formatNum = (num: number) => String(Math.floor(num)).padStart(2, "0");
  const durationMinutes = formatNum(seconds / 60);
  const durationSeconds = formatNum(seconds % 60);
  return `${durationMinutes}:${durationSeconds}`;
}

export function formatDuration(elapsed: number, total: number): string {
  if (elapsed < 0) {
    return `Countdown: ${-Math.floor(elapsed)}`;
  }
  const elapsedStr = secondsToMinutesAndSeconds(elapsed);
  const totalStr = secondsToMinutesAndSeconds(total);
  return `${elapsedStr} / ${totalStr}`;
}

export function formatElapsed(elapsed: number): string {
  return elapsed < 0
    ? `Countdown: ${-Math.floor(elapsed)}`
    : secondsToMinutesAndSeconds(elapsed);
}

if (import.meta.vitest) {
  const { expect, test } = import.meta.vitest;

  test("secondsToMinutesAndSeconds", () => {
    expect(secondsToMinutesAndSeconds(0)).toBe("00:00");
    expect(secondsToMinutesAndSeconds(65.9)).toBe("01:05");
    expect(secondsToMinutesAndSeconds(1200)).toBe("20:00");
  });

  test("formatDuration", () => {
    // countdown rounds up: 3.5s left shows 4
    expect(formatDuration(-3.5, 1200)).toBe("Countdown: 4");
    expect(formatDuration(90, 1200)).toBe("01:30 / 20:00");
  });

  test("formatElapsed", () => {
    expect(formatElapsed(-10)).toBe("Countdown: 10");
    expect(formatElapsed(61)).toBe("01:01");
  });
}
