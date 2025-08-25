
import type { SymbolCode } from '@/utils/symbols'
import { toFinnhub } from '@/utils/symbols'

type Listener = (symbol: SymbolCode, price: number, time: number) => void

export class FinnhubSocket {
  private ws: WebSocket | null = null
  private listeners = new Set<Listener>()
  private token: string
  private symbols: SymbolCode[]
  private alive = false

  constructor(token: string, symbols: SymbolCode[]) {
    this.token = token
    this.symbols = symbols
  }

  on(cb: Listener) {
    this.listeners.add(cb)
    return () => this.listeners.delete(cb)
  }

  start() {
    if (!this.token) throw new Error('Missing Finnhub token')
    if (this.ws) return

    this.ws = new WebSocket(`wss://ws.finnhub.io?token=${this.token}`)
    this.ws.onopen = () => {
      this.alive = true
      for (const s of this.symbols) {
        const fin = toFinnhub(s)
        this.ws?.send(JSON.stringify({ type: 'subscribe', symbol: fin }))
      }
    }
    this.ws.onerror = () => { /* handled by caller via fallback */ }
    this.ws.onclose = () => { this.alive = false }
    this.ws.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data)
        if (data.type === 'trade' && Array.isArray(data.data)) {
          const now = Date.now()
          for (const t of data.data) {
            // { p: price, s: symbol, t: ts }
            // Map back to our SymbolCode if possible
            const m = this.fromFinnhub(t.s)
            if (!m) continue
            const price = t.p
            const time = t.t ? t.t : now
            for (const l of this.listeners) l(m, price, time)
          }
        }
      } catch {}
    }
  }

  stop() {
    if (this.ws && this.alive) {
      for (const s of this.symbols) {
        const fin = toFinnhub(s)
        this.ws?.send(JSON.stringify({ type: 'unsubscribe', symbol: fin }))
      }
    }
    this.ws?.close()
    this.ws = null
  }

  private fromFinnhub(fin: string): SymbolCode | null {
    switch (fin) {
      case 'OANDA:EUR_USD': return 'EURUSD'
      case 'OANDA:GBP_USD': return 'GBPUSD'
      case 'OANDA:XAU_USD': return 'XAUUSD'
      default: return null
    }
  }
}
