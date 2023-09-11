import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  background: #eee;
  background: linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
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
  return <Wrapper width={width} height={height} />;
}

export default LoadingSkeleton;
