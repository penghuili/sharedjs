import { Box, Button, Layer } from 'grommet';
import React from 'react';

function Popup({ visible, disabled, onClose, onConfirm, children }) {
  if (!visible) {
    return null;
  }

  return (
    <Layer onClickOutside={onClose} onEsc={onClose}>
      <Box pad="1rem" style={{ minWidth: '20rem' }}>
        {children}

        <Box direction="row" justify="between" margin="2rem 0 0">
          <Button label="Cancel" onClick={onClose} color="brand" />
          <Button
            label="Confirm"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            primary
            color="brand"
            disabled={disabled}
          />
        </Box>
      </Box>
    </Layer>
  );
}

export default Popup;
