import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label="Toggle theme"
      style={{
        width: '40px', height: '40px', borderRadius: '10px',
        background: isDark ? '#334155' : '#f8fafc',
        border: `1px solid ${isDark ? '#475569' : '#e2e8f0'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'all 0.2s ease', fontSize: '1.1rem',
        flexShrink: 0
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = isDark ? '#475569' : '#f1f5f9';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = isDark ? '#334155' : '#f8fafc';
      }}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
};

export default ThemeToggle;
