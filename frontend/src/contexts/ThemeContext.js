import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : false;
  });

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.body.style.backgroundColor = isDark ? '#1f2937' : '#f3f4f6';
    document.body.style.color = isDark ? '#f9fafb' : '#111827';
    document.body.style.transition = 'all 0.3s ease';
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const theme = {
    isDark,
    toggleTheme,
    colors: {
      primary: isDark ? '#3b82f6' : '#2563eb',
      secondary: isDark ? '#6b7280' : '#4b5563',
      background: isDark ? '#1f2937' : '#ffffff',
      surface: isDark ? '#374151' : '#f8fafc',
      text: isDark ? '#f9fafb' : '#111827',
      textSecondary: isDark ? '#d1d5db' : '#6b7280',
      border: isDark ? '#4b5563' : '#e5e7eb',
      success: isDark ? '#10b981' : '#059669',
      warning: isDark ? '#f59e0b' : '#d97706',
      error: isDark ? '#ef4444' : '#dc2626',
      card: isDark ? '#374151' : '#ffffff',
      hover: isDark ? '#4b5563' : '#f3f4f6'
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};