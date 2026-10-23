// css gradient that colors the track sections between the given values
// e.g. values [10, 20], colors [a, b, c] => a until 10, b from 10 to 20, c from 20
export function getTrackBackground({
  values,
  colors,
  min,
  max,
}: {
  values: number[];
  colors: string[];
  min: number;
  max: number;
}): string {
  const progress = [...values]
    .sort((a, b) => a - b)
    .map((value) => ((value - min) / (max - min)) * 100);
  const middle = progress.reduce(
    (acc, point, index) =>
      `${acc}, ${colors[index]} ${point}%, ${colors[index + 1]} ${point}%`,
    "",
  );
  return `linear-gradient(to right, ${colors[0]} 0%${middle}, ${colors[colors.length - 1]} 100%)`;
}
