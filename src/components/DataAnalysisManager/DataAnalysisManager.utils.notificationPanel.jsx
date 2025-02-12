import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './DataAnalysisManager.styles.css';

export const NotificationPanel = ({ notifications, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <div
        className='analysis_manager-hover-container'
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      ></div>
      <div
        className={`analysis_manager-panel ${isHovered ? 'expanded' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {notifications.map((notification, index) => {
          const isExpanded = isHovered;
          const offset = isExpanded ? `${index * 20}px` : `${index * 25}px`;
          const opacity = isExpanded ? 1 : 1 - index * 0.15;
          const disabled = notification.disabled;

          return (
            <div
              key={notification.id}
              className={`analysis_manager-card ${isExpanded ? 'expanded' : ''} ${disabled ? 'disabled' : ''}`}
              style={{
                '--stack-offset': offset,
                '--expanded-offset': `${index * 55}px`,
                '--stack-opacity': opacity,
                '--stack-index': index,
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.5 : 1,
              }}
              onClick={() => !disabled && onClick(notification)}
              onMouseEnter={() => !disabled && setIsHovered(true)}
              onMouseLeave={() => !disabled && setIsHovered(false)}
              title={
                disabled
                  ? 'This analysis requires missing dataset columns.'
                  : ''
              }
            >
              <div className='analysis_manager-content'>
                <div className='analysis_manager-icon'>{notification.icon}</div>
                <div className='analysis_manager-text'>
                  <div className='analysis_manager-title'>
                    {notification.title}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

NotificationPanel.propTypes = {
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      icon: PropTypes.node,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
  onClick: PropTypes.func.isRequired,
};
