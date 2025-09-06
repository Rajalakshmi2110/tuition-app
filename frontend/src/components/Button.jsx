import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  onClick, 
  disabled = false, 
  loading = false,
  icon,
  className = '',
  ...props 
}) => {
  const { colors } = useTheme();

  const getVariantStyles = () => {
    const variants = {
      primary: {
        backgroundColor: colors.primary,
        color: 'white',
        border: `2px solid ${colors.primary}`,
        hover: {
          backgroundColor: colors.primary,
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)'
        }
      },
      secondary: {
        backgroundColor: 'transparent',
        color: colors.primary,
        border: `2px solid ${colors.primary}`,
        hover: {
          backgroundColor: colors.primary,
          color: 'white'
        }
      },
      success: {
        backgroundColor: colors.success,
        color: 'white',
        border: `2px solid ${colors.success}`,
        hover: {
          backgroundColor: colors.success,
          transform: 'translateY(-2px)'
        }
      },
      danger: {
        backgroundColor: colors.error,
        color: 'white',
        border: `2px solid ${colors.error}`,
        hover: {
          backgroundColor: colors.error,
          transform: 'translateY(-2px)'
        }
      }
    };
    return variants[variant] || variants.primary;
  };

  const getSizeStyles = () => {
    const sizes = {
      small: {
        padding: '0.5rem 1rem',
        fontSize: '0.875rem'
      },
      medium: {
        padding: '0.75rem 1.5rem',
        fontSize: '1rem'
      },
      large: {
        padding: '1rem 2rem',
        fontSize: '1.125rem'
      }
    };
    return sizes[size] || sizes.medium;
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  const baseStyles = {
    ...sizeStyles,
    ...variantStyles,
    borderRadius: '8px',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: disabled || loading ? 0.6 : 1,
    transform: 'translateY(0)',
    outline: 'none',
    position: 'relative',
    overflow: 'hidden'
  };

  const handleMouseEnter = (e) => {
    if (!disabled && !loading) {
      Object.assign(e.target.style, variantStyles.hover);
    }
  };

  const handleMouseLeave = (e) => {
    if (!disabled && !loading) {
      e.target.style.backgroundColor = variantStyles.backgroundColor;
      e.target.style.color = variantStyles.color;
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = 'none';
    }
  };

  return (
    <button
      style={baseStyles}
      onClick={disabled || loading ? undefined : onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`smooth-transition ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="spinner" style={{
          width: '16px',
          height: '16px',
          border: '2px solid transparent',
          borderTop: '2px solid currentColor',
          borderRadius: '50%'
        }} />
      )}
      {icon && !loading && <span>{icon}</span>}
      {children}
    </button>
  );
};

export default Button;