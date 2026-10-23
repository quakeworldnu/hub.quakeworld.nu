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
