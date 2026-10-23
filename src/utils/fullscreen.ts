export function isFullscreen(): boolean {
  return Boolean(document.fullscreenElement);
}

export function toggleFullscreen(elementId: string) {
  const element = document.getElementById(elementId);

  if (!element) {
    return;
  }

  try {
    if (isFullscreen()) {
      document.exitFullscreen().catch(() => {});
    } else {
      element.requestFullscreen().catch(() => {});
    }
  } catch {
    // ignore
  }
}
