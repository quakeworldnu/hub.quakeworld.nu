export async function sha256FromBytes(bytes: Uint8Array) {
  const hashBuf = await window.crypto.subtle.digest("SHA-256", bytes);
  const byteArr = Array.from(new Uint8Array(hashBuf));
  const hexStr = byteArr.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hexStr;
}
