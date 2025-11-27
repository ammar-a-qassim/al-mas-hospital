import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

const themes = {
    light: {
        name: 'Light',
        primary: '#0891b2',
        primaryHover: '#0e7490',
        secondary: '#64748b',
        background: '#f8fafc',
        surface: '#ffffff',
        text: '#1e293b',
        textSecondary: '#64748b',
        border: '#e2e8f0',
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        sidebarBg: '#1e293b',
        sidebarText: '#ffffff'
    },
    dark: {
        name: 'Dark',
        primary: '#3b82f6',
        primaryHover: '#2563eb',
        secondary: '#94a3b8',
        background: '#0f172a',
        surface: '#1e293b',
        text: '#f1f5f9',
        textSecondary: '#94a3b8',
        border: '#334155',
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        sidebarBg: '#0f172a',
        sidebarText: '#f1f5f9'
    },
    medical: {
        name: 'Medical Blue',
        primary: '#0891b2',
        primaryHover: '#0e7490',
        secondary: '#06b6d4',
        background: '#f0f9ff',
        surface: '#ffffff',
        text: '#0c4a6e',
        textSecondary: '#0369a1',
        border: '#bae6fd',
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        sidebarBg: '#0c4a6e',
        sidebarText: '#f0f9ff'
    },
    purple: {
        name: 'Purple',
        primary: '#9333ea',
        primaryHover: '#7e22ce',
        secondary: '#a855f7',
        background: '#faf5ff',
        surface: '#ffffff',
        text: '#581c87',
        textSecondary: '#7c3aed',
        border: '#e9d5ff',
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        sidebarBg: '#581c87',
        sidebarText: '#faf5ff'
    },
    green: {
        name: 'Green',
        primary: '#059669',
        primaryHover: '#047857',
        secondary: '#10b981',
        background: '#f0fdf4',
        surface: '#ffffff',
        text: '#064e3b',
        textSecondary: '#047857',
        border: '#bbf7d0',
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        sidebarBg: '#064e3b',
        sidebarText: '#f0fdf4'
    },
    rose: {
        name: 'Rose',
        primary: '#e11d48',
        primaryHover: '#be123c',
        secondary: '#f43f5e',
        background: '#fff1f2',
        surface: '#ffffff',
        text: '#881337',
        textSecondary: '#be123c',
        border: '#fecdd3',
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        sidebarBg: '#881337',
        sidebarText: '#fff1f2'
    },
    ocean: {
        name: 'Ocean',
        primary: '#0284c7',
        primaryHover: '#0369a1',
        secondary: '#0ea5e9',
        background: '#f0f9ff',
        surface: '#ffffff',
        text: '#075985',
        textSecondary: '#0369a1',
        border: '#bae6fd',
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        sidebarBg: '#075985',
        sidebarText: '#f0f9ff'
    },
    sunset: {
        name: 'Sunset',
        primary: '#ea580c',
        primaryHover: '#c2410c',
        secondary: '#f97316',
        background: '#fff7ed',
        surface: '#ffffff',
        text: '#7c2d12',
        textSecondary: '#c2410c',
        border: '#fed7aa',
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        sidebarBg: '#7c2d12',
        sidebarText: '#fff7ed'
    }
};

export const ThemeProvider = ({ children }) => {
    const [currentTheme, setCurrentTheme] = useState(
        localStorage.getItem('theme') || 'light'
    );
    const [language, setLanguage] = useState(
        localStorage.getItem('language') || 'en'
    );

    // Apply theme on initial mount
    useEffect(() => {
        applyTheme(themes[currentTheme]);
    }, []);

    useEffect(() => {
        localStorage.setItem('theme', currentTheme);
        applyTheme(themes[currentTheme]);
    }, [currentTheme]);

    useEffect(() => {
        localStorage.setItem('language', language);
        // Apply language attribute to document
        document.documentElement.setAttribute('lang', language);
        // Apply direction for RTL
        document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    }, [language]);

    const applyTheme = (theme) => {
        Object.entries(theme).forEach(([key, value]) => {
            if (key !== 'name') {
                document.documentElement.style.setProperty(`--color-${key}`, value);
            }
        });
    };

    const changeTheme = (themeName) => {
        if (themes[themeName]) {
            setCurrentTheme(themeName);
        }
    };

    return (
        <ThemeContext.Provider value={{
            currentTheme,
            changeTheme,
            themes,
            language,
            setLanguage
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};
