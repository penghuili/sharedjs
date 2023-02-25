import { Notification } from 'grommet';
import React from 'react';

function Toast({ toast, onClose }) {
  if (!toast?.message) {
    return null;
  }

  return (
    <Notification toast message={toast.message} status={toast.type} onClose={onClose} time={6000} />
  );
}

export default Toast;
