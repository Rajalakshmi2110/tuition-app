import React from 'react';

const Loader = ({ message = "Loading...", size = "large" }) => {
  const spinnerSize = size === "small" ? "30px" : "50px";
  const containerPadding = size === "small" ? "2rem" : "4rem";

  return (
    <div style={{ textAlign: 'center', padding: containerPadding }}>
      <div style={{ backgroundColor: 'white', padding: '3rem', borderRadius: '16px', boxShadow: '0 6px 20px rgba(0,0,0,0.1)' }}>
        <div style={{ 
          width: spinnerSize, 
          height: spinnerSize, 
          border: '4px solid #f3f4f6', 
          borderTop: '4px solid #3b82f6', 
          borderRadius: '50%', 
          animation: 'spin 1s linear infinite', 
          margin: '0 auto 1.5rem'
        }}></div>
        <h3 style={{ fontSize: '1.5rem', color: '#20205c', marginBottom: '0.5rem' }}>{message}</h3>
        <p style={{ color: '#666', margin: 0 }}>Please wait...</p>
      </div>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Loader;