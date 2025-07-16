// frontend/src/hooks/useUI.ts
import { useUIStore } from '@/stores/uiStore'
import { useCallback, useMemo } from 'react'

type Theme = 'light' | 'dark' | 'system'

export const useUI = () => {
  const theme = useUIStore((state) => state.theme)
  const activeTab = useUIStore((state) => state.activeTab)
  const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed)
  const isLoading = useUIStore((state) => state.isLoading)
  
  const setTheme = useUIStore((state) => state.setTheme)
  const setActiveTab = useUIStore((state) => state.setActiveTab)
  const setSidebarCollapsed = useUIStore((state) => state.setSidebarCollapsed)
  const setLoading = useUIStore((state) => state.setLoading)

  const toggleTheme = useCallback(() => {
    useUIStore.getState().toggleTheme()
  }, [])

  const toggleSidebar = useCallback(() => {
    useUIStore.getState().toggleSidebar()
  }, [])

  // Calculate effective theme directly in the hook to avoid store function calls
  const effectiveTheme = useMemo(() => {
    if (theme === 'system') {
      if (typeof window !== 'undefined') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      }
      return 'dark' // fallback for SSR
    }
    return theme as 'light' | 'dark'
  }, [theme])

  return {
    // State
    theme,
    activeTab,
    sidebarCollapsed,
    isLoading,
    
    // Actions
    setTheme,
    setActiveTab,
    setSidebarCollapsed,
    setLoading,
    toggleTheme,
    toggleSidebar,
    
    // Computed
    effectiveTheme,
  }
}