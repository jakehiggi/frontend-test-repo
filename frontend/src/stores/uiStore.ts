import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'system'

interface UIStore {
  theme: Theme
  activeTab: string
  setTheme: (theme: Theme) => void
  setActiveTab: (tab: string) => void
}

export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      (set) => ({
        theme: 'dark',
        activeTab: 'chat',
        setTheme: (theme: Theme) => set({ theme }),
        setActiveTab: (tab: string) => set({ activeTab: tab }),
      }),
      {
        name: 'ui-storage',
      }
    ),
    { name: 'ui-store' }
  )
)