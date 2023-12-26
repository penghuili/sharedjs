import { Layer } from 'grommet';
import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  padding: 1rem;
  max-height: 100vh;
  overflow-y: auto;
`;

function Modal({ show, onClose, children }) {
  if (!show) {
    return null;
  }

  return (
    <Layer onEsc={onClose} onClickOutside={onClose} responsive={false} modal>
      <Wrapper>{children}</Wrapper>
    </Layer>
  );
}

export default Modal;
