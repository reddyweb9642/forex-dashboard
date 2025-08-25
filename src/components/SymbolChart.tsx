
import React, { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import { useSelector } from 'react-redux'
import { selectSeries } from '@/features/market/marketSlice'
import type { RootState } from '@/store'
import type { SymbolCode } from '@/utils/symbols'
import { DISPLAY_NAME } from '@/utils/symbols'

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="card w-full">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-sm font-semibold">{title}</h3>
    </div>
    <div className="h-[280px]">{children}</div>
  </div>
)

export const SymbolCharts: React.FC<{ symbol: SymbolCode }> = ({ symbol }) => {
  const series = useSelector((s: RootState) => selectSeries(s, symbol))

  const lineOpt = useMemo(() => ({
    animation: false,
    grid: { left: 40, right: 10, top: 20, bottom: 30 },
    xAxis: { type: 'time' as const, boundaryGap: false },
    yAxis: { type: 'value' as const, scale: true },
    tooltip: { trigger: 'axis' as const, axisPointer: { type: 'cross' as const } },
    dataZoom: [
      { type: 'inside', throttle: 50 },
      { type: 'slider' },
    ],
    series: [{
      type: 'line' as const,
      showSymbol: false,
      smooth: true,
      name: DISPLAY_NAME[symbol],
      data: series.line.map(p => [p.time, p.value]),
    }]
  }), [series.line, symbol])

  const candleData = useMemo(() =>
    series.candles.map(c => [c.time, c.open, c.close, c.low, c.high])
  , [series.candles])

  const candleOpt = useMemo(() => ({
    animation: false,
    grid: { left: 40, right: 10, top: 20, bottom: 30 },
    xAxis: { type: 'time' as const },
    yAxis: { type: 'value' as const, scale: true },
    tooltip: {
      trigger: 'axis' as const,
      axisPointer: { type: 'cross' as const },
    },
    dataZoom: [
      { type: 'inside', throttle: 50 },
      { type: 'slider' },
    ],
    series: [{
      type: 'candlestick' as const,
      name: DISPLAY_NAME[symbol],
      data: candleData,
    }]
  }), [candleData, symbol])

  return (
    <div className="flex flex-col gap-3">
      <ChartCard title={`${DISPLAY_NAME[symbol]} • Line`}>
        <ReactECharts option={lineOpt} style={{ height: '100%', width: '100%' }} />
      </ChartCard>
      <ChartCard title={`${DISPLAY_NAME[symbol]} • Candlestick`}>
        <ReactECharts option={candleOpt} style={{ height: '100%', width: '100%' }} />
      </ChartCard>
    </div>
  )
}
