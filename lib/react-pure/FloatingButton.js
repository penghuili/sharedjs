import { Button } from 'grommet';
import { Add } from 'grommet-icons';
import React from 'react';
import styled from 'styled-components';

import useIsMobile from '../react/hooks/useIsMobile';
import { breakpoint } from './size';

const Wrapper = styled.div`
  position: fixed;
  bottom: 4rem;
  right: ${({ right }) => right};
`;

function FloatingButton({ onClick }) {
  const isMobile = useIsMobile();

  return (
    <Wrapper right={isMobile ? '2rem' : `calc(50vw - ${breakpoint / 2}px)`}>
      <Button icon={<Add size="large" />} size="large" onClick={onClick} primary color="brand" />
    </Wrapper>
  );
}

export default FloatingButton;