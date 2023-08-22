export function localStorageSet(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function localStorageGet(key, defaultValue) {
  const settings = localStorage.getItem(key);
  return settings ? JSON.parse(settings) : defaultValue;
}

export function isTwitchExtensionEmbedded() {
  return document.referrer.includes("ext-twitch.tv");
}
