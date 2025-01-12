/**
 * Generates an array of numbers in a specified range.
 *
 * @param start - The starting number of the range.
 * @param stop - The ending number of the range.
 * @param step - The increment between each number in the range. Defaults to 1.
 * @returns An array of numbers from start to stop, incremented by step.
 */
export default function range(start: number, stop: number, step = 1): number[] {
  return Array.from(
    { length: Math.ceil((stop + 1 - start) / step) },
    (_, i) => start + i * step,
  );
}

if (import.meta.vitest) {
  const { expect, it } = import.meta.vitest;

  it.each([
    [1, 3, undefined, [1, 2, 3]],
    [-1, 1, undefined, [-1, 0, 1]],
    [0, 5, 2, [0, 2, 4]],
  ])('range(%i, %i, %j) -> %j', (start, stop, step, expected) => {
    expect(range(start, stop, step)).toStrictEqual(expected);
  });
}
