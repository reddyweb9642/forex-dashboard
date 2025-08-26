import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { MarketState, Tick, CandlePoint } from "./types";
import type { RootState } from "@/store";
import type { SymbolCode } from "@/utils/symbols";
import { Simulator } from "./simulator";
import { FinnhubSocket } from "./websocket";

const MAX_POINTS = 600;

const initialSeries = () => ({
  line: [],
  candles: [],
  last: null as number | null,
});

const initialState: MarketState = {
  series: {
    EURUSD: initialSeries(),
    GBPUSD: initialSeries(),
    XAUUSD: initialSeries(),
  },
  connected: false,
  mode: "simulator",
};

function pushLine(state: MarketState, { symbol, price, time }: Tick) {
  const s = state.series[symbol];
  s.last = price;
  s.line.push({ time, value: price });
  if (s.line.length > MAX_POINTS) s.line.shift();
}

function upsertCandle(state: MarketState, { symbol, price, time }: Tick) {
  const s = state.series[symbol];
  const sec = Math.floor(time / 1000) * 1000;
  const arr = s.candles;
  const last = arr[arr.length - 1];
  if (!last || last.time !== sec) {
    const c: CandlePoint = {
      time: sec,
      open: price,
      high: price,
      low: price,
      close: price,
    };
    arr.push(c);
    if (arr.length > 600) arr.shift();
  } else {
    last.high = Math.max(last.high, price);
    last.low = Math.min(last.low, price);
    last.close = price;
  }
}

const slice = createSlice({
  name: "market",
  initialState,
  reducers: {
    tick: (state, action: PayloadAction<Tick>) => {
      pushLine(state, action.payload);
      upsertCandle(state, action.payload);
    },
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload;
    },
    setMode: (state, action: PayloadAction<"websocket" | "simulator">) => {
      state.mode = action.payload;
    },
    reset: () => initialState,
  },
});

export const { tick, setConnected, setMode, reset } = slice.actions;

let started = false;
export function startMarket(dispatch: any) {
  if (started) return;
  started = true;

  const token = import.meta.env.VITE_FINNHUB_API_KEY as string | undefined;
  const symbols: SymbolCode[] = ["EURUSD", "GBPUSD", "XAUUSD"];

  if (token) {
    try {
      const ws = new FinnhubSocket(token, symbols);
      ws.on((symbol, price, time) => dispatch(tick({ symbol, price, time })));
      ws.start();
      dispatch(setMode("websocket"));
      dispatch(setConnected(true));

      return;
    } catch {}
  }

  const sim = new Simulator(
    { EURUSD: 1.085, GBPUSD: 1.275, XAUUSD: 2400.0 },
    500
  );
  sim.on((symbol, price, time) => dispatch(tick({ symbol, price, time })));
  sim.start();
  dispatch(setMode("simulator"));
  dispatch(setConnected(true));
}

export const selectSeries = (state: RootState, symbol: SymbolCode) =>
  state.market.series[symbol];
export const selectLast = (state: RootState, symbol: SymbolCode) =>
  state.market.series[symbol].last;
export const selectConnected = (state: RootState) => state.market.connected;
export const selectMode = (state: RootState) => state.market.mode;

export default slice.reducer;
