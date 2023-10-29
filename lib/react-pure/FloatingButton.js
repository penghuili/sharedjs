import { Button } from 'grommet';
import { Add } from 'grommet-icons';
import React from 'react';
import styled from 'styled-components';
import useIsMobileSize from '../react/hooks/useIsMobileSize';
import { breakpoint } from './size';

const Wrapper = styled.div`
  position: fixed;
  bottom: 4rem;
  right: ${({ right }) => right};
`;

function FloatingButton({ disabled, onClick }) {
  const isMobile = useIsMobileSize();

  return (
    <Wrapper right={isMobile ? '2rem' : `calc(50vw - ${breakpoint / 2}px)`}>
      <Button
        icon={<Add size="large" />}
        size="large"
        onClick={onClick}
        primary
        color="brand"
        disabled={disabled}
      />
    </Wrapper>
  );
}

export default FloatingButton;
