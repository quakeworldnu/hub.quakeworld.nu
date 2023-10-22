import screenfull from "screenfull";

export function toggleFullscreen(elementId: string) {
  const element = document.getElementById(elementId);

  if (!element) {
    return;
  }

  try {
    if (screenfull.isFullscreen) {
      screenfull.exit();
    } else {
      screenfull.request(element);
    }
  } catch (e) {
    // ignore
  }
}
