import { Button } from 'grommet';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;
  overflow: hidden;
  height: ${({ height }) => height};
  transition: height 0.5s ease;
`;

const BottomOverlay = styled.div`
  position: absulute;
  bottom: 0;
  left: 0;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    height: ${({ showFullText }) => (showFullText ? '0' : '2rem')};
    width: 100%;
    background: linear-gradient(transparent, rgba(255, 255, 255, 0.8));
    pointer-events: none;
  }
`;

function ShowMoreWrapper({ defaultHeight = '10rem', children }) {
  const [showFullText, setShowFullText] = useState(false);
  const [hasMoreContent, setHasMoreContent] = useState(true);
  const contentRef = useRef(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const value =
        !!contentRef.current && contentRef.current.scrollHeight > contentRef.current.clientHeight;
      setHasMoreContent(value);
      setShowFullText(!value);
    }, 50);

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
        {hasMoreContent && <BottomOverlay showFullText={showFullText} />}
      </Wrapper>
      {hasMoreContent && (
        <Button
          label={showFullText ? 'Show less' : 'Show more'}
          onClick={() => setShowFullText(!showFullText)}
          plain
          margin="0.5rem 0 0"
        />
      )}
    </>
  );
}

export default ShowMoreWrapper;
