import type { SymbolCode } from "@/utils/symbols";

export interface Tick {
  symbol: SymbolCode;
  price: number;
  time: number;
}

export interface LinePoint {
  time: number;
  value: number;
}

export interface CandlePoint {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface Series {
  line: LinePoint[];
  candles: CandlePoint[];
  last: number | null;
}

export interface MarketState {
  series: Record<SymbolCode, Series>;
  connected: boolean;
  mode: "websocket" | "simulator";
}
