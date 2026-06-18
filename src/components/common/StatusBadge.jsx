import React from 'react';
import { ColorStatus } from '../../constants/constants';

export const StatusBadge = ({ status, type = 'default' }) => {
  let badgeClass = ColorStatus.DISABLED;

  switch (type?.toLowerCase()) {
    case 'success':
      badgeClass = ColorStatus.SUCCESS;
      break;
    case 'warning':
      badgeClass = ColorStatus.WARNING;
      break;
    case 'info':
      badgeClass = ColorStatus.INFO;
      break;
    case 'danger':
    case 'error':
      badgeClass = ColorStatus.DANGER;
      break;
    case 'muted':
      badgeClass = ColorStatus.MUTED;
      break;
    default:
      badgeClass = ColorStatus.DISABLED;
      break;
  }

  return (
    <span className={`${badgeClass} px-2 py-1 fw-medium`} style={{ fontSize: '0.8rem' }}>
      {status}
    </span>
  );
};

export default StatusBadge;
