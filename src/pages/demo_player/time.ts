export function secondsToMinutesAndSeconds(seconds: number): string {
  const formatNum = (num: number) => String(Math.floor(num)).padStart(2, "0");
  const durationMinutes = formatNum(seconds / 60);
  const durationSeconds = formatNum(seconds % 60);
  return `${durationMinutes}:${durationSeconds}`;
}

export function formatElapsed(elapsed: number, total: number): string {
  if (elapsed < 0) {
    return `Countdown: ${-Math.floor(elapsed)}`;
  } else {
    const elapsedStr = secondsToMinutesAndSeconds(elapsed);
    const totalStr = secondsToMinutesAndSeconds(total);
    return `${elapsedStr} / ${totalStr}`;
  }
}

export function formatSeek(seekTime: number, startTime: number): string {
  if (seekTime < startTime) {
    return `Countdown: ${Math.floor(startTime - seekTime)}`;
  } else {
    return secondsToMinutesAndSeconds(seekTime - startTime);
  }
}
