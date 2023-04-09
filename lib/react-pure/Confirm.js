import { Button, Text } from 'grommet';
import React from 'react';

import HorizontalCenter from './HorizontalCenter';
import Modal from './Modal';

function Confirm({ message, show, onClose, onConfirm }) {
  return (
    <Modal show={show} onClose={onClose}>
      <Text>{message}</Text>

      <HorizontalCenter margin="2rem 0 0" justify="end">
        <Button onClick={onClose} label="Close" margin="0 1rem 0 0" />
        <Button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          label="Confirm"
          primary
        />
      </HorizontalCenter>
    </Modal>
  );
}

export default Confirm;
