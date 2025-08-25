
import React, { useEffect } from 'react'
import { Header } from './components/Header'
import { SymbolCharts } from './components/SymbolChart'
import { PortfolioPanel } from './components/PortfolioPanel'
import { useDispatch } from 'react-redux'
import { startMarket } from './features/market/marketSlice'

const App: React.FC = () => {
  const dispatch = useDispatch()
  useEffect(() => { startMarket(dispatch) }, [dispatch])

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <Header />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="col-span-2 flex flex-col gap-4">
          <SymbolCharts symbol="EURUSD" />
          <SymbolCharts symbol="GBPUSD" />
          <SymbolCharts symbol="XAUUSD" />
        </div>
        <div className="col-span-1">
          <PortfolioPanel />
        </div>
      </div>
    </div>
  )
}

export default App
