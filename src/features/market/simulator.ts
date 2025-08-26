import type { SymbolCode } from "@/utils/symbols";

type Listener = (symbol: SymbolCode, price: number, time: number) => void;

function randomWalk(prev: number, vol: number) {
  const change = (Math.random() - 0.5) * vol;
  return Math.max(0.00001, prev + change);
}

export class Simulator {
  private prices: Record<SymbolCode, number>;
  private timer: any = null;
  private listeners = new Set<Listener>();
  private intervalMs: number;

  constructor(start: Record<SymbolCode, number>, intervalMs = 500) {
    this.prices = { ...start };
    this.intervalMs = intervalMs;
  }

  on(cb: Listener) {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  start() {
    if (this.timer) return;
    this.timer = setInterval(() => {
      const now = Date.now();

      this.prices.EURUSD = randomWalk(this.prices.EURUSD, 0.0006);
      this.prices.GBPUSD = randomWalk(this.prices.GBPUSD, 0.0007);
      this.prices.XAUUSD = randomWalk(this.prices.XAUUSD, 0.35);

      for (const [symbol, price] of Object.entries(this.prices) as any) {
        for (const l of this.listeners) l(symbol, price, now);
      }
    }, this.intervalMs);
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }
}
