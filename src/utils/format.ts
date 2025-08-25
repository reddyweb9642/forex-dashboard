
export function formatPrice(v: number): string {
  return v.toFixed(5)
}
export function formatGold(v: number): string {
  return v.toFixed(2)
}
export function ts(): number {
  return Date.now()
}
