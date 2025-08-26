import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
import type { PortfolioState, Side } from "./types";
import type { SymbolCode } from "@/utils/symbols";
import type { RootState } from "@/store";

const initialState: PortfolioState = {
  cash: 100000,
  positions: {
    EURUSD: { symbol: "EURUSD", quantity: 0, avgPrice: 0 },
    GBPUSD: { symbol: "GBPUSD", quantity: 0, avgPrice: 0 },
    XAUUSD: { symbol: "XAUUSD", quantity: 0, avgPrice: 0 },
  },
  trades: [],
};

interface TradePayload {
  symbol: SymbolCode;
  quantity: number;
  price: number;
  side: Side;
}

const slice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    trade: {
      reducer: (
        state,
        action: PayloadAction<TradePayload & { id: string; time: number }>
      ) => {
        const { symbol, quantity, price, side } = action.payload;
        const pos = state.positions[symbol];
        const value = quantity * price;

        if (side === "BUY") {
          if (state.cash < value) return;

          const newQty = pos.quantity + quantity;
          const newAvg =
            newQty === 0 ? 0 : (pos.avgPrice * pos.quantity + value) / newQty;
          pos.quantity = newQty;
          pos.avgPrice = newAvg;
          state.cash -= value;
        } else {
          if (quantity > pos.quantity) return;
          pos.quantity -= quantity;

          state.cash += value;
        }

        state.trades.unshift({
          id: action.payload.id,
          time: action.payload.time,
          symbol,
          side,
          quantity,
          price,
          value,
        });
      },
      prepare: (payload: TradePayload) => ({
        payload: { ...payload, id: nanoid(), time: Date.now() },
      }),
    },
    resetPortfolio: () => initialState,
  },
});

export const { trade, resetPortfolio } = slice.actions;

export const selectCash = (s: RootState) => s.portfolio.cash;
export const selectPositions = (s: RootState) => s.portfolio.positions;
export const selectTrades = (s: RootState) => s.portfolio.trades;

export const selectEquity = (
  s: RootState,
  prices: Partial<Record<SymbolCode, number>>
) => {
  const posVal = (
    Object.values(s.portfolio.positions) as {
      symbol: SymbolCode;
      quantity: number;
      avgPrice: number;
    }[]
  ).reduce((acc, p) => acc + (prices[p.symbol] ?? 0) * p.quantity, 0);
  return s.portfolio.cash + posVal;
};

export const selectPnL = (
  s: RootState,
  prices: Partial<Record<SymbolCode, number>>
) => {
  let pnl = 0;
  for (const p of Object.values(s.portfolio.positions)) {
    const last = prices[p.symbol] ?? 0;
    pnl += (last - p.avgPrice) * p.quantity;
  }
  return pnl;
};

export default slice.reducer;
