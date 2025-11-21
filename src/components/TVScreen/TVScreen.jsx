import React from 'react';
import './TVScreen.css';

const TVScreen = ({ children, className = '' }) => {
  return (
    <div className={`tv-screen ${className}`}>
      <div className="screen-content">
        {children}
      </div>
    </div>
  );
};

export default TVScreen;
