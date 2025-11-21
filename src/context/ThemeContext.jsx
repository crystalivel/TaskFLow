import React, { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext({
    theme: 'dark',
    toggleTheme: () => { }
})

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        // Check localStorage for saved theme preference
        const savedTheme = localStorage.getItem('theme')
        return savedTheme || 'dark'
    })

    useEffect(() => {
        // Update DOM and localStorage when theme changes
        const root = document.documentElement
        root.classList.remove('light', 'dark')
        root.classList.add(theme)
        localStorage.setItem('theme', theme)
    }, [theme])

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark')
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}
