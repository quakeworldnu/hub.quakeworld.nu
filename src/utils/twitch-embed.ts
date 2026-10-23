export function isTwitchExtensionEmbedded() {
  return document.referrer.includes("ext-twitch.tv");
}
