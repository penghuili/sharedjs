import { Anchor, Box } from 'grommet';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { useBackgroundColor } from './createTheme';

const Wrapper = styled.div`
  position: relative;
  overflow: hidden;
  height: ${({ height }) => height};
  transition: height 0.5s ease;
`;

const BottomOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: ${({ showFullText }) => (showFullText ? '0' : '2rem')};
  width: 100%;
  background: ${({ background }) => background};
  pointer-events: none;
`;

function ShowMoreWrapper({ defaultHeight = '10rem', showLink = true, children }) {
  const [showFullText, setShowFullText] = useState(false);
  const [hasMoreContent, setHasMoreContent] = useState(true);
  const contentRef = useRef(null);

  const backgroundColor = useBackgroundColor();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const value =
        !!contentRef.current && contentRef.current.scrollHeight > contentRef.current.clientHeight;
      setHasMoreContent(value);
      setShowFullText(!value);
    }, 300);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  function getHeight() {
    if (!hasMoreContent) {
      return 'auto';
    }

    return showFullText ? `${contentRef.current.scrollHeight}px` : defaultHeight;
  }

  return (
    <>
      <Wrapper height={getHeight()} ref={contentRef}>
        {children}
        {hasMoreContent && (
          <BottomOverlay
            showFullText={showFullText}
            background={`linear-gradient(transparent, ${backgroundColor})`}
          />
        )}
      </Wrapper>
      {hasMoreContent && showLink && (
        <Box align="start">
          <Anchor
            label={showFullText ? 'Show less' : 'Show more'}
            onClick={() => setShowFullText(!showFullText)}
            size="small"
            margin="0.5rem 0 0"
          />
        </Box>
      )}
    </>
  );
}

export default ShowMoreWrapper;
