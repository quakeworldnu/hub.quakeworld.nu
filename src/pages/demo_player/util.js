export function throttle(fn, interval) {
  let lastTime = performance.now() - interval;
  return (...args) => {
    const time = performance.now();
    if (time - lastTime < interval) return;
    lastTime = time;
    fn(...args);
  };
}

export function debounce(fn, delay) {
  let timerId = null;
  return (...args) => {
    if (timerId) clearTimeout(timerId);
    timerId = setTimeout(() => {
      fn(...args);
      timerId = null;
    }, delay);
  };
}

export function secondsToMinutesAndSeconds(seconds) {
  const formatNum = (num) => String(Math.floor(num)).padStart(2, "0");
  const durationMinutes = formatNum(seconds / 60);
  const durationSeconds = formatNum(seconds % 60);
  return `${durationMinutes}:${durationSeconds}`;
}

export function formatTimeProgress(elapsed, total) {
  const isCountdown = elapsed < 0;

  if (isCountdown) {
    return `Countdown: ${-Math.floor(elapsed)}`;
  } else {
    const elapsedStr = secondsToMinutesAndSeconds(elapsed);
    const totalStr = secondsToMinutesAndSeconds(total);

    return `${elapsedStr} / ${totalStr}`;
  }
}
