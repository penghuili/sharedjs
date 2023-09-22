import React from 'react';
import styled from 'styled-components';

import { useIsDarkMode } from './createTheme';

const Wrapper = styled.div`
  background: ${({ background }) => background};
  background-size: 200% 100%;
  animation: 1.5s shine linear infinite;

  width: ${({ width }) => width};
  height: ${({ height }) => height};

  @keyframes shine {
    to {
      background-position-x: -200%;
    }
  }
`;

function LoadingSkeleton({ width, height }) {
  const isDark = useIsDarkMode();
  return (
    <Wrapper
      width={width}
      height={height}
      background={
        isDark
          ? 'linear-gradient(110deg, #253642 8%, #1A2938 18%, #253642 33%)'
          : 'linear-gradient(110deg, #e0e0e0 8%, #f0f0f0 18%, #e0e0e0 33%)'
      }
    />
  );
}

export default LoadingSkeleton;
