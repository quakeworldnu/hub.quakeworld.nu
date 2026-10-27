// page is loaded in an iframe, e.g. the qtv player embedded on another site
export function isEmbedded(): boolean {
  return window.self !== window.top;
}
