export function secondsToMinutesAndSeconds(seconds: number): string {
  const formatNum = (num: number) => String(Math.floor(num)).padStart(2, "0");
  const durationMinutes = formatNum(seconds / 60);
  const durationSeconds = formatNum(seconds % 60);
  return `${durationMinutes}:${durationSeconds}`;
}

export function formatTimeProgress(elapsed: number, total: number): string {
  const isCountdown = elapsed < 0;

  if (isCountdown) {
    return `Countdown: ${-Math.floor(elapsed)}`;
  } else {
    const elapsedStr = secondsToMinutesAndSeconds(elapsed);
    const totalStr = secondsToMinutesAndSeconds(total);

    return `${elapsedStr} / ${totalStr}`;
  }
}
