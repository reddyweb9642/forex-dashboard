
import React, { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '@/store'
import type { SymbolCode } from '@/utils/symbols'
import { SYMBOLS, DISPLAY_NAME } from '@/utils/symbols'
import { selectLast } from '@/features/market/marketSlice'
import { trade } from '@/features/portfolio/portfolioSlice'

export const TradeForm: React.FC = () => {
  const dispatch = useDispatch()
  const [symbol, setSymbol] = useState<SymbolCode>('EURUSD')
  const [qty, setQty] = useState<number>(1000)

  const price = useSelector((s: RootState) => selectLast(s, symbol)) ?? 0
  const cost = useMemo(() => price * qty, [price, qty])

  const onBuy = () => {
    if (price <= 0 || qty <= 0) return
    dispatch(trade({ symbol, quantity: qty, price, side: 'BUY' }))
  }
  const onSell = () => {
    if (price <= 0 || qty <= 0) return
    dispatch(trade({ symbol, quantity: qty, price, side: 'SELL' }))
  }

  return (
    <div className="card flex flex-col gap-3">
      <h3 className="font-semibold text-sm">Trade Simulator</h3>
      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm">
          <span>Symbol</span>
          <select value={symbol} onChange={e => setSymbol(e.target.value as SymbolCode)}
            className="rounded-xl bg-gray-100 dark:bg-gray-700 p-2">
            {SYMBOLS.map(s => <option key={s} value={s}>{DISPLAY_NAME[s]}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span>Quantity (units)</span>
          <input type="number" min={1} value={qty}
            onChange={e => setQty(parseInt(e.target.value)||0)}
            className="rounded-xl bg-gray-100 dark:bg-gray-700 p-2" />
        </label>
      </div>
      <div className="text-sm">Price: <b>{price.toFixed(5)}</b> | Est. Value: <b>${cost.toFixed(2)}</b></div>
      <div className="flex gap-3">
        <button onClick={onBuy} className="flex-1 py-2 rounded-xl bg-green-600 text-white hover:opacity-90">Buy</button>
        <button onClick={onSell} className="flex-1 py-2 rounded-xl bg-red-600 text-white hover:opacity-90">Sell</button>
      </div>
    </div>
  )
}
