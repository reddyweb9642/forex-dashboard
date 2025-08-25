
import React from 'react'
import { TradeForm } from './TradeForm'
import { PositionsTable } from './PositionsTable'
import { TradesTable } from './TradesTable'

export const PortfolioPanel: React.FC = () => {
  return (
    <div className="flex flex-col gap-3">
      <TradeForm />
      <PositionsTable />
      <TradesTable />
    </div>
  )
}
