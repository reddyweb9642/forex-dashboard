
export type SymbolCode = 'EURUSD' | 'GBPUSD' | 'XAUUSD'

export const SYMBOLS: SymbolCode[] = ['EURUSD', 'GBPUSD', 'XAUUSD']

export const DISPLAY_NAME: Record<SymbolCode, string> = {
  EURUSD: 'EUR/USD',
  GBPUSD: 'GBP/USD',
  XAUUSD: 'XAU/USD',
}

export function toFinnhub(symbol: SymbolCode): string {
  // Finnhub socket uses OANDA symbols for Forex & metals (approx mapping)
  // Adjust as needed if you use another broker or feed
  const map: Record<SymbolCode, string> = {
    EURUSD: 'OANDA:EUR_USD',
    GBPUSD: 'OANDA:GBP_USD',
    XAUUSD: 'OANDA:XAU_USD',
  }
  return map[symbol]
}
