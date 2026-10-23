export function roundFloat(value: number, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

if (import.meta.vitest) {
  const { expect, test } = import.meta.vitest;

  test("roundFloat", () => {
    expect(roundFloat(1.005)).toBe(1.01);
    expect(roundFloat(1540 / 1400)).toBe(1.1);
    expect(roundFloat(1.23456, 3)).toBe(1.235);
  });

  test("clamp", () => {
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(11, 0, 10)).toBe(10);
  });
}
