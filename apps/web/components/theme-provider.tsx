"use client"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  attribute?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const THEME_SCRIPT = `
  !function(){
    try {
      var d=document.documentElement;
      var t=localStorage.getItem("ui-theme") || "system";
      
      if(t==="system"){
        var systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        d.classList.add(systemTheme);
      } else {
        d.classList.add(t);
      }
    } catch (e){}
  }();
`

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  attribute = "class",
  enableSystem = true,
  disableTransitionOnChange = false,
  storageKey = "ui-theme",
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  
  // Khôi phục theme từ localStorage khi component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem(storageKey) as Theme | null
    
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [storageKey])
  
  // Lưu theme vào localStorage khi theme thay đổi
  useEffect(() => {
    localStorage.setItem(storageKey, theme)
  }, [theme, storageKey])

  useEffect(() => {
    const root = window.document.documentElement
    
    // Xóa tất cả các class theme hiện tại
    root.classList.remove("light", "dark")

    if (disableTransitionOnChange) {
      root.classList.add("[&_*]:!transition-none")
      
      setTimeout(() => {
        root.classList.remove("[&_*]:!transition-none")
      }, 0)
    }

    if (theme === "system" && enableSystem) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme, attribute, enableSystem, disableTransitionOnChange])

  // Theo dõi thay đổi từ system theme
  useEffect(() => {
    if (!enableSystem) return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    
    const handleChange = () => {
      if (theme === "system") {
        const root = window.document.documentElement
        const systemTheme = mediaQuery.matches ? "dark" : "light"
        
        root.classList.remove("light", "dark")
        root.classList.add(systemTheme)
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme, enableSystem])

  const value = {
    theme,
    setTheme: (theme: Theme) => setTheme(theme),
  }

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}

// Script để chèn vào HTML để tránh flash theme
export const ThemeScript = () => {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: THEME_SCRIPT
      }}
    />
  )
} 