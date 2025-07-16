import { useUIStore } from '@/stores/uiStore'
import { useCallback } from 'react'

type Theme = 'light' | 'dark' | 'system'

export const useUI = () => {
  const theme = useUIStore((state) => state.theme)
  const activeTab = useUIStore((state) => state.activeTab)
  const setTheme = useUIStore((state) => state.setTheme)
  const setActiveTab = useUIStore((state) => state.setActiveTab)

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }, [theme, setTheme])

  return {
    theme,
    activeTab,
    setTheme,
    setActiveTab,
    toggleTheme,
  }
}