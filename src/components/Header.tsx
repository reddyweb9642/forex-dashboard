
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { selectEquity, selectPnL, selectCash } from '@/features/portfolio/portfolioSlice'
import { selectLast, selectMode } from '@/features/market/marketSlice'
import type { RootState } from '@/store'
import type { SymbolCode } from '@/utils/symbols'
import { useTheme } from '@/theme/ThemeProvider'

export const Header: React.FC = () => {
  const { theme, toggle } = useTheme()
  const prices = usePrices()
  const equity = useSelector((s: RootState) => selectEquity(s, prices))
  const pnl = useSelector((s: RootState) => selectPnL(s, prices))
  const cash = useSelector(selectCash)
  const mode = useSelector(selectMode)

  return (
    <header className="flex flex-col md:flex-row gap-3 md:gap-6 items-start md:items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">Forex Dashboard</h1>
        <span className="text-xs px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-700">
          {mode === 'websocket' ? 'Live (Finnhub)' : 'Simulator'}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <KPI label="Equity" value={`$${equity.toFixed(2)}`} />
        <KPI label="Cash" value={`$${cash.toFixed(2)}`} />
        <KPI label="PnL" value={`${pnl >= 0 ? '+' : ''}$${pnl.toFixed(2)}`} accent={pnl>=0 ? 'text-green-500' : 'text-red-500'} />
        <button onClick={toggle} className="px-3 py-2 rounded-xl bg-gray-200 dark:bg-gray-700">
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    </header>
  )
}

const KPI: React.FC<{label:string; value:string; accent?:string}> = ({label, value, accent}) => (
  <div className="card flex flex-col min-w-[120px]">
    <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
    <span className={`text-lg font-semibold ${accent??''}`}>{value}</span>
  </div>
)

function usePrices(): Partial<Record<SymbolCode, number>> {
  const e = useSelector((s: RootState) => selectLast(s, 'EURUSD'))
  const g = useSelector((s: RootState) => selectLast(s, 'GBPUSD'))
  const x = useSelector((s: RootState) => selectLast(s, 'XAUUSD'))
  return useMemo(() => ({ EURUSD: e ?? 0, GBPUSD: g ?? 0, XAUUSD: x ?? 0 }), [e,g,x])
}
