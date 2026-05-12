export function lenisEasing(t: number): number {
  return Math.min(1, 1.001 - Math.pow(2, -10 * t));
}
