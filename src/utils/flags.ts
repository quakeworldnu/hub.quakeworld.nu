// flagpedia.net cdn: same height for all flags, width follows the flag's proportions
export function getFlagUrl(cc: string): string {
  return `https://flagcdn.com/h24/${cc.toLowerCase()}.webp`;
}
