
import React from 'react'
import { useSelector } from 'react-redux'
import { selectPositions } from '@/features/portfolio/portfolioSlice'
import type { RootState } from '@/store'
import { selectLast } from '@/features/market/marketSlice'
import { DISPLAY_NAME } from '@/utils/symbols'

export const PositionsTable: React.FC = () => {
  const positions = useSelector(selectPositions)
  const last = {
    EURUSD: useSelector((s: RootState) => selectLast(s, 'EURUSD')) ?? 0,
    GBPUSD: useSelector((s: RootState) => selectLast(s, 'GBPUSD')) ?? 0,
    XAUUSD: useSelector((s: RootState) => selectLast(s, 'XAUUSD')) ?? 0,
  }

  return (
    <div className="card">
      <h3 className="font-semibold text-sm mb-3">Open Positions</h3>
      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-left">
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="py-2">Symbol</th>
              <th>Qty</th>
              <th>Avg Price</th>
              <th>Last</th>
              <th>Unrealized PnL</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(positions).map(p => {
              const l = last[p.symbol]
              const pnl = (l - p.avgPrice) * p.quantity
              return (
                <tr key={p.symbol} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-2">{DISPLAY_NAME[p.symbol]}</td>
                  <td>{p.quantity}</td>
                  <td>{p.avgPrice.toFixed(5)}</td>
                  <td>{l.toFixed(5)}</td>
                  <td className={pnl>=0 ? 'text-green-500' : 'text-red-500'}>{pnl.toFixed(2)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
