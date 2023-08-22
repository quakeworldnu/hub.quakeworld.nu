export function localStorageSet(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function localStorageGet(key, defaultValue) {
  const settings = localStorage.getItem(key);
  return settings ? JSON.parse(settings) : defaultValue;
}

export function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function toId(str) {
  return slugify(str).replace(/-/g, "_");
}

export function isDeepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function isTwitchExtensionEmbedded() {
  return document.referrer.includes("ext-twitch.tv");
}
