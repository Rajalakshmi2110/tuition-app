import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Card = ({ 
  children, 
  className = '', 
  hover = true, 
  padding = 'medium',
  onClick,
  style = {},
  ...props 
}) => {
  const { colors } = useTheme();

  const getPaddingStyles = () => {
    const paddings = {
      small: '1rem',
      medium: '1.5rem',
      large: '2rem',
      none: '0'
    };
    return paddings[padding] || paddings.medium;
  };

  const baseStyles = {
    backgroundColor: colors.card,
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    border: `1px solid ${colors.border}`,
    padding: getPaddingStyles(),
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: onClick ? 'pointer' : 'default',
    ...style
  };

  const handleMouseEnter = (e) => {
    if (hover) {
      e.target.style.transform = 'translateY(-5px)';
      e.target.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
    }
  };

  const handleMouseLeave = (e) => {
    if (hover) {
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
    }
  };

  return (
    <div
      style={baseStyles}
      className={`fade-in ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;