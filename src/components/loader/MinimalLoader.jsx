import React from 'react';
import './MinimalLoader.css';

const MinimalLoader = ({ assetsLoaded, onStart, isTransitioning }) => {
  return (
    <div className={`minimal-loader-container  `}>
      {/* Dark background */}
      <div className="minimal-loader-background"></div>

      {/* Content */}
      <div className="minimal-loader-content">
        {!assetsLoaded ? (
          // Loading state
          <>
            <div className="minimal-loader-spinner"></div>
            <div className="minimal-loader-text">Loading  ...</div>
          </>
        ) : !isTransitioning ? (
          // Ready state - Show Start Experience button (only when not transitioning)
          <button
            className="minimal-start-btn"
            onClick={onStart}
          >
              Start Experience
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default MinimalLoader;
