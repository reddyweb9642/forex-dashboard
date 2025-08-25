
import { configureStore } from '@reduxjs/toolkit'
import marketReducer from './features/market/marketSlice'
import portfolioReducer from './features/portfolio/portfolioSlice'

export const store = configureStore({
  reducer: {
    market: marketReducer,
    portfolio: portfolioReducer,
  },
  middleware: (getDefault) => getDefault({ serializableCheck: false }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
