
import React from 'react'
import { useSelector } from 'react-redux'
import { selectTrades } from '@/features/portfolio/portfolioSlice'
import { DISPLAY_NAME } from '@/utils/symbols'

export const TradesTable: React.FC = () => {
  const trades = useSelector(selectTrades)

  return (
    <div className="card">
      <h3 className="font-semibold text-sm mb-3">Trade History</h3>
      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-left">
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="py-2">Time</th>
              <th>Symbol</th>
              <th>Side</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {trades.map(t => (
              <tr key={t.id} className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2">{new Date(t.time).toLocaleTimeString()}</td>
                <td>{DISPLAY_NAME[t.symbol]}</td>
                <td className={t.side==='BUY' ? 'text-green-500' : 'text-red-500'}>{t.side}</td>
                <td>{t.quantity}</td>
                <td>{t.price.toFixed(5)}</td>
                <td>${t.value.toFixed(2)}</td>
              </tr>
            ))}
            {trades.length === 0 && (
              <tr><td className="py-3 text-gray-500" colSpan={6}>No trades yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
