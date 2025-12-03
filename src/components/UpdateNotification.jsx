import React, { useState, useEffect } from 'react';
import './UpdateNotification.css';

/**
 * Component that shows a notification when a new app version is available
 * Allows users to update immediately or dismiss
 */
function UpdateNotification({ workbox }) {
  const [showNotification, setShowNotification] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!workbox) return;

    // Show notification when an update is waiting
    const handleWaiting = () => {
      setShowNotification(true);
    };

    // Hide notification when update is complete
    const handleControlling = () => {
      setShowNotification(false);
      setIsUpdating(false);
    };

    workbox.addEventListener('waiting', handleWaiting);
    workbox.addEventListener('controlling', handleControlling);

    return () => {
      workbox.removeEventListener('waiting', handleWaiting);
      workbox.removeEventListener('controlling', handleControlling);
    };
  }, [workbox]);

  const handleUpdate = () => {
    if (!workbox) return;
    
    setIsUpdating(true);
    
    // Send message to service worker to skip waiting
    workbox.messageSkipWaiting();
    
    // The page will reload automatically when 'controlling' event fires
  };

  const handleDismiss = () => {
    setShowNotification(false);
    
    // Show reminder after 1 hour
    setTimeout(() => {
      setShowNotification(true);
    }, 60 * 60 * 1000); // 1 hour
  };

  if (!showNotification) return null;

  return (
    <div className="update-notification">
      <div className="update-notification-content">
        <div className="update-notification-icon">🔄</div>
        <div className="update-notification-text">
          <strong>New Version Available!</strong>
          <p>A new version of the app is ready. Update now for the latest features and improvements.</p>
        </div>
        <div className="update-notification-actions">
          <button
            className="update-btn update-btn-primary"
            onClick={handleUpdate}
            disabled={isUpdating}
          >
            {isUpdating ? 'Updating...' : 'Update Now'}
          </button>
          <button
            className="update-btn update-btn-secondary"
            onClick={handleDismiss}
            disabled={isUpdating}
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateNotification;
