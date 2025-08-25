
import type { SymbolCode } from '@/utils/symbols'

export type Side = 'BUY' | 'SELL'

export interface Position {
  symbol: SymbolCode
  quantity: number
  avgPrice: number
}

export interface Trade {
  id: string
  time: number
  symbol: SymbolCode
  side: Side
  quantity: number
  price: number
  value: number // quantity * price (forex lots simplified)
}

export interface PortfolioState {
  cash: number
  positions: Record<SymbolCode, Position>
  trades: Trade[]
}
