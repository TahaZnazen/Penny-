import React from 'react';
import './MinimalLoader.css';

const MinimalLoader = ({ assetsLoaded, onStart, isTransitioning }) => {
  return (
    <div className={`minimal-loader-container ${isTransitioning ? 'fade-out' : ''}`}>
      {/* Dark background */}
      <div className="minimal-loader-background"></div>

      {/* Content */}
      <div className="minimal-loader-content">
        {!assetsLoaded ? (
          // Loading state
          <>
            <div className="minimal-loader-spinner"></div>
            <div className="minimal-loader-text">Loading Storm...</div>
          </>
        ) : (
          // Ready state - Show Start Experience button
          <button
            className="minimal-start-btn"
            onClick={onStart}
          >
            ⚡ Start Experience
          </button>
        )}
      </div>
    </div>
  );
};

export default MinimalLoader;
