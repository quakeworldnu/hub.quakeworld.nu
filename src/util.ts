export function localStorageSet(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function localStorageGet<T>(key: string, defaultValue: T): T {
  const settings = localStorage.getItem(key);
  return settings ? JSON.parse(settings) : defaultValue;
}

export function isTwitchExtensionEmbedded() {
  return document.referrer.includes("ext-twitch.tv");
}
