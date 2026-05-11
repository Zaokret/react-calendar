import { createContext, useContext, useState, type Dispatch, type SetStateAction } from "react"
import { DOW } from "./time"

const DOWPreferenceContext = createContext<
  [number, Dispatch<SetStateAction<number>>] | null
>(null)

export function DOWPreferenceProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const state = useState(DOW.OffsetTypes.EU)

  return (
    <DOWPreferenceContext.Provider value={state}>
      {children}
    </DOWPreferenceContext.Provider>
  )
}

export function useDOWPreference() {
  const ctx = useContext(DOWPreferenceContext)

  if (!ctx) {
    throw new Error('Missing DOWPreferenceProvider')
  }

  return ctx
}