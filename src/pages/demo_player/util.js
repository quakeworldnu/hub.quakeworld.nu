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

export function secondsToString(duration) {
  const durationMinutes = Math.floor(duration / 60).toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
  const durationSeconds = Math.floor(duration % 60).toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
  return `${durationMinutes}:${durationSeconds}`;
}
