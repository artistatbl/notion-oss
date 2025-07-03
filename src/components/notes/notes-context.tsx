"use client"

import * as React from "react"
import { createContext, useContext, useState } from "react"

interface NotesContextType {
  isNotesVisible: boolean
  showNotes: () => void
  hideNotes: () => void
  toggleNotes: () => void
}

const NotesContext = createContext<NotesContextType | undefined>(undefined)

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [isNotesVisible, setIsNotesVisible] = useState(false)

  const showNotes = () => setIsNotesVisible(true)
  const hideNotes = () => setIsNotesVisible(false)
  const toggleNotes = () => setIsNotesVisible(prev => !prev)

  return (
    <NotesContext.Provider
      value={{
        isNotesVisible,
        showNotes,
        hideNotes,
        toggleNotes,
      }}
    >
      {children}
    </NotesContext.Provider>
  )
}

export function useNotes() {
  const context = useContext(NotesContext)
  if (context === undefined) {
    throw new Error("useNotes must be used within a NotesProvider")
  }
  return context
}