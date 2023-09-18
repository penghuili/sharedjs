import React from 'react';
import styled from 'styled-components';

import LoadingSkeleton from './LoadingSkeleton';

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0.8;
  height: 100%;
  width: 100%;
`;

function LoadingSkeletonOverlay() {
  return (
    <Wrapper>
      <LoadingSkeleton width="100%" height="100%" />
    </Wrapper>
  );
}

export default LoadingSkeletonOverlay;
