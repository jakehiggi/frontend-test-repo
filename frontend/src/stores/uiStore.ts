// frontend/src/stores/uiStore.ts
import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'system'

interface UIStore {
  // Theme state
  theme: Theme
  
  // Tab state
  activeTab: string
  
  // Sidebar state (for mobile responsiveness)
  sidebarCollapsed: boolean
  
  // Loading states
  isLoading: boolean
  
  // Actions - these need to be stable references
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  setActiveTab: (tab: string) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebar: () => void
  setLoading: (loading: boolean) => void
}

// Helper function to apply theme to DOM (outside of store to avoid re-creation)
const applyThemeToDOM = (theme: Theme) => {
  if (typeof window === 'undefined') return
  
  const root = window.document.documentElement
  root.classList.remove('light', 'dark')
  
  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    root.classList.add(systemTheme)
  } else {
    root.classList.add(theme)
  }
}

export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        theme: 'dark',
        activeTab: 'chat',
        sidebarCollapsed: false,
        isLoading: false,
        
        // Actions - using stable function references
        setTheme: (theme: Theme) => {
          set({ theme })
          applyThemeToDOM(theme)
        },
        
        toggleTheme: () => {
          const currentTheme = get().theme
          const newTheme = currentTheme === 'light' ? 'dark' : 'light'
          set({ theme: newTheme })
          applyThemeToDOM(newTheme)
        },
        
        setActiveTab: (tab: string) => set({ activeTab: tab }),
        
        setSidebarCollapsed: (collapsed: boolean) => set({ sidebarCollapsed: collapsed }),
        
        toggleSidebar: () => set((state) => ({ 
          sidebarCollapsed: !state.sidebarCollapsed 
        })),
        
        setLoading: (loading: boolean) => set({ isLoading: loading }),
      }),
      {
        name: 'ui-storage',
        partialize: (state) => ({
          theme: state.theme,
          activeTab: state.activeTab,
          sidebarCollapsed: state.sidebarCollapsed
          // Don't persist loading states or function references
        }),
      }
    ),
    { name: 'ui-store' }
  )
)

// Initialize theme on store creation
if (typeof window !== 'undefined') {
  // Apply initial theme
  const initialState = useUIStore.getState()
  applyThemeToDOM(initialState.theme)
  
  // Listen for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const handleSystemThemeChange = () => {
    const state = useUIStore.getState()
    if (state.theme === 'system') {
      applyThemeToDOM('system')
    }
  }
  
  mediaQuery.addEventListener('change', handleSystemThemeChange)
}