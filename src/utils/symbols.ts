export type SymbolCode = "EURUSD" | "GBPUSD" | "XAUUSD";

export const SYMBOLS: SymbolCode[] = ["EURUSD", "GBPUSD", "XAUUSD"];

export const DISPLAY_NAME: Record<SymbolCode, string> = {
  EURUSD: "EUR/USD",
  GBPUSD: "GBP/USD",
  XAUUSD: "XAU/USD",
};

export function toFinnhub(symbol: SymbolCode): string {
  const map: Record<SymbolCode, string> = {
    EURUSD: "OANDA:EUR_USD",
    GBPUSD: "OANDA:GBP_USD",
    XAUUSD: "OANDA:XAU_USD",
  };
  return map[symbol];
}
