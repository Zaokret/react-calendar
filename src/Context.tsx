import { createContext, useContext, useState, type Dispatch, type SetStateAction } from "react"
import { DOW } from "./time"

type DOWPreference = { offset: number, dowSelected: boolean[] }

const DOWPreferenceContext = createContext<
  [DOWPreference, Dispatch<SetStateAction<DOWPreference>>] | null
>(null)

export function DOWPreferenceProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const state = useState({ offset: DOW.OffsetTypes.EU, dowSelected: [true,true,true,true,true,true,true] })

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