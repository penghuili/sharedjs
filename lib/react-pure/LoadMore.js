import { Box, Button } from 'grommet';
import React from 'react';
import { useInView } from '../react/hooks/useInView';

function LoadMore({ hasMore, isLoading, margin = 0, onLoadMore }) {
  const ref = useInView(
    () => {
      if (!isLoading && hasMore) {
        onLoadMore();
      }
    },
    { alwaysObserve: true }
  );

  function renderContent() {
    if (!hasMore) {
      return null;
    }

    return (
      <Button
        label="Load more"
        onClick={onLoadMore}
        primary
        color="brand"
        disabled={isLoading}
        size="small"
      />
    );
  }

  return (
    <Box ref={ref} margin={margin}>
      {renderContent()}
    </Box>
  );
}

export default LoadMore;
