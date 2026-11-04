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

// scroll: ios can scroll the page under the fixed player, overflow clip or not
type SavedState = {
  element: HTMLElement;
  elementCss: string;
  htmlCss: string;
  bodyCss: string;
  scrollX: number;
  scrollY: number;
};

let savedState: SavedState | null = null;

// notched iphones in landscape stop the viewport at the safe area; full-window covers it
const VIEWPORT_FIT_COVER = "viewport-fit=cover";

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
  return savedState !== null;
}

export function isFullscreen(): boolean {
  return !isFullWindow() && Boolean(document.fullscreenElement);
}

// iphone safari has fullscreen for <video> only
export function isFullscreenSupported(): boolean {
  return Boolean(document.fullscreenEnabled);
}

// full-window stands in where fullscreen is unsupported (iphone)
export function toggleFullscreen(elementId: string) {
  const element = document.getElementById(elementId);

  if (!element) {
    return;
  }

  if (!isFullscreenSupported()) {
    toggleFullWindow(elementId);
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
  savedState = {
    element,
    elementCss: element.style.cssText,
    htmlCss: html.style.cssText,
    bodyCss: body.style.cssText,
    scrollX: window.scrollX,
    scrollY: window.scrollY,
  };

  // style the container, not the canvas: fte strips inline width/height from the canvas on resize
  for (const [property, value] of FULL_WINDOW_STYLES) {
    element.style.setProperty(property, value);
  }

  html.style.setProperty("overflow", "clip");
  body.style.setProperty("overflow", "clip");
  setViewportFitCover(true);
  notifyChange();
}

// restores the original inline styles exactly, also called on player unmount
export function exitFullWindow() {
  if (!savedState) {
    return;
  }

  const { element, elementCss, htmlCss, bodyCss, scrollX, scrollY } =
    savedState;
  savedState = null;
  element.style.cssText = elementCss;
  document.documentElement.style.cssText = htmlCss;
  document.body.style.cssText = bodyCss;
  setViewportFitCover(false);
  window.scrollTo(scrollX, scrollY);
  notifyChange();
}

function setViewportFitCover(enabled: boolean) {
  const meta = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');

  if (meta) {
    meta.content = withViewportFitCover(meta.content, enabled);
  }
}

function withViewportFitCover(content: string, enabled: boolean): string {
  const parts = content
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part && part !== VIEWPORT_FIT_COVER);

  if (enabled) {
    parts.push(VIEWPORT_FIT_COVER);
  }

  return parts.join(", ");
}

if (import.meta.vitest) {
  const { expect, test } = import.meta.vitest;

  test("withViewportFitCover", () => {
    const base = "width=device-width, initial-scale=1.0";
    const cover = `${base}, viewport-fit=cover`;

    expect(withViewportFitCover(base, true)).toBe(cover);
    expect(withViewportFitCover(cover, true)).toBe(cover);
    expect(withViewportFitCover(cover, false)).toBe(base);
    expect(withViewportFitCover(base, false)).toBe(base);
    expect(
      withViewportFitCover("width=device-width,viewport-fit=cover", false),
    ).toBe("width=device-width");
  });
}
