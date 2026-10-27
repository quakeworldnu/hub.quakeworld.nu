// display modes (mutually exclusive): inline, full-window (css only), full-screen (fullscreen api)

// max-width/max-height: player containers have size limits (e.g. max-h-[75vh])
const FULL_WINDOW_STYLES: [string, string][] = [
  ["position", "fixed"],
  ["inset", "0"],
  ["width", "100%"],
  ["height", "100%"],
  ["max-width", "none"],
  ["max-height", "none"],
  ["z-index", "2147483647"],
  ["box-sizing", "border-box"],
];

type SavedStyles = {
  element: HTMLElement;
  elementCss: string;
  htmlCss: string;
  bodyCss: string;
};

let savedStyles: SavedStyles | null = null;

export const DISPLAY_MODE_CHANGE = "hub.display_mode.change";

declare global {
  interface WindowEventMap {
    [DISPLAY_MODE_CHANGE]: Event;
  }
}

// fte resizes its framebuffer on window "resize" only
function notifyChange() {
  window.dispatchEvent(new Event("resize"));
  window.dispatchEvent(new Event(DISPLAY_MODE_CHANGE));
}

export function isFullWindow(): boolean {
  return savedStyles !== null;
}

export function isFullscreen(): boolean {
  return !isFullWindow() && Boolean(document.fullscreenElement);
}

export function toggleFullscreen(elementId: string) {
  const element = document.getElementById(elementId);

  if (!element) {
    return;
  }

  try {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
      return;
    }

    exitFullWindow();
    element.requestFullscreen().catch(() => {});
  } catch {
    // ignore
  }
}

export function toggleFullWindow(elementId: string) {
  if (isFullWindow()) {
    exitFullWindow();
  } else {
    enterFullWindow(elementId);
  }
}

function enterFullWindow(elementId: string) {
  const element = document.getElementById(elementId);

  if (!element) {
    return;
  }

  if (document.fullscreenElement) {
    document.exitFullscreen().catch(() => {});
  }

  const html = document.documentElement;
  const body = document.body;
  savedStyles = {
    element,
    elementCss: element.style.cssText,
    htmlCss: html.style.cssText,
    bodyCss: body.style.cssText,
  };

  // style the container, not the canvas: fte strips inline width/height from the canvas on resize
  for (const [property, value] of FULL_WINDOW_STYLES) {
    element.style.setProperty(property, value);
  }

  html.style.setProperty("overflow", "clip");
  body.style.setProperty("overflow", "clip");
  notifyChange();
}

// restores the original inline styles exactly, also called on player unmount
export function exitFullWindow() {
  if (!savedStyles) {
    return;
  }

  const { element, elementCss, htmlCss, bodyCss } = savedStyles;
  savedStyles = null;
  element.style.cssText = elementCss;
  document.documentElement.style.cssText = htmlCss;
  document.body.style.cssText = bodyCss;
  notifyChange();
}
