import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

const ToolbarPanelUtilsButton = ({
  icon,
  title,
  onClick,
  isActive = false,
  isDisabled = false,
  extraClasses = '',
  ariaLabel = 'toolbar button',
}) => {
  const className = `
    toolbar_panel-btn
    ${isActive ? 'active' : ''}
    ${isDisabled ? 'disabled' : ''}
    ${extraClasses}
  `
    .replace(/\s+/g, ' ')
    .trim();

  return (
    <Tooltip title={title} arrow>
      <span>
        <IconButton
          className={className}
          onClick={onClick}
          aria-label={ariaLabel}
          disabled={isDisabled}
        >
          {icon}
        </IconButton>
      </span>
    </Tooltip>
  );
};

ToolbarPanelUtilsButton.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  isActive: PropTypes.bool,
  isDisabled: PropTypes.bool,
  extraClasses: PropTypes.string,
  ariaLabel: PropTypes.string,
};

export default ToolbarPanelUtilsButton;
