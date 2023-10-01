import screenfull from "screenfull";

export function getElement() {
  return document.getElementById("ftePlayer");
}

export function toggleFullscreen() {
  try {
    if (screenfull.isFullscreen) {
      screenfull.exit();
    } else {
      const element = getElement();

      if (element) {
        screenfull.request(element);
      }
    }
  } catch (e) {
    // ignore
  }
}

export function getWidth() {
  const element = getElement();

  if (!element) {
    return 0;
  }

  const isLandscape = window.screen.orientation.angle === 0;
  const { clientWidth, clientHeight } = element;
  return isLandscape ? clientWidth : clientHeight;
}
