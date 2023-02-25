import { Box, Layer } from 'grommet';
import React from 'react';

function Modal({ show, onClose, children }) {
  if (!show) {
    return null;
  }

  return (
    <Layer onEsc={onClose} onClickOutside={onClose} responsive={false} modal>
      <Box pad="1rem">{children}</Box>
    </Layer>
  );
}

export default Modal;
